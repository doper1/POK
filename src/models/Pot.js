const potRepo = require('../repositories/potRepo.js');
const participantRepo = require('../repositories/participantRepo.js');

class Pot {
  constructor(pot) {
    this.id = pot.id;
    this.gameId = pot.gameId;
    this.value = pot.value;
    this.highestBet = pot.highestBet;
  }

  static async create(gameId, value = 0, highestBet = 0) {
    let pot = await potRepo.createPot(gameId, value, highestBet);
    return new Pot(pot);
  }

  static async get(potId) {
    let pot = await potRepo.getPot(potId);

    if (pot == undefined) return undefined;
    return new Pot(pot);
  }

  async set(property, value) {
    this[property] = value;
    await potRepo.updatePot(this.id, property, value);
  }

  async addParticipant(userId) {
    await participantRepo.createParticipant(this.id, userId);
  }

  async getParticipants() {
    return await potRepo.getParticipants(this.id);
  }

  static async resetPotsBets(mainPotId, pots) {
    let promises = [];

    for (const pot of pots) {
      if (pot.id == mainPotId) {
        promises.push(potRepo.updatePot(mainPotId, 'highestBet', 0));
      } else {
        promises.push(potRepo.updatePot(pot.id, 'currentBet', -1));
      }
    }

    await Promise.all(promises);
  }
}

module.exports = Pot;
