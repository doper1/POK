const {
  isCurrent,
  isPlaying,
  isGameRunning,
  replyError,
} = require('../utils/generalFunctions');
const constants = require('../utils/constants');
const User = require('../models/User');
const Pot = require('../models/Pot.js');

async function start(game, chat, message) {
  if (constants.GAME_RUNNING_STATUSES.includes(game.status)) {
    return replyError(message, 'There is a game in progress');
  }

  let players = await game.getPlayers();

  if (
    players.length > 0 &&
    !players.some((player) => player.userId === message.author)
  ) {
    return replyError(message, 'You need to join the game first');
  }

  if (players.length == 1) {
    return replyError(message, 'There is only one player at the table');
  }

  if (players.filter((player) => player.gameMoney > 0).length <= 1) {
    await chat.sendMessage(
      `Not enough player has sufficient money in their stack\n
    ${await game.getPlayersPretty()}`,
      { mentions: await game.getMentions() },
    );
    return false;
  }

  return true;
}

function end(game, message) {
  if (game.status === 'pending') {
    return replyError(message, 'No game in progress');
  }

  if (game.status === 'to end') {
    return replyError(message, 'The game is already about to end');
  }

  return true;
}

async function join(game, message, amount, players) {
  const player = players.find((player) => player.userId === message.author);

  if (player) {
    let newMessage = 'You have already joined the game';

    if (!Number.isNaN(amount) && player.gameMoney === 0) {
      newMessage += '\nBuy some chips instead';
    }

    return replyError(message, newMessage);
  }
  if (players.length === constants.MAX_PLAYERS) {
    return replyError(message, 'I am sorry, This game is full');
  }

  if (game.status === 'to end') {
    return replyError(
      'There is no point in joining now, the game is about to end',
    );
  }

  return true;
}

async function show(game, message) {
  if (!(await game.getPlayers()).length) {
    return replyError(message, 'There are no players at the table');
  }

  return true;
}

async function exit(message, current) {
  if (!current) {
    return replyError(message, 'You have not joined the game yet');
  }

  return true;
}

async function buy(game, message, amount, current, joinFlag = true) {
  if (joinFlag && current === undefined) {
    return replyError(message, 'You need to join the game first');
  }

  if (Number.isNaN(amount)) {
    return replyError(message, 'Please specify a numerical amount (e.g. 30)');
  }

  if (!Number.isInteger(amount)) {
    return replyError(
      message,
      'Please enter a whole number (e.g. 4) and not a decimal (e.g. 4.5).',
    );
  }

  if (amount < 1) {
    return replyError(message, 'Please buy a positive amount');
  }

  let user = await User.get(message.author);

  if (user === undefined) {
    currentAmount = 1000;
  } else {
    currentAmount = user.money;
  }

  if (currentAmount < amount) {
    return replyError(message, `You only have $${currentAmount} behind...`);
  }

  if (game.status === 'to end') {
    return replyError(
      message,
      'The game is about to end, You cannot buy chips anymore.',
    );
  }

  return true;
}

async function small(game, message, amount, current) {
  if (current === undefined) {
    return replyError(message, 'You need to join the game first');
  }

  if (amount >= game.bigBlind) {
    return replyError(
      message,
      '_Small blind_ should be less than the _big blind_',
    );
  }

  if (amount === game.smallBlind) {
    return replyError(message, `_Small blind_ is already $${amount}`);
  }

  if (Number.isNaN(amount)) {
    return replyError(message, 'Please specify a numerical amount (e.g. 30)');
  }

  if (!Number.isInteger(amount)) {
    return replyError(
      message,
      'Please enter a whole number (e.g. 4) and not a decimal (e.g. 4.5).',
    );
  }

  if (amount < 1) {
    return replyError(message, 'Please specify a positive amount');
  }

  return true;
}

async function big(game, message, amount, current) {
  if (current === undefined) {
    return replyError(message, 'You need to join the game first');
  }

  if (amount <= game.smallBlind) {
    return replyError(
      message,
      '_Big blind_ should be more than the _small blind_',
    );
  }

  if (amount === game.bigBlind) {
    return replyError(message, `_Big blind_ is already $${amount}`);
  }

  if (Number.isNaN(amount)) {
    return replyError(message, 'Please specify a numerical amount (e.g. 30)');
  }

  if (!Number.isInteger(amount)) {
    return replyError(
      message,
      'Please enter a whole number (e.g. 4) and not a decimal (e.g. 4.5).',
    );
  }

  if (amount < 1) {
    return replyError(message, 'Please specify a positive amount');
  }

  return true;
}

async function check(game, message, current) {
  if (!isGameRunning(game.status, message)) return false;
  if (!isPlaying(current, message)) return false;
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

function allIn(game, message, current) {
  if (!isGameRunning(game.status, message)) return false;
  if (!isPlaying(current, message)) return false;
  if (!isCurrent(game, message)) return false;
  return true;
}

async function raise(game, message, amount, current) {
  if (!isGameRunning(game.status, message)) return false;
  if (!isPlaying(current, message)) return false;
  if (!isCurrent(game, message)) return false;

  if (Number.isNaN(amount)) {
    return replyError(
      message,
      `Please specify a numerical amount (e.g. '3'), pot bases size (e.g. 'full pot', 'half pot') or go 'all in' (e.g. 'all in')`,
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

function fold(game, message, current) {
  if (!isGameRunning(game.status, message)) return false;
  if (!isPlaying(current, message)) return false;
  if (!isCurrent(game, message)) return false;
  return true;
}

function call(game, message, current, pot) {
  if (!isGameRunning(game.status, message)) return false;
  if (!isPlaying(current, message)) return false;
  if (!isCurrent(game, message)) return false;

  if (pot.highestBet === current.currentBet) {
    return replyError(message, 'Since no one has bet, you don’t need to call');
  }

  return true;
}

module.exports = {
  start,
  end,
  join,
  show,
  exit,
  buy,
  small,
  big,
  check,
  raise,
  allIn,
  fold,
  call,
};
