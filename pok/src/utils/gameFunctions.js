const Mustache = require('mustache');
const constants = require('../utils/constants');
const cardsFunctions = require('../utils/cardsFunctions');
const Pot = require('../models/Pot.js');
const participantRepo = require('../repositories/participantRepo.js');
const { rand } = require('./generalFunctions.js');

/**
 * Checks if a player is a valid winner by verifying their presence in the list of participants.
 *
 * @param {Object} player - The player object to check.
 * @param {Object[]} participants - An array of participant objects.
 * @param {string} player.userId - The unique identifier of the player.
 * @param {string} participant.userId - The unique identifier of each participant.
 * @returns {boolean} Returns true if the player is found in the participants list, false otherwise.
 */
function isValidWinner(player, participants) {
  return participants.some(
    (participant) => participant.userId === player.userId,
  );
}

/**
 * Recursively distributes the given amount among the players.
 * If no players remain, the remainder is awarded to a random winner from potWinners.
 */
function rakeToWinners(players, amount, winners, potWinners) {
  if (players.length === 0) {
    // Give the remainder to a random winner (if any remainder exists)
    winners[randomWinnerKey(potWinners)].winnings += amount;
    return winners;
  }
  const player = players[0];

  if (!(player.userId in winners)) {
    winners[player.userId] = {
      ...player,
      winnings: 0,
    };
  }
  const perPlayer = (amount - (amount % players.length)) / players.length;
  winners[player.userId].winnings += perPlayer;

  players.splice(0, 1);

  return rakeToWinners(players, amount - perPlayer, winners, potWinners);
}

/**
 * Determines the winners among the players based on their hands.
 * In case of a tie, all tying players are returned.
 */
function getWinners(players) {
  if (!players || players.length === 0) return [];

  let winners = [players[0]];

  for (let i = 1; i < players.length; i++) {
    const currentPlayer = players[i];
    const comparisonResult = compareHands(
      winners[0].cards,
      currentPlayer.cards,
    );

    if (comparisonResult > 0) {
      winners = [currentPlayer];
    } else if (comparisonResult === 0) {
      winners.push(currentPlayer);
    }
  }

  return winners;
}

/**
 * Compares two hands card-by-card.
 * Returns 1 if hand1 is weaker than hand2, -1 if stronger, or 0 if equal.
 */
function compareHands(hand1, hand2) {
  for (let i = 0; i < hand1.length; i++) {
    let card1 = cardsFunctions.parseCardNumber(hand1[i])[1];
    let card2 = cardsFunctions.parseCardNumber(hand2[i])[1];
    if (card1 < card2) {
      return 1;
    } else if (card1 > card2) {
      return -1;
    }
  }
  return 0;
}

/**
 * Returns a random key from the array of possible winner IDs.
 */
function randomWinnerKey(possibleWinners) {
  return possibleWinners[rand(possibleWinners.length)];
}

/**
 * Returns the players still active in the game.
 */
async function getLastPlayers(game) {
  const players = await game.getPlayers();
  return players.filter((player) =>
    constants.PLAYER_IN_THE_GAME_STATUSES.includes(player.status),
  );
}

/**
 * Reorganizes the pots by:
 * - Adding remaining players to the main pot.
 * - Sorting all pots in ascending order by their value.
 * - Adjusting each side pot’s value so that players can only win up to what they contributed.
 */
async function reorgPots(game) {
  // Add participants to the main pot.
  const lastPlayers = await getLastPlayers(game);
  const promises = lastPlayers.map((player) =>
    participantRepo.createParticipant(game.mainPot, player.userId),
  );
  await Promise.all(promises);

  // Retrieve and sort the pots in ascending order by value.
  let pots = await game.getPots();
  pots = await Promise.all(pots.map(async (pot) => await Pot.get(pot.id)));
  pots.sort((a, b) => a.value - b.value);

  // Adjust each pot's value to reflect only the additional amount contributed beyond previous pots.
  let previous = 0;
  for (let i = 0; i < pots.length; i++) {
    const originalValue = pots[i].value;
    const effectiveValue = originalValue - previous;
    await pots[i].set('value', effectiveValue);
    previous = originalValue;
  }

  return pots;
}

/**
 * Calculates winners for each pot, distributes winnings, and credits players.
 */
async function calcWinners(game, pots) {
  let winners = {}; // { id: { ...player, winnings: number, cards, strength } }
  const handsStrengthList = await cardsFunctions.calcHandsStrength(game);
  // Iterate over strength levels in ascending order (lower number = better hand)
  const sortedStrengthLevels = Object.keys(handsStrengthList)
    .map(Number)
    .sort((a, b) => a - b);

  // Loop on each pot.
  for (const pot of pots) {
    if (pot.value === 0) continue;

    const participants = await pot.getParticipants();
    let potWinners = [];

    // Loop on each strength level (best hands first).
    for (const level of sortedStrengthLevels) {
      let strengthLevel = handsStrengthList[level].filter((player) =>
        constants.PLAYER_IN_THE_GAME_STATUSES.includes(player.status),
      );

      const possibleWinners = getWinners(strengthLevel);

      // Check each possible winner against the pot participants.
      for (const possibleWinner of possibleWinners) {
        if (isValidWinner(possibleWinner, participants)) {
          potWinners.push(possibleWinner);
        }
      }

      if (potWinners.length > 0) {
        winners = rakeToWinners(
          potWinners.slice(), // use a copy so the original array isn’t mutated
          pot.value,
          winners,
          potWinners.map((pw) => pw.userId),
        );
        break;
      }
    }
  }

  // Credit each winner their winnings.
  for (const winnerId of Object.keys(winners)) {
    let player = await game.getPlayer(winnerId);
    await player.set(
      'gameMoney',
      player.gameMoney + winners[winnerId].winnings,
    );
  }

  return winners;
}

/**
 * Adjusts side pots for players who are all-in.
 */
async function qualifyToAllInsPots(game, amount, current) {
  let pots = (await game.getPots()).filter((pot) => pot.id !== game.mainPot);
  let promises = [];

  for (let pot of pots) {
    pot = await Pot.get(pot.id);

    if (pot.highestBet === -1 || current.currentBet >= pot.highestBet) {
      continue;
    }

    if (current.currentBet + amount >= pot.highestBet) {
      promises.push(pot.addParticipant(current.userId));
      promises.push(
        pot.set('value', pot.value + pot.highestBet - current.currentBet),
      );
    } else {
      promises.push(pot.set('value', pot.value + amount));
    }
  }

  await Promise.all(promises);
}

/**
 * Processes the showdown by reorganizing pots, calculating winners, and preparing a message.
 */
async function showdown(game) {
  let pots = await reorgPots(game);
  let winners = await calcWinners(game, pots);
  let newCards;
  let message = '';

  const template = `Congrats! @{{winner}} Won \${{winnings}}
with {{holeCards}}:
{{handStrength}}
${constants.SEPARATOR}`;

  for (const index in winners) {
    let player = winners[index];

    if (player.winnings === 0) continue;
    if (message.length > 0) message += '\n';

    newCards = await cardsFunctions.getCards(
      Object.values(winners)[0].cards,
      'Winning Hand',
    );

    const winnerData = {
      winner: player.userId,
      winnings: player.winnings,
      holeCards: cardsFunctions.printCards(player.holeCards),
      handStrength: constants.STRENGTH_DICT[player.strength],
    };

    message += Mustache.render(template, winnerData);
  }

  return { endMessage: message, newCards };
}

module.exports = {
  showdown,
  reorgPots,
  calcWinners,
  qualifyToAllInsPots,
  isValidWinner,
  rakeToWinners,
  getWinners,
  compareHands,
  randomWinnerKey,
};
