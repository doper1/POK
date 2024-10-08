const Mustache = require('mustache');
const { emote } = require('../../utils/generalFunctions');
const User = require('../../models/User');

// globals
let player;
let template;
let newMessage;

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

  if (Number.isNaN(amount)) {
    template += `\n\nBuy some Chips with 'pok buy [amount]'
before the game starts`;
  } else {
    template += `\n\nyou bought \${{amount}}`;
    await player.buy(amount, game.status);
  }

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

async function buy(game, message, chat, amount) {
  player = await game.getPlayer(message.author);

  await player.buy(amount, game.status);

  template = `Nice! @{{name}} bought \${{amount}}`;
  player = {
    name: player.userId,
    amount: amount,
  };
  newMessage = Mustache.render(template, player);
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
