const {
  isCurrent,
  formatId,
  replyError,
} = require('../../generalFunctions.js');
const constants = require('../../constants.js');

// globals
let current;

function end(game, message) {
  if (!game || !game.isMidRound) {
    return replyError(message, 'No game in progress');
  }

  return true;
}

function check(game, message) {
  current = game.order.currentPlayer;

  if (!isCurrent(game, message)) return false;

  if (game.pot.currentBet != current.currentBet) {
    let callAmount = game.pot.currentBet - current.currentBet;

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

function raise(game, message, amount) {
  current = game.order.currentPlayer;

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

  if (game.pot.currentBet > amount + current.currentBet) {
    return replyError(
      message,
      `You need to call, raise at least $${
        game.pot.currentBet - current.currentBet
      } more, or fold`,
    );
  }

  if (current.gameMoney < amount) {
    return replyError(message, `You only have $${current.gameMoney}...`);
  }

  return true;
}

function fold(game, message) {
  if (!isCurrent(game, message)) {
    return false;
  }

  return true;
}

function call(game, message) {
  current = game.order.currentPlayer;

  if (!isCurrent(game, message)) return false;

  if (current.gameMoney == 0) {
    return replyError(
      message,
      "You are out of chips, please re-buy using 'pok rebuy'",
    );
  }

  if (game.pot.currentBet == current.currentBet) {
    return replyError(message, 'Since no one has bet, you don’t need to call');
  }

  return true;
}

function buy(game, message, amount) {
  let player = game.players[formatId(message.author)];

  if (player === undefined) {
    return replyError(message, 'You need to join the game first (pok join)');
  }

  if (Number.isNaN(amount)) {
    return replyError(
      message,
      "Please specify a numerical amount (e.g. 'pok buy 30')",
    );
  }

  if (!Number.isInteger(amount)) {
    return replyError(
      message,
      'Please enter a whole number (e.g. 4) and not a decimal (e.g. 4.5).',
    );
  }

  if (amount < 1) {
    return replyError(message, 'Please re-buy a positive amount');
  }

  if (player.money < amount) {
    return replyError(message, `You only have $${player.money} behind...`);
  }

  return true;
}

function join(game, message, amount) {
  let id = formatId(message.author);

  if (game.players[id] !== undefined) {
    let newMessage = 'You have already joined!';

    if (!Number.isNaN(amount)) {
      newMessage += `\nUse 'pok buy ${amount}' instead`;
    }

    return replyError(message, newMessage);
  }
  if (Object.keys(game.players).length === constants.MAX_PLAYERS) {
    return replyError(message, 'I am sorry, This game is full');
  } // TODO: When there is a DB in play, add validation for if the player has enought money to join the game (most of the time of he has more then zero, or if there is minimum by-in (1000/200 game with blinds of 10/20))

  return true;
}

function show(game, message) {
  if (game == undefined) {
    return replyError(message, 'There are no players at the table');
  }

  return true;
}

function exit(game, message) {
  if (
    game === undefined ||
    game.players[formatId(message.author)] === undefined
  ) {
    return replyError(message, 'You have not joined the game yet');
  }

  return true;
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
