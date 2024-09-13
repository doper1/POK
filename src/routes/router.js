// Scripts
const constants = require('../constants');
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
  const phoneNumber = (await message.getContact()).id.user;

  if (games[chatId] == undefined || !games[chatId].isMidRound) {
    preGameRoute(body, games, chatId, message, whatsapp, chat, phoneNumber);
  } else {
    inGameRoute(body, games, chatId, message, whatsapp, chat, phoneNumber);
  }
}

module.exports = { validateMessage, route };
