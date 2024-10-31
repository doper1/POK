const constants = require('./constants');
const { getProperties, currentTime } = require('./generalFunctions');
const Mustache = require('mustache');
const Game = require('../models/Game.js');
const Groq = require('groq-sdk');

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

function validateMessage(msg, chat) {
  return (
    currentTime() - msg.timestamp < constants.MESSAGE_MAX_AGE && chat.isGroup
  );
}

async function lockGame(game) {
  await game.set('lock', currentTime());
}

async function unlockGame(game) {
  await game.set('lock', null);
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

async function getGame(chat) {
  let game = await Game.get(chat.id.user);
  if (!game) {
    game = await Game.create(chat.id.user, chat.name);
  }

  return game;
}

const groq = new Groq({ apiKey: process.env.Groq_API_KEY });

async function translate(body) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
Your name is Pok.

The message you will receive is poker related.
Your goal is to translate it to a command.

The possible commands are:
pok check - checks the actions and move the turn to the next player.
pok call - calls the current bet
pok raise [amount] - raises the specified amount
pok all (in) - puts all your chips in the pot
pok fold - folds the hand
pok buy [amount] - buys more chips to the table
pok help - Shows the available commands
pok start - starts the game
pok join [amount] - adds you to the game. If you also specified an amount, it will buy that amount
pok show - Shows the pot value, the players, the players order, the players statues, the players bets and the current player
pok exit - remove you from the game
pok end - ends the game for everyone


Return either:
1. a command from the command list
2. 'not related'
`,
      },
      {
        role: 'user',
        content: `${body} `,
      },
    ],

    model: `${constants.MODEL}`,
  });
}

module.exports = {
  validateMessage,
  filterWhatsapp,
  filterMessage,
  filterChat,
  logMessage,
  validateLock,
  lockGame,
  unlockGame,
  getGame,
  translate,
};
