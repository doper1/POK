let constants = require("../constants");

// Scripts
let general_functions = require("../scripts/general_functions");
let game_functions = require("../scripts/game_functions");

// Classes
let Player = require("./Player");
let { LinkedList } = require("./LinkedList");

class Game {
  constructor(id, chat) {
    this.id = id;
    this.chat = chat;
    this.players = {};
    this.order = new LinkedList();
    this.pot = 0;
    this.current_bet = 0;
    this.deck = [];
    this.type = 1; // for Omaha chap or more // 1,2,3
    this.burned = [];
    this.community_cards = []; //  if 0 and round end -> 3
    this.is_midround = false;
    this.round = 1; // 1, 2, 3, 4
  }

  getCommunityCards() {
    return this.CommunityCards;
  }

  addPlayer(name, phone_number, contact) {
    let player = new Player(name, phone_number, contact);
    this.players[phone_number] = player;
  }

  getPlayers() {
    return this.players;
  }

  getPlayersPretty() {
    let index = 1;
    let players_string = "";
    for (let value of Object.values(this.players)) {
      players_string += `\n${index++}. _${value.name}_`;
    }
    return `*Players:*${players_string}`;
  }

  getOrderPretty() {
    // Should be a squere at the end
    let current_player = this.order.current_player;
    let to_string = "";
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      to_string += `\n${i}. ${current_player.name}`;
      current_player = current_player.next_player;
    }
    return `_Playing Order:_
----------------${to_string}`;
  }
  initRound(whatsapp, chat_name) {
    this.deck = general_functions.shuffleArray(constants.deck);
    let current_player = this.order.current_player;
    while (current_player) {
      current_player.game_money = 100; // Change to some constants, also handle less money situations
      current_player.money -= 100;
      current_player.setHoleCards(this.deck.pop(), this.deck.pop());
      whatsapp.sendMessage(
        current_player.phone_number,
        `${chat_name}
-------------
Cards: ${game_functions.print_cards(current_player.getHoleCards())}
Stack: $${current_player.game_money}`
      );
      if (current_player.is_button) break;
      else current_player = current_player.next_player;
    }
    //this.moveButton();
    //this.putBlinds();
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
    let current = this.order.current_player;
    while (current.next_player) {
      // Closes the linkedlist as a loop
      current = current.next_player;
    }
    current.next_player = this.order.current_player;
    this.order.current_player.is_button = true;
    this.order.current_player = this.order.current_player.next_player;
  }

  moveButton() {
    this.order.current_player.is_button = false;
    this.order.current_player = this.order.current_player.next_player;
  }

  moveAction() {
    this.order.current_player = this.order.current_player.next_player;

    this.chat.sendMessage(`Pot: $${this.pot}`);
    this.chat.sendMessage(
      `Action on @${this.order.current_player.contact.id.user}`,
      {
        mentions: [this.order.current_player.contact.id._serialized],
      }
    );
  }

  putBlinds() {
    // the player after the button puts a small blind, the player after him put a big blind, and the action passes to UTG player
    this.order.current_player.game_money -= constants.small_blind;
    this.order.current_player.next_player.game_money -= constants.big_blind;
    this.pot += constants.small_blind + constants.big_blind;
  }

  update_round() {
    if (this.order.current_player.next_player.is_folded) {
      this.order.current_player = this.order.current_player.next_player;
      this.update_round();
    } else if (
      this.order.current_player.next_player.is_played &&
      this.order.current_player.next_player.current_bet === this.current_bet
    ) {
      // Flop
      switch (this.community_cards.length) {
        case 0:
          this.community_cards.push(this.deck.pop());
          this.community_cards.push(this.deck.pop());
          this.community_cards.push(this.deck.pop());
          this.chat.sendMessage(
            `*Cards:* \n${game_functions.print_cards(this.community_cards)}`
          );
          this.current_bet = 0;
          this.reset_players_status();
          this.moveAction();
          break;

        // Turn
        case 3:
          this.community_cards.push(this.deck.pop());
          this.chat.sendMessage(
            `*Cards:* \n${game_functions.print_cards(this.community_cards)}`
          );
          this.current_bet = 0;
          this.reset_players_status();
          this.moveAction();
          break;

        // River
        case 4:
          this.community_cards.push(this.deck.pop());
          this.chat.sendMessage(
            `*Cards:* \n${game_functions.print_cards(this.community_cards)}`
          );
          this.current_bet = 0;
          this.reset_players_status();
          this.moveAction();
          break;

        // Showdown
        case 5:
          this.community_cards = [];
          this.reset_players_status();
          break;
      }
    } else {
      this.order.current_player.is_played = true;
      this.moveAction();
    }
  }

  jump_to_button() {
    let current = this.order.current_player;
    while (!current.is_button) {
      current = current.next_player;
    }
    this.order.current_player = current;
  }

  reset_players_status() {
    this.jump_to_button();
    let current = this.order.current_player;

    do {
      current.is_played = false;
      current.current_bet = 0;
      current = current.next_player;
    } while (!current.is_button);
  }
}
module.exports = Game;
