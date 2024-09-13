const mustache = require('mustache');
const constants = require('../constants');
const { shuffleArray, delay, setLock } = require('../generalFunctions.js');
const cardsFunctions = require('../game/cardsFunctions.js');
const gameFunctions = require('../game/gameFunctions.js');
const Player = require('./Player');
const Order = require('./Order.js');
const Pot = require('./Pot');

class Game {
  constructor(id, chat) {
    this.id = id;
    this.chat = chat;
    this.players = {};
    this.order = new Order();
    this.pot = new Pot();
    this.deck = [];
    this.type = 1; // for Omaha // 1,2,3
    this.communityCards = [];
    this.isMidRound = false;
    this.folds = 0;
  }

  addPlayer(id, phoneNumber) {
    this.players[id] = new Player(id, phoneNumber);
  }

  getPlayers() {
    return this.players;
  }

  getisMidRound() {
    return this.isMidRound;
  }

  setisMidRound(newMidround) {
    this.isMidRound = newMidround;
  }

  getPlayersPretty() {
    let index = 1;
    let players = Object.values(this.players).map((player) => ({
      index: index++,
      name: player.phoneNumber,
    }));
    let template = `*Players:*{{#players}}\n{{index}}. @{{name}}{{/players}}`;
    return mustache.render(template, { players });
  }

  getOrderPretty() {
    let current = this.order.currentPlayer;
    this.jumpToButton();

    let playerCount = Object.keys(this.players).length;
    if (playerCount == 2) {
      // After preflop
      if (this.communityCards.length != 0) {
        this.order.next(); // SB
      }
    } else {
      // Preflop
      if (this.communityCards.length == 0) {
        this.order.next(); // SB
        this.order.next(); // BB
        this.order.next(); // UTG
      }
      // After preflop
      else {
        this.order.next(); // SB
      }
    }

    // Define virtual current for looping over the players
    let tempCurrent = this.order.currentPlayer;

    // Return the real current player to it's place
    this.order.currentPlayer = current;

    let orderString = '';
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      orderString += '\n';
      if (tempCurrent === this.order.currentPlayer) {
        orderString += `_*${i}.@${tempCurrent.phoneNumber}I  $${tempCurrent.currentBet}  I  $${tempCurrent.gameMoney}`;
      } else if (tempCurrent.isFolded) {
        orderString += `~${i}.@${tempCurrent.phoneNumber}I  $${tempCurrent.currentBet}  I  $${tempCurrent.gameMoney}`;
      } else {
        orderString += `${i}.@${tempCurrent.phoneNumber}I  $${tempCurrent.currentBet}  I  $${tempCurrent.gameMoney}`;
      }

      if (tempCurrent.isButton) {
        orderString += 'I⚪';
      }
      if (tempCurrent.isAllIn) {
        orderString += 'I🔴';
      }

      if (tempCurrent === this.order.currentPlayer) {
        orderString += `*_`;
      } else if (tempCurrent.isFolded) {
        orderString += `~`;
      }

      tempCurrent = tempCurrent.nextPlayer;
    }

    let template = `*Pot:* \${{mainPot}}\n
{{#hasCommunityCards}}
*Community Cards:*
{{communityCards}}\n
{{/hasCommunityCards}}*Playing Order  |  Bet  |  Stack* {{orderString}}`;

    return mustache.render(template, {
      mainPot: this.pot.mainPot,
      hasCommunityCards: this.communityCards.length != 0,
      communityCards:
        this.communityCards.length != 0 &&
        cardsFunctions.printCards(this.communityCards),
      orderString: orderString,
    });
  }

  resetGameStatus() {
    this.deck = shuffleArray(constants.DECK.map((card) => [...card]));
    this.communityCards = [];
    this.folds = 0;
    this.pot = new Pot();
    this.resetPlayersStatus(true);
  }

  dealCards(whatsapp) {
    this.jumpToButton();
    let current = this.order.currentPlayer;
    do {
      current.holeCards = [];
      current.setHoleCards(...this.deck.splice(-2));
      const template = `{{holeCards}}\n
{{chatName}}`;

      const newMessage = mustache.render(template, {
        holeCards: cardsFunctions.printCards(current.getHoleCards()),
        chatName: this.chat.name,
      });

      whatsapp.sendMessage(current.id, newMessage);
      current = current.nextPlayer;
    } while (!current.isButton);
  }

  initRound(whatsapp, lastRoundMessage = '') {
    this.resetGameStatus();
    this.dealCards(whatsapp);
    this.moveButton();

    // For games with two players, the button is also the SB- so there is one extra order shift
    if (Object.keys(this.players).length == 2) {
      this.order.next();
    }
    this.putBlinds();

    let template = `{{#lastRoundMessage}}{{lastRoundMessage}}\n{{/lastRoundMessage}}
{{order}}\n
Check your DM for your cards 🤫\n
Action on @{{currentPlayer.phoneNumber}} (\${{currentPlayer.gameMoney}})\n
\${{toCall}} to call`;

    let newMessage = mustache.render(template, {
      lastRoundMessage,
      order: this.getOrderPretty(),
      currentPlayer: this.order.currentPlayer,
      toCall: this.pot.currentBet - this.order.currentPlayer.currentBet,
    });

    this.chat.sendMessage(newMessage, {
      mentions: this.getMentions(),
    });
  }
  generateOrder() {
    this.order = new Order();
    let players = shuffleArray(Object.values(this.players));
    for (let i = 0; i < players.length; i++) {
      this.order.append(players[i]);
    }
    // Closes the Order as a loop
    let current = this.order.currentPlayer;
    while (current.nextPlayer) {
      current = current.nextPlayer;
    }
    current.nextPlayer = this.order.currentPlayer;
    this.order.currentPlayer.isButton = true;
  }

  jumpToButton() {
    let current = this.order.currentPlayer;
    while (!current.isButton) {
      current = current.nextPlayer;
    }
    this.order.currentPlayer = current;
  }

  moveButton() {
    this.jumpToButton();
    this.order.currentPlayer.isButton = false;
    this.order.next();
    this.order.currentPlayer.isButton = true;
  }

  moveAction(actionMessage) {
    this.order.next();
    let current = this.order.currentPlayer;

    const template = `*Pot*: \${{mainPot}}\n
{{actionMessage}}\n
Action on @{{phoneNumber}} (\${{gameMoney}})
{{#toCall}}
\n\${{toCall}} to call{{/toCall}}`;

    const newMessage = mustache.render(template, {
      mainPot: this.pot.mainPot,
      actionMessage,
      phoneNumber: current.phoneNumber,
      gameMoney: current.gameMoney,
      toCall:
        this.pot.currentBet - current.currentBet !== 0
          ? this.pot.currentBet - current.currentBet
          : null,
    });

    this.chat.sendMessage(newMessage, {
      mentions: this.getMentions(),
    });
  }

  putBlinds() {
    this.pot.mainPot += constants.SMALL_BLIND + constants.BIG_BLIND;
    this.pot.currentBet = constants.BIG_BLIND;

    this.order.next();
    this.order.currentPlayer.gameMoney -= constants.SMALL_BLIND;
    this.order.currentPlayer.currentBet = constants.SMALL_BLIND;
    this.order.next();
    this.order.currentPlayer.gameMoney -= constants.BIG_BLIND;
    this.order.currentPlayer.currentBet = constants.BIG_BLIND;
    this.order.next();
  }

  async updateRound(whatsapp, actionMessage) {
    let current = this.order.currentPlayer;
    let next = current.nextPlayer;
    let playerCount = Object.keys(this.players).length;
    let allInCount = this.pot.allIns.length;

    // Everybody folded except one player
    if (this.folds + 1 == playerCount) {
      while (current.isFolded) {
        current = current.nextPlayer;
      }
      current.gameMoney += this.pot.mainPot;
      this.initRound(
        whatsapp,
        `Congrats! @${current.phoneNumber} Won $${this.pot.mainPot}!
---------------------------------`,
      );
    }
    // More then one player is all in and everybody else folded
    else if (
      allInCount + this.folds == playerCount ||
      (allInCount == playerCount - this.folds - 1 &&
        next.currentBet == this.pot.currentBet)
    ) {
      setLock(true);
      let newMessage = `${actionMessage}\n\n*Pot:* $${this.pot.mainPot}\n\n`;
      Object.values(this.players).forEach((player) => {
        if (!player.isFolded) {
          newMessage += `${cardsFunctions.formatHand(
            player.phoneNumber,
            player.holeCards,
          )}`;
        }
      });
      if (this.communityCards.length != 0) {
        newMessage += `\n*Community Cards:*\n${cardsFunctions.printCards(this.communityCards)}`;
      } else {
        newMessage += '\n*Community Cards:*\n-';
      }
      let message = await this.chat.sendMessage(newMessage, {
        mentions: this.getMentions(),
      });

      await delay(1000);
      await this.rushRound(message, whatsapp, newMessage);
      let endMessage = gameFunctions.showdown(this);
      this.initRound(whatsapp, endMessage);
      setLock(false);
    } else if (next.isAllIn || next.isFolded) {
      this.order.next();
      this.updateRound(whatsapp, actionMessage);
    } else if (next.isPlayed && next.currentBet == this.pot.currentBet) {
      this.moveRound(whatsapp);
    } else {
      current.isPlayed = true;
      this.moveAction(actionMessage);
    }
  }

  moveRound(whatsapp) {
    switch (this.communityCards.length) {
      // Flop
      case 0:
        this.communityCards.push(...this.deck.splice(-3));
        this.resetRoundStatus();
        break;
      // Turn / River
      case 3:
      case 4:
        this.communityCards.push(this.deck.pop());
        this.resetRoundStatus();
        break;
      // Showdown
      case 5:
        this.initRound(whatsapp, gameFunctions.showdown(this));
        break;
    }
  }

  async rushRound(message, whatsapp, body) {
    const editMessage = async (message) => {
      let newMessage = body.replace(/\n.*$/, '').trim();
      newMessage += `\n${cardsFunctions.printCards(this.communityCards)}`;
      await message.edit(newMessage, { mentions: this.getMentions() });

      return message;
    };

    switch (this.communityCards.length) {
      // Flop
      case 0:
        this.communityCards.push(...this.deck.splice(-3));
        message = await editMessage(message);
        break;
      // Turn / River
      case 3:
      case 4:
        this.communityCards.push(this.deck.pop());
        message = await editMessage(message);
        break;
      default:
        return;
    }

    await delay((this.communityCards.length - 1) * 1000);
    await this.rushRound(message, whatsapp, body);
  }

  resetPlayersStatus(isNewHand) {
    this.jumpToButton();
    let current = this.order.currentPlayer;
    do {
      if (isNewHand) {
        current.isAllIn = false;
        current.isFolded = false;
        current.handScore = { str: undefined, cards: [] };
      }
      current.currentBet = 0;
      current.isPlayed = false;
      current = current.nextPlayer;
    } while (!current.isButton);
  }

  resetRoundStatus() {
    this.pot.lastRoundPot = this.pot.mainPot;
    this.pot.currentBet = 0;
    this.pot.allIns.forEach((allIn) => {
      allIn.currentBet = -1;
    });
    this.resetPlayersStatus(false);
    this.order.next();
    let current = this.order.currentPlayer;
    while (current.isAllIn || current.isFolded) {
      current = current.nextPlayer;
    }
    this.order.currentPlayer = current;
    let newMessage = `*Pot*: $${this.pot.mainPot}\n
*Community Cards:*\n${cardsFunctions.printCards(this.communityCards)}\n
Action on @${current.phoneNumber} ($${current.gameMoney})`;

    if (this.pot.currentBet - current.currentBet != 0) {
      newMessage += `\n$${this.pot.currentBet - current.currentBet} to call`;
    }
    this.chat.sendMessage(newMessage, {
      mentions: this.getMentions(),
    });
  }

  showHands() {
    this.jumpToButton();
    let current = this.order.currentPlayer;
    let hands = '';
    do {
      current = current.nextPlayer;
      hands += `${cardsFunctions.formatHand(
        current.phoneNumber,
        current.holeCards,
      )}\n`;
    } while (current.isButton == false);

    return hands;
  }

  getMentions() {
    return Object.values(this.players).map((player) => player.id);
  }
}

module.exports = Game;
