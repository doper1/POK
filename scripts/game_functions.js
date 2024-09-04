const AllIn = require("../classes/AllIn");
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
  players[0].game_money +=
    (amount - (amount % players.length)) / players.length;

  if (!(players[0].phone_number in winners)) {
    winners[players[0].phone_number] = players[0];
  }
  players.splice(0, 1);

  return rake_to_winners(players, amount, winners);
}

function get_winners(players) {
  let winners = [players[0]];

  for (let i = 1; i < players.length; i++) {
    const currentPlayer = players[i];
    const comparisonResult = compare_hands(
      winners[0].hand_score.cards,
      currentPlayer.hand_score.cards
    );

    if (comparisonResult < 0) {
      winners = [currentPlayer];
    } else if (comparisonResult === 0) {
      winners.push(currentPlayer);
    }
  }

  return winners;
}

function compare_hands(hand1, hand2) {
  for (let i = 0; i < hand1.length; i++) {
    if (hand1[i] > hand2[i]) {
      return 1;
    } else if (hand1[i] < hand2[i]) {
      return -1;
    }
  }
  return 0;
}

function random_winner_key(winners) {
  return Object.keys(winners)[
    Math.floor(Math.random() * Object.keys(winners).length)
  ];
}

function showdown(game) {
  let hands_strength_list = cards_functions.calc_hands_strength(game);
  game.jumpToButton();
  let current = game.order.current_player;
  let last_pot = new AllIn([], game.pot.main_pot, -1);
  do {
    if (!current.is_folded) {
      last_pot.addPlayer(current);
    }
    current = current.next_player;
  } while (!current.is_button);

  let all_ins = [...game.pot.all_ins, last_pot];
  all_ins = all_ins.map((all_in, index) => {
    if (index == 0) {
      return new AllIn(all_in.players, all_in.pot, -1);
    } else {
      return new AllIn(all_in.players, all_in.pot - all_ins[index - 1].pot, -1);
    }
  });

  let winners = {};
  all_ins.forEach((all_in) => {
    for (let i = 0; i < Object.keys(hands_strength_list).length; i += 1) {
      let possible_winners = get_winners(Object.values(hands_strength_list)[i]);
      if (!Array.isArray(possible_winners)) {
        if (is_valid_winner(possible_winners, all_in)) {
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

          // If there is a reminder of the stack that cannot be split, gives it to random player from the winners
          winners[random_winner_key(winners)].game_money +=
            all_in.pot % all_in.players.length;

          break;
        }
      }
    }
  });
  let message = "";
  for (const phone_number in winners) {
    let player = winners[phone_number];
    message += `${player.name} Won $${
      player.game_money
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
  all_in_qualification,
};
