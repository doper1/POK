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

function parseCardNumber(card) {
  switch (card[1]) {
    case "A":
      return [card[0], 14]; // Ace can be high (14) or low (1)
    case "K":
      return [card[0], 13];
    case "Q":
      return [card[0], 12];
    case "J":
      return [card[0], 11];
    default:
      return [card[0], parseInt(card[1])];
  }
}
function ReverseParseCardNumber(card) {
  switch (card[1]) {
    case "14":
      return [card[0], "A"];
    case "13":
      return [card[0], "K"];
    case "12":
      return [card[0], "Q"];
    case "11":
      return [card[0], "J"];
    case "1":
      return [card[0], "A"];
    default:
      return [card[0], `${card[1]}`];
  }
}

function sort_cards(cards) {
  return (cards = cards.slice().sort((a, b) => a[1] - b[1]));
}

function c_count(cards, type) {
  let count_cards = {};
  cards.forEach((card) => {
    if (card[type] in count_cards) count_cards[card[type]].push(card);
    else count_cards[card[type]] = [card];
  });
  return count_cards;
}

function is_flush(cards) {
  let count_cards = c_count(cards, 0);
  for (let key in count_cards)
    if (count_cards[key].length >= 5) return count_cards[key];
  return false;
}
function is_straight(cards) {
  if (cards === false) return false;
  let Count = 1;
  let straight = [];

  for (let i = cards.length - 1; i < 0; i--) {
    if (cards[i][1] === cards[i - 1][1] + 1) {
      Count++;
      straight.push(cards[i]);
    } else if (cards[i][1] === cards[i - 1][1]) {
    } else {
      Count = 1;
      straight = [];
      straight.push(cards[i]);
    }
    if (Count >= 5) return straight; // can go there here will return only 5
  }
  // here and will return more than 5 cards
  return false;
}

function is_four_of_a_kind(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards)
    if (count_cards[key].length >= 4)
      return [
        count_cards[key][0],
        count_cards[key][1],
        count_cards[key][2],
        count_cards[key][3],
      ];
  return false;
}

function is_full_house(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards)
    if (count_cards[key].length === 3)
      for (let k in count_cards)
        if (count_cards[k].length === 2)
          return [
            count_cards[key][0],
            count_cards[key][1],
            count_cards[key][2],
            count_cards[k][0],
            count_cards[k][1],
          ];
  return false;
}
function is_three_of_a_kind(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards)
    if (count_cards[key].length === 3)
      return [count_cards[key][0], count_cards[key][1], count_cards[key][2]];
  return false;
}
function is_two_pair(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards)
    if (count_cards[key].length === 2) {
      for (let k in count_cards)
        if (k != key && count_cards[k].length === 2)
          return [
            count_cards[key][0],
            count_cards[key][1],
            count_cards[k][0],
            count_cards[k][1],
          ];
    } else return false; // can reuse for making ispair just fix return and if downstairs[count_cards[key][0], count_cards[key][1]];
  return false;
}
function is_one_pair(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards)
    if (count_cards[key].length === 2)
      return [count_cards[key][0], count_cards[key][1]];
  return false;
}

function check_winner(game, players) {
  if ((game.type = 1)) {
    players.forEach((player) => {
      let tmpcards = [];
      for (let i = 0; i < game.CommunityCards.length; i++)
        tmpcards.push(game.CommunityCards[i]);
      for (let i = 0; i < player.hole_cards.length; i++)
        tmpcards.push(player.hole_cards[i]);
      /*console.log(`before parse: ${tmpcards}`);
      console.log(tmpcards);*/
      for (let i = 0; i < tmpcards.length; i++)
        tmpcards[i] = parseCardNumber(tmpcards[i]);
      /*console.log(`after parse: ${tmpcards}`);
      console.log(tmpcards);*/
      tmpcards = sort_cards(tmpcards);

      if (is_straight(is_flush(tmpcards)) != false)
        player.hand_score = { 1: is_straight(is_flush(tmpcards)) };
      else if (is_four_of_a_kind(tmpcards) != false)
        player.hand_score = { 2: is_four_of_a_kind(tmpcards) };
      else if (is_full_house(tmpcards) != false)
        player.hand_score = { 3: is_full_house(tmpcards) };
      else if (is_flush(tmpcards) != false)
        player.hand_score = { 4: is_flush(tmpcards) };
      else if (is_straight(tmpcards) != false)
        player.hand_score = { 5: is_straight(tmpcards) };
      else if (is_three_of_a_kind(tmpcards) != false)
        player.hand_score = { 6: is_three_of_a_kind(tmpcards) };
      else if (is_two_pair(tmpcards) != false)
        player.hand_score = { 7: is_two_pair(tmpcards) };
      else if (is_one_pair(tmpcards) != false)
        player.hand_score = { 8: is_one_pair(tmpcards) };
      else player.hand_score = { 9: sort_cards(tmpcards) };

      console.log(Object.keys(player.hand_score)[0]);
      console.log(player.hand_score[Object.keys(player.hand_score)[0]].length);
      while (player.hand_score[Object.keys(player.hand_score)[0]].length < 5)
        player.hand_score[Object.keys(player.hand_score)[0]].push(
          tmpcards.pop()
        );

      console.log(`check:  ${JSON.stringify(player.hand_score)}`);
    });
  }
}

module.exports = {
  check,
  raise,
  fold,
  print_cards,
  sort_cards,
  c_count,
  is_flush,
  is_straight,
  is_four_of_a_kind,
  is_full_house,
  is_flush,
  is_three_of_a_kind,
  is_two_pair,
  is_one_pair,
  check_winner,
};
