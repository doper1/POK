const constants = require('../../utils/constants');
const actions = require('./actions.js');
const validators = require('./validators.js');
const { emote } = require('../../utils/generalFunctions');
const Pot = require('../../models/Pot.js');

async function inGameRoute({ whatsapp, message, chat, game, current }) {
  let amount;
  let pot = await Pot.get(game.mainPot);

  if (
    message.body[2] !== undefined &&
    constants.RAISE_SIZES.includes(message.body[2].toLowerCase())
  ) {
    amount = Math.floor(
      pot.value /
        (constants.RAISE_SIZES.indexOf(message.body[2].toLowerCase()) + 1),
    );
  } else {
    amount = Number(message.body[2]);
  }

  switch (message.body[1]) {
    case 'check':
      if (await validators.check(game, message, current))
        await actions.check(game, whatsapp, current);
      break;
    case 'call':
      if (game.currentBet >= current.gameMoney) {
        if (validators.allIn(game, message))
          await actions.allIn(game, whatsapp, current);
      } else if (validators.call(game, message, current, pot))
        await actions.call(game, whatsapp, current, pot);
      break;
    case 'raise':
      if (message.body[2] == 'all' || current.gameMoney == amount) {
        if (validators.allIn(game, message)) {
          await actions.allIn(game, whatsapp, current);
        }
      } else if (await validators.raise(game, message, amount, current)) {
        await actions.raise(game, amount, whatsapp, current);
      }
      break;
    case 'all':
      if (validators.allIn(game, message))
        await actions.allIn(game, whatsapp, current);
      break;
    case 'fold':
      if (validators.fold(game, message))
        await actions.fold(game, message, whatsapp, current);
      break;
    case 'buy':
      if (await validators.buy(game, message, amount, current))
        await actions.buy(game, message, chat, amount, whatsapp);
      break;
    case 'join':
      const players = await game.getPlayers();

      if (await validators.join(game, message, amount, current, players))
        await actions.join(game, message, chat, amount);
      break;
    case 'show':
      if (await validators.show(game, message)) await actions.show(game, chat);
      break;
    case 'exit':
      if (await validators.exit(game, message))
        await actions.exit(game, message, chat, current, whatsapp);
      break;
    case 'end':
      if (validators.end(game, message)) await actions.end(game, message, chat);
      break;
    case 'start':
      message.react(emote('mistake'));
      message.reply('There is a game in progress');
      break;
    case 'small':
      if (await validators.small(game, message, amount))
        await actions.small(game, message, chat, amount);
      break;
    case 'big':
      if (await validators.big(game, message, amount))
        await actions.big(game, message, chat, amount);
      break;
    default:
      message.reply(constants.HELP_IN_GAME);
      break;
  }
}

module.exports = inGameRoute;
