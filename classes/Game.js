let general_functions = require("../scripts/general_functions");
let game_functions = require("../scripts/game_functions");
let Player = require("./Player");
const LinkedList = require("./LinkedList");

class Game {
  constructor(id) {
    this.id = id;
    this.players = []; // arr player --> to linkedlist
    this.pot = 0;
    this.deck = general_functions.shuffleArray(general_functions.createDeck()); //deck
    this.type = 1; // for oma chap or more // 1,2,3
    this.burned = [];
    this.CommunityCards = [];
    this.midround = false;
  }

  getCommunityCards() {
    return this.CommunityCards;
  }
  getPlayers() {
    return this.players;
  }
  setPlayers(newPlayers) {
    this.players = newPlayers;
  }

  initRound(whatsapp, chat_name) {
    this.players = general_functions.shuffleArray(this.players); // shuffle order
    this.deck = general_functions.shuffleArray(general_functions.createDeck()); // new deck
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].setHoleCards(this.deck.pop(), this.deck.pop());
      whatsapp.sendMessage(
        this.players[i].getPhoneNumber(),
        `${chat_name}
-------------
Cards: ${game_functions.print_cards(this.players[i].hole_cards)}
Stack: $${this.players[i].game_money}`
      );
    }
    this.deck.pop();
    this.CommunityCards.push(
      this.deck.pop(),
      this.deck.pop(),
      this.deck.pop(),
      this.deck.pop(),
      this.deck.pop()
    );
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

  getMidround() {
    return this.midround;
  }

  setMidround(newMidround) {
    this.midround = newMidround;
  }
}

module.exports = Game;
