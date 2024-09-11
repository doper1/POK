const constants = require("../../constants");
const actions = require("./actions.js");
const validators = require("./validators.js");
const { emote } = require("../../generalFunctions");

function inGameRoute(body, games, chat_id, message, whatsapp) {
  let game = games[chat_id];
  let current = game.order.current_player;
  let raise_amount;

  switch (body[1]) {
    case "start":
      message.react(emote("mistake"));
      message.reply("There is a game in progress");
      return true;
    case "check":
      if (validators.check(game, message)) actions.check(game, whatsapp);
      return true;
    case "raise":
      raise_amount = Number(body[2]);

      if (body[2] == "all" || current.game_money == raise_amount) {
        if (validators.all_in(game, message)) {
          actions.all_in(game, whatsapp);
        }
      } else if (validators.raise(game, message, raise_amount)) {
        actions.raise(game, raise_amount, whatsapp);
      }
      return true;
    case "all":
      if (validators.all_in(game, message)) actions.all_in(game, whatsapp);
      return true;
    case "fold":
      if (validators.fold(game, message)) actions.fold(game, message, whatsapp);
      return true;
    case "call":
      if (game.pot.current_bet - current.current_bet >= current.game_money) {
        if (validators.all_in(game, message)) actions.all_in(game, whatsapp);
        return true;
      } else if (validators.call(game, message)) actions.call(game, whatsapp);
      return true;
    case "end":
      if (validators.end(game, message)) actions.end(games, chat_id, message);
      return true;
    default:
      message.reply(constants.HELP_IN_GAME);
      return true;
  }
}

module.exports = inGameRoute;
