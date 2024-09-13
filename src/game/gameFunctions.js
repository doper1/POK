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
  let current = game.order.currentPlayer;
  let handsStrengthList = cardsFunctions.calcHandsStrength(game);

  game.pot.reorgAllIns();
  game.jumpToButton();

  let lastPot = new AllIn([], game.pot.mainPot, -1);
  do {
    if (!current.isFolded) {
      lastPot.addPlayer(current);
    }
    current = current.nextPlayer;
  } while (!current.isButton);

  let allIns = [...game.pot.allIns, lastPot];
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
---------------------------------`;

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

function qualifyToAllIns(game, amount) {
  let current = game.order.currentPlayer;
  game.pot.allIns.forEach((allIn) => {
    if (allIn.currentBet != -1) {
      if (current.currentBet >= allIn.currentBet) {
        allIn.players.push(current);
      }

      if (amount < allIn.currentBet) {
        allIn.pot += amount;
      } else {
        allIn.pot += allIn.currentBet;
      }
    }
  });
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
