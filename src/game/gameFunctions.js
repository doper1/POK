const Mustache = require('mustache');
const AllIn = require('../classes/AllIn');
const constants = require('../constants');
const cardsFunctions = require('./cardsFunctions');

function isValidWinner(player, allIn) {
  return allIn.players.some((allInPlayer) => allInPlayer.id == player.id);
}
function rakeToWinners(players, amount, winners) {
  if (players.length === 0) {
    return winners;
  }
  if (!(players[0].id in winners)) {
    winners[players[0].id] = [players[0], 0];
  }
  let winnings = (amount - (amount % players.length)) / players.length;
  winners[players[0].id][0].gameMoney += winnings;
  winners[players[0].id][1] += winnings;

  players.splice(0, 1);

  return rakeToWinners(players, amount - winnings, winners);
}

// Checking for ties and returning the right winner(s) accordingly
function getWinners(players) {
  let winners = [players[0]];

  for (let i = 1; i < players.length; i++) {
    const currentPlayer = players[i];
    const comparisonResult = compareHands(
      winners[0].handScore.cards,
      currentPlayer.handScore.cards,
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

function randomWinnerKey(winners) {
  return Object.keys(winners)[
    Math.floor(Math.random() * Object.keys(winners).length)
  ];
}

function showdown(game) {
  let handsStrengthList = cardsFunctions.calcHandsStrength(game);
  game.pot.reorgAllIns();

  let lastPotPlayers = getLastPlayers(game);
  let lastPot = new AllIn(lastPotPlayers, game.pot.mainPot, -1);
  let allIns = [...game.pot.allIns, lastPot];

  // Reduce from each pot the amount of the pot before it to prevent handling players more then the pot is worth
  allIns = allIns.map((allIn, index) => {
    if (index == 0) {
      return new AllIn(allIn.players, allIn.pot, -1);
    } else {
      return new AllIn(allIn.players, allIn.pot - allIns[index - 1].pot, -1);
    }
  });

  let winners = {}; // { id: [player, player winnings] ...}
  allIns.forEach((allIn) => {
    for (let i = 0; i < Object.keys(handsStrengthList).length; i += 1) {
      let possibleWinners = getWinners(Object.values(handsStrengthList)[i]);

      // Handle the case differently if there is one player on the level against few players on the same hand strength level
      if (!Array.isArray(possibleWinners)) {
        if (isValidWinner(possibleWinners, allIn)) {
          winners = rakeToWinners([possibleWinners], allIn.pot, winners);
          break;
        }
      } else {
        for (
          let playerIndex = 0;
          playerIndex < possibleWinners.length;
          playerIndex += 1
        ) {
          if (!isValidWinner(possibleWinners[playerIndex], allIn)) {
            possibleWinners.splice(playerIndex, 1);
          }
        }
        if (possibleWinners.length > 0) {
          winners = rakeToWinners(possibleWinners, allIn.pot, winners);

          // If there is a reminder of the stack that cannot be split, gives it to random player from the winners
          winners[randomWinnerKey(winners)][0].gameMoney +=
            allIn.pot % allIn.players.length;

          break;
        }
      }
    }
  });
  let message = '';
  const template = `Congrats! @{{winner}} Won \${{winnings}}
with {{holeCards}} - a *{{handStrength}}*\n
{{handCards}}
${constants.SEPARATOR}`;

  for (const id in winners) {
    let player = winners[id];

    if (player[1] === 0) continue;
    if (message.length > 0) message += '\n';

    const winnerData = {
      winner: player[0].phoneNumber,
      winnings: player[1],
      holeCards: cardsFunctions.printCards(player[0].holeCards),
      handStrength: constants.STRENGTH_DICT[player[0].handScore.str],
      handCards: cardsFunctions.printCards(player[0].handScore.cards),
    };

    message += Mustache.render(template, winnerData);
  }

  return message;
}

function qualifyToAllIns(allIns, amount, current) {
  for (let i = allIns.length - 1; i >= 0; i--) {
    let allIn = allIns[i];

    if (allIn.currentBet == -1) return;

    // The condition is fullfied if the player didn't already qualify (by checking if his bet before this one already was a qualifing amount)
    if (current.currentBet >= allIn.currentBet) continue;

    if (current.currentBet + amount >= allIn.currentBet) {
      allIn.players.push(current);
      allIn.pot += allIn.currentBet - current.currentBet;
    } else {
      allIn.pot += amount;
    }
  }
}

function getLastPlayers(game) {
  return Object.values(game.players).filter(
    (player) =>
      !(
        player.isFolded ||
        (player.isAllIn &&
          (player.currentBet == 0 || player.currentBet < game.pot.currentBet))
      ),
  );
}

module.exports = {
  showdown,
  qualifyToAllIns,
  isValidWinner,
  rakeToWinners,
  getWinners,
  compareHands,
  randomWinnerKey,
};
