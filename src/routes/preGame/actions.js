const Mustache = require('mustache');
const Game = require('../../classes/Game');
const { formatId, emote } = require('../../generalFunctions');

// pok start - start the game
function start(game, message, whatsapp) {
  game.generateOrder();
  let current = game.order.currentPlayer;
  do {
    current.gameMoney = 100; // TODO: Change to a constants, also handle less money situations
    current.money -= 100;
    current = current.nextPlayer;
  } while (!current.isButton);

  game.isMidRound = true;
  game.initRound(whatsapp);
  message.react(emote('happy'));
}

function join(games, chatId, message, phoneNumber, chat) {
  let id = formatId(message.author);
  let newMessage = 'Hi @{{name}}, welcome to the game!';

  if (games[chatId] == undefined) games[chatId] = new Game(chatId, chat);

  let game = games[chatId];
  game.addPlayer(id, phoneNumber);

  if (game.isMidRound) {
    game.players[id].isFolded = true;
    game.folds++;
    game.order.insertAfterCurrent(game.players[id]); // TODO: needs to be tested
    newMessage += 'Wait for the next round to start';
  }

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
  if (game.isMidRound == true) {
    chat.sendMessage(game.getOrderPretty(), { mentions: game.getMentions() });
  } else {
    chat.sendMessage(game.getPlayersPretty(), { mentions: game.getMentions() });
  }
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

module.exports = {
  start,
  join,
  show,
  exit,
};
