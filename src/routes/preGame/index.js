const constants = require("../../constants.js");
const actions = require("./actions.js");
const validators = require("./validators.js");

function preGameRoute(body, game, message, whatsapp) {
  switch (body[1]) {
    case "start":
      if (validators.start(game, message))
        actions.start(game, message, whatsapp);
      return true;
    default:
      message.reply(constants.HELP_PRE_GAME);
      return true;
  }
}

module.exports = preGameRoute;
