const Mustache = require('mustache');
const Game = require('../../classes/Game');
const { formatPhoneNumber } = require('../../generalFunctions');

function join(games, chatId, message, contact, chat) {
  let id = formatPhoneNumber(message.author);
  let newMessage = 'Hi @{{name}}, welcome to the game!';

  if (games[chatId] == undefined) games[chatId] = new Game(chatId, chat);

  let game = games[chatId];
  game.addPlayer(contact, id);

  if (game.isMidRound) {
    game.players[id].isFolded = true;
    game.folds++;
    game.order.insertAfterCurrent(game.players[id]); // TODO: needs to be tested
    newMessage += 'Wait for the next round to start';
  }

  chat.sendMessage(
    Mustache.render(newMessage, {
      name: game.players[id].contact
    }),
    {
      mentions: [id]
    }
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
  games[chatId].players[formatPhoneNumber(message.author)].isFolded = true;
  games[chatId].folds++;

  if (games[chatId].isMidRound) {
    if (Object.keys(games[chatId].players).length == 2) {
      games[chatId].order.removePlayer(formatPhoneNumber(message.author));
      delete games[chatId].players[formatPhoneNumber(message.author)];
      games[chatId].isMidRound = false;

      message.react('👋');
      message.reply(`*The game has ended!*`);
    } else {
      games[chatId].order.removePlayer(formatPhoneNumber(message.author));
      delete games[chatId].players[formatPhoneNumber(message.author)];

      message.react('👋');
      message.reply(`Goodbye!`);
    }
  } else {
    if (Object.keys(games[chatId].players).length == 1) {
      delete games[chatId];

      message.react('👋');
      message.reply(`Goodbye!`);
    } else {
      delete games[chatId].players[formatPhoneNumber(message.author)];

      message.react('👋');
      message.reply(`Goodbye!`);
    }
  }
}

module.exports = {
  join,
  show,
  exit
};
