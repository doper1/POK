const Mustache = require('mustache');
const { emote } = require('../../utils/generalFunctions');
const User = require('../../models/User');

async function start(game, message, whatsapp) {
  await game.set('status', 'running');

  await game.generateOrder();
  await game.initRound(whatsapp, '🎰 *The game has STARTED!* 🎰');

  message.react(emote('happy'));
}

async function join(game, message, chat, amount) {
  let template = `Hi @{{name}}, welcome to the game!`;

  if (!(await User.get(message.author))) {
    await User.create(message.author);
  }

  const player = await game.addPlayer(message.author);

  if (!Number.isInteger(amount)) {
    template += `\n\nBuy some Chips with 'pok buy [amount]'`;
  } else {
    template += `\n\nYou bought \${{amount}}`;
    await player.buy(amount, game.status);
  }

  if (game.status === 'running') {
    await game.addPlayerMidGame(player.userId);
  }

  // before the game starts`;
  message.react(emote('happy'));
  chat.sendMessage(
    Mustache.render(template, {
      name: message.author,
      amount: amount,
    }),
    {
      mentions: await game.getMentions(),
    },
  );
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
