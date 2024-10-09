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
  return cards.slice().sort((a, b) => b[1] - a[1]);
}

function isCardInCards(card, cards) {
  return cards.some((c) => c[0] == card[0] && c[1] == card[1]);
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

    if (Count >= 5) {
      return straight;
    }
  }
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
            count[k][1],
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

function getHandStrength(tempCards) {
  let cards = isStraightFlush(tempCards);
  if (cards) {
    let type = cards[0][0];
    if (isCardInCards([type, 13], cards) && isCardInCards([type, 14], cards))
      return { strength: 0, cards: cards }; //royal flush
    else {
      return { strength: 1, cards: cards };
    }
  }

  cards = isFourOfAKind(tempCards);
  if (cards) return { strength: 2, cards: cards };

  cards = isFullHouse(tempCards);
  if (cards) return { strength: 3, cards: cards };

  cards = isFlush(tempCards);
  if (cards) return { strength: 4, cards: cards };

  cards = isStraight(tempCards);
  if (cards) return { strength: 5, cards: cards };

  cards = isThreeOfAKind(tempCards);
  if (cards) return { strength: 6, cards: cards };

  cards = isTwoPair(tempCards);
  if (cards) return { strength: 7, cards: cards };

  cards = isPair(tempCards);
  if (cards) return { strength: 8, cards: cards };

  return { strength: 9, cards: tempCards };
}

function getHand(game, player) {
  let tempCards = [...game.communityCards, ...player.holeCards];

  // parses cards to numbers, like J -> 11 Q -> 12
  for (let i = 0; i < tempCards.length; i++) {
    tempCards[i] = parseCardNumber(tempCards[i]);
  }

  tempCards = sortCards(tempCards);
  let score = getHandStrength(tempCards);

  for (let i = 0; i < tempCards.length && score.cards.length < 5; i++) {
    let cardToAdd = tempCards[i];

    if (!isCardInCards(cardToAdd, score.cards)) {
      score.cards.push(cardToAdd);
    }
  }

  //if cards > 5 removes weakest (Could be the case in High card hands)
  while (score.cards.length > 5) {
    score.cards.pop();
  }

  // Reverses back to card symbol (11 -> J, 14||1 -> A)
  for (let i = 0; i < score.cards.length; i++) {
    score.cards[i] = ReverseParseCardNumber(score.cards[i]);
  }

  return score;
}

async function calcHandsStrength(game) {
  let strengthList = [];
  let current = await game.getPlayer(game.button);

  do {
    let score = getHand(game, current);
    strengthList.push([score, current]);
    current = await game.getPlayer(current.nextPlayer);
  } while (game.button !== current.userId);

  // Sort by hand strength
  strengthList = strengthList.slice().sort((playerA, playerB) => {
    if (playerA[0].strength !== playerB[0].strength) {
      return playerA[0].strength - playerB[0].strength;
    }
    const cardsA = playerA[0].cards;
    const cardsB = playerB[0].cards;

    for (let i = 4; i >= 0; i--) {
      if (cardsA[i][1] !== cardsB[i][1]) {
        return cardsA[i][1] - cardsB[i][1];
      }
    }
  });

  let result = {}; // {strength: [{player: Player, cards: Cards}, {player: Player, cards: Cards}]... }
  strengthList.forEach(([score, player]) => {
    if (!(score.strength in result)) {
      result[score.strength] = [];
    }
    result[score.strength].push({
      ...player,
      strength: score.strength,
      cards: score.cards,
    });
  });

  return result;
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
  getHandStrength,
  getHand,
  isCardInCards,
  calcHandsStrength,
  formatHand,
};