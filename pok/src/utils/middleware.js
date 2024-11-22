const constants = require('./constants');
const { getProperties, currentTime } = require('./generalFunctions');
const Mustache = require('mustache');
const Game = require('../models/Game.js');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const Redis = require('ioredis');

function validateEnvVariables() {
  if (process.env.POSTGRES_HOST === undefined) {
    throw new Error('Please set POSTGRES_HOST environment variable');
  }

  if (process.env.POSTGRES_DB === undefined) {
    throw new Error('Please set POSTGRES_DB environment variable');
  }

  if (process.env.POSTGRES_USER === undefined) {
    throw new Error('Please set POSTGRES_USER environment variable');
  }

  if (process.env.POSTGRES_PASSWORD === undefined) {
    throw new Error('Please set POSTGRES_PASSWORD environment variable');
  }

  if (process.env.OPENAI_API_KEY === undefined) {
    throw new Error('Please set OPENAI_API_KEY environment variable');
  }

  if (process.env.ENV === undefined) {
    throw new Error('Please set ENV environment variable');
  }
}

function validateEnv(groupName) {
  return (
    (process.env.ENV === 'dev' && groupName.startsWith('POKDEV')) ||
    (process.env.ENV === 'prod' && !groupName.startsWith('POKDEV'))
  );
}

function validateMessage(msg, chat) {
  return (
    currentTime() - msg.timestamp < constants.MESSAGE_MAX_AGE &&
    (chat.isGroup || msg.from.length > 22 || msg.to.length > 22)
  );
}

async function validateLock(game) {
  if (!game.lock) {
    return true;
  } else if (BigInt(currentTime()) - game.lock > constants.LOCK_MAX_AGE) {
    // For cases where a game still has a lock because of an external error
    await unlockGame(game);
    return true;
  } else {
    return false;
  }
}

function logMessage(message, chatName, messageLevel) {
  const template = `CHAT: {{chatName}} || FROM: {{author}} || MESSAGE: {{body}}`;
  const values = {
    chatName,
    author: message.author,
    body: message.body.join(' '),
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
      console.error(newMessage);
      break;
  }
}

function filterWhatsapp(whatsapp) {
  return getProperties(whatsapp, [], ['sendMessage', 'on', 'initialize']);
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

async function getGame(chat) {
  let game = await Game.get(chat.id.user);
  if (!game) {
    game = await Game.create(chat.id.user, chat.name);
  }

  return game;
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const glhf = new OpenAI({
  apiKey: process.env.GLHF_API_KEY,
  baseURL: 'https://glhf.chat/api/openai/v1',
});

async function translate(body) {
  try {
    return await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: constants.LLM_SYSTEM_MESSAGE,
        },
        {
          role: 'user',
          content: `${body} `,
        },
      ],

      model: `${constants.MODEL_GROQ}`,
      temperature: 0.7,
    });
  } catch {
    return await glhf.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: constants.LLM_SYSTEM_MESSAGE,
        },
        {
          role: 'user',
          content: `${body} `,
        },
      ],

      model: `${constants.MODEL_GLHF}`,
      temperature: 0.7,
    });
  }
}

function processOutput(output) {
  return output.split(' ').filter((word) => word !== '' && word !== '\n');
}

const redis = new Redis({ password: process.env.REDIS_PASSWORD });

async function messageToCommand(body) {
  const cacheKey = body.join('_');

  if (body.length <= 6) {
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      return processOutput(cachedResult);
    }
  }

  const groqOutput = await translate(body.join(' '));
  newBody = groqOutput.choices[0]?.message?.content;

  if (body.length <= 6) {
    await redis.set(cacheKey, newBody);
  }

  return processOutput(newBody);
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
