const constants = require("../constants");
const cards_functions = require("./cards_functions");

function is_valid_winner(player, all_in) {
  return all_in.players.some(
    (ai_player) => ai_player.phone_number == player.phone_number
  );
}
function rake_to_winners(players, amount, winners) {
  if (players.length === 0) {
    return winners;
  }

  if (players[0].phone_number in winners) {
    winners[players[0].phone_number] +=
      (amount - (amount % players.length)) / players.length;
  } else {
    winners[players[0].phone_number] =
      (amount - (amount % players.length)) / players.length;
  }
  players.splice(0, 1);

  return rake_to_winners(players, amount, winners);
}

function showdown(game) {
  let hands_strength_list = cards_functions.calc_hands_strength(game);
  console.log(hands_strength_list);
  game.jumpToButton();
  let current = game.order.current_player;
  let last_pot = { pot: game.pot.main_pot, players: [] };
  do {
    if (!current.is_folded) {
      last_pot.players.push(current);
    }
    current = current.next_player;
  } while (!current.is_button);
  let all_ins = [...game.pot.all_ins, last_pot].map((value, index, array) =>
    index === 0 ? value : value - array[index - 1]
  );

  let winners = {};
  all_ins.forEach((all_in) => {
    for (let i = 0; i < Object.keys(hands_strength_list).length; i += 1) {
      let possible_winners = Object.values(hands_strength_list)[i];
      console.log("possible_winners:", possible_winners.length);
      if (!Array.isArray(possible_winners)) {
        console.log("NOT ARRAY");
        if (is_valid_winner(possible_winners, all_in)) {
          console.log("Valid, one player", possible_winners.phone_number);
          winners = rake_to_winners([possible_winners], all_in.pot, winners);
          break;
        }
      } else {
        for (
          let player_index = 0;
          player_index < possible_winners.length;
          player_index += 1
        ) {
          if (!is_valid_winner(possible_winners[player_index], all_in)) {
            possible_winners.splice(player_index, 1);
          }
        }
        if (possible_winners.length > 0) {
          winners = rake_to_winners(possible_winners, all_in.pot, winners);
          winners[
            possible_winners[
              Math.floor(Math.random() * (possible_winners.length + 1))
            ].phone_number
          ] += all_in.pot % all_in.players.length;
          console.log("BREAK");
          break;
        }
      }
    }
  });
  let message = "";
  for (const phone_number in winners) {
    let player = game.players[phone_number];
    message += `${player.name} Won $${
      winners[phone_number]
    } with ${cards_functions.print_cards(player.hole_cards)}
  \n${constants.STRENGTH_DICT[player.hand_score.str]}:
  ${cards_functions.print_cards(player.hand_score.cards)}
  ---------------------------------`;
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

function all_in_qualification(game) {
  let current = game.order.current_player;
  game.pot.all_ins.forEach((all_in) => {
    if (all_in.current_bet != -1 && current.current_bet < all_in.current_bet) {
      all_in.pot += all_in.current_bet - current.current_bet;
      all_in.players.push(current);
    }
  });
}

module.exports = {
  showdown,
  all_in,
  all_in_qualification
};
