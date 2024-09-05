const { emote } = require("../../generalFunctions");

// pok start - start the game
function start(game, message, whatsapp) {
  game.generateOrder();
  let current = game.order.current_player;
  do {
    current.game_money = 100; // TODO: Change to a constants, also handle less money situations
    current.money -= 100;
    current = current.next_player;
  } while (!current.is_button);

  game.initRound(whatsapp);
  game.is_midround = true;
  message.react(emote("happy"));
}

module.exports = { start };
