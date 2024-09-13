// Scripts
const constants = require('../constants');
const globalRoute = require('./global/index.js');
const preGameRoute = require('./preGame/index.js');
const inGameRoute = require('./inGame/index.js');

function validateMessage(message, body, chat) {
  const messageAge = Math.floor(Date.now() / 1000) - message.timestamp;
  if (
    messageAge < constants.MESSAGE_MAX_AGE &&
    chat.isGroup &&
    body[0] == 'pok'
  ) {
    return true;
  }
  return false;
}

async function route(whatsapp, message, body, chat, games) {
  const chatId = chat.id.user;
  const contact = (await message.getContact()).id.user;

  if (globalRoute(body, games, chatId, message, contact, chat)) {
    return true;
  } else if (games[chatId] == undefined || !games[chatId].isMidRound) {
    preGameRoute(body, games[chatId], message, whatsapp);
  } else {
    inGameRoute(body, games, chatId, message, whatsapp);
  }
}

module.exports = { validateMessage, route };
