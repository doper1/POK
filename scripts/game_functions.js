const constants = require("../constants");
const cards_functions = require("./cards_functions");

function showdown(game) {
  let hands_strength_list = cards_functions.calc_hands_strength(game);

  let all_ins = [...game.pot.all_ins, game.pot.main_pot].map(
    (value, index, array) => (index === 0 ? value : value - array[index - 1]),
  );

  let winners = {};
  all_ins.forEach((all_in) => {
    for (let i = 0; i < Object.keys(strength_list).length; i += 1) {
      let possible_winners = Object.values(strength_list)[i];
      if (!Array.isArray(possible_winners)) {
        let player = possible_winners;
        if (is_valid_winner(player)) {
          rake_to_winner(player);
          break;
        }
      } else {
        for (
          let player_index = 0;
          player_index < possible_winners;
          player_index += 1
        ) {
          if (!is_valid_winner(possible_winners[player_index])) {
            possible_winners.splice(player_index, 1);
          }
        }
        if (possible_winners.length > 0) {
          rake_to_winners(possible_winners);
          break;
        }
      }
    }
  });

  function is_valid_winner(player) {}
  function rake_to_winners(players, amount, players_count) {
    let remainder = amount % players_count;
    let amount_per_player = (amount - remainder) / players_count;

    for (let i = 0; i < players.length; i += 1) {}
  }
  // Should handle three cases:
  // 1. No one is all in and one player won
  // 2. No one is all in and few players won
  // 3. somebody is all in- check who win each all in pot and then who win the rest of the main pot
  // -------------
  // 1. calc hands strength V
  // 2. loop on the all ins from the first to last (biggest) V
  // 3. determine the winner/winners on each using an algorithm
  // -> loop on each level -> if 1 player, check if he is eligble to win the pot (if he is append him to winners). if more than one player, loop and them and check for each one, append to winners
  // -> if level has no winners, move to the next one -> when winners got appended to the winners list, start a side function to calculate winnings in a global winners list
  // -> after all the money has been served, loop on the winners and add appropriet message to each winner
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
