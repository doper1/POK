const Mustache = require('mustache');
const gameFunctions = require('../../utils/gameFunctions');
const { emote } = require('../../utils/generalFunctions');
const constants = require('../../utils/constants');
const Pot = require('../../models/Pot');
const User = require('../../models/User');

async function end(game, message, chat) {
  await game.set('status', 'to end');

  message.react(emote('sad'));
  await chat.sendMessage('⚠️  Game ending after this hand ⚠️ ');
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
  await current.set('status', 'folded');

  const template = `@{{name}} folded`;
  const player = {
    name: current.userId,
  };
  const newMessage = Mustache.render(template, player);
  message.react(emote('fold'));
  await game.updateRound(whatsapp, newMessage);
}

async function buy(game, message, chat, amount) {
  const current = await game.getPlayer(message.author);
  await current.buy(amount, game.status);

  const template = `Nice! @{{name}} bought \${{amount}}
it will be added in the next hand`;

  const player = {
    name: current.userId,
    amount: amount,
  };
  const newMessage = Mustache.render(template, player);
  message.react(emote('happy'));
  await chat.sendMessage(newMessage, { mentions: await game.getMentions() });
}

async function join(game, message, chat, amount) {
  let template = `Hi @{{name}}, welcome to the game!`;

  if (!(await User.get(message.author))) {
    await User.create(message.author);
  }

  const player = await game.addPlayer(message.author);
  await game.addPlayerMidGame(player.userId);

  if (Number.isNaN(amount)) {
    template += `\n\nBuy some Chips with 'pok buy [amount]'
before the next hand starts`;
  } else {
    template += `\n\nyou bought \${{amount}}
wait for the next hand to start`;
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
}

async function exit(game, message, chat, current, whatsapp) {
  const newMessage = `Goodbye @${current.userId}!`;

  // If there are 2 players before the exit, also end the game
  if ((await game.getPlayers()).length == 2) {
    // When only one player left it should get all the money that remained in the pot
    if (game.currentPlayer == current.userId) {
      current = await game.getPlayer(current.nextPlayer);
    }
    await current.set(
      'gameMoney',
      current.gameMoney + (await Pot.get(game.mainPot)).value,
    );

    await game.endGame(whatsapp, `${newMessage}\n${constants.SEPARATOR}`);
  } else {
    chat.sendMessage(newMessage);
  }

  await game.removePlayer(message.author);
  message.react('👋');
}

module.exports = {
  end,
  check,
  raise,
  allIn,
  fold,
  call,
  buy,
  join,
  show,
  exit,
};
