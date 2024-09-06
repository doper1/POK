const constants = require("../../constants.js");
const actions = require("./actions.js");
const validators = require("./validators.js");

function globalRoute(body, games, chat_id, message, contact, chat) {
  switch (body[1]) {
    case "help":
      message.reply(constants.HELP_PRE_GAME);
      return true;
    case "join":
      if (validators.join(games[chat_id], message))
        actions.join(games, chat_id, message, contact, chat);
      return true;
    case "show":
      if (validators.show(games[chat_id], message))
        actions.show(games[chat_id], chat);
      return true;
    case "exit":
      if (validators.exit(games[chat_id], message))
        actions.exit(games, chat_id, message);
      return true;
    default:
      return false;
  }
}

module.exports = globalRoute;
