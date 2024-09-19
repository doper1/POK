const { formatId, emote } = require('../../generalFunctions');

function start(game, message) {
  if (game == undefined) {
    message.reply('There are no players on the table :(');
    return false;
  } else if (game.players[formatId(message.author)] == undefined) {
    message.react(emote('mistake'));
    message.reply('You need to join the game first');
    return false;
  } else if (Object.keys(game.players).length == 1) {
    message.react(emote('mistake'));
    message.reply('There is only one player at the table');
    return false;
  } else if (
    Object.values(game.players).filter((player) => player.gameMoney > 0)
      .length <= 1
  ) {
    message.react(emote('mistake'));
    game.chat.sendMessage(
      `Not enough player has sufficient money in their stack\n
${game.getPlayersPretty()}\n
Use 'pok buy [amount]' to buy some chips`,
      { mentions: game.getMentions() },
    );
    return false;
  }
  return true;
}

function join(game, message) {
  if (
    game != undefined &&
    game.players[formatId(message.author)] !== undefined
  ) {
    message.reply('You have already joined!');
    return false;
  } else if (game != undefined && Object.keys(game.players).length === 23) {
    message.react(emote('mistake'));
    message.reply('I am sorry, This game is full');
    return false;
  }
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
    message.reply('Please buy a positive amount');
    return false;
  }
  if (player.money < amount) {
    message.react(emote('mistake'));
    message.reply(`You only have $${player.money} behind...`);
    return false;
  }
  return true;
}

module.exports = { start, join, show, exit, buy };
