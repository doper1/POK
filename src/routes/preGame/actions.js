const { emote } = require('../../generalFunctions');

// pok start - start the game
function start(game, message, whatsapp) {
  game.generateOrder();
  let current = game.order.currentPlayer;
  do {
    current.gameMoney = 100; // TODO: Change to a constants, also handle less money situations
    current.money -= 100;
    current = current.nextPlayer;
  } while (!current.isButton);

  game.isMidRound = true;
  game.initRound(whatsapp);
  message.react(emote('happy'));
}

module.exports = { start };
