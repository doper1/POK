const constants = require('../../constants');
const actions = require('./actions.js');
const validators = require('./validators.js');
const { emote } = require('../../generalFunctions');

function inGameRoute(
  body,
  games,
  chatId,
  message,
  whatsapp,
  chat,
  phoneNumber,
) {
  let game = games[chatId];
  let current = game.order.currentPlayer;
  let raiseAmount;

  switch (body[1]) {
    case 'start':
      message.react(emote('mistake'));
      message.reply('There is a game in progress');
      return true;
    case 'check':
      if (validators.check(game, message)) actions.check(game, whatsapp);
      return true;
    case 'raise':
      raiseAmount = Number(body[2]);

      if (body[2] == 'all' || current.gameMoney == raiseAmount) {
        if (validators.allIn(game, message)) {
          actions.allIn(game, whatsapp);
        }
      } else if (validators.raise(game, message, raiseAmount)) {
        actions.raise(game, raiseAmount, whatsapp);
      }
      return true;
    case 'all':
      if (validators.allIn(game, message)) actions.allIn(game, whatsapp);
      return true;
    case 'fold':
      if (validators.fold(game, message)) actions.fold(game, message, whatsapp);
      return true;
    case 'call':
      if (game.pot.currentBet - current.currentBet >= current.gameMoney) {
        if (validators.allIn(game, message)) actions.allIn(game, whatsapp);
        return true;
      } else if (validators.call(game, message)) actions.call(game, whatsapp);
      return true;
    case 'end':
      if (validators.end(game, message)) actions.end(games, chatId, message);
      return true;
    case 'help':
      message.reply(constants.HELP_PRE_GAME);
      return true;
    case 'join':
      if (validators.join(games[chatId], message))
        actions.join(games, chatId, message, phoneNumber, chat);
      return true;
    case 'show':
      if (validators.show(games[chatId], message))
        actions.show(games[chatId], chat);
      return true;
    case 'exit':
      if (validators.exit(games[chatId], message))
        actions.exit(games, chatId, message);
      return true;
    default:
      message.reply(constants.HELP_IN_GAME);
      return true;
  }
}

module.exports = inGameRoute;
