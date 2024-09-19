const Mustache = require('mustache');
const Game = require('../../classes/Game');
const { formatId, emote } = require('../../generalFunctions');

// globals
let id;
let player;
let template;
let game;
let newMessage;

function start(game, message, whatsapp) {
  game.isMidRound = true;

  game.generateOrder();
  game.initRound(whatsapp, '🎰 *The game has STARTED!* 🎰');

  message.react(emote('happy'));
}

function join(games, chatId, message, phoneNumber, chat, amount) {
  id = formatId(message.author);

  if (games[chatId] == undefined) games[chatId] = new Game(chatId, chat);

  game = games[chatId];
  game.addPlayer(id, phoneNumber);
  player = game.players[id];

  if (Number.isNaN(amount)) {
    template = `Hi @{{name}}, welcome to the game!
Buy some Chips with 'pok buy [amount]'
before the game starts`;
  } else {
    player.gameMoney = amount;
    player.money -= amount;
    player.sessionBalance -= amount;
    template = `Hi @{{name}}, welcome to the game!`;
  }

  message.react(emote('happy'));
  chat.sendMessage(
    Mustache.render(template, {
      name: player.phoneNumber,
    }),
    {
      mentions: [id],
    },
  );
}

function show(game, chat) {
  chat.sendMessage(game.getPlayersPretty(), { mentions: game.getMentions() });
}

function exit(games, chatId, message) {
  games[chatId].players[formatId(message.author)].isFolded = true;
  games[chatId].folds++;

  if (Object.keys(games[chatId].players).length == 1) {
    delete games[chatId];

    message.react('👋');
    message.reply(`Goodbye!`);
  } else {
    delete games[chatId].players[formatId(message.author)];

    message.react('👋');
    message.reply(`Goodbye!`);
  }
}

function buy(game, message, amount) {
  id = formatId(message.author);
  player = game.players[id];

  player.gameMoney += amount;
  player.sessionBalance -= amount;
  player.money -= amount;

  template = `Nice! @{{name}} bought \${{amount}}`;

  player = {
    name: player.phoneNumber,
    amount: amount,
  };
  newMessage = Mustache.render(template, player);
  message.react(emote('happy'));
  game.chat.sendMessage(newMessage, { mentions: [id] });
  return true;
}

module.exports = {
  start,
  join,
  show,
  exit,
  buy,
};
