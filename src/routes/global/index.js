const constants = require("../../constants.js");
const actions = require("./actions.js");
const validators = require("./validators.js");

function globalRoute(body, games, chatId, message, phoneNumber, chat) {
  switch (body[1]) {
    case "help":
      message.reply(constants.HELP_PRE_GAME);
      return true;
    case "join":
      if (validators.join(games[chatId], message))
        actions.join(games, chatId, message, phoneNumber, chat);
      return true;
    case "show":
      if (validators.show(games[chatId], message))
        actions.show(games[chatId], chat);
      return true;
    case "exit":
      if (validators.exit(games[chatId], message))
        actions.exit(games, chatId, message);
      return true;
    default:
      return false;
  }
}

module.exports = globalRoute;
