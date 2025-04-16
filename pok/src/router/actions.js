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

async function join(game, message, chat, amount, players) {
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
    template += `\nyou may buy some Chips`;
  } else {
    template += `\nYou bought \${{amount}}`;
    await player.buy(amount, 'pending');
  }

  if (game.status === 'running') {
    template +=
      '\n\nYou joined in the middle of a hand, wait for the next one to start!';
    await game.addPlayerMidGame(player.userId);
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
  if (constants.GAME_RUNNING_STATUSES.includes(game.status)) {
    let order = await game.getOrderPretty();
    const newCards = order[0];
    const newMessage = order[1];

    if (!newCards) {
      return await chat.sendMessage(newMessage, {
        mentions: await game.getMentions(),
      });
    } else {
      return await chat.sendMessage(newCards, {
        caption: newMessage,
        mentions: await game.getMentions(),
      });
    }
  } else {
    await chat.sendMessage(await game.getPlayersPretty(), {
      mentions: await game.getMentions(),
    });
  }
}

async function exit(
  game,
  current,
  whatsapp,
  isSilent = false,
  message = undefined,
) {
  if (
    constants.GAME_RUNNING_STATUSES.includes(game.status) &&
    (await game.getPlayers()).length == 2
  ) {
    // Last player would be the one that is not in the game anymore
    const lastPlayer = await game.getPlayer(current.nextPlayer);

    await lastPlayer.set(
      'gameMoney',
      lastPlayer.gameMoney + (await Pot.get(game.mainPot)).value,
    );

    await game.endGame(whatsapp, `Goodbye!\n${constants.SEPARATOR}`);
  } else if (!isSilent) {
    if (message !== undefined) await message.react('👋');
    whatsapp.sendMessage(`${game.id}@g.us`, `Goodbye!`);
  }

  await game.removePlayer(current.userId);
}

async function buy(game, message, chat, amount, current) {
  let template = `Nice! @{{name}} bought \${{amount}}`;
  let newMessage;

  if (!constants.GAME_RUNNING_STATUSES.includes(game.status)) {
    await current.buy(amount, 'pending');

    newMessage = Mustache.render(template, {
      name: current.userId,
      amount: amount,
    });
  } else {
    template += `\nit will be added on the next hand`;
    await current.buy(amount, 'running');

    newMessage = Mustache.render(template, {
      name: current.userId,
      amount: amount,
      orderMessage: template.includes('orderMessage')
        ? (await game.getOrderPretty())[1]
        : '',
    });
  }
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
