function print_cards(cards) {
  let to_string = "";
  for (let i = 0; i < cards.length - 1; i++) {
    to_string += `*|${cards[i][0]}${cards[i][1]}|* `;
  }
  return `${to_string}*|${cards[cards.length - 1][0]}${
    cards[cards.length - 1][1]
  }|*`;
}

function parseCardNumber(card) {
  switch (card[1]) {
    case "A":
      return [card[0], 14];
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
    case 14:
      return [card[0], "A"];
    case 13:
      return [card[0], "K"];
    case 12:
      return [card[0], "Q"];
    case 11:
      return [card[0], "J"];
    case 1:
      return [card[0], "A"];
    default:
      return [card[0], `${card[1]}`];
  }
}

function sort_cards(cards) {
  return (cards = cards.slice().sort((a, b) => b[1] - a[1]));
}

function isCardInCards(card, Cards) {
  for (let i = 0; i < Cards.length; i++)
    if (Cards[i][0] == card[0] && Cards[i][1] == card[1]) return true; // Card is already in the hand
  return false;
}
// switch to param
function c_count(cards, type) {
  let count_cards = {};
  cards.forEach((card) => {
    // " " + card[type] is used to make sure that the automatic sort doesnt work and fuck our sort e.g in case of two pairs
    // like 2s,8s,13s the 2s and 8s will be sorted before from lowest to highest and destroy our sorting from high to low 13s, 8s , 2s
    if (" " + card[type] in count_cards)
      count_cards[" " + card[type]].push(card);
    else count_cards[" " + card[type]] = [card];
  });
  return count_cards;
}

function is_flush(cards) {
  let count_cards = c_count(cards, 0);
  for (let key in count_cards)
    if (count_cards[key].length >= 5) return count_cards[key];

  return false;
}

/*
 * @param {cards} - array of cards
 * @param {type} -type of card clubs, diamonds, hearts, spades specify only if given flush in cards
 */
function is_straight(cards) {
  if (cards == false) return false;
  let Count = 1;
  let straight = [cards[0]];
  for (let i = 0; i < cards.length - 1; i++) {
    if (cards[i][1] - 1 == cards[i + 1][1]) {
      Count++;
      straight.push(cards[i + 1]);
    } else {
      Count = 1;
      straight = [];
      straight.push(cards[i + 1]);
    }
    if (Count >= 5) return straight; // can go there here will return only 5
  }
  // here and will return more than 5 cards
  return false;
}
function is_straight_flush(cards) {
  let flush_Cards = is_flush(cards);
  if (flush_Cards == false) return false;
  return is_straight(flush_Cards);
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
    if (count_cards[key].length == 3)
      for (let k in count_cards)
        if (count_cards[k].length == 2)
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
    if (count_cards[key].length == 3)
      return [count_cards[key][0], count_cards[key][1], count_cards[key][2]];
  return false;
}
function is_two_pair(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards)
    if (count_cards[key].length == 2)
      for (let k in count_cards)
        if (k != key && count_cards[k].length == 2)
          return [
            count_cards[key][0],
            count_cards[key][1],
            count_cards[k][0],
            count_cards[k][1],
          ];
  // can reuse for making ispair just fix return and if downstairs[count_cards[key][0], count_cards[key][1]];
  return false;
}
function is_one_pair(cards) {
  let count_cards = c_count(cards, 1);
  for (let key in count_cards) {
    if (count_cards[key].length == 2)
      return [count_cards[key][0], count_cards[key][1]];
  }
  return false;
}

/**
 * @param {Game} game - The game
 * @param {Player} player - The player in which you update the hand str
 */
function update_hand_str(game, player) {
  player.hand_score = {};
  let tmp_cards = [];

  // adds comm cards and player cards
  tmp_cards = [...game.community_cards];
  tmp_cards.push(player.hole_cards[0]);
  tmp_cards.push(player.hole_cards[1]);

  // parses cards to numbers J:11 Q:12 K:13 A:14...
  for (let i = 0; i < tmp_cards.length; i++)
    tmp_cards[i] = parseCardNumber(tmp_cards[i]);

  //sorts from highest to lowest to determine calculation of hand highest = better
  tmp_cards = sort_cards(tmp_cards);

  if (is_straight_flush(tmp_cards) != false) {
    let str_flush = is_straight(is_flush(tmp_cards));
    let type = str_flush[0][0];
    if (
      isCardInCards([type, 13], str_flush) &&
      isCardInCards([type, 14], str_flush)
    )
      player.hand_score = { str: 0, cards: str_flush }; //royal flush
    else player.hand_score = { str: 1, cards: str_flush };
  } else if (is_four_of_a_kind(tmp_cards) != false)
    player.hand_score = { str: 2, cards: is_four_of_a_kind(tmp_cards) };
  else if (is_full_house(tmp_cards) != false)
    player.hand_score = { str: 3, cards: is_full_house(tmp_cards) };
  else if (is_flush(tmp_cards) != false)
    player.hand_score = { str: 4, cards: is_flush(tmp_cards) };
  else if (is_straight(tmp_cards) != false)
    player.hand_score = { str: 5, cards: is_straight(tmp_cards) };
  else if (is_three_of_a_kind(tmp_cards) != false)
    player.hand_score = { str: 6, cards: is_three_of_a_kind(tmp_cards) };
  else if (is_two_pair(tmp_cards) != false)
    player.hand_score = { str: 7, cards: is_two_pair(tmp_cards) };
  else if (is_one_pair(tmp_cards) != false)
    player.hand_score = { str: 8, cards: is_one_pair(tmp_cards) };
  else player.hand_score = { str: 9, cards: tmp_cards };

  // if cards <5 adds highest
  for (let i = 0; i < tmp_cards.length; i++)
    if (player.hand_score.cards.length < 5) {
      let cardToAdd = tmp_cards[i];
      if (!isCardInCards(cardToAdd, player.hand_score.cards)) {
        player.hand_score.cards.push(cardToAdd);
      }
    }

  //if cards > 5 removes weakest
  while (player.hand_score.cards.length > 5) {
    player.hand_score.cards.pop(player.hand_score.cards[0]);
  }
  //reverses back to 11:J 13:K (14||1 :A) 12:Q
  for (let i = 0; i < player.hand_score.cards.length; i++)
    player.hand_score.cards[i] = ReverseParseCardNumber(
      player.hand_score.cards[i],
    );
}

/**
 * @param {Game} game - The game of which to generate the strength arr for all players
 * @returns {Dictionary}
 * @example dict = {[0:player1], [4:player3], [8,[player4,player5]] }
 */
function calc_hands_strength(game) {
  let strength_list = [];
  game.jumpToButton();
  let current = game.order.current_player;

  // Collect hand strengths for each player
  do {
    update_hand_str(game, current);
    strength_list.push([current.hand_score.str, current]);
    current = current.next_player;
  } while (!current.is_button);

  // Sort by hand strength and then by kicker cards
  strength_list = strength_list.slice().sort(([strA, handA], [strB, handB]) => {
    if (strA !== strB) {
      return strA - strB;
    }

    const cardsA = handA.hand_score.cards;
    const cardsB = handB.hand_score.cards;

    // Tie-breaking for flushes
    if (strA === 4) {
      // Assuming 4 is the strength value for flushes
      for (let i = 4; i >= 0; i--) {
        if (cardsA[i][1] !== cardsB[i][1]) {
          return cardsB[i][1] - cardsA[i][1];
        }
      }
    } else {
      // Compare kicker cards for other hands
      for (let i = 4; i >= 0; i--) {
        if (cardsA[i][1] !== cardsB[i][1]) {
          return cardsB[i][1] - cardsA[i][1];
        }
      }
    }
    return 0;
  });

  // Convert to expected format
  return Object.fromEntries(
    new Map(strength_list.map(([str, player]) => [str, player])),
  );
}

function format_hand(player_name, hole_cards) {
  return `${player_name}: ${print_cards(hole_cards)}\n`;
}

module.exports = {
  print_cards,
  sort_cards,
  c_count,
  is_flush,
  is_straight,
  is_straight_flush,
  is_four_of_a_kind,
  is_full_house,
  is_three_of_a_kind,
  is_two_pair,
  is_one_pair,
  update_hand_str,
  parseCardNumber,
  ReverseParseCardNumber,
  isCardInCards,
  calc_hands_strength,
  format_hand,
};
