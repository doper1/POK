const constants = require('./constants');
const { getProperties, currentTime } = require('./generalFunctions');
const Mustache = require('mustache');
const Game = require('../models/Game.js');

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
  message.body = message.body.toLowerCase().split(' ');
  message.author = message.author.match(/\d+/)[0];

  return getProperties(message, ['body', 'author'], ['react', 'reply']);
}

function filterChat(chat) {
  return getProperties(chat, ['id', 'name', 'isGroup'], ['sendMessage']);
}

function validateMessage(msg, chat) {
  return (
    currentTime() - msg.timestamp < constants.MESSAGE_MAX_AGE &&
    chat.isGroup &&
    msg.body[0] == 'pok'
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
};
