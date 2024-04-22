/**
 * @param {String} name name of player
 * @param {String} phone_number phone number of player
 * @param {Array} hole_cards of the form [card_suit, card_number],[card_suit, card_number]
 * @param {Array} hand_score Array of the form [card_suit, card_number]*5
 * @param {int} money of player
 * //// to be continued
 *
 */

class Player {
  constructor(name, phone_number) {
    this.name = name;
    this.phone_number = phone_number;
    this.hole_cards = [];
    /**
     * @param {int} str representing the strength of the hand 0-9 mentioned in  constants
     * @param {Array}  cards of cards consistings of 5 cards
     * @card Array of the form [card_suit, card_number]
     *
     * @example hand_score = {str: 1, cards: [["♦️", "1"], ["♦️", "J"], ["♣️", "K"], ["♥️", "A"], ["♠️", "7"]]}
     * @note
     * note that the cards of hand_score are consistings of the best possible layout of hole_cards and Community Cards in regular/chap
     * in omaha, includes hand_score includes hole_cards
     */
    this.hand_score = { str: undefined, cards: [] };
    this.money = 1000;
    this.game_money = 0;
    this.currentBet = 0;
    this.is_all_in = false;
    this.is_folded = false;
    this.is_button = false;
  }
  getHandScore() {
    return this.hand_score;
  }
  setHandScore(newScore) {
    this.hand_score = newScore;
  }
  getName() {
    return this.name;
  }

  setName(newName) {
    this.name = newName;
  }

  getPhoneNumber() {
    return this.phone_number;
  }

  setPhoneNumber(newNumber) {
    this.phone_number = newNumber;
  }

  getHoleCards() {
    return this.hole_cards;
  }

  setHoleCards(card_1, card_2) {
    this.hole_cards.push(card_1);
    this.hole_cards.push(card_2);
  }

  resetHoleCards() {
    this.hole_cards = [];
  }

  getFinalHand() {
    return this.final_hand;
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
        `Insufficient funds, you got more ${this.money} chips`
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
