const { formatId, replyError } = require('../../generalFunctions');
const constants = require('../../constants');

function start(game, message) {
  if (game == undefined) {
    return replyError(message, 'There are no players on the table :(');
  }

  if (game.players[formatId(message.author)] == undefined) {
    return replyError(message, 'You need to join the game first');
  }

  if (Object.keys(game.players).length == 1) {
    return replyError(message, 'There is only one player at the table');
  }

  if (
    Object.values(game.players).filter((player) => player.gameMoney > 0)
      .length <= 1
  ) {
    return replyError(
      message,
      `Not enough player has sufficient money in their stack\n
${game.getPlayersPretty()}\n
Use 'pok buy [amount]' to buy some chips`,
      { mentions: game.getMentions() },
    );
  }

  return true;
}

function join(game, message, amount) {
  if (
    game != undefined &&
    game.players[formatId(message.author)] !== undefined
  ) {
    let newMessage = 'You have already joined!';

    if (!Number.isNaN(amount)) {
      newMessage += `\nUse 'pok buy ${amount}' instead`;
    }

    return replyError(message, newMessage);
  }

  if (
    game != undefined &&
    Object.keys(game.players).length === constants.MAX_PLAYERS
  ) {
    return replyError(message, 'I am sorry, This game is full');
  }

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

function buy(game, message, amount) {
  if (game == undefined) {
    return replyError(message, 'You need to join the game first (pok join)');
  }

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
    return replyError(message, 'Please buy a positive amount');
  }

  if (player.money < amount) {
    return replyError(message, `You only have $${player.money} behind...`);
  }

  return true;
}

module.exports = { start, join, show, exit, buy };
