const constants = require('../../constants');
const actions = require('./actions.js');
const validators = require('./validators.js');
const { emote } = require('../../generalFunctions');

function inGameRoute({
  whatsapp,
  message,
  body,
  chat,
  games,
  chatId,
  phoneNumber,
}) {
  let game = games[chatId];
  let current = game.order.currentPlayer;
  let amount;

  switch (body[1]) {
    case 'start':
      message.react(emote('mistake'));
      message.reply('There is a game in progress');
      break;
    case 'check':
      if (validators.check(game, message)) actions.check(game, whatsapp);
      break;
    case 'raise':
      amount = Number(body[2]);

      if (body[2] == 'all' || current.gameMoney == amount) {
        if (validators.allIn(game, message)) {
          actions.allIn(game, whatsapp);
        }
      } else if (validators.raise(game, message, amount)) {
        actions.raise(game, amount, whatsapp);
      }
      break;
    case 'all':
      if (validators.allIn(game, message)) actions.allIn(game, whatsapp);
      break;
    case 'fold':
      if (validators.fold(game, message)) actions.fold(game, message, whatsapp);
      break;
    case 'call':
      if (game.pot.currentBet - current.currentBet >= current.gameMoney) {
        if (validators.allIn(game, message)) actions.allIn(game, whatsapp);
        break;
      } else if (validators.call(game, message)) actions.call(game, whatsapp);
      break;
    case 'buy':
      amount = Number(body[2]);

      if (validators.buy(game, message, amount))
        actions.buy(game, message, amount);
      break;
    case 'end':
      if (validators.end(game, message)) actions.end(games[chatId], message);
      break;
    case 'help':
      message.reply(constants.HELP_PRE_GAME);
      break;
    case 'join':
      if (validators.join(games[chatId], message))
        actions.join(games, chatId, message, phoneNumber, chat);
      break;
    case 'show':
      if (validators.show(games[chatId], message))
        actions.show(games[chatId], chat);
      break;
    case 'exit':
      if (validators.exit(games[chatId], message))
        actions.exit(games, chatId, message);
      break;
    default:
      message.reply(constants.HELP_IN_GAME);
      break;
  }
}

module.exports = inGameRoute;
