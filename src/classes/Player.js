/**
 * @param {String} name name of player
 * @param {String} id phone number of player
 * @param {Array} holeCards of the form [cardSuit, cardNumber],[cardSuit, cardNumber]
 * @param {Array} handScore Array of the form [cardSuit, cardNumber]*5
 * @param {int} money of player
 * //// to be continued
 *
 */

class Player {
  constructor(id, phoneNumber) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.holeCards = [];
    this.money = 1000;
    this.gameMoney = 0;
    this.currentBet = 0;
    this.isAllIn = false;
    this.isFolded = false;
    this.isButton = false;
    this.isPlayed = false;

    /** @param {int} str representing the strength of the hand 0-9 mentioned in  constants
     * @param {Array}  cards of cards consistings of 5 cards
     * @example handScore = {str: 1, cards: [["♦️", "1"], ["♦️", "J"], ["♣️", "K"], ["♥️", "A"], ["♠️", "7"]]}*/
    this.handScore = { str: undefined, cards: [] };
  }
  getHandScore() {
    return this.handScore;
  }
  setHandScore(newScore) {
    this.handScore = newScore;
  }
  getName() {
    return this.name;
  }

  setName(newName) {
    this.name = newName;
  }

  getPhoneNumber() {
    return this.id;
  }

  setPhoneNumber(newNumber) {
    this.id = newNumber;
  }

  getHoleCards() {
    return this.holeCards;
  }

  setHoleCards(card1, card2) {
    this.holeCards.push(card1);
    this.holeCards.push(card2);
  }

  resetHoleCards() {
    this.holeCards = [];
  }

  getMoney() {
    return this.money;
  }

  setMoney(newMoney) {
    this.money = newMoney;
  }

  betMoney(amount) {
    if (amount > this.money) {
      MessageChannel.reply(
        `Insufficient funds, you got more ${this.money} chips`,
      );
      return;
    }

    this.money -= amount;
    this.currentBet += amount;
    return amount;
  }

  resetBet() {
    this.currentBet = 0;
  }

  getCurrentBet() {
    return this.currentBet;
  }

  setCurrentBet(newBet) {
    this.currentBet = newBet;
  }
}

module.exports = Player;
