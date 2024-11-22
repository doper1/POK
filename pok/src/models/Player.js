const playerRepo = require('../repositories/playerRepo.js');

class Player {
  constructor(player) {
    this.gameId = player.gameId;
    this.userId = player.userId;
    this.gameMoney = player.gameMoney;
    this.currentBet = player.currentBet;
    this.status = player.status;
    this.reBuy = player.reBuy;
    this.sessionBalance = player.sessionBalance;
    this.holeCards = player.holeCards;
    this.nextPlayer = player.nextPlayer;
  }

  static async create(gameId, userId) {
    let player = await playerRepo.createPlayer(gameId, userId);
    return new Player(player);
  }

  static async get(gameId, userId) {
    let player = await playerRepo.getPlayer(gameId, userId);

    if (player == undefined) return undefined;
    return new Player(player);
  }

  async set(property, value) {
    this[property] = value;
    await playerRepo.updatePlayer(this.gameId, this.userId, property, value);
  }

  async buy(amount, gameStatus) {
    if (gameStatus === 'pending') {
      await playerRepo.buyPreGame(this.gameId, this.userId, amount);
    } else {
      await playerRepo.buyInGame(this.gameId, this.userId, amount);
    }
  }
  async bet(amount, potId) {
    await playerRepo.bet(this.gameId, this.userId, amount, potId);
    this.currentBet += amount;
    this.gameMoney -= amount;
  }

  async checkout() {
    this.sessionBalance += this.gameMoney;
    await playerRepo.checkout(this.gameId, this.userId, this.gameMoney);
    this.gameMoney = 0;
  }

  async buyIn() {
    this.gameMoney += this.reBuy;
    await playerRepo.reBuy(this.gameId, this.userId);
    this.reBuy = 0;
  }
}

module.exports = Player;
