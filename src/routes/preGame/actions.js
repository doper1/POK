const Mustache = require('mustache');
const {
  emote,
  shuffleArray,
  notifyImagenerator,
} = require('../../utils/generalFunctions');
const User = require('../../models/User');
const constants = require('../../utils/constants');
const Pot = require('../../models/Pot');

async function start(game, message, whatsapp) {
  await game.set('status', 'running');

  await game.generateOrder();
  await game.initRound(whatsapp, '🎰 *The game has STARTED!* 🎰', false, true);

  message.react(emote('happy'));

  notifyImagenerator('start', game.id, 0);
}

async function join(game, message, chat, amount, players, whatsapp) {
  let template = `Hi @{{name}}, welcome to the game!`;

  if (!(await User.get(message.author))) {
    await User.create(message.author);
  }

  const player = await game.addPlayer(message.author);

  if (players.length === 0 || game.deck.length === 0) {
    await game.set(
      'deck',
      shuffleArray(constants.DECK.map((card) => [...card])),
    );
  }

  if (!Number.isInteger(amount)) {
    template += `\n\nBuy some Chips with 'pok buy [amount]'`;
  } else {
    template += `\n\nYou bought \${{amount}}`;
    await player.buy(amount, 'pending');
  }

  if (game.status === 'running') {
    await game.addPlayerMidGame(player.userId);

    if (
      constants.BIG_BLIND + constants.SMALL_BLIND ===
        (await Pot.get(game.mainPot)).value &&
      Number.isInteger(amount) &&
      player.holeCards.length === 0
    ) {
      template += `\n\nCheck your DM for your cards 🤫
${constants.SEPARATOR}
{{orderMessage}}`;

      await game.deal(message.author, whatsapp);
      await player.set('status', 'pending');

      notifyImagenerator('mid-join', game.id, 0);
    }
  } else {
    notifyImagenerator('join', game.id, players.length * 4);
  }

  const newMessage = Mustache.render(template, {
    name: player.userId,
    amount: amount,
    orderMessage: template.includes('orderMessage')
      ? (await game.getOrderPretty())[1]
      : '',
  });

  message.react(emote('happy'));
  await chat.sendMessage(newMessage, { mentions: await game.getMentions() });
}

async function show(game, chat) {
  await chat.sendMessage(await game.getPlayersPretty(), {
    mentions: await game.getMentions(),
  });
}

async function exit(game, message) {
  await game.removePlayer(message.author);

  await message.react('👋');
  await message.reply(`Goodbye!`);
}

async function buy(game, message, chat, amount, player) {
  const template = `Nice! @{{name}} bought \${{amount}}`;

  await player.buy(amount, 'pending');

  const newMessage = Mustache.render(template, {
    name: player.userId,
    amount: amount,
  });

  message.react(emote('happy'));
  await chat.sendMessage(newMessage, { mentions: await game.getMentions() });
  return true;
}

module.exports = {
  start,
  join,
  show,
  exit,
  buy,
};
