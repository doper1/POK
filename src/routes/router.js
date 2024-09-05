// Scripts
const constants = require("../constants");
const pok_functions = require("./pokFunctions");
const { emote } = require("../scripts/generalFunctions");

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
  let game = games[chat_id];

  // Prevent crushes when the user does not have a whatsapp name.
  // This is a case when playing with the whatsapp account that runs the bot
  let full_name;
  if (contact.pushname == undefined) {
    full_name = contact.id.user;
  } else {
    full_name = contact.pushname;
  }

  if (!(game != undefined && game.is_midround)) {
    // Before a game starts
    switch (body[1]) {
      case "help":
        message.reply(constants.HELP_PRE_GAME);
        break;
      case "join":
        pok_functions.join(games, chat_id, message, full_name, contact, chat);
        break;
      case "show":
        pok_functions.show(game, message);
        break;
      case "exit":
        pok_functions.exit(games, chat_id, message, full_name);
        break;
      case "start":
        pok_functions.start(game, message, contact, whatsapp);
        break;
      default:
        message.reply(constants.HELP_PRE_GAME);
    }
  } else {
    let current = game.order.current_player;
    let raise_amount;

    // During a game
    switch (body[1]) {
      case "check":
        if (pok_functions.check(game, message)) {
          game.updateRound(whatsapp, `@${current.contact.id.user} checked`);
        }
        break;
      case "raise":
        raise_amount = Number(body[2]);

        if (body[2] == "all" || current.game_money == raise_amount) {
          raise_amount = current.game_money;
          if (pok_functions.all_in(game, message, message)) {
            game.updateRound(
              whatsapp,
              `@${current.contact.id.user} is ALL IN for $${raise_amount} more (total $${current.current_bet})`
            );
          }
        } else if (pok_functions.raise(game, message, raise_amount)) {
          game.updateRound(
            whatsapp,
            `@${current.contact.id.user} raised $${raise_amount}`
          );
        }
        break;
      case "all":
        raise_amount = current.game_money;

        if (pok_functions.all_in(game, message, message)) {
          game.updateRound(
            whatsapp,
            `@${current.contact.id.user} is ALL IN for $${raise_amount} more (total $${current.current_bet})`
          );
        }
        break;
      case "fold":
        if (pok_functions.fold(game, message))
          game.updateRound(whatsapp, `@${current.contact.id.user} folded`);
        break;
      case "call":
        raise_amount =
          game.pot.current_bet - game.order.current_player.current_bet;
        if (current.game_money == 0) {
          message.reply(
            "You are out of chips, please re-buy using 'pok rebuy'"
          );
        } else if (raise_amount >= current.game_money) {
          if (pok_functions.all_in(game, message, message)) {
            game.updateRound(
              whatsapp,
              `@${current.contact.id.user} is ALL IN for $${raise_amount} more (total $${current.current_bet})`
            );
          }
        } else if (pok_functions.call(game, message))
          game.updateRound(
            whatsapp,
            `@${current.contact.id.user} calls $${raise_amount}`
          );
        break;
      case "help":
        message.reply(constants.HELP_IN_GAME);
        break;
      case "join":
        pok_functions.join(games, chat_id, message, full_name, contact, chat);
        break;
      case "show":
        pok_functions.show(game, message);
        break;
      case "exit":
        pok_functions.exit(games, chat_id, message, contact);
        break;
      case "end":
        pok_functions.end(games, chat_id, message);
        break;
      default:
        if (body[1] == "start") {
          message.react(emote("mistake"));
          message.reply("There is a game in progress");
        } else {
          message.reply(constants.HELP_IN_GAME);
        }
    }
  }
}

module.exports = { validateMessage, route };
