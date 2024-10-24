const Mustache = require('mustache');
const constants = require('../utils/constants.js');
const { rand, shuffleArray, delay } = require('../utils/generalFunctions.js');
const cardsFunctions = require('../utils/cardsFunctions.js');
const gameFunctions = require('../utils/gameFunctions.js');
const Pot = require('./Pot.js');
const Player = require('./Player.js');
const gameRepo = require('../repositories/gameRepo.js');
const playerRepo = require('../repositories/playerRepo.js');
const potRepo = require('../repositories/potRepo.js');

class Game {
  constructor(game) {
    this.id = game.id;
    this.groupName = game.groupName;
    this.type = game.type;
    this.status = game.status;
    this.currentPlayer = game.currentPlayer;
    this.button = game.button;
    this.deck = game.deck;
    this.communityCards = game.communityCards;
    this.mainPot = game.mainPot;
    this.lastRoundPot = game.lastRoundPot;
    this.lock = game.lock;
  }

  static async create(chatId, groupName) {
    let game = await gameRepo.createGame(chatId, groupName);
    return new Game(game);
  }
  static async get(chatId) {
    let game = await gameRepo.getGame(chatId);

    if (game == undefined) return undefined;
    return new Game(game);
  }

  async set(property, value) {
    this[property] = value;
    await gameRepo.updateGame(this.id, property, value);
  }

  async getPlayer(id) {
    return await Player.get(this.id, id);
  }

  async getPreviousPlayer(id) {
    const previousPlayer = await playerRepo.getPreviousPlayer(this.id, id);
    return new Player(previousPlayer);
  }

  async addPlayer(id) {
    return await Player.create(this.id, id);
  }

  async addPlayerMidGame(userId) {
    await gameRepo.addPlayerMidGame(this.id, userId);
  }

  async getPlayers() {
    return await gameRepo.getPlayers(this.id);
  }

  async getPlayersWithMoney() {
    return await gameRepo.getPlayersWithMoney(this.id);
  }

  async getPots() {
    return await gameRepo.getPots(this.id);
  }

  async deletePots() {
    await this.set('mainPot', null);
    let pots = await this.getPots();
    let promises = [];

    for (const pot of pots) {
      promises.push(potRepo.deleteParticipants(pot.id));
    }

    await Promise.all(promises);
    await gameRepo.deletePots(this.id);
  }

  async getUsers() {
    return await gameRepo.getUsers(this.id);
  }

  async getMentions() {
    return (await this.getPlayers()).map((player) => `${player.userId}@c.us`);
  }

  async addCommunityCards(amount) {
    this.communityCards = this.communityCards.concat(
      this.deck.splice(0, amount),
    );
    await gameRepo.addCommunityCards(this.id, amount);
  }

  async getPlayersPretty() {
    let index = 1;
    let players = (await this.getPlayersWithMoney()).map((player) => ({
      index: index++,
      name: player.userId,
      stack: player.gameMoney,
      money: player.money,
    }));

    let template = `*Players  |  Stack  |   Money*{{#players}}\n{{index}}. @{{name}}I \${{stack}} I \${{money}}{{/players}}`;
    return Mustache.render(template, { players });
  }

  async getOrderPretty() {
    let orderString = '';
    let players = {};

    (await this.getPlayers()).forEach(
      (player) => (players[player.userId] = player),
    );

    let current = await this.getFirstPlayer(players);
    let firstPlayerId = current.userId;
    let i = 1;

    do {
      if (current.status === 'no money') {
        current = players[current.nextPlayer];
        continue;
      }

      orderString += '\n';

      if (current.userId === this.currentPlayer) {
        orderString += `_*`;
      } else if (current.status === 'folded') {
        orderString += `~`;
      }

      orderString += `${i++}.@${current.userId}I $${current.currentBet} I $${
        current.gameMoney
      }`;

      if (current.userId === this.button) {
        orderString += 'I⚪';
      }
      if (current.status === 'all in') {
        orderString += 'I🔴';
      }

      if (current.userId === this.currentPlayer) {
        orderString += `*_`;
      } else if (current.status === 'folded') {
        orderString += `~`;
      }

      current = players[current.nextPlayer];
    } while (current.userId != firstPlayerId);

    let template = `*Pot:* \${{mainPot}}\n
*Playing Order  |  Bet  |  Stack* {{orderString}}`;

    return [
      await cardsFunctions.getCards(this.communityCards),
      Mustache.render(template, {
        mainPot: (await Pot.get(this.mainPot)).value,
        orderString: orderString,
      }),
    ];
  }

  async resetGameStatus() {
    await this.deletePots();
    let pot = await Pot.create(this.id);
    await this.set('mainPot', pot.id);
    await this.set(
      'deck',
      shuffleArray(constants.DECK.map((card) => [...card])),
    );
    await this.set('communityCards', []);
    await this.set('lastRoundPot', 0);
    await this.resetPlayersStatus(true);
  }

  async dealCards(whatsapp, players) {
    for (const player of players) {
      if (player.status === 'folded') continue;

      let holeCards = [...this.deck.splice(-2)];
      await playerRepo.updatePlayer(
        this.id,
        player.userId,
        'holeCards',
        holeCards,
      );

      const newCards = await cardsFunctions.getCards(holeCards);

      whatsapp.sendMessage(`${player.userId}@c.us`, newCards, {
        caption: `*${this.groupName}*`,
      });
    }
  }

  async endCondition(players) {
    return (
      this.status === 'to end' ||
      players.filter((player) => player.gameMoney > 0).length <= 1
    );
  }

  async initRound(whatsapp, lastRoundMessage, newCards = false) {
    await this.resetGameStatus();
    let players = await this.getPlayers();

    if (await this.endCondition(players)) {
      await this.endGame(whatsapp, lastRoundMessage, newCards);
      return;
    }

    // Move button and set SB
    let button = await this.moveButton();
    await this.set('currentPlayer', button.userId);
    await this.moveCurrentPlayer();

    let playersCount = players.filter(
      (player) => player.status !== 'folded',
    ).length;

    if (playersCount === 2) {
      await this.moveCurrentPlayer(); // In heads up game the button is also the Small blind
    }

    let bigBlind = await this.putBlinds();
    let utg = await this.getPlayer(bigBlind.nextPlayer); // Under the Gun

    while (utg.status === 'folded') {
      utg = await this.getPlayer(utg.nextPlayer);
    }

    await this.set('currentPlayer', utg.userId);
    await this.dealCards(whatsapp, players);

    let template = `{{lastRoundMessage}}\n
{{order}}\n
Check your DM for your cards 🤫\n
Action on @{{id}} (\${{money}})`;

    let callAmount = (await Pot.get(this.mainPot)).highestBet - utg.currentBet;

    if (callAmount != 0) {
      if (callAmount < utg.gameMoney) {
        template += `\n\n\${{toCall}} to call`;
      } else {
        template += `\n\nAll in to call`;
      }
    }
    let order = await this.getOrderPretty();

    let newMessage = Mustache.render(template, {
      lastRoundMessage,
      order: order[1],
      id: utg.userId,
      money: utg.gameMoney,
      toCall: callAmount,
    });

    if (newCards) {
      whatsapp.sendMessage(`${this.id}@g.us`, newCards, {
        caption: newMessage,
        mentions: await this.getMentions(),
      });
    } else {
      whatsapp.sendMessage(`${this.id}@g.us`, newMessage, {
        mentions: await this.getMentions(),
      });
    }
  }

  async generateOrder() {
    let players = await this.getPlayers();
    let buttonPlayer = players.splice(rand(players.length), 1)[0];
    await this.set('button', buttonPlayer.userId);
    let currentPlayer = await this.getPlayer(this.button);

    while (players.length > 0) {
      let nextPlayer = players.splice(rand(players.length), 1)[0];
      await currentPlayer.set('nextPlayer', nextPlayer.userId);
      currentPlayer = await this.getPlayer(nextPlayer.userId);
    }

    await currentPlayer.set('nextPlayer', this.button);
  }

  async moveButton() {
    let button = await this.getPlayer(this.button);
    let nextButton = await this.getPlayer(button.nextPlayer);

    while (nextButton.status === 'folded') {
      nextButton = await this.getPlayer(nextButton.nextPlayer);
    }

    await this.set('button', nextButton.userId);
    return await this.getPlayer(this.button);
  }

  async getNextCurrent(current) {
    let nextCurrent = await this.getPlayer(current.nextPlayer);

    while (
      nextCurrent.status === 'all in' ||
      nextCurrent.status === 'folded' ||
      nextCurrent.status === 'no money'
    ) {
      nextCurrent = await this.getPlayer(nextCurrent.nextPlayer);
    }

    return nextCurrent;
  }

  async moveCurrentPlayer() {
    let nextCurrent = await this.getNextCurrent(
      await this.getPlayer(this.currentPlayer),
    );
    await this.set('currentPlayer', nextCurrent.userId);
    return await this.getPlayer(this.currentPlayer);
  }

  async moveAction(whatsapp, actionMessage, mainPot) {
    let current = await this.moveCurrentPlayer();

    let template = `*Pot*: \${{mainPot}}\n
{{actionMessage}}\n
Action on @{{id}} (\${{money}})`;

    let callAmount = mainPot.highestBet - current.currentBet;

    if (callAmount != 0) {
      if (callAmount < current.gameMoney) {
        template += `\n\n\${{toCall}} to call`;
      } else {
        template += `\n\nAll in to call`;
      }
    }

    const newMessage = Mustache.render(template, {
      mainPot: mainPot.value,
      actionMessage,
      id: current.userId,
      money: current.gameMoney,
      toCall: callAmount,
    });

    whatsapp.sendMessage(`${this.id}@g.us`, newMessage, {
      mentions: await this.getMentions(),
    });
  }

  async putBlind(current, blindAmount) {
    if (current.gameMoney <= blindAmount) {
      await current.set('status', 'all in');
      await current.bet(current.gameMoney, this.mainPot);
    } else {
      await current.bet(blindAmount, this.mainPot);
    }

    return current;
  }

  async putBlinds() {
    let smallBlind = await this.putBlind(
      await this.getPlayer(this.currentPlayer),
      constants.SMALL_BLIND,
    );

    // Skips [small/big] blind candidate players until there is a player with in-game money
    let current = await this.getNextCurrent(smallBlind);

    let bigBlind = await this.putBlind(current, constants.BIG_BLIND);

    return bigBlind;
  }

  async updateRound(whatsapp, actionMessage) {
    let players = await this.getPlayers();
    let current = await this.getPlayer(this.currentPlayer);
    let next = await this.getPlayer(current.nextPlayer);
    let pots = await this.getPots();
    let mainPot = pots.find((pot) => pot.id === this.mainPot);
    let foldsCount = players.reduce((folds, player) => {
      if (player.status === 'folded') {
        return folds + 1;
      } else {
        return folds;
      }
    }, 0);

    // Everybody folded except one player
    if (foldsCount + 1 == players.length) {
      await this.foldsScenario(whatsapp, current, mainPot);
    }
    // More then one player is all in and everybody else folded
    else if (
      pots.length + foldsCount === players.length + 1 ||
      (pots.length + foldsCount === players.length &&
        next.currentBet === mainPot.highestBet)
    ) {
      await this.AllInScenario(actionMessage, whatsapp, mainPot, players);
    }
    // Next player is all-in, folded, or joined mid round (there for action should be passed to the next player)
    else if (
      next.status === 'all in' ||
      next.status === 'folded' ||
      next.status === 'no money'
    ) {
      await this.set('currentPlayer', next.userId);
      await this.updateRound(whatsapp, actionMessage);
    }
    // All the player in the pot called the highest bet (or either checked, folded, or all in)
    else if (
      next.status === 'played' &&
      next.currentBet === mainPot.highestBet
    ) {
      await this.moveRound(whatsapp, actionMessage);
    }
    // Next player didn't played or called the highest bet yet
    else {
      await this.moveAction(whatsapp, actionMessage, mainPot);
    }
  }

  async moveRound(whatsapp, actionMessage) {
    switch (this.communityCards.length) {
      // Flop
      case 0:
        await this.addCommunityCards(3);
        await this.resetRoundStatus(whatsapp, actionMessage);
        break;
      // Turn / River
      case 3:
      case 4:
        await this.addCommunityCards(1);
        await this.resetRoundStatus(whatsapp, actionMessage);
        break;
      // Showdown
      case 5:
        let { endMessage, newCards } = await gameFunctions.showdown(this);
        await this.initRound(whatsapp, endMessage, newCards);
        break;
    }
  }

  async rushRound(message, whatsapp, body) {
    const editMessage = async (message) => {
      let newMessage = body.replace(/\n.*$/, '').trim();
      newMessage += `\n${cardsFunctions.printCards(this.communityCards)}`;
      await message.edit(newMessage, { mentions: await this.getMentions() });

      return message;
    };

    switch (this.communityCards.length) {
      // Flop
      case 0:
        await delay(3000);
        await this.addCommunityCards(3);
        message = await editMessage(message);
        break;
      // Turn / River
      case 3:
      case 4:
        await delay(5000);
        await this.addCommunityCards(1);
        message = await editMessage(message);
        break;
      default:
        return;
    }

    await this.rushRound(message, whatsapp, body);
  }

  async resetPlayersStatus(isNewHand = false) {
    let players = await gameRepo.getPlayers(this.id);

    for (let player of players) {
      player = await this.getPlayer(player.userId);
      await player.set('currentBet', 0);
      await player.set(
        'status',
        player.status === 'played' ? 'pending' : player.status,
      );

      if (isNewHand) {
        await player.buyIn();
        await player.set(
          'status',
          player.gameMoney == 0 ? 'no money' : 'pending',
        );
      }
    }
  }

  async resetRoundStatus(whatsapp, actionMessage = ' ') {
    let pot = await Pot.get(this.mainPot);
    await this.set('lastRoundPot', pot.value);

    await Pot.resetPotsBets(this.mainPot, await this.getPots());
    await this.resetPlayersStatus(false);
    let current = await this.getFirstPlayer();

    while (current.status == 'all in' || current.status == 'folded') {
      current = await this.getPlayer(current.nextPlayer);
    }
    await this.set('currentPlayer', current.userId);

    let template = `*Pot*: \${{pot}}\n\n`;

    if (actionMessage != ' ') {
      template += actionMessage;
    }

    template += `\n\nAction on @{{id}} (\${{money}})`;

    const newCards = await cardsFunctions.getCards(this.communityCards);

    let newMessage = Mustache.render(template, {
      id: current.userId,
      money: current.gameMoney,
      pot: pot.value,
    });

    await whatsapp.sendMessage(`${this.id}@g.us`, newCards, {
      caption: newMessage,
      mentions: await this.getMentions(),
    });
  }

  async AllInScenario(actionMessage, whatsapp, mainPot, players) {
    let newMessage = `*Pot:* $${mainPot.value}\n\n${actionMessage}\n\n`;

    players.forEach((player) => {
      if (player.status !== 'folded') {
        newMessage += `${cardsFunctions.formatHand(
          player.userId,
          player.holeCards,
        )}`;
      }
    });

    if (this.communityCards.length) {
      newMessage += `\n*Community Cards:*\n${cardsFunctions.printCards(
        this.communityCards,
      )}`;
    } else {
      newMessage += '\n*Community Cards:*\n-';
    }

    let message = await whatsapp.sendMessage(`${this.id}@g.us`, newMessage, {
      mentions: await this.getMentions(),
    });

    await this.rushRound(message, whatsapp, newMessage);
    await delay(1000);
    let { endMessage, newCards } = await gameFunctions.showdown(this);
    await this.set('status', 'running');
    await this.initRound(whatsapp, endMessage, newCards);
  }

  async foldsScenario(whatsapp, current, mainPot) {
    while (current.status === 'folded') {
      current = await this.getPlayer(current.nextPlayer);
    }

    await current.set('gameMoney', current.gameMoney + mainPot.value);
    await this.initRound(
      whatsapp,
      `Congrats! @${current.userId} Won $${mainPot.value}!
${constants.SEPARATOR}`,
    );
  }

  async endGame(whatsapp, lastRoundMessage = '', newCards = false) {
    let current = await this.getPlayer(this.button);

    do {
      await current.checkout();
      current = await this.getPlayer(current.nextPlayer);
    } while (current.userId !== this.button);

    let index = 1;
    if (lastRoundMessage) {
      lastRoundMessage += '\n';
    }

    let template = `${lastRoundMessage}🎰 *The game has ended!* 🎰\n
*Player  |  Balance  |  Money*{{#players}}\n{{index}}. @{{id}}I  *{{balance}}*  I  \${{money}}{{/players}}`;

    let players = await this.getPlayersWithMoney();
    players.sort((a, b) => b.sessionBalance - a.sessionBalance);

    players = players.map((player) => ({
      index: index++,
      id: player.userId,
      money: player.money,
      balance:
        player.sessionBalance >= 0
          ? `+$${player.sessionBalance}🟢`
          : `-$${player.sessionBalance * -1}🔻`,
    }));
    let newMessage = Mustache.render(template, { players });

    if (newCards) {
      await whatsapp.sendMessage(`${this.id}@g.us`, newCards, {
        caption: newMessage,
        mentions: await this.getMentions(),
      });
    } else {
      await whatsapp.sendMessage(`${this.id}@g.us`, newMessage, {
        mentions: await this.getMentions(),
      });
    }

    // Resets the status in-case new game starts
    current = await this.getPlayer(this.button);

    do {
      let next = current.nextPlayer;
      await current.set('nextPlayer', null);
      await current.set('gameMoney', 0);
      await current.set('currentBet', 0);
      await current.set('status', 'pending');
      await current.set('reBuy', 0);
      await current.set('holeCards', []);
      await current.set('sessionBalance', 0);
      current = await this.getPlayer(next);
    } while (current.userId !== this.button);

    // Reset game status
    await this.set('status', 'pending');
    await this.set('currentPlayer', null);
    await this.set('button', null);
    await this.set('deck', []);
    await this.set('communityCards', []);
    await this.set('lastRoundPot', 0);
  }

  async getFirstPlayer(players = {}) {
    if (!Object.keys(players).length) {
      (await this.getPlayers()).forEach(
        (player) => (players[player.userId] = player),
      );
    }

    let current = players[this.button]; // Button

    if (Object.keys(players).length === 2) {
      if (this.communityCards.length) {
        current = players[current.nextPlayer]; // BB
      }
    } else if (!this.communityCards.length) {
      current = players[current.nextPlayer]; // SB
      current = players[current.nextPlayer]; // BB
      current = players[current.nextPlayer]; // UTG
    } else {
      current = players[current.nextPlayer]; // SB
    }

    return current;
  }

  async removePlayer(id) {
    let player = await this.getPlayer(id);
    await player.checkout();

    // Skip in-case the player left before the game started
    if (!player.nextPlayer) {
      await playerRepo.deletePlayer(this.id, id);
      return;
    }

    let previousPlayer = await this.getPreviousPlayer(id);
    await previousPlayer.set('nextPlayer', player.nextPlayer);

    await playerRepo.deletePlayer(this.id, id);
  }

  async addAllInPot(highestBet) {
    let pot = await Pot.create(this.id, this.lastRoundPot, highestBet);
    let players = await this.getPlayers();
    let promises = [];
    let amount = 0;

    for (const player of players) {
      if (player.currentBet >= highestBet) {
        amount += highestBet;
        promises.push(pot.addParticipant(player.userId));
      } else {
        amount += player.currentBet;
      }
    }

    await pot.set('value', pot.value + amount);
    await Promise.all(promises);
  }
}

module.exports = Game;
