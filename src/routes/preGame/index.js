const constants = require('../../constants.js');
const actions = require('./actions.js');
const validators = require('./validators.js');

function preGameRoute(
  body,
  games,
  chatId,
  message,
  whatsapp,
  chat,
  phoneNumber,
) {
  switch (body[1]) {
    case 'start':
      if (validators.start(games[chatId], message))
        actions.start(games[chatId], message, whatsapp);
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
      message.reply(constants.HELP_PRE_GAME);
      return true;
  }
}

module.exports = preGameRoute;
