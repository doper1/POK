const Mustache = require('mustache');
const constants = require('../utils/constants');
const {
  emote,
  notifyImagen,
  shuffleArray,
} = require('../utils/generalFunctions');
const User = require('../models/User');
const gameFunctions = require('../utils/gameFunctions');
const Pot = require('../models/Pot');

async function start(game, message, whatsapp) {
  await game.set('status', 'running');

  await game.generateOrder();
  await game.initRound(whatsapp, '🎰 *The game has STARTED!* 🎰', false, true);

  message.react(emote('happy'));

  notifyImagen('start', game.id);
}

async function end(game, message, chat) {
  await game.set('status', 'to end');

  message.react(emote('sad'));
  await chat.sendMessage('⚠️  Game ending after this hand ⚠️ ');
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

      notifyImagen('start', game.id);
    }
  } else {
    notifyImagen('join', game.id, players.length * 4);
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

async function small(game, message, chat, amount) {
  const template = `Small blind is now \${{amount}}
and the big blind is \${{bigBlind}}`;

  await game.setBlind(amount, 'small');

  const newMessage = Mustache.render(template, {
    amount: amount,
    bigBlind: game.bigBlind,
  });

  message.react(emote('happy'));
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

  message.react(emote('happy'));
  await chat.sendMessage(newMessage);
  return true;
}

async function check(game, whatsapp, current) {
  await current.set('status', 'played');

  const template = `@{{name}} checked`;
  const player = {
    name: current.userId,
  };
  const newMessage = Mustache.render(template, player);
  await game.updateRound(whatsapp, newMessage);
}

async function raise(game, amount, whatsapp, current) {
  await current.set('status', 'played');

  await gameFunctions.qualifyToAllInsPots(game, amount, current);
  await current.bet(amount, game.mainPot);

  const template = `@{{name}} raised $${amount}`;
  const player = {
    name: current.userId,
  };
  const newMessage = Mustache.render(template, player);
  await game.updateRound(whatsapp, newMessage);
}

async function allIn(game, whatsapp, current) {
  await current.set('status', 'all in');
  const amount = current.gameMoney;

  await gameFunctions.qualifyToAllInsPots(game, amount, current);
  await current.bet(amount, game.mainPot);

  await game.addAllInPot(current.currentBet);

  const template = `Wow! @{{name}} is *ALL IN* for \${{amount}} more (total \${{totalBet}})`;
  const player = {
    name: current.userId,
    amount: amount,
    totalBet: current.currentBet,
  };
  const newMessage = Mustache.render(template, player);
  await game.updateRound(whatsapp, newMessage);
}

async function call(game, whatsapp, current, pot) {
  await current.set('status', 'played');
  const amount = pot.highestBet - current.currentBet;

  await gameFunctions.qualifyToAllInsPots(game, amount, current);
  await current.bet(amount, pot.id);

  const template = `Nice! @{{name}} calls \${{amount}}`;
  const player = {
    name: current.userId,
    amount: amount,
  };
  const newMessage = Mustache.render(template, player);
  await game.updateRound(whatsapp, newMessage);
}

async function fold(game, message, whatsapp, current) {
  const template = `@{{name}} folded`;

  await current.set('status', 'folded');

  const player = {
    name: current.userId,
  };

  const newMessage = Mustache.render(template, player);
  message.react(emote('fold'));
  await game.updateRound(whatsapp, newMessage);
}

module.exports = {
  start,
  end,
  join,
  show,
  exit,
  buy,
  small,
  big,
  check,
  raise,
  allIn,
  fold,
  call,
};
