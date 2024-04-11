class Player {
  constructor(name, phone_number) {
    this.name = name;
    this.phone_number = phone_number;
    this.hole_cards = [];
    this.hand_score = "";
    this.money = 1000;
    this.game_money = 0;
    this.currentBet = 0;
    this.all_in = false;
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

  createFinalHand(community_cards) {
    console.log("TO DO"); // Write a function to Caclulate the best hand after a round ends, then save it for each player with this one
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
