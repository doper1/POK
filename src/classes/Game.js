const Mustache = require('mustache');
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
      stack: player.gameMoney,
      money: player.money,
    }));
    let template = `*Players  |  Stack  |   Money*{{#players}}\n{{index}}. @{{name}}I \${{stack}} I \${{money}}{{/players}}`;
    return Mustache.render(template, { players });
  }

  getOrderPretty() {
    let current = this.getPlayerUTG();

    let orderString = '';
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      orderString += '\n';
      if (current === this.order.currentPlayer) {
        orderString += `_*`;
      } else if (current.isFolded) {
        orderString += `~`;
      }

      orderString += `${i}.@${current.phoneNumber}I $${current.currentBet} I $${current.gameMoney}`;

      if (current.isButton) {
        orderString += 'I⚪';
      }
      if (current.isAllIn) {
        orderString += 'I🔴';
      }

      if (current === this.order.currentPlayer) {
        orderString += `*_`;
      } else if (current.isFolded) {
        orderString += `~`;
      }

      current = current.nextPlayer;
    }

    let template = `*Pot:* \${{mainPot}}\n
{{#hasCommunityCards}}
*Community Cards:*
{{communityCards}}\n
{{/hasCommunityCards}}*Playing Order  |  Bet  |  Stack* {{orderString}}`;

    return Mustache.render(template, {
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

      const newMessage = Mustache.render(template, {
        holeCards: cardsFunctions.printCards(current.holeCards),
        chatName: this.chat.name,
      });

      whatsapp.sendMessage(current.id, newMessage);
      current = current.nextPlayer;
    } while (!current.isButton);
  }

  initRound(whatsapp, lastRoundMessage) {
    this.resetGameStatus();

    if (
      Object.values(this.players).filter((player) => player.gameMoney > 0)
        .length <= 1
    ) {
      this.endGame(lastRoundMessage);
      return;
    }

    this.dealCards(whatsapp);
    this.moveButton();

    // For games with two players, the button is also the SB- so there is one extra order shift
    if (Object.keys(this.players).length == 2) {
      this.order.next();
    }
    this.putBlinds();

    let template = `{{lastRoundMessage}}\n
{{order}}\n
Check your DM for your cards 🤫\n
Action on @{{name}} (\${{gameMoney}})`;

    let current = this.order.currentPlayer;
    let callAmount = this.pot.currentBet - current.currentBet;

    if (callAmount != 0) {
      if (callAmount < current.gameMoney) {
        template += `\n\n\${{toCall}} to call`;
      } else {
        template += `\n\nAll in to call`;
      }
    }
    let newMessage = Mustache.render(template, {
      lastRoundMessage,
      order: this.getOrderPretty(),
      name: current.phoneNumber,
      gameMoney: current.gameMoney,
      toCall: callAmount,
    });

    this.chat.sendMessage(newMessage, {
      mentions: this.getMentions(),
    });
  }
  generateOrder() {
    this.order = new Order();
    let players = shuffleArray(Object.values(this.players));
    for (let i = 0; i < players.length; i++) {
      players[i].nextPlayer = null;
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

    let template = `*Pot*: \${{mainPot}}\n
{{actionMessage}}\n
Action on @{{phoneNumber}} (\${{gameMoney}})`;

    let callAmount = this.pot.currentBet - current.currentBet;

    if (callAmount != 0) {
      if (callAmount < current.gameMoney) {
        template += `\n\n\${{toCall}} to call`;
      } else {
        template += `\n\nAll in to call`;
      }
    }

    const newMessage = Mustache.render(template, {
      mainPot: this.pot.mainPot,
      actionMessage,
      phoneNumber: current.phoneNumber,
      gameMoney: current.gameMoney,
      toCall: callAmount,
    });

    this.chat.sendMessage(newMessage, {
      mentions: this.getMentions(),
    });
  }

  putBlinds() {
    this.pot.mainPot += constants.SMALL_BLIND + constants.BIG_BLIND;
    this.pot.currentBet = constants.BIG_BLIND;

    this.order.next();
    let current = this.order.currentPlayer;

    while (current.gameMoney == 0) {
      current = current.nextPlayer;

      if (current.gameMoney <= constants.SMALL_BLIND) {
        current.isAllIn = true;
      }
    }

    current.gameMoney -= constants.SMALL_BLIND;
    current.currentBet = constants.SMALL_BLIND;
    current = current.nextPlayer;

    while (current.gameMoney == 0) {
      current = current.nextPlayer;

      if (current.gameMoney <= constants.BIG_BLIND) {
        current.isAllIn = true;
      }
    }

    current.gameMoney -= constants.BIG_BLIND;
    current.currentBet = constants.BIG_BLIND;

    this.order.currentPlayer = current.nextPlayer;
  }

  updateRound(whatsapp, actionMessage) {
    let current = this.order.currentPlayer;
    let next = current.nextPlayer;
    let playerCount = Object.keys(this.players).length;
    let allInCount = this.pot.allIns.length;

    // Everybody folded except one player
    if (this.folds + 1 == playerCount) {
      this.foldsScenario(whatsapp);
    }
    // More then one player is all in and everybody else folded
    else if (
      allInCount + this.folds == playerCount ||
      (allInCount == playerCount - this.folds - 1 &&
        next.currentBet == this.pot.currentBet)
    ) {
      this.AllInScenario(actionMessage, whatsapp);
    }
    // Next player is all in or folded (there for action should be passed to the next player)
    else if (next.isAllIn || next.isFolded) {
      this.order.next();
      this.updateRound(whatsapp, actionMessage);
    }
    // All the player in the pot called the highest bet (or either checked, folded, or all in)
    else if (next.isPlayed && next.currentBet == this.pot.currentBet) {
      this.moveRound(whatsapp, actionMessage);
    }
    // Next player didn't played or called the highest bet yet
    else {
      current.isPlayed = true;
      this.moveAction(actionMessage);
    }
  }

  moveRound(whatsapp, actionMessage) {
    switch (this.communityCards.length) {
      // Flop
      case 0:
        this.communityCards.push(...this.deck.splice(-3));
        this.resetRoundStatus(actionMessage);
        break;
      // Turn / River
      case 3:
      case 4:
        this.communityCards.push(this.deck.pop());
        this.resetRoundStatus(actionMessage);
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
        current.handScore = { str: undefined, cards: [] };
        current.gameMoney += current.rebuy;
        current.rebuy = 0;

        if (current.gameMoney == 0) {
          current.isFolded = true;
        } else {
          current.isFolded = false;
        }
      }

      current.currentBet = 0;
      current.isPlayed = false;
      current = current.nextPlayer;
    } while (!current.isButton);
  }

  resetRoundStatus(actionMessage = ' ') {
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
    let template = `*Pot*: \${{pot}}\n\n`;

    if (actionMessage != ' ') {
      template += actionMessage;
    }
    template += `\n\n*Community Cards:*
{{communityCards}}\n
Action on @{{phoneNumber}} (\${{gameMoney}})`;

    let callAmount = this.pot.currentBet - current.currentBet;

    if (callAmount != 0) {
      if (callAmount < current.gameMoney) {
        template += `\n\n\${{toCall}} to call`;
      } else {
        template += `\n\nAll in to call`;
      }
    }

    let newMessage = Mustache.render(template, {
      communityCards: cardsFunctions.printCards(this.communityCards),
      phoneNumber: current.phoneNumber,
      gameMoney: current.gameMoney,
      pot: this.pot.mainPot,
      toCall: callAmount,
    });

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

  async AllInScenario(actionMessage, whatsapp) {
    setLock(true);
    let newMessage = `*Pot:* $${this.pot.mainPot}\n\n${actionMessage}\n\n`;
    Object.values(this.players).forEach((player) => {
      if (!player.isFolded) {
        newMessage += `${cardsFunctions.formatHand(
          player.phoneNumber,
          player.holeCards,
        )}`;
      }
    });
    if (this.communityCards.length != 0) {
      newMessage += `\n*Community Cards:*\n${cardsFunctions.printCards(
        this.communityCards,
      )}`;
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
  }

  foldsScenario(whatsapp) {
    let current = this.order.currentPlayer;

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

  endGame(lastRoundMessage = '') {
    this.isMidRound = false;

    this.jumpToButton();
    let current = this.order.currentPlayer;

    do {
      current.sessionBalance += current.gameMoney;
      current.money += current.gameMoney;
      current.gameMoney = 0;

      current = current.nextPlayer;
    } while (!current.isButton);

    let index = 1;
    if (lastRoundMessage) {
      lastRoundMessage += '\n';
    }

    let template = `${lastRoundMessage}🎰 *The game has ended!* 🎰\n
*Player  |  Balance  |  Money*{{#players}}\n{{index}}. @{{name}}I  *{{balance}}*  I  \${{money}}{{/players}}`;

    let players = Object.values(this.players);
    players.sort((a, b) => b.sessionBalance - a.sessionBalance);

    players = players.map((player) => ({
      index: index++,
      name: player.phoneNumber,
      money: player.money,
      balance:
        player.sessionBalance >= 0
          ? `+$${player.sessionBalance}🟢`
          : `-$${player.sessionBalance * -1}🔴`,
    }));
    let newMessage = Mustache.render(template, { players });
    this.chat.sendMessage(newMessage, { mentions: this.getMentions() });

    // Reset the session balance incase new game is starting (consider removing)
    this.jumpToButton();
    current = this.order.currentPlayer;

    do {
      current.sessionBalance = 0;
      current = current.nextPlayer;
    } while (!current.isButton);
  }

  getPlayerUTG() {
    let current = this.order.currentPlayer;
    while (!current.isButton) {
      current = current.nextPlayer;
    }

    let playerCount = Object.keys(this.players).length;
    if (playerCount == 2) {
      // After preflop
      if (this.communityCards.length != 0) {
        current = current.nextPlayer; // SB
      }
    } else {
      // Preflop
      if (this.communityCards.length == 0) {
        current = current.nextPlayer; // SB
        current = current.nextPlayer; // BB
        current = current.nextPlayer; // UTG
      }
      // After preflop
      else {
        current = current.nextPlayer; // SB
      }
    }
    return current;
  }
}

module.exports = Game;
