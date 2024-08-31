const constants = require("../constants");
const cards_functions = require("./cards_functions");

function showdown(game) {
  let hands_strength_list = cards_functions.calc_hands_strength(game);

  let all_ins = [...game.pot.all_ins, game.pot.main_pot].map(
    (value, index, array) => (index === 0 ? value : value - array[index - 1])
  );

  all_ins.forEach((all_in) => {
    Object.entries([...hands_strength_list]).filter(([strength, players]) => {
      hands_strength_list[strength];
    });
  });

  // Should handle three cases:
  // 1. No one is all in and one player won
  // 2. No one is all in and few players won
  // 3. somebody is all in- check who win each all in pot and then who win the rest of the main pot
  // -------------
  // CHAGNE CALC TO POPULATE THE PLAYER OBJECT SO THE VALUE W
  // 0. calc hands strength
  // 1. add the full pot with the remaining players to the all ins at the end of the game (exclude it if it's the same as the last all in)
  // 2. add zero as the first all in, then map the all ins so each all is is minus the all in before him, then remove the zero again (to generalize to all ins to the amount someone would really get)
  // 2. loop on the all ins from the first to last (biggest)
  // 3. determine the winner/winners on each using a function
  // 4. split the money by the amount of the winners to an object with the player phone number as a key, and the player with his earing in an array
  // 6. when done, return the message to Game
  if (game.pot.all_ins.length == 0) {
    let best_hands = Object.values(strength_list)[0];
    if (!Array.isArray(best_hands)) {
      let winner = best_hands;
      let message = `${winner.name} Won $${
        game.pot.main_pot
      } with ${cards_functions.print_cards(winner.hole_cards)}
  \n${constants.STRENGTH_DICT[Object.keys(strength_list)[0]]}:
  ${cards_functions.print_cards(winner.hand_score.cards)}
  ---------------------------------`;

      game.players[winner.phone_number].game_money += game.pot.main_pot;
    } else {
      let winner = best_hands;
      let message = `${winner.name} Won $${
        game.pot.main_pot
      } with ${cards_functions.print_cards(winner.hole_cards)}
  \n${constants.STRENGTH_DICT[Object.keys(strength_list)[0]]}:
  ${cards_functions.print_cards(winner.hand_score.cards)}
  ---------------------------------`;

      game.players[winner.phone_number].game_money += game.pot.main_pot;
    }
  } else {
  }

  return message;
}

function all_in(game) {
  let current = game.order.current_player;
  current.is_all_in = true;
  current.is_played = true;
  game.pot.main_pot += current.game_money;
  current.current_bet += current.game_money;
  current.game_money = 0;

  if (current.current_bet > game.pot.current_bet) {
    game.pot.current_bet = current.current_bet;
  }

  game.pot.addAllIn(game);
}

function get_winners(game) {
  if (!Array.isArray(possible_winners)) {
    console.log(possible_winners);
    return { winner_strength: possible_winners };
  } else {
    possible_winners.forEach((player) => {
      console.log(player.hand_score.cards);
    });
    // return possible_winners.filter((player) =>)
    console.log(player.name, player.hand_score["cards"]);
    return possible_winners;
  }
}

module.exports = {
  showdown,
  all_in,
  get_winners,
};
