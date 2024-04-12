//let Player = require("../classes/Player");
//Check

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

// IF Ace in array- add 1 and 14
//let uniqueNumbers = Array.from(new Set(numbers)); // Remove doubles,
// function Calculate_hand_strength(raw_cards) {
//   // -> hand score (numerical)
//   cards = raw_cards.slice().sort((a, b) => a - b);
//   if is_straight_flush(cards)
//   else if is_four_of_a_kind(cards)
//   else if is_full_house()
//   else if is_flush()
//   else if is_straight()
//   else if is_three_of_a_kind()
//   else if is_two_pair()
//   else if is_pair()
//   else // Hight card
//}
function is_straight(raw_cards) {
  cards = raw_cards.slice().sort((a, b) => a - b); // remove later
  if (cards.length < 5) {
    return false;
  } else {
    for (let i = cards.length - 5; i === 0; i--) {
      counter = 0;
      for (let i = cards.length - 1; i === 0; i--) {
        if (cards[i] === cards[i - 1] - 1) {
          counter++;
        }
      }
    }
  }
}
//function is_flush(cards) {}

// function is_straight_flush(cards) {
//   if is_flush(is_straight(cards)[1]){
//     return true;
//   +9}
// }

function reorg_cards(raw_cards) {
  cards = raw_cards.slice().sort((a, b) => a[1] - b[1]);
}

reorg_cards([
  ["♥️", "6"],
  ["♥️", "J"],
  ["♣️", "9"],
]);
module.exports = { print_cards };
