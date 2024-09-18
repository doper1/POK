const Mustache = require('mustache');
const Game = require('../../classes/Game');
const { formatId, emote } = require('../../generalFunctions');

function start(game, message, whatsapp) {
  game.isMidRound = true;

  game.generateOrder();
  game.initRound(whatsapp, '🎰 *The game has STARTED!* 🎰');

  message.react(emote('happy'));
}

function join(games, chatId, message, phoneNumber, chat) {
  let id = formatId(message.author);

  if (games[chatId] == undefined) games[chatId] = new Game(chatId, chat);

  let game = games[chatId];
  game.addPlayer(id, phoneNumber);

  message.react(emote('happy'));
  let newMessage = `Hi @{{name}}, welcome to the game!
Buy some Chips with 'pok buy [amount]'
before the game starts`;
  chat.sendMessage(
    Mustache.render(newMessage, {
      name: game.players[id].phoneNumber,
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
  let id = formatId(message.author);
  let player = game.players[id];

  player.gameMoney += amount;
  player.sessionBalance -= amount;
  player.money -= amount;

  let template = `Nice! @{{name}} bought \${{amount}}`;

  player = {
    name: player.phoneNumber,
    amount: amount,
  };
  let newMessage = Mustache.render(template, player);
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
