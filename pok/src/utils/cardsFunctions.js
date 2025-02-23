const { MessageMedia } = require('whatsapp-web.js');
const os = require('os');
const { spawn } = require('node:child_process');
const fs = require('fs');
const constants = require('./constants.js');

function printCards(cards) {
  if (!cards.length) return '';
  let cardsString = '';
  for (let i = 0; i < cards.length - 1; i++) {
    cardsString += `*(${constants.SHAPES[cards[i][0] - 1]}${cards[i][1]})* `;
  }
  return `${cardsString}*(${constants.SHAPES[cards[cards.length - 1][0] - 1]}${
    cards[cards.length - 1][1]
  })*`;
}

async function generateCards(cards, path, title = undefined) {
  return new Promise((resolve, reject) => {
    let bin;
    if (os.type().includes('Windows')) {
      bin = 'magick';
    } else {
      bin = 'convert';
    }

    let cmd1Args = [];
    for (const card of cards) {
      cmd1Args.push(`cards/${card[0]}${card[1]}.png`);
    }
    cmd1Args.push(
      '-gravity',
      'South',
      '-border',
      '30',
      '-resize',
      '50%',
      '-filter',
      'Lanczos',
      '-quality',
      '100',
      '+append',
      '-',
    );

    let cmd2Args = ['-', '-border', '20x40', '-strip'];

    if (title) {
      cmd2Args.push(
        '-gravity',
        'North',
        '-pointsize',
        '48',
        '-annotate',
        '0',
        title,
      );
    }

    cmd2Args.push(path);

    let cmd1 = spawn(bin, cmd1Args);
    let cmd2 = spawn(bin, cmd2Args);

    cmd1.stdout.pipe(cmd2.stdin);

    cmd2.on('close', (code) => {
      if (code === 0) {
        resolve(MessageMedia.fromFilePath(path));
      } else {
        reject(new Error('Image generation failed'));
      }
    });
  });
}

async function getCards(cards, title = undefined) {
  if (!cards.length) {
    return '';
  }

  const path = `newCards/${cards.flat().join('')}.png`;

  if (fs.existsSync(path)) {
    return MessageMedia.fromFilePath(path);
  } else {
    return await generateCards(cards, path, title);
  }
}

function countCards(cards, type) {
  let count = {};
  cards.forEach((card) => {
    const key = String(card[type]);
    if (key in count) {
      count[key].push(card);
    } else {
      count[key] = [card];
    }
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
      return [card[0], parseInt(card[1], 10)];
  }
}

function reverseParseCardNumber(card) {
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
      // Sort the flush cards in descending order and take the best 5.
      let flushCards = sortCards(count[key]);
      return flushCards.slice(0, 5);
    }
  }
  return false;
}

/*
 * Checks for a straight in a sorted (descending) array of cards.
 */
function isStraight(cards) {
  if (!cards || cards.length === 0) return false;

  let count = 1;
  let straight = [cards[0]];

  for (let i = 0; i < cards.length - 1; i++) {
    // Check if next card is exactly one less in rank.
    if (cards[i][1] - 1 === cards[i + 1][1]) {
      count++;
      straight.push(cards[i + 1]);
    } else if (cards[i][1] === cards[i + 1][1]) {
      // Skip duplicate ranks
      continue;
    } else {
      count = 1;
      straight = [cards[i + 1]];
    }
    if (count >= 5) {
      return straight.slice(0, 5); // Return only 5 cards for the straight.
    }
  }
  return false;
}

function isStraightFlush(cards) {
  let flushCards = isFlush(cards);
  if (!flushCards) return false;
  return isStraight(flushCards);
}

function isFourOfAKind(cards) {
  let count = countCards(cards, 1);
  for (let key in count) {
    if (count[key].length >= 4) return count[key].slice(0, 4);
  }
  return false;
}

function isFullHouse(cards) {
  let count = countCards(cards, 1);
  let three = null,
    pair = null;
  // Find three-of-a-kind first.
  for (let key in count) {
    if (count[key].length >= 3) {
      three = count[key].slice(0, 3);
      break;
    }
  }
  if (three) {
    for (let key in count) {
      if (count[key].length >= 2 && key !== three[0][1].toString()) {
        pair = count[key].slice(0, 2);
        break;
      }
    }
  }
  if (three && pair) {
    return [...three, ...pair];
  }
  return false;
}

function isThreeOfAKind(cards) {
  let count = countCards(cards, 1);
  for (let key in count) {
    if (count[key].length === 3) return count[key].slice(0, 3);
  }
  return false;
}

function isTwoPair(cards) {
  let count = countCards(cards, 1);
  let pairs = [];
  for (let key in count) {
    if (count[key].length === 2) {
      pairs.push(count[key]);
    }
  }
  if (pairs.length >= 2) {
    // Sort pairs by their rank in descending order.
    pairs.sort((a, b) => b[0][1] - a[0][1]);
    return [...pairs[0], ...pairs[1]];
  }
  return false;
}

function isPair(cards) {
  let count = countCards(cards, 1);
  for (let key in count) {
    if (count[key].length === 2) return count[key].slice(0, 2);
  }
  return false;
}

function getHandStrength(tempCards) {
  let hand = isStraightFlush(tempCards);
  if (hand) {
    let type = hand[0][0];
    // Check for royal flush (contains both King and Ace).
    if (isCardInCards([type, 13], hand) && isCardInCards([type, 14], hand)) {
      return { strength: 0, cards: hand };
    } else {
      return { strength: 1, cards: hand };
    }
  }

  hand = isFourOfAKind(tempCards);
  if (hand) return { strength: 2, cards: hand };

  hand = isFullHouse(tempCards);
  if (hand) return { strength: 3, cards: hand };

  hand = isFlush(tempCards);
  if (hand) return { strength: 4, cards: hand };

  hand = isStraight(tempCards);
  if (hand) return { strength: 5, cards: hand };

  hand = isThreeOfAKind(tempCards);
  if (hand) return { strength: 6, cards: hand };

  hand = isTwoPair(tempCards);
  if (hand) return { strength: 7, cards: hand };

  hand = isPair(tempCards);
  if (hand) return { strength: 8, cards: hand };

  return { strength: 9, cards: tempCards.slice(0, 5) };
}

function getHand(game, player) {
  let tempCards = [...game.communityCards, ...player.holeCards];

  // Convert card symbols to numbers (e.g. 'J' becomes 11).
  for (let i = 0; i < tempCards.length; i++) {
    tempCards[i] = parseCardNumber(tempCards[i]);
  }

  // If there’s an Ace, add an extra card for wheel straights if needed.
  if (
    tempCards.some((card) => card[1] === 14) &&
    !tempCards.some((card) => card[1] === 1)
  ) {
    tempCards.push(['none', 1]);
  }

  tempCards = sortCards(tempCards);
  let score = getHandStrength(tempCards);

  // Ensure that the hand is exactly 5 cards.
  if (score.cards.length > 5) {
    score.cards = score.cards.slice(0, 5);
  }

  // If fewer than 5 cards, add the best remaining cards as kickers.
  for (let i = 0; i < tempCards.length && score.cards.length < 5; i++) {
    let cardToAdd = tempCards[i];
    if (!isCardInCards(cardToAdd, score.cards)) {
      score.cards.push(cardToAdd);
    }
  }

  // For high card hands, trim again to exactly 5 cards.
  if (score.strength === 9 && score.cards.length > 5) {
    score.cards = score.cards.slice(0, 5);
  }

  // Convert back from numbers to card symbols.
  for (let i = 0; i < score.cards.length; i++) {
    score.cards[i] = reverseParseCardNumber(score.cards[i]);
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

  // Sort by hand strength and then by card ranks.
  strengthList.sort((playerA, playerB) => {
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
    return 0; // return 0 if all card values are equal
  });

  let result = {}; // {strength: [ {player, strength, cards}, ... ], ... }
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
  reverseParseCardNumber,
  getCards,
  sortCards,
  countCards,
  getHandStrength,
  getHand,
  isCardInCards,
  calcHandsStrength,
  printCards,
  formatHand,
};
