const Mustache = require('mustache');
const gameFunctions = require('../../game/gameFunctions');
const { emote, formatId } = require('../../generalFunctions');

// globals
let newMessage;
let current;
let amount;
let template;
let player;

function end(game, message) {
  message.react(emote('sad'));
  game.endGame();
  return true;
}

function check(game, whatsapp) {
  current = game.order.currentPlayer;

  template = `@{{name}} checked`;
  player = {
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

  template = `@{{name}} raised $${amount}`;
  player = {
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

  template = `Wow! @{{name}} is *ALL IN* for \${{amount}} more (total \${{totalBet}})`;
  player = {
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

  template = `@{{name}} folded`;
  player = {
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

  template = `Nice! @{{name}} calls \${{amount}}`;
  player = {
    name: current.phoneNumber,
    amount: amount,
  };
  newMessage = Mustache.render(template, player);
  gameFunctions.qualifyToAllIns(game, amount);
  game.updateRound(whatsapp, newMessage);
  return true;
}

function buy(game, message, amount) {
  let id = formatId(message.author);
  player = game.players[id];

  player.queueReBuy(amount);
  player.sessionBalance -= amount;
  player.money -= amount;

  template = `Nice! @{{name}} bought \${{amount}}
it will be added in the next hand`;

  player = {
    name: player.phoneNumber,
    amount: amount,
  };
  newMessage = Mustache.render(template, player);
  message.react(emote('happy'));
  game.chat.sendMessage(newMessage, { mentions: [id] });
  return true;
}

function join(games, chatId, message, phoneNumber, chat) {
  let id = formatId(message.author);
  let game = games[chatId];

  game.addPlayer(id, phoneNumber);
  game.players[id].isFolded = true;
  game.folds++;
  game.order.insertAfterCurrent(game.players[id]);

  let template = `Hi @{{name}}, welcome to the game!
Buy some Chips with 'pok buy [amount]'
before the next hand starts`;

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
  let id = formatId(message.author);
  player = games[chatId].players[id];

  player.money += player.gameMoney; // TODO: This row is currently insignificant the player is deleted upon exit. it will be useful when DB will come in play

  if (Object.keys(games[chatId].players).length == 2) {
    games[chatId].order.removePlayer(id);
    delete games[chatId].players[id];
    games[chatId].isMidRound = false;

    message.react('👋');
    message.reply(`*The game has ended!*`);
  } else {
    games[chatId].order.removePlayer(id);
    delete games[chatId].players[id];

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
  buy,
  join,
  show,
  exit,
};
