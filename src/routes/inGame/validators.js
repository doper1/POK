const { isCurrent, replyError } = require('../../utils/generalFunctions.js');
const preGameValidators = require('../preGame/validators.js');
const Pot = require('../../models/Pot.js');

function end(game, message) {
  if (game.status === 'pending') {
    return replyError(message, 'No game in progress');
  }

  return true;
}

async function check(game, message, current) {
  if (!isCurrent(game, message)) return false;

  let pot = await Pot.get(game.mainPot);
  if (pot.highestBet != current.currentBet) {
    let callAmount = pot.highestBet - current.currentBet;

    return replyError(
      message,
      `You can call ($${callAmount} more), raise or fold`,
    );
  }

  return true;
}

function allIn(game, message) {
  return isCurrent(game, message);
}

async function raise(game, message, amount, current) {
  if (!isCurrent(game, message)) return false;

  if (Number.isNaN(amount)) {
    return replyError(
      message,
      `Please specify a numerical amount (e.g. 'pok raise 3') or go 'all in' (e.g. 'pok raise all in')`,
    );
  }

  if (!Number.isInteger(amount)) {
    return replyError(
      message,
      'Please specify a whole number (e.g. 4) and not a decimal (e.g. 4.5)',
    );
  }

  if (amount < 1) {
    return replyError(message, 'Please raise a positive amount');
  }
  let mainPot = await Pot.get(game.mainPot);
  if (mainPot.highestBet > amount + current.currentBet) {
    return replyError(
      message,
      `You need to call, raise at least $${
        mainPot.highestBet - current.currentBet
      } more, or fold`,
    );
  }

  if (current.gameMoney < amount) {
    return replyError(message, `You only have $${current.gameMoney}...`);
  }

  return true;
}

function fold(game, message) {
  return isCurrent(game, message);
}

function call(game, message, current, pot) {
  if (!isCurrent(game, message)) return false;

  if (current.gameMoney == 0) {
    return replyError(
      message,
      "You are out of chips, please re-buy using 'pok rebuy'",
    );
  }

  if (pot.highestBet === current.currentBet) {
    return replyError(message, 'Since no one has bet, you don’t need to call');
  }

  return true;
}

async function buy(game, message, amount, current) {
  return await preGameValidators.buy(game, message, amount, current);
}

async function join(game, message, amount, current, players) {
  return await preGameValidators.join(game, message, amount, current, players);
}

async function show(game, message) {
  return await preGameValidators.show(game, message);
}

async function exit(game, message) {
  return await preGameValidators.exit(game, message);
}

module.exports = {
  end,
  check,
  allIn,
  raise,
  fold,
  call,
  buy,
  join,
  show,
  exit,
};
