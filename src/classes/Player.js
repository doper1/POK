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
    this.rebuy = 0;
    this.sessionBalance = 0;

    /** @param {int} str representing the strength of the hand 0-9 mentioned in  constants
     * @param {Array}  cards of cards consistings of 5 cards
     * @example handScore = {str: 1, cards: [["♦️", "1"], ["♦️", "J"], ["♣️", "K"], ["♥️", "A"], ["♠️", "7"]]}*/
    this.handScore = { str: undefined, cards: [] };
  }

  setHoleCards(card1, card2) {
    this.holeCards.push(card1);
    this.holeCards.push(card2);
  }

  queueReBuy(amount) {
    this.rebuy = amount;
  }
}

module.exports = Player;
