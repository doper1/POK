const actions = require('./actions.js');
const validators = require('./validators.js');
const constants = require('../../utils/constants');

async function preGameRoute({ whatsapp, message, chat, game, current }) {
  const amount = Number(message.body[2]);

  switch (message.body[1]) {
    case 'join':
      const players = await game.getPlayers();

      if (await validators.join(game, message, amount, current, players))
        await actions.join(game, message, chat, amount, players, whatsapp);
      break;
    case 'show':
      if (await validators.show(game, message)) await actions.show(game, chat);
      break;
    case 'exit':
      if (await validators.exit(message, current))
        await actions.exit(game, message);
      break;
    case 'start':
      if (await validators.start(game, chat, message))
        await actions.start(game, message, whatsapp);
      break;
    case 'buy':
      if (await validators.buy(game, message, amount, current))
        await actions.buy(game, message, chat, amount, current);
      break;
    default:
      message.reply(constants.HELP_PRE_GAME);
      break;
  }
}

module.exports = preGameRoute;
