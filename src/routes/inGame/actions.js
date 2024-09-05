const { emote } = require("../../scripts/generalFunctions");
const game_functions = require("../../scripts/gameFunctions");

// globals
let new_message;
let current;

function end(games, chat_id, message) {
  delete games[chat_id];
  message.reply(`*The game has ended!*`);
}

function check() {}

function raise(game, amount, whatsapp) {
  current = game.order.current_player;
  new_message = `@${current.contact.id.user} raised $${amount}`;
  game_functions.qualifyToAllIns(game);
  current.is_played = true;
  current.current_bet = amount + current.current_bet;
  game.pot.main_pot += amount;
  current.game_money -= amount;
  game.pot.current_bet = current.current_bet;

  game.updateRound(whatsapp, new_message);
  return true;
}

function all_in(game, whatsapp) {
  current = game.order.current_player;
  new_message = `@${current.contact.id.user} is ALL IN for $${current.game_money} more (total $${current.current_bet + current.game_money})`;
  game_functions.qualifyToAllIns(game);
  current.is_all_in = true;
  current.is_played = true;
  game.pot.main_pot += current.game_money;
  current.current_bet += current.game_money;
  current.game_money = 0;

  if (current.current_bet > game.pot.current_bet) {
    game.pot.current_bet = current.current_bet;
  }

  game.pot.addAllIn(game);
  game.updateRound(whatsapp, new_message);
  return true;
}

function fold(game, message, whatsapp) {
  current = game.order.current_player;
  new_message = `@${current.contact.id.user} folded`;
  current.is_folded = true;
  game.folds++;

  message.react(emote("fold"));
  game.updateRound(whatsapp, new_message);
  return true;
}

function call(game, whatsapp) {
  current = game.order.current_player;
  let amount = game.pot.current_bet - current.current_bet;
  new_message = `@${current.contact.id.user} calls $${amount}`;
  game_functions.qualifyToAllIns(game);
  current.game_money -= amount;
  current.is_played = true;
  game.pot.main_pot += amount;
  current.current_bet = game.pot.current_bet;

  game.updateRound(whatsapp, new_message);
  return true;
}

module.exports = {
  end,
  fold,
  check,
  raise,
  call,
  all_in,
};
