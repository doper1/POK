const actions = require('./actions.js');
const validators = require('./validators.js');
const constants = require('../utils/constants.js');
const Pot = require('../models/Pot.js');

async function router({ whatsapp, message, chat, game, current }) {
  let amount;
  let pot = await Pot.get(game.mainPot);

  if (message.body[2] !== undefined) {
    amount = message.body[2].toLowerCase();

    if (constants.PARTIAL_RAISE_SIZES.includes(amount)) {
      amount = Math.floor(
        pot.value / (constants.PARTIAL_RAISE_SIZES.indexOf(amount) + 1),
      );
    } else if (constants.FULL_RAISE_SIZES.includes(amount)) {
      amount = pot.value * (constants.FULL_RAISE_SIZES.indexOf(amount) + 1);
    } else {
      amount = Number(message.body[2]);
    }
  }

  switch (message.body[1]) {
    case 'join':
      const players = await game.getPlayers();

      // Redirect to buy if player already joined
      if (current && amount !== undefined) {
        if (await validators.buy(game, message, amount, current))
          await actions.buy(game, message, chat, amount, current);
      } else {
        if (await validators.join(game, message, amount, players)) {
          if (amount !== undefined) {
            if (await validators.buy(game, message, amount, current, false))
              await actions.join(game, message, chat, amount, players);
          } else {
            await actions.join(game, message, chat, amount, players);
          }
        }
      }
      break;
    case 'show':
      if (await validators.show(game, message)) await actions.show(game, chat);
      break;
    case 'exit':
      if (await validators.exit(message, current))
        await actions.exit(game, current, whatsapp, false, message);
      break;
    case 'start':
      if (await validators.start(game, chat, message))
        await actions.start(game, message, whatsapp);
      break;
    case 'end':
      if (validators.end(game, message)) await actions.end(game, message, chat);
      break;
    case 'small':
      amount = Number(message.body[2]);

      if (await validators.small(game, message, amount, current))
        await actions.small(game, message, chat, amount);
      break;
    case 'big':
      amount = Number(message.body[2]);

      if (await validators.big(game, message, amount, current))
        await actions.big(game, message, chat, amount);
      break;
    case 'check':
      if (await validators.check(game, message, current))
        await actions.check(game, whatsapp, current);
      break;
    case 'call':
      if (validators.call(game, message, current, pot)) {
        if (pot.highestBet - current.currentBet >= current.gameMoney) {
          await actions.allIn(game, whatsapp, current);
        } else {
          await actions.call(game, whatsapp, current, pot);
        }
      }
      break;
    case 'raise':
      if (await validators.raise(game, message, amount, current)) {
        if (message.body[2] == 'all' || current.gameMoney == amount) {
          if (validators.allIn(game, message, current)) {
            await actions.allIn(game, whatsapp, current);
          }
        } else {
          await actions.raise(game, amount, whatsapp, current);
        }
      }
      break;
    case 'all':
      if (validators.allIn(game, message, current))
        await actions.allIn(game, whatsapp, current);
      break;
    case 'fold':
      if (validators.fold(game, message, current))
        await actions.fold(game, message, whatsapp, current);
      break;
    default:
      message.reply(constants.HELP_MESSAGE);
      break;
  }
}

module.exports = router;
