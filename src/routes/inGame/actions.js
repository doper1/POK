const Mustache = require('mustache');
const gameFunctions = require('../../game/gameFunctions');
const { emote, formatId } = require('../../generalFunctions');

// globals
let newMessage;
let current;
let amount;
let template;
let player;
let id;

function end(game, message) {
  game.toEnd = true;

  message.react(emote('sad'));
  game.chat.sendMessage('⚠️  Game ending after this hand ⚠️ ');
}

function check(game, whatsapp) {
  current = game.order.currentPlayer;

  template = `@{{name}} checked`;
  player = {
    name: current.phoneNumber,
  };
  newMessage = Mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
}

function raise(game, amount, whatsapp) {
  current = game.order.currentPlayer;

  gameFunctions.qualifyToAllIns(game.pot.allIns, amount, current);
  current.isPlayed = true;
  current.currentBet = amount + current.currentBet;
  game.pot.mainPot += amount;
  current.gameMoney -= amount;
  game.pot.currentBet = current.currentBet;

  template = `@{{name}} raised $${amount}`;
  player = {
    name: current.phoneNumber,
  };
  newMessage = Mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
}

function allIn(game, whatsapp) {
  current = game.order.currentPlayer;
  amount = current.gameMoney;

  gameFunctions.qualifyToAllIns(game.pot.allIns, amount, current);
  current.isAllIn = true;
  current.isPlayed = true;
  game.pot.mainPot += amount;
  current.currentBet += amount;
  current.gameMoney = 0;

  if (current.currentBet > game.pot.currentBet) {
    game.pot.currentBet = current.currentBet;
  }

  game.pot.addAllIn(game);

  template = `Wow! @{{name}} is *ALL IN* for \${{amount}} more (total \${{totalBet}})`;
  player = {
    name: current.phoneNumber,
    amount: amount,
    totalBet: current.currentBet,
  };
  newMessage = Mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
}

function fold(game, message, whatsapp) {
  current = game.order.currentPlayer;
  current.isFolded = true;
  game.folds++;

  template = `@{{name}} folded`;
  player = {
    name: current.phoneNumber,
  };
  newMessage = Mustache.render(template, player);
  message.react(emote('fold'));
  game.updateRound(whatsapp, newMessage);
}

function call(game, whatsapp) {
  current = game.order.currentPlayer;
  amount = game.pot.currentBet - current.currentBet;

  gameFunctions.qualifyToAllIns(game.pot.allIns, amount, current);
  current.gameMoney -= amount;
  current.isPlayed = true;
  game.pot.mainPot += amount;
  current.currentBet = game.pot.currentBet;

  template = `Nice! @{{name}} calls \${{amount}}`;
  player = {
    name: current.phoneNumber,
    amount: amount,
  };
  newMessage = Mustache.render(template, player);
  game.updateRound(whatsapp, newMessage);
}

function buy(game, message, amount) {
  id = formatId(message.author);
  player = game.players[id];

  player.queueReBuy(amount);
  player.sessionBalance -= amount;
  player.money -= amount;

  template = `Nice! @{{name}} bought \${{amount}}
it will be added in the next hand`;

  player = {
    name: player.phoneNumber,
    amount: amount,
  };
  newMessage = Mustache.render(template, player);
  message.react(emote('happy'));
  game.chat.sendMessage(newMessage, { mentions: [id] });
}

function join(games, chatId, message, phoneNumber, chat, amount) {
  id = formatId(message.author);
  let game = games[chatId];

  game.addPlayer(id, phoneNumber);
  player = game.players[id];
  player.isFolded = true;
  game.folds++;
  game.order.insertAfterCurrent(player);

  if (Number.isNaN(amount)) {
    template = `Hi @{{name}}, welcome to the game!
Buy some Chips with 'pok buy [amount]'
before the next hand starts`;
  } else {
    player.gameMoney = amount;
    player.money -= amount;
    player.sessionBalance -= amount;
    template = `Hi @{{name}}, welcome to the game!`;
  }

  chat.sendMessage(
    Mustache.render(template, {
      name: player.phoneNumber,
    }),
    {
      mentions: [id],
    },
  );
}

function show(game, chat) {
  chat.sendMessage(game.getOrderPretty(), { mentions: game.getMentions() });
}

function exit(game, message, phoneNumber) {
  id = formatId(message.author);
  player = game.players[id];
  newMessage = `Goodbye @${phoneNumber}!\n---------------------------------`;

  // If there are 2 players before the exit, also end the game
  if (Object.keys(game.players).length == 2) {
    let current = game.order.currentPlayer;

    // When only one player left it should get all the money that remained in the pot
    if (current.id == id) {
      current = current.nextPlayer;
    }
    current.gameMoney += game.pot.mainPot;

    game.endGame(newMessage);
  } else {
    game.chat.sendMessage(newMessage);
  }

  game.removePlayer(id);
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
