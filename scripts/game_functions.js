//let Player = require("../classes/Player");

//Check
function check() {
  // move current player
}

//Raise
function raise() {
  // move current player
  //pot += player_bet;
  //player_money -= player_bet;
}

//Fold
function fold() {
  //player.pop() from mini linked list
  //check_player_amount()
}

//Calculate hand strength:
// 1. Give each hand a score by it's strenght level
// 2. If two or more hands are equall, give an in hand strenght comparison
// 3. If there is a tie, split the pot

// All in

function print_cards(cards) {
  let to_string = "";
  for (let i = 0; i < cards.length - 1; i++) {
    to_string += `*|${cards[i][0]}${cards[i][1]}|* `;
  }
  return `${to_string}  *|${cards[cards.length - 1][0]}${
    cards[cards.length - 1][1]
  }|*`;
}

module.exports = { check, raise, fold, print_cards };
