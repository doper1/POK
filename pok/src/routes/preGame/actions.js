const Mustache = require('mustache');
const gf = require('../../utils/generalFunctions');
const User = require('../../models/User');
const constants = require('../../utils/constants');
const Pot = require('../../models/Pot');

async function start(game, message, whatsapp) {
  await game.set('status', 'running');

  await game.generateOrder();
  await game.initRound(whatsapp, '🎰 *The game has STARTED!* 🎰', false, true);

  message.react(gf.emote('happy'));

  gf.notifyImagen('start', game.id);
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
      gf.shuffleArray(constants.DECK.map((card) => [...card])),
    );
  }

  if (!Number.isInteger(amount)) {
    template += `\n\nyou may buy some Chips`;
  } else {
    template += `\n\nYou bought \${{amount}}`;
    await player.buy(amount, 'pending');
  }

  if (game.status === 'running') {
    await game.addPlayerMidGame(player.userId);

    if (
      game.smallBlind + game.bigBlind === (await Pot.get(game.mainPot)).value &&
      Number.isInteger(amount) &&
      player.holeCards.length === 0
    ) {
      template += `\n\nCheck your DM for your cards 🤫
${constants.SEPARATOR}
{{orderMessage}}`;

      await game.deal(message.author, whatsapp);
      await player.set('status', 'pending');

      gf.notifyImagen('start', game.id);
    }
  } else {
    gf.notifyImagen('join', game.id, players.length * 4);
  }

  const newMessage = Mustache.render(template, {
    name: player.userId,
    amount: amount,
    orderMessage: template.includes('orderMessage')
      ? (await game.getOrderPretty())[1]
      : '',
  });

  message.react(gf.emote('happy'));
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

  message.react(gf.emote('happy'));
  await chat.sendMessage(newMessage, { mentions: await game.getMentions() });
  return true;
}

async function small(game, message, chat, amount) {
  const template = `Small blind is now \${{amount}}
and the big blind is \${{bigBlind}}`;

  await game.setBlind(amount, 'small');

  const newMessage = Mustache.render(template, {
    amount: amount,
    bigBlind: game.bigBlind,
  });

  message.react(gf.emote('happy'));
  await chat.sendMessage(newMessage);
  return true;
}

async function big(game, message, chat, amount) {
  const template = `Big blind is now \${{amount}}
and the small blind is \${{smallBlind}}`;

  await game.setBlind(amount, 'big');

  const newMessage = Mustache.render(template, {
    amount: amount,
    smallBlind: game.smallBlind,
  });

  message.react(gf.emote('happy'));
  await chat.sendMessage(newMessage);
  return true;
}

module.exports = {
  start,
  join,
  show,
  exit,
  buy,
  small,
  big,
};
