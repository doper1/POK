let general_functions = require("./general_functions");
let Player = require("./player");

class Game {
  constructor(id, pot, type) {
    this.id = id;
    this.players = []; // arr player
    this.pot = pot;

    this.deck = general_functions.shuffleArray(general_functions.createDeck()); //deck

    this.type = type; // for oma chap or more
    this.burned = [];
    this.CommunityCards = [];
    this.midround = true;
  }
  getmidround() {
    return this.midround;
  }
  setmidround(newmidround) {
    this.midround = newmidround;
  }
  flipmidround() {
    this.midround = !this.midround;
  }
  getPlayers() {
    return this.players;
  }
  setPlayers(newPlayers) {
    this.players = newPlayers;
  }

  ResetRound() {
    this.deck = general_functions.shuffleArray(general_functions.createDeck()); // new deck
    for (let i = 0; i < this.players.length; i++)
      this.players[i].setHoleCards([]);
  }
  BurnCard() {
    this.deck.pop();
  }
  initRound() {
    this.ResetRound();
    this.BurnCard();
    this.CommunityCards.push(this.deck.pop());
    this.CommunityCards.push(this.deck.pop());
    this.CommunityCards.push(this.deck.pop());
    for (let i = 0; i < this.players.length; i++)
      this.players[i].setHoleCards(this.deck.pop(), this.deck.pop());
  }

  addPlayer(name, phonenumber) {
    let p = new Player(name, phonenumber);
    this.players.push(p);
  }

  getlayers() {
    return this.players;
  }
}
module.exports = Game;
