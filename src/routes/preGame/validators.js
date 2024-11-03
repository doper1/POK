const { replyError } = require('../../utils/generalFunctions');
const constants = require('../../utils/constants');
const User = require('../../models/User');

async function start(game, chat, message) {
  let players = await game.getPlayers();

  if (!players.some((player) => player.userId === message.author)) {
    return replyError(message, 'You need to join the game first');
  }

  if (players.length == 1) {
    return replyError(message, 'There is only one player at the table');
  }

  if (players.filter((player) => player.gameMoney > 0).length <= 1) {
    await chat.sendMessage(
      `Not enough player has sufficient money in their stack\n
    ${await game.getPlayersPretty()}\n
    Use 'pok buy [amount]' to buy some chips`,
      { mentions: await game.getMentions() },
    );
    return false;
  }

  return true;
}

async function join(game, message, amount, current) {
  if (current) {
    let newMessage = 'You have already joined!';

    if (!Number.isNaN(amount)) {
      newMessage += `\nUse 'pok buy ${amount}' instead`;
    }

    return replyError(message, newMessage);
  }
  if ((await game.getPlayers()).length === constants.MAX_PLAYERS) {
    return replyError(message, 'I am sorry, This game is full');
  }

  if (game.status === 'to end') {
    return replyError(
      'There is no point in joining now, the game is about to end',
    );
  }

  if (!Number.isNaN(amount)) {
    return await buy(game, message, amount, current, false);
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

  let user = await User.get(message.author);

  if (joinFlag && user.money < amount) {
    return replyError(message, `You only have $${user.money} behind...`);
  }

  if (game.status === 'to end') {
    return replyError(
      message,
      'The game is about to end, You cannot buy chips anymore.',
    );
  }

  return true;
}

module.exports = { start, join, show, exit, buy };
