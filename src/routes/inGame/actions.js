const Mustache = require('mustache');
const gameFunctions = require('../../game/gameFunctions');
const { emote, formatId } = require('../../generalFunctions');

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
  newMessage = Mustache.render(template, player);
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
  newMessage = Mustache.render(template, player);
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

  gameFunctions.qualifyToAllIns(game, amount);
  game.pot.addAllIn(game);

  const template = `Wow! @{{name}} is *ALL IN* for \${{amount}} more (total \${{totalBet}})`;
  const player = {
    name: current.phoneNumber,
    amount: amount,
    totalBet: current.currentBet,
  };
  newMessage = Mustache.render(template, player);
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
  newMessage = Mustache.render(template, player);
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
  newMessage = Mustache.render(template, player);
  gameFunctions.qualifyToAllIns(game, amount);
  game.updateRound(whatsapp, newMessage);
  return true;
}

function join(games, chatId, message, phoneNumber, chat) {
  let id = formatId(message.author);
  let game = games[chatId];

  game.addPlayer(id, phoneNumber);
  game.players[id].isFolded = true;
  game.folds++;
  game.order.insertAfterCurrent(game.players[id]); // TODO: needs to be tested

  let template = `Hi @{{name}}, welcome to the game!
Wait for the next round to start`;

  chat.sendMessage(
    Mustache.render(template, {
      name: game.players[id].phoneNumber,
    }),
    {
      mentions: [id],
    },
  );
}

function show(game, chat) {
  chat.sendMessage(game.getOrderPretty(), { mentions: game.getMentions() });
}

function exit(games, chatId, message) {
  games[chatId].players[formatId(message.author)].isFolded = true;
  games[chatId].folds++;

  if (Object.keys(games[chatId].players).length == 2) {
    games[chatId].order.removePlayer(formatId(message.author));
    delete games[chatId].players[formatId(message.author)];
    games[chatId].isMidRound = false;

    message.react('👋');
    message.reply(`*The game has ended!*`);
  } else {
    games[chatId].order.removePlayer(formatId(message.author));
    delete games[chatId].players[formatId(message.author)];

    message.react('👋');
    message.reply(`Goodbye!`);
  }
}

module.exports = {
  end,
  check,
  raise,
  allIn,
  fold,
  call,
  join,
  show,
  exit,
};
