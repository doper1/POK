const constants = require('./constants');
const { getProperties, currentTime, delay } = require('./generalFunctions');
const Game = require('../models/Game.js');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Redis = require('ioredis');
const winston = require('winston');
// Import database connection for validation
const { connection: db } = require('../../db/db.ts');

// Configure Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    winston.format.printf(info => {
      const { timestamp, level, message, metadata } = info;
      const chatName = metadata?.chatName || 'SYSTEM';
      const author = metadata?.author || '-';
      // Handle cases where message might be an object (like errors)
      const msg = typeof message === 'string' ? message : JSON.stringify(message);
      return `[${timestamp}] [${level.toUpperCase()}] [${chatName}] [${author}] ${msg}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pok_app.log' })
  ]
});

// Database health check configuration
const DB_HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

function validateEnvVariables() {
  const requiredVars = [
    'POSTGRES_HOST',
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'ENV',
    'PHONE_NUMBER',
    'REDIS_PASSWORD',
    'REDIS_HOST',
  ];

  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Please set ${key} environment variable`);
    }
  });

  const optionalWarnings = {
    IMAGEN_HOST: 'Please set IMAGEN_HOST environment variable',
    GROQ_API_KEY:
      'GROQ_API_KEY environment variable is not set\nprocesses will fail if no *_API_KEY is set',
    OPENAI_API_KEY:
      'OPENAI_API_KEY environment variable is not set\nprocesses will fail if no *_API_KEY is set',
  };

  Object.entries(optionalWarnings).forEach(([key, message]) => {
    if (!process.env[key]) {
      // console.warn(message);
      logger.warn(message);
    }
  });
}

function validateEnv(groupName) {
  return (
    (process.env.ENV.toLowerCase().startsWith('dev') &&
      groupName.startsWith('POKDEV')) ||
    (process.env.ENV.toLowerCase().startsWith('prod') &&
      !groupName.startsWith('POKDEV'))
  );
}

function validateMessage(msg) {
  return (
    currentTime() - msg.timestamp < constants.MESSAGE_MAX_AGE &&
    (msg.from.length > 22 || msg.to.length > 22)
  );
}

async function validateLock(game) {
  if (!game.lock) {
    return true;
  } else if (BigInt(currentTime()) - game.lock > constants.LOCK_MAX_AGE) {
    // For cases where a game still has a lock because of an external error
    await unlockGame(game);
    return true;
  }

  // Wait for other request to process and remove the lock
  await delay(500);

  // Check the state of the lock again
  await validateLock(game);
}

function filterWhatsapp(whatsapp) {
  return getProperties(
    whatsapp,
    [],
    ['sendMessage', 'on', 'initialize', 'getChatById'],
  );
}

async function filterMessage(message) {
  message.body = message.body
    .toLowerCase()
    .split(' ')
    .filter((word) => word != '');
// The old solution to get the phone number. Replaced by the lines below (commented out):
  // // Use message.from (sender ID) as fallback if author is undefined (e.g., private chats in message_create)
  // const authorInput = message.author; // Store original for comparison
  // const fromInput = message.from;
  //  const authorId = authorInput ? String(authorInput).match(/\d+/)?.[0] : String(fromInput).match(/\d+/)?.[0]; 
  const authorId = (await message.getContact()).number;
  message.author = authorId;

  return getProperties(message, ['body', 'author', 'from'], ['react', 'reply']);
}

function filterChat(chat) {
  const filtered = getProperties(chat, ['id', 'name', 'isGroup'], ['sendMessage']);
  // For private chats, chat.name might be null/undefined. Use user ID as name in that case.
  if (!filtered.name && filtered.id?.user) {
    filtered.name = filtered.id.user;
  }
  return filtered;
}

async function lockGame(game) {
  await game.set('lock', currentTime());
}

async function unlockGame(game) {
  await game.set('lock', null);
}

async function getGame(chatId, chatName) {
  let game = await Game.get(chatId);
  if (!game) game = await Game.create(chatId, chatName);
  return game;
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const glhf = new OpenAI({
  apiKey: process.env.GLHF_API_KEY,
  baseURL: 'https://glhf.chat/api/openai/v1',
});

async function translate(body, systemMessage) {
  try {
    return (
      await groq.chat.completions.create({
        model: `${constants.MODEL_GROQ}`,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: `${body}`,
          },
        ],
        temperature: 1,
      })
    ).choices[0]?.message?.content;
  } catch (e) {
    // console.log('Groq Failed ---', e);
    logger.error('Groq API call failed', { metadata: { error: e } });
    return (
      await glhf.chat.completions.create({
        model: `${constants.MODEL_GLHF}`,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: `${body}`,
          },
        ],
        temperature: 1,
      })
    ).choices[0]?.message?.content;
  }
}

function processOutput(body) {
  return body.split(' ').filter((word) => word != '' && word !== '\n');
}

// Initialize Redis with automatic reconnection support
const redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  reconnectOnError: () => true,
});

// Listen for Redis events
redis.on('error', (err) => {
  // console.error('Redis error:', err);
  logger.error('Redis error', { metadata: { error: err } });
});

redis.on('connect', () => {
  // console.log('Redis connected');
  logger.info('Redis connected');
});

redis.on('end', () => {
  // console.warn('Redis connection ended');
  logger.warn('Redis connection ended');
});

// Initialize PostgreSQL database connection validation
let isDbHealthy = true; // Track database connection state

/**
 * Validates the PostgreSQL database connection by executing a simple test query.
 * This function is called at application startup and logs the connection status.
 * 
 * @returns {Promise<Array>} - Result of the test query
 * @throws {Error} - If the database connection fails
 */
async function validateDatabaseConnection() {
  logger.info('Attempting PostgreSQL database connection');
  try {
    // Test the database connection with a simple query using postgres.js syntax
    const result = await db`SELECT 1 as test`;
    logger.info('PostgreSQL database connected successfully');
    isDbHealthy = true;
    return result;
  } catch (error) {
    // Log clean error message without verbose details
    logger.error(`PostgreSQL database connection failed: ${error.message}`, { 
      metadata: { 
        errorCode: error.code,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST
      } 
    });
    
    isDbHealthy = false;
    throw error;
  }
}

// Note: postgres.js doesn't support traditional event listeners like .on('error')
// Instead, we rely on try/catch blocks and periodic health checks

// Add a periodic health check for the database connection
// This helps monitor database connectivity and logs state changes
setInterval(async () => {
  try {
    await db`SELECT 1`;
    // Only log if connection was previously unhealthy
    if (!isDbHealthy) {
      logger.info('PostgreSQL database connection restored');
      isDbHealthy = true;
    }
  } catch (error) {
    // Only log if connection was previously healthy
    if (isDbHealthy) {
      logger.error(`PostgreSQL database health check failed: ${error.message}`, { 
        metadata: { 
          errorCode: error.code
        } 
      });
      isDbHealthy = false;
    }
  }
}, DB_HEALTH_CHECK_INTERVAL);

async function messageToCommand(body) {
  const cacheKey = body.join('_').toLowerCase();
  const isCacheValid = body.length <= 6 && body.join('').length <= 40;

  if (isCacheValid && redis.status === 'ready') {
    try {
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        await redis.zadd(constants.DATE_CACHE_NAME, Date.now(), cacheKey);
        return processOutput(cachedResult);
      }
    } catch (err) {
      // console.error('Redis get error:', err);
      logger.error('Redis GET error', { metadata: { error: err, cacheKey } });
    }
  }

  const output = await translate(
    body.join(' '),
    constants.TRANSLATE_SYSTEM_MESSAGE,
  );

  if (isCacheValid && redis.status === 'ready') {
    try {
      await redis.set(cacheKey, output);
      await redis.zadd(constants.DATE_CACHE_NAME, Date.now(), cacheKey);

      const cacheSize = await redis.zcard(constants.DATE_CACHE_NAME);
      if (cacheSize > constants.MAX_CACHE_ENTRIES) {
        await trimCache();
      }
    } catch (err) {
      // console.error('Redis set error:', err);
      logger.error('Redis SET/ZADD/TRIM error', { metadata: { error: err, cacheKey } });
    }
  }

  return processOutput(output);
}

async function trimCache() {
  try {
    const keysToRemove = Math.floor(constants.MAX_CACHE_ENTRIES / 5); // Remove 5% of max cache size
    const oldestKeys = await redis.zrange(
      constants.DATE_CACHE_NAME,
      0,
      keysToRemove - 1,
    );

    if (oldestKeys.length > 0) {
      await redis.del(...oldestKeys);
      await redis.zrem(constants.DATE_CACHE_NAME, ...oldestKeys);
    }
  } catch (err) {
    // console.error('Redis trim cache error:', err);
    logger.error('Redis TRIM error', { metadata: { error: err } });
  }
}

module.exports = {
  validateEnvVariables,
  validateMessage,
  validateEnv,
  validateLock,
  filterWhatsapp,
  filterMessage,
  filterChat,
  // logMessage, // Removed original logMessage
  logger, // Export the logger instance
  lockGame,
  unlockGame,
  getGame,
  translate,
  messageToCommand,
  validateDatabaseConnection, // Export the new database validation function
};
