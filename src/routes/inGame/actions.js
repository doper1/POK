const mustache = require('mustache');
const { emote } = require('../../generalFunctions');
const gameFunctions = require('../../game/gameFunctions');

// globals
let newMessage;
let current;
let amount;

function end(games, chatId, message) {
  delete games[chatId];
  message.reply(`*The game has ended!*`);
  return true;
}

function check(game, whatsapp) {
  current = game.order.currentPlayer;

  const template = `@{{name}} checked`;
  const player = {
    name: current.phoneNumber,
  };
  newMessage = mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
  return true;
}

function raise(game, amount, whatsapp) {
  current = game.order.currentPlayer;
  current.isPlayed = true;
  current.currentBet = amount + current.currentBet;
  game.pot.mainPot += amount;
  current.gameMoney -= amount;
  game.pot.currentBet = current.currentBet;
  gameFunctions.qualifyToAllIns(game, amount);

  const template = `@{{name}} raised $${amount}`;
  const player = {
    name: current.phoneNumber,
  };
  newMessage = mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
  return true;
}

function allIn(game, whatsapp) {
  current = game.order.currentPlayer;
  amount = current.gameMoney;
  current.isAllIn = true;
  current.isAllIn = true;
  current.isPlayed = true;
  game.pot.mainPot += amount;
  current.currentBet += amount;
  current.gameMoney = 0;

  if (current.currentBet > game.pot.currentBet) {
    game.pot.currentBet = current.currentBet;
  }

  game.pot.addAllIn(game);
  gameFunctions.qualifyToAllIns(game, amount);

  const template = `Wow! @{{name}} is *ALL IN* for \${{amount}} more (total \${{totalBet}})`;
  const player = {
    name: current.phoneNumber,
    amount: amount,
    totalBet: current.currentBet,
  };
  newMessage = mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
  return true;
}

function fold(game, message, whatsapp) {
  current = game.order.currentPlayer;
  current.isFolded = true;
  game.folds++;

  const template = `@{{name}} folded`;
  const player = {
    name: current.phoneNumber,
  };
  newMessage = mustache.render(template, player);
  message.react(emote('fold'));
  game.updateRound(whatsapp, newMessage);
  return true;
}

function call(game, whatsapp) {
  current = game.order.currentPlayer;
  let amount = game.pot.currentBet - current.currentBet;
  current.gameMoney -= amount;
  current.isPlayed = true;
  game.pot.mainPot += amount;
  current.currentBet = game.pot.currentBet;

  const template = `@{{name}} calls \${{amount}}`;
  const player = {
    name: current.phoneNumber,
    amount: amount,
  };
  newMessage = mustache.render(template, player);
  gameFunctions.qualifyToAllIns(game, amount);
  game.updateRound(whatsapp, newMessage);
  return true;
}

module.exports = {
  end,
  check,
  raise,
  allIn,
  fold,
  call,
};
