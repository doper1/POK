const Mustache = require('mustache');
const constants = require('../utils/constants.js');
const {
  rand,
  shuffleArray,
  delay,
  notifyImagen,
} = require('../utils/generalFunctions.js');
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
    this.smallBlind = game.smallBlind;
    this.bigBlind = game.bigBlind;
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

  async delete() {
    await gameRepo.deleteGame(this.id);
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

  async setBlind(amount, blindType) {
    if (blindType === 'small') {
      await this.set('smallBlind', amount);
    } else {
      await this.set('bigBlind', amount);
    }
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

    let template = `*Players  |  Stack  |   Money*
{{#players}}{{index}}. @{{name}}I \${{stack}} I \${{money}}\n{{/players}}\n
🔹 Small Blind: \${{smallBlind}}
🔸 Big Blind: \${{bigBlind}}`;
    return Mustache.render(template, {
      players,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
    });
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
      if (constants.PLAYER_NOT_AT_THE_TABLE_STATUSES.includes(current.status)) {
        current = players[current.nextPlayer];
        continue;
      }

      orderString += '\n';

      if (current.userId === this.currentPlayer) {
        orderString += `_*`;
      } else if (
        !constants.PLAYER_IN_THE_GAME_STATUSES.includes(current.status)
      ) {
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
        orderString += `*_ 🕙`;
      } else if (
        !constants.PLAYER_IN_THE_GAME_STATUSES.includes(current.status)
      ) {
        orderString += `~`;
      }

      current = players[current.nextPlayer];
    } while (current.userId != firstPlayerId);

    let template = `*Pot:* \${{mainPot}}\n
*Playing Order  |  Bet  |  Stack* {{orderString}}\n
🔹 Small Blind: \${{smallBlind}}
🔸 Big Blind: \${{bigBlind}}`;

    return [
      await cardsFunctions.getCards(this.communityCards),
      Mustache.render(template, {
        mainPot: (await Pot.get(this.mainPot)).value,
        orderString: orderString,
        smallBlind: this.smallBlind,
        bigBlind: this.bigBlind,
      }),
    ];
  }

  async resetGameStatus(isInitial) {
    await this.deletePots();
    let pot = await Pot.create(this.id);
    await this.set('mainPot', pot.id);
    await this.set('communityCards', []);
    await this.set('lastRoundPot', 0);
    await this.resetPlayersStatus(true);

    if (!isInitial) {
      await this.set(
        'deck',
        shuffleArray(constants.DECK.map((card) => [...card])),
      );
    }
  }

  async deal(userId, whatsapp) {
    let holeCards = [...this.deck.splice(0, 2)];

    const [newCards] = await Promise.all([
      cardsFunctions.getCards(holeCards),
      this.set('deck', this.deck),
      playerRepo.updatePlayer(this.id, userId, 'holeCards', holeCards),
    ]);

    whatsapp.sendMessage(`${userId}@c.us`, newCards, {
      caption: `*${this.groupName}*`,
    });
  }

  async dealCards(whatsapp, players) {
    for (const player of players) {
      if (!constants.PLAYER_STILL_PLAYING_STATUSES.includes(player.status))
        continue;

      await this.deal(player.userId, whatsapp);
    }
  }

  async endCondition(players) {
    return (
      this.status === 'to end' ||
      players.filter((player) => player.gameMoney > 0).length <= 1
    );
  }

  async initRound(
    whatsapp,
    lastRoundMessage,
    newCards = false,
    isInitial = false,
  ) {
    await this.resetGameStatus(isInitial && this.deck.length > 0);
    let players = await this.getPlayers();

    if (await this.endCondition(players)) {
      await this.endGame(whatsapp, lastRoundMessage, newCards);
      return;
    }

    // ---- Initiate new hand ----
    let template = `{{lastRoundMessage}}\n
{{order}}\n
I sent you your cards 🤫\n
Action on @{{id}} (\${{money}})`;

    let playersCount = players.filter((player) =>
      constants.PLAYER_STILL_PLAYING_STATUSES.includes(player.status),
    ).length;

    // Move button and set SB
    let button = await this.moveButton();
    let smallBlind = button;

    if (playersCount !== 2) {
      smallBlind = await this.getNextPlayer(button);
    }

    await this.putBlinds(smallBlind);
    let firstPlayer = await this.getFirstPlayer();

    if (!constants.PLAYER_STILL_PLAYING_STATUSES.includes(firstPlayer.status)) {
      firstPlayer = await this.getNextPlayer(firstPlayer);
    }

    const [mainPot] = await Promise.all([
      Pot.get(this.mainPot),
      this.set('currentPlayer', firstPlayer.userId),
      this.dealCards(whatsapp, players),
    ]);

    // Build whatsapp message
    const callAmount = mainPot.highestBet - firstPlayer.currentBet;

    if (callAmount != 0) {
      if (callAmount < firstPlayer.gameMoney) {
        template += `\n\n\${{toCall}} to call`;
      } else {
        template += `\n\nAll in to call`;
      }
    }
    let order = await this.getOrderPretty();

    let newMessage = Mustache.render(template, {
      lastRoundMessage,
      order: order[1],
      id: firstPlayer.userId,
      money: firstPlayer.gameMoney,
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
    const buttonPlayer = players.splice(rand(players.length), 1)[0];

    let [currentPlayer] = await Promise.all([
      this.getPlayer(buttonPlayer.userId),
      this.set('button', buttonPlayer.userId),
    ]);

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

    while (nextButton.status === 'no money') {
      nextButton = await this.getPlayer(nextButton.nextPlayer);
    }

    await this.set('button', nextButton.userId);
    return await this.getPlayer(nextButton.userId);
  }

  async getNextPlayer(current) {
    let nextPlayer = await this.getPlayer(current.nextPlayer);

    while (
      !constants.PLAYER_STILL_PLAYING_STATUSES.includes(nextPlayer.status)
    ) {
      nextPlayer = await this.getPlayer(nextPlayer.nextPlayer);
    }

    return nextPlayer;
  }

  async moveCurrentPlayer() {
    let nextPlayer = await this.getNextPlayer(
      await this.getPlayer(this.currentPlayer),
    );
    await this.set('currentPlayer', nextPlayer.userId);
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
      await Promise.all([
        current.set('status', 'all in'),
        current.bet(current.gameMoney, this.mainPot),
      ]);
    } else {
      await current.bet(blindAmount, this.mainPot);
    }

    return current;
  }

  async putBlinds(current) {
    let smallBlind = await this.putBlind(current, this.smallBlind);

    // Skips [small/big] blind candidate players until there is a player with in-game money
    current = await this.getNextPlayer(smallBlind);

    let bigBlind = await this.putBlind(current, this.bigBlind);

    return bigBlind;
  }

  async updateRound(whatsapp, actionMessage) {
    const [players, current, mainPot] = await Promise.all([
      this.getPlayers(),
      this.getPlayer(this.currentPlayer),
      Pot.get(this.mainPot),
    ]);

    const next = await this.getPlayer(current.nextPlayer);
    let playerCount = players.reduce(
      (count, player) => {
        if (!constants.PLAYER_IN_THE_GAME_STATUSES.includes(player.status)) {
          count.outs += 1;
          return count;
        }

        if (player.status === 'all in') {
          count.allIns += 1;
          return count;
        }

        return count;
      },
      { outs: 0, allIns: 0 },
    );

    // Everybody folded except one player
    if (playerCount.outs + 1 == players.length) {
      await this.foldsScenario(whatsapp, current, mainPot);
      return;
    }

    // More then one player is all in and everybody else folded
    if (
      playerCount.outs + playerCount.allIns === players.length ||
      (playerCount.outs + playerCount.allIns === players.length - 1 &&
        next.currentBet === mainPot.highestBet)
    ) {
      await this.AllInScenario(actionMessage, whatsapp, mainPot, players);
      return;
    }

    // Next player is all-in, folded, or joined mid round (there for action should be passed to the next player)
    if (!constants.PLAYER_STILL_PLAYING_STATUSES.includes(next.status)) {
      await this.set('currentPlayer', next.userId);
      await this.updateRound(whatsapp, actionMessage);
      return;
    }

    // All the player in the pot called the highest bet (or either checked, folded, or all in)
    if (next.status === 'played' && next.currentBet === mainPot.highestBet) {
      await this.moveRound(whatsapp, actionMessage);
      return;
    }

    // Next player didn't played or called the highest bet yet
    await this.moveAction(whatsapp, actionMessage, mainPot);
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

        notifyImagen('start', this.id);
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
    // TODO improve efficiency, maybe separate to different functions
    let players = await gameRepo.getPlayers(this.id);

    for (let player of players) {
      player = await this.getPlayer(player.userId);

      await Promise.all([
        player.set('currentBet', 0),
        player.set(
          'status',
          player.status === 'played' ? 'pending' : player.status,
        ),
      ]);

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

    await Promise.all([
      this.set('lastRoundPot', pot.value),
      Pot.resetPotsBets(this.mainPot, await this.getPots()),
      this.resetPlayersStatus(false),
    ]);

    let current = await this.getFirstPlayer();

    while (!constants.PLAYER_STILL_PLAYING_STATUSES.includes(current.status)) {
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

    whatsapp.sendMessage(`${this.id}@g.us`, newCards, {
      caption: newMessage,
      mentions: await this.getMentions(),
    });
  }

  async AllInScenario(actionMessage, whatsapp, mainPot, players) {
    let newMessage = `*Pot:* $${mainPot.value}\n\n${actionMessage}\n\n`;

    players.forEach((player) => {
      if (constants.PLAYER_IN_THE_GAME_STATUSES.includes(player.status)) {
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
    await this.initRound(whatsapp, endMessage, newCards);

    notifyImagen('start', this.id);
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

    notifyImagen('start', this.id);
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
      whatsapp.sendMessage(`${this.id}@g.us`, newCards, {
        caption: newMessage,
        mentions: await this.getMentions(),
      });
    } else {
      whatsapp.sendMessage(`${this.id}@g.us`, newMessage, {
        mentions: await this.getMentions(),
      });
    }

    // Resets the status in-case new game starts
    current = await this.getPlayer(this.button);

    do {
      let next = current.nextPlayer;
      await Promise.all([
        current.set('sessionBalance', 0),
        current.set('holeCards', []),
        current.set('reBuy', 0),
        current.set('reBuy', 0),
        current.set('nextPlayer', null),
        current.set('gameMoney', 0),
        current.set('currentBet', 0),
        current.set('status', 'pending'),
      ]);

      current = await this.getPlayer(next);
    } while (current.userId !== this.button);

    // Reset game status
    await Promise.all([
      this.set('status', 'pending'),
      this.set('currentPlayer', null),
      this.set('button', null),
      this.set('deck', []),
      this.set('communityCards', []),
      this.set('lastRoundPot', 0),
    ]);
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

    if (player.userId === this.button) {
      await this.set('button', player.nextPlayer);
    }

    if (player.userId === this.currentPlayer) {
      await this.set('currentPlayer', player.nextPlayer);
    }

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
