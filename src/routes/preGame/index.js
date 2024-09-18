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

  switch (body[1]) {
    case 'start':
      if (validators.start(game, message))
        actions.start(game, message, whatsapp);
      return true;
    case 'help':
      message.reply(constants.HELP_PRE_GAME);
      return true;
    case 'join':
      if (validators.join(game, message))
        actions.join(games, chatId, message, phoneNumber, chat);
      return true;
    case 'show':
      if (validators.show(game, message)) actions.show(game, chat);
      return true;
    case 'exit':
      if (validators.exit(game, message)) actions.exit(games, chatId, message);
      return true;
    case 'buy':
      let amount = Number(body[2]);

      if (validators.buy(game, message, amount))
        actions.buy(game, message, amount);
      break;
    default:
      message.reply(constants.HELP_PRE_GAME);
      return true;
  }
}

module.exports = preGameRoute;
