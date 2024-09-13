function printCards(cards) {
  let cardsString = '';
  for (let i = 0; i < cards.length - 1; i++) {
    cardsString += `*I${cards[i][0]}${cards[i][1]}I* `;
  }
  return `${cardsString}*I${cards[cards.length - 1][0]}${
    cards[cards.length - 1][1]
  }I*`;
}

function countCards(cards, type) {
  let count = {};
  cards.forEach((card) => {
    if (' ' + card[type] in count) count[' ' + card[type]].push(card);
    else count[' ' + card[type]] = [card];
  });
  return count;
}

function parseCardNumber(card) {
  switch (card[1]) {
    case 'A':
      return [card[0], 14];
    case 'K':
      return [card[0], 13];
    case 'Q':
      return [card[0], 12];
    case 'J':
      return [card[0], 11];
    default:
      return [card[0], parseInt(card[1])];
  }
}
function ReverseParseCardNumber(card) {
  switch (card[1]) {
    case 14:
      return [card[0], 'A'];
    case 13:
      return [card[0], 'K'];
    case 12:
      return [card[0], 'Q'];
    case 11:
      return [card[0], 'J'];
    case 1:
      return [card[0], 'A'];
    default:
      return [card[0], `${card[1]}`];
  }
}

function sortCards(cards) {
  return (cards = cards.slice().sort((a, b) => b[1] - a[1]));
}

function isCardInCards(card, Cards) {
  for (let i = 0; i < Cards.length; i++)
    if (Cards[i][0] == card[0] && Cards[i][1] == card[1]) return true; // Card is already in the hand
  return false;
}

function isFlush(cards) {
  let count = countCards(cards, 0);
  for (let key in count) {
    if (count[key].length >= 5) {
      return count[key];
    }
  }

  return false;
}

/*
 * @param {cards} - array of cards
 * @param {type} -type of card clubs, diamonds, hearts, spades specify only if given flush in cards
 */
function isStraight(cards) {
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
function isStraightFlush(cards) {
  let flushCards = isFlush(cards);
  if (flushCards == false) return false;
  return isStraight(flushCards);
}

function isFourOfAKind(cards) {
  let count = countCards(cards, 1);
  for (let key in count)
    if (count[key].length >= 4)
      return [count[key][0], count[key][1], count[key][2], count[key][3]];
  return false;
}

function isFullHouse(cards) {
  let count = countCards(cards, 1);
  for (let key in count)
    if (count[key].length == 3)
      for (let k in count)
        if (count[k].length == 2)
          return [
            count[key][0],
            count[key][1],
            count[key][2],
            count[k][0],
            count[k][1]
          ];
  return false;
}
function isThreeOfAKind(cards) {
  let count = countCards(cards, 1);
  for (let key in count)
    if (count[key].length == 3)
      return [count[key][0], count[key][1], count[key][2]];
  return false;
}
function isTwoPair(cards) {
  let count = countCards(cards, 1);
  for (let key in count)
    if (count[key].length == 2)
      for (let k in count)
        if (k != key && count[k].length == 2)
          return [count[key][0], count[key][1], count[k][0], count[k][1]];
  return false;
}
function isPair(cards) {
  let count = countCards(cards, 1);
  for (let key in count) {
    if (count[key].length == 2) return [count[key][0], count[key][1]];
  }
  return false;
}

/**
 * @param {Game} game - The game
 * @param {Player} player - The player in which you update the hand str
 */
function updateHandStrength(game, player) {
  player.handScore = {};
  let temp = [];

  // adds comm cards and player cards
  temp = [...game.communityCards];
  temp.push(player.holeCards[0]);
  temp.push(player.holeCards[1]);

  // parses cards to numbers J:11 Q:12 K:13 A:14...
  for (let i = 0; i < temp.length; i++) temp[i] = parseCardNumber(temp[i]);

  //sorts from highest to lowest to determine calculation of hand highest = better
  temp = sortCards(temp);

  if (isStraightFlush(temp) != false) {
    let straightFlush = isStraight(isFlush(temp));
    let type = straightFlush[0][0];
    if (
      isCardInCards([type, 13], straightFlush) &&
      isCardInCards([type, 14], straightFlush)
    )
      player.handScore = { str: 0, cards: straightFlush }; //royal flush
    else player.handScore = { str: 1, cards: straightFlush };
  } else if (isFourOfAKind(temp) != false)
    player.handScore = { str: 2, cards: isFourOfAKind(temp) };
  else if (isFullHouse(temp) != false)
    player.handScore = { str: 3, cards: isFullHouse(temp) };
  else if (isFlush(temp) != false)
    player.handScore = { str: 4, cards: isFlush(temp) };
  else if (isStraight(temp) != false)
    player.handScore = { str: 5, cards: isStraight(temp) };
  else if (isThreeOfAKind(temp) != false)
    player.handScore = { str: 6, cards: isThreeOfAKind(temp) };
  else if (isTwoPair(temp) != false)
    player.handScore = { str: 7, cards: isTwoPair(temp) };
  else if (isPair(temp) != false)
    player.handScore = { str: 8, cards: isPair(temp) };
  else player.handScore = { str: 9, cards: temp };

  // if cards <5 adds highest
  for (let i = 0; i < temp.length; i++)
    if (player.handScore.cards.length < 5) {
      let cardToAdd = temp[i];
      if (!isCardInCards(cardToAdd, player.handScore.cards)) {
        player.handScore.cards.push(cardToAdd);
      }
    }

  //if cards > 5 removes weakest
  while (player.handScore.cards.length > 5) {
    player.handScore.cards.pop(player.handScore.cards[0]);
  }
  //reverses back to 11:J 13:K (14||1 :A) 12:Q
  for (let i = 0; i < player.handScore.cards.length; i++)
    player.handScore.cards[i] = ReverseParseCardNumber(
      player.handScore.cards[i]
    );
}

/**
 * @param {Game} game - The game of which to generate the strength arr for all players
 * @returns {Dictionary}
 * @example dict = {[0:player1], [4:player3], [8,[player4,player5]] }
 */
/**
 * @param {Game} game - The game of which to generate the strength arr for all players
 * @returns {Dictionary}
 * @example dict = {[0:player1], [4:player3], [8,[player4,player5]] }
 */

function calcHandsStrength(game) {
  let strengthList = [];
  game.jumpToButton();
  let current = game.order.currentPlayer;

  // Collect hand strengths for each player
  do {
    updateHandStrength(game, current);
    strengthList.push([current.handScore.str, current]);
    current = current.nextPlayer;
  } while (!current.isButton);

  // Sort by hand strength and then by kicker cards
  strengthList = strengthList.slice().sort(([strA, handA], [strB, handB]) => {
    if (strA !== strB) {
      return strB - strA; // Sort in descending order
    }

    const cardsA = handA.handScore.cards;
    const cardsB = handB.handScore.cards;

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
  });

  // Handle multiple winners with the same hand
  let res = new Map();
  strengthList.forEach(([str, player]) => {
    if (!res.has(str)) {
      res.set(str, []);
    }
    res.get(str).push(player);
  });

  return Object.fromEntries(res);
}

function formatHand(player, holeCards) {
  return `@${player}: ${printCards(holeCards)}\n`;
}

module.exports = {
  isStraightFlush,
  isFourOfAKind,
  isFullHouse,
  isFlush,
  isStraight,
  isThreeOfAKind,
  isTwoPair,
  isPair,
  parseCardNumber,
  ReverseParseCardNumber,
  printCards,
  sortCards,
  countCards,
  updateHandStrength,
  isCardInCards,
  calcHandsStrength,
  formatHand
};
