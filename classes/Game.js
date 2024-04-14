let constants = require("../constants");

// Scripts
let general_functions = require("../scripts/general_functions");
let game_functions = require("../scripts/game_functions");

// Classes
let Player = require("./Player");
let { LinkedList } = require("./LinkedList");

class Game {
  constructor(id) {
    this.id = id;
    this.players = {};
    this.order = new LinkedList();
    this.pot = 0;
    this.deck = [];
    this.type = 1; // for Omaha chap or more // 1,2,3
    this.burned = [];
    this.community_cards = [];
    this.is_midround = false;
  }

  addPlayer(name, phone_number) {
    let player = new Player(name, phone_number);
    this.players[phone_number] = player;
  }

  getPlayers() {
    return this.players;
  }

  getPlayersPretty() {
    let index = 1;
    let players_string = "";
    for (let value of Object.values(this.players)) {
      players_string += `\n${index++}. ${value.name}`;
    }
    return `Players:\n---------${players_string}`;
  }

  getOrderPretty() {
    let current = this.order.head;
    let to_string = "";
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      to_string += `\n${i}. ${current.player.name}`;
      current = current.next;
    }
    return `Playing Order:
----------------${to_string}`;
  }
  initRound(whatsapp, chat_name) {
    this.deck = general_functions.shuffleArray(constants.deck);
    let current = this.order.head.next; // Starts from SB
    while (current) {
      current.player.setHoleCards(this.deck.pop(), this.deck.pop());
      whatsapp.sendMessage(
        current.player.phone_number,
        `${chat_name}
-------------
Cards: ${game_functions.print_cards(current.player.getHoleCards())}
Stack: $${current.player.game_money}`
      );
      if (current.is_button) break;
      else current = current.next;
    }
  }

  setType() {
    this.type = this.type; // for oma chap or more
  }

  getIs_midround() {
    return this.is_midround;
  }

  setIs_midround(newMidround) {
    this.is_midround = newMidround;
  }

  getOrder() {
    return this.order;
  }

  generateOrder() {
    let players = general_functions.shuffleArray(Object.values(this.players));
    for (let i = 0; i < players.length; i++) {
      this.order.append(players[i]);
    }
    this.order.head.is_button = true;
    let current = this.order.head;
    while (current.next) {
      current = current.next;
    }
    current.next = this.order.head;
  }

  moveButton() {
    this.order.head.is_button = false;
    this.order.head = this.order.head.next; // Maybe should be this.order = ...
  }
}
module.exports = Game;
