const { emote, isCurrent, formatId } = require('../../generalFunctions.js');

// globals
let current;

function end(game, message) {
  if (game === undefined || !game.isMidRound) {
    message.react(emote('mistake'));
    message.reply('There is no game in progress');
    return false;
  }
  return true;
}

function check(game, message) {
  current = game.order.currentPlayer;
  if (!isCurrent(game, message)) {
    return false;
  } else if (game.pot.currentBet != current.currentBet) {
    message.react(emote('mistake'));
    message.reply(
      `You can call ($${
        game.pot.currentBet - current.currentBet
      } more), raise or fold`,
    );
    return false;
  }
  return true;
}

function allIn(game, message) {
  if (!isCurrent(game, message)) {
    return false;
  }
  return true;
}

function raise(game, message, amount) {
  current = game.order.currentPlayer;
  if (!isCurrent(game, message)) {
    return false;
  } else if (Number.isNaN(amount)) {
    message.react(emote('mistake'));
    message.reply(
      "Please specify a numerical amount (e.g. 'pok raise 3') or go 'all in' (e.g. 'pok raise all in').",
    );
    return false;
  } else if (!Number.isInteger(amount)) {
    message.react(emote('mistake'));
    message.reply(
      'Please enter a whole number (e.g. 4) and not a decimal (e.g. 4.5).',
    );
    return false;
  } else if (amount < 1) {
    message.react(emote('mistake'));
    message.reply('Please Raise a positive amount');
    return false;
  } else if (game.pot.currentBet > amount + current.currentBet) {
    message.react(emote('mistake'));
    message.reply(
      `You need to call, raise at least $${
        game.pot.currentBet - current.currentBet
      } more, or fold`,
    );
    return false;
  } else if (current.gameMoney < amount) {
    message.react(emote('mistake'));
    message.reply(`You only have $${current.gameMoney}...`);
    return false;
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
  if (!isCurrent(game, message)) {
    return false;
  } else if (current.gameMoney == 0) {
    message.reply("You are out of chips, please re-buy using 'pok rebuy'");
    return false;
  } else if (game.pot.currentBet == current.currentBet) {
    message.react(emote('mistake'));
    message.reply(`Since no one has bet, you don’t need to call`);
    return false;
  }
  return true;
}

function buy(game, message, amount) {
  let player = game.players[formatId(message.author)];

  if (player === undefined) {
    message.react(emote('mistake'));
    message.reply('You need to join the game first (pok join)');
    return false;
  } else if (Number.isNaN(amount)) {
    message.react(emote('mistake'));
    message.reply("Please specify a numerical amount (e.g. 'pok buy 30')");
    return false;
  } else if (!Number.isInteger(amount)) {
    message.react(emote('mistake'));
    message.reply(
      'Please enter a whole number (e.g. 4) and not a decimal (e.g. 4.5).',
    );
    return false;
  } else if (amount < 1) {
    message.react(emote('mistake'));
    message.reply('Please re-buy a positive amount');
    return false;
  }
  if (player.money < amount) {
    message.react(emote('mistake'));
    message.reply(`You only have $${player.money} behind...`);
    return false;
  }
  return true;
}

function join(game, message) {
  let id = formatId(message.author);

  if (game != undefined && game.players[id] !== undefined) {
    message.reply('You have already joined!');
    return false;
  } // TODO: When there is a DB in play, add validation for if the player has enought money to join the game (most of the time of he has more then zero, or if there is minimum by-in (1000/200 game with blinds of 10/20))
  return true;
}

function show(game, message) {
  if (game == undefined) {
    message.react(emote('fold'));
    message.reply('There are no players at the table');
    return false;
  }
  return true;
}

function exit(game, message) {
  if (
    game === undefined ||
    game.players[formatId(message.author)] === undefined
  ) {
    message.react(emote('mistake'));
    message.reply('You have not joined the game yet');
    return false;
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
