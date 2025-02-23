const constants = require('./constants');
const { getProperties, currentTime, delay } = require('./generalFunctions');
const Mustache = require('mustache');
const Game = require('../models/Game.js');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Redis = require('ioredis');

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
      console.warn(message);
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

/**
 * Logs a formatted message to the console with different log levels.
 *
 * @param {string} message - The content of the message to be logged.
 * @param {string} author - The author or sender of the message.
 * @param {string} chatName - The name of the chat or conversation.
 * @param {string} messageLevel - The level of the message, determining how it's logged.
 *                                Possible values: 'success', 'locked', 'invalid', 'error'.
 * @returns {void}
 */
function logMessage(message, author, chatName, messageLevel) {
  const template = `CHAT: {{chatName}} || FROM: {{author}} || MESSAGE: {{body}}`;
  const values = {
    chatName,
    author: author,
    body: message,
  };
  const newMessage = Mustache.render(template, values);

  switch (messageLevel) {
    case 'success':
      console.log(newMessage);
      break;
    case 'locked':
      console.warn(newMessage);
      break;
    case 'invalid':
    case 'error':
      console.error(newMessage);
      break;
  }
}

function filterWhatsapp(whatsapp) {
  return getProperties(
    whatsapp,
    [],
    ['sendMessage', 'on', 'initialize', 'getChatById'],
  );
}

function filterMessage(message) {
  message.body = message.body
    .toLowerCase()
    .split(' ')
    .filter((word) => word != '');
  message.author = message.author.match(/\d+/)[0];

  return getProperties(message, ['body', 'author', 'from'], ['react', 'reply']);
}

function filterChat(chat) {
  return getProperties(chat, ['id', 'name', 'isGroup'], ['sendMessage']);
}

async function lockGame(game) {
  await game.set('lock', currentTime());
}

async function unlockGame(game) {
  await game.set('lock', null);
}

async function getGame(chatId, chatName = '') {
  let game = await Game.get(chatId);
  if (!game) {
    game = await Game.create(chatId, chatName);
  }

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
    console.log('Groq Failed ---', e);
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
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('end', () => {
  console.warn('Redis connection ended');
});

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
      console.error('Redis get error:', err);
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
      console.error('Redis set error:', err);
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
    console.error('Redis trim cache error:', err);
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
  logMessage,
  lockGame,
  unlockGame,
  getGame,
  translate,
  messageToCommand,
};
