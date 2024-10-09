const constants = require('../../utils/constants.js');
const actions = require('./actions.js');
const validators = require('./validators.js');

async function preGameRoute({ whatsapp, message, chat, game }) {
  const amount = Number(message.body[2]);

  switch (message.body[1]) {
    case 'help':
      message.reply(constants.HELP_PRE_GAME);
      break;
    case 'join':
      if (await validators.join(game, message, amount))
        await actions.join(game, message, chat, amount);
      break;
    case 'show':
      if (await validators.show(game, message)) await actions.show(game, chat);
      break;
    case 'exit':
      if (await validators.exit(game, message))
        await actions.exit(game, message);
      break;
    case 'start':
      if (await validators.start(game, chat, message))
        await actions.start(game, message, whatsapp);
      break;
    case 'buy':
      if (await validators.buy(game, message, amount))
        await actions.buy(game, message, chat, amount);
      break;
    default:
      message.reply(constants.HELP_PRE_GAME);
      break;
  }
}

module.exports = preGameRoute;
