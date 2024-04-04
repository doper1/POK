let general_functions = require("../scripts/general_functions");
let Player = require("./Player");

class Game {
  constructor(id) {
    this.id = id;
    this.players = []; // arr player --> to linkedlist
    this.pot = 0;
    this.deck = general_functions.shuffleArray(general_functions.createDeck()); //deck
    this.type = 1; // for oma chap or more // 1,2,3
    this.burned = [];
    this.CommunityCards = [];
  }
  getPlayers() {
    return this.players;
  }
  setPlayers(newPlayers) {
    this.players = newPlayers;
  }

  initRound() {
    this.deck = general_functions.shuffleArray(general_functions.createDeck()); // new deck
    for (let i = 0; i < this.players.length; i++) players[i].setHoleCards([]);
  }

  addPlayer(name, phone_number) {
    let player = new Player(name, phone_number);
    this.players.push(player);
  }

  getlayers() {
    return this.players;
  }

  setType() {
    this.type = this.type; // for oma chap or more
  }
}

module.exports = Game;
