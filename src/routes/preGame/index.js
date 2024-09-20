const constants = require('../../constants.js');
const actions = require('./actions.js');
const validators = require('./validators.js');

function preGameRoute({
  whatsapp,
  message,
  body,
  chat,
  games,
  chatId,
  phoneNumber,
}) {
  let game = games[chatId];
  let amount;

  switch (body[1]) {
    case 'start':
      if (validators.start(game, message))
        actions.start(game, message, whatsapp);
      break;
    case 'help':
      message.reply(constants.HELP_PRE_GAME);
      break;
    case 'join':
      amount = Number(body[2]);

      if (validators.join(game, message, amount))
        actions.join(games, chatId, message, phoneNumber, chat, amount);
      break;
    case 'show':
      if (validators.show(game, message)) actions.show(game, chat);
      break;
    case 'exit':
      if (validators.exit(game, message)) actions.exit(games, chatId, message);
      break;
    case 'buy':
      amount = Number(body[2]);

      if (validators.buy(game, message, amount))
        actions.buy(game, message, amount);
      break;
    default:
      message.reply(constants.HELP_PRE_GAME);
      break;
  }
}

module.exports = preGameRoute;
