const mustache = require("mustache");
const { emote } = require("../../generalFunctions");
const game_functions = require("../../game/gameFunctions");

// globals
let new_message;
let current;
let amount;

function end(games, chat_id, message) {
  delete games[chat_id];
  message.reply(`*The game has ended!*`);
}

function check(game, whatsapp) {
  current = game.order.current_player;
  new_message = `@${current.contact.id.user} checked`;

  game.updateRound(whatsapp, new_message);
  return true;
}

function raise(game, amount, whatsapp) {
  current = game.order.current_player;
  new_message = `@${current.contact.id.user} raised $${amount}`;
  current.is_played = true;
  current.current_bet = amount + current.current_bet;
  game.pot.main_pot += amount;
  current.game_money -= amount;
  game.pot.current_bet = current.current_bet;

  game_functions.qualifyToAllIns(game, amount);
  game.updateRound(whatsapp, new_message);
  return true;
}

function all_in(game, whatsapp) {
  current = game.order.current_player;
  amount = current.game_money;
  current.is_all_in = true;
  current.is_all_in = true;
  current.is_played = true;
  game.pot.main_pot += amount;
  current.current_bet += amount;
  current.game_money = 0;

  if (current.current_bet > game.pot.current_bet) {
    game.pot.current_bet = current.current_bet;
  }

  const all_in_template = `Wow! @{{player}} is ALL IN for \${{ amount }} more (total \${{ total_bet }})`;
  const player = {
    player: current.contact.id.user,
    amount: amount,
    total_bet: current.current_bet
  };

  new_message = mustache.render(all_in_template, player);
  game.pot.addAllIn(game);
  game_functions.qualifyToAllIns(game, amount);
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
  current.game_money -= amount;
  current.is_played = true;
  game.pot.main_pot += amount;
  current.current_bet = game.pot.current_bet;

  game_functions.qualifyToAllIns(game, amount);
  game.updateRound(whatsapp, new_message);
  return true;
}

module.exports = {
  end,
  fold,
  check,
  raise,
  call,
  all_in
};
