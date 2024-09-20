const constants = require('../constants');
const preGameRoute = require('./preGame/index.js');
const inGameRoute = require('./inGame/index.js');

function validateMessage(message, body, chat) {
  const messageAge = Math.floor(Date.now() / 1000) - message.timestamp;
  return (
    messageAge < constants.MESSAGE_MAX_AGE && chat.isGroup && body[0] == 'pok'
  );
}

async function route(whatsapp, message, body, chat, games) {
  const chatId = chat.id.user;
  const phoneNumber = (await message.getContact()).id.user;
  const params = {
    whatsapp,
    message,
    body,
    chat,
    games,
    chatId,
    phoneNumber,
  };

  if (games[chatId] == undefined || !games[chatId].isMidRound) {
    preGameRoute(params);
  } else {
    inGameRoute(params);
  }
}

module.exports = { validateMessage, route };
