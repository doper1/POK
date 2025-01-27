const Mustache = require('mustache');
const constants = require('../utils/constants');
const cardsFunctions = require('../utils/cardsFunctions');
const Pot = require('../models/Pot.js');
const participantRepo = require('../repositories/participantRepo.js');
const { rand } = require('./generalFunctions.js');

function isValidWinner(player, participants) {
  return participants.some(
    (participant) => participant.userId == player.userId,
  );
}

function rakeToWinners(players, amount, winners, potWinners) {
  if (players.length === 0) {
    // gives the reminder to a random winner (if there is a reminder)
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
  let winnings = (amount - (amount % players.length)) / players.length;
  winners[player.userId].winnings += winnings;

  players.splice(0, 1);

  return rakeToWinners(players, amount - winnings, winners, potWinners);
}

// Checking for ties and returning the right winner(s) accordingly
function getWinners(players) {
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

function randomWinnerKey(possibleWinners) {
  return possibleWinners[rand(possibleWinners.length)];
}

async function showdown(game) {
  let pots = await reorgPots(game);
  let winners = await calcWinners(game, pots);
  let newCards;
  let message = '';

  const template = `Congrats! @{{winner}} Won \${{winnings}}
with {{holeCards}} - {{handStrength}}
${constants.SEPARATOR}`;

  for (const index in winners) {
    let player = winners[index];

    if (player[1] === 0) continue;
    if (message.length > 0) message += '\n';

    newCards = await cardsFunctions.getCards(Object.values(winners)[0].cards);

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

async function reorgPots(game) {
  // Add participants to the main pot
  let promises = [];
  (await getLastPlayers(game)).forEach((player) => {
    promises.push(
      participantRepo.createParticipant(game.mainPot, player.userId),
    );
  });
  await Promise.all(promises);

  // Sort the pots by their value in acending order
  let pots = await game.getPots();

  for (const index in pots) {
    pots[index] = await Pot.get(pots[index].id);
  }
  pots.sort((a, b) => a.value - b.value);

  // Reduce from each pot the amount cardsAof the pot before it to prevent handling players more then the pot is worth
  let lastRoundPot;
  for (const index in pots) {
    let pot = pots[index];

    if (index == 0) {
      lastRoundPot = pot.value;
      continue;
    }
    await pot.set('value', pot.value - lastRoundPot);
    lastRoundPot += pot.value;
  }

  return pots;
}

async function calcWinners(game, pots) {
  let winners = {}; // { id: [{player: player, cards: cards, strength: strength}, player winnings] ...}
  let handsStrengthList = await cardsFunctions.calcHandsStrength(game); // { strength: [{player: player1, cards: cards1}, {player: player2, cards: cards2}], strength2:...}

  // Loop on each pot
  for (const pot of pots) {
    if (pot.value === 0) continue;

    let participants = await pot.getParticipants();
    let potWinners = [];

    // Loop on each players strength level (e.g. 6: [player, player], 8: [player])
    for (let strengthLevel of Object.values(handsStrengthList)) {
      strengthLevel = strengthLevel.filter((player) =>
        constants.IN_THE_GAME_STATUSES.includes(player.status),
      );

      let possibleWinners = getWinners(strengthLevel);

      // Loops on each player inside the same strength level
      for (const possibleWinner of possibleWinners) {
        if (isValidWinner(possibleWinner, participants)) {
          potWinners.push(possibleWinner);
        }
      }

      if (potWinners.length > 0) {
        winners = rakeToWinners(
          potWinners,
          pot.value,
          winners,
          potWinners.map((pw) => pw.userId),
        );
        break;
      }
    }
  }

  // Give player their winnings
  for (const winnerId of Object.keys(winners)) {
    let player = await game.getPlayer(winnerId);
    await player.set(
      'gameMoney',
      player.gameMoney + winners[winnerId].winnings,
    );
  }

  return winners;
}

async function qualifyToAllInsPots(game, amount, current) {
  let pots = (await game.getPots()).filter((pot) => pot.id !== game.mainPot);
  let promises = [];

  for (let pot of pots) {
    pot = await Pot.get(pot.id);

    if (pot.highestBet == -1 || current.currentBet >= pot.highestBet) {
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

async function getLastPlayers(game) {
  let mainPot = await Pot.get(game.mainPot);
  return (await game.getPlayers()).filter(
    (player) =>
      !(
        player.status === 'folded' ||
        (player.status === 'all in' &&
          (player.currentBet == 0 || player.currentBet < mainPot.highestBet))
      ),
  );
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
