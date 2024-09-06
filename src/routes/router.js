// Scripts
const constants = require("../constants");
const globalRoute = require("./global/index.js");
const preGameRoute = require("./preGame/index.js");
const inGameRoute = require("./inGame/index.js");

function validateMessage(message, body, chat) {
  const message_age = Math.floor(Date.now() / 1000) - message.timestamp;
  if (
    message_age < constants.MESSAGE_MAX_AGE &&
    chat.isGroup &&
    body[0] == "pok"
  ) {
    return true;
  }
  return false;
}

async function route(whatsapp, message, body, chat, games) {
  let contact = await message.getContact();
  let chat_id = chat.id.user;

  if (globalRoute(body, games, chat_id, message, contact, chat)) {
    return true;
  } else if (games[chat_id] == undefined || !games[chat_id].is_midround) {
    preGameRoute(body, games[chat_id], message, whatsapp);
  } else {
    inGameRoute(body, games, chat_id, message, whatsapp);
  }
}

module.exports = { validateMessage, route };
