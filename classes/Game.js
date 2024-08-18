let constants = require("../constants");

// Scripts
let general_functions = require("../scripts/general_functions");
let game_functions = require("../scripts/game_functions");

// Classes
let Player = require("./Player");
let LinkedList = require("./LinkedList");
let Pot = require("./Pot");

class Game {
  constructor(id, chat) {
    this.id = id;
    this.chat = chat;
    this.players = {};
    this.order = new LinkedList();
    this.pot = new Pot();
    this.deck = [];
    this.type = 1; // for Omaha // 1,2,3
    this.community_cards = [];
    this.is_midround = false;
    this.folds = 0;
  }

  addPlayer(name, phone_number, contact) {
    let player = new Player(name, phone_number, contact);
    this.players[phone_number] = player;
  }

  getPlayers() {
    return this.players;
  }

  getIsMidround() {
    return this.is_midround;
  }

  setIsMidround(newMidround) {
    this.is_midround = newMidround;
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
    let order_string = "";
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      if (current_player.is_button) {
        order_string += `\n_${i}. ${current_player.name} ⚪_`;
      } else {
        order_string += `\n_${i}. ${current_player.name}_`;
      }
      current_player = current_player.next_player;
    }
    return `*Playing Order:* ${order_string}`;
  }
  initRound(whatsapp, chat_name, last_round_message = "") {
    this.deck = general_functions.shuffleArray(constants.deck);
    this.jumpToButton();
    let current = this.order.current_player;
    do {
      current.hole_cards = [];
      current.setHoleCards(...this.deck.splice(-2));
      whatsapp.sendMessage(
        current.phone_number,
        `*Cards:* ${game_functions.print_cards(current.getHoleCards())}
*-------------*
*${chat_name}*`
      );
      current = current.next_player;
    } while (!current.is_button);
    this.resetPlayersStatus();
    this.community_cards = [];
    this.folds = 0;
    this.pot = new Pot();
    this.moveButton();
    if (Object.keys(this.players).length === 2) {
      this.order.next();
    }
    this.putBlinds();
    if (last_round_message === "") {
      this.chat.sendMessage(
        `Check your DM for your cards 🤫
----------------
${this.getOrderPretty()}
----------------
Pot: $${this.pot.main_pot}
----------------
Action on @${this.order.current_player.contact.id.user} ($${
          this.order.current_player.game_money
        })
----------------
$${this.pot.current_bet - this.order.current_player.current_bet} to call`,
        {
          mentions: [this.order.current_player.contact.id._serialized],
        }
      );
    } else {
      this.chat.sendMessage(
        `${last_round_message}
----------------
${this.getOrderPretty()}
----------------
Pot: $${this.pot.main_pot}
----------------
Action on @${this.order.current_player.contact.id.user} ($${
          this.order.current_player.game_money
        })
----------------
$${this.pot.current_bet - this.order.current_player.current_bet} to call`,
        {
          mentions: [this.order.current_player.contact.id._serialized],
        }
      );
    }
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
  }

  jumpToButton() {
    let current = this.order.current_player;
    while (!current.is_button) {
      current = current.next_player;
    }
    this.order.current_player = current;
  }

  moveButton() {
    this.jumpToButton();
    this.order.current_player.is_button = false;
    this.order.next();
    this.order.current_player.is_button = true;
  }

  moveAction(action_message) {
    this.order.next();
    if (this.pot.current_bet - this.order.current_player.current_bet != 0) {
      this.chat.sendMessage(
        `${action_message}
-------------
Pot: $${this.pot.main_pot}
-------------
Action on @${this.order.current_player.contact.id.user} ($${
          this.order.current_player.game_money
        })
-------------
$${this.pot.current_bet - this.order.current_player.current_bet} to call`,
        {
          mentions: [this.order.current_player.contact.id._serialized],
        }
      );
    } else {
      this.chat.sendMessage(
        `${action_message}
-------------
Pot: $${this.pot.main_pot}
-------------
Action on @${this.order.current_player.contact.id.user} ($${this.order.current_player.game_money})`,
        {
          mentions: [this.order.current_player.contact.id._serialized],
        }
      );
    }
  }

  putBlinds() {
    this.pot.main_pot += constants.small_blind + constants.big_blind;
    this.pot.current_bet = constants.big_blind;

    this.order.next();
    this.order.current_player.game_money -= constants.small_blind;
    this.order.current_player.current_bet = constants.small_blind;
    this.order.next();
    this.order.current_player.game_money -= constants.big_blind;
    this.order.current_player.current_bet = constants.big_blind;
    this.order.next();
  }

  updateRound(whatsapp, action_message) {
    let next_player = this.order.current_player.next_player;

    // if (this.pot.all_ins.length + 1 == Object.keys(this.players).length) {
    if (next_player.is_folded || next_player.is_all_in) {
      this.moveRound(whatsapp);
      this.updateRound(whatsapp, "");
    } else if (this.folds === Object.keys(this.players).length - 1) {
      this.pot.reorgAllIns();
      while (this.order.current_player.is_folded) {
        this.order.next();
      }
      this.order.current_player.game_money += this.pot.main_pot;
      this.initRound(
        whatsapp,
        this.chat.name,
        `${this.order.current_player.name} Won $${this.pot.main_pot}`
      );
    } else if (next_player.is_folded || next_player.is_all_in) {
      this.order.next();
      this.updateRound();
    } else if (
      next_player.is_played &&
      next_player.current_bet === this.pot.current_bet
    ) {
      this.moveRound(whatsapp);
    } else {
      this.order.current_player.is_played = true;
      this.moveAction(action_message);
    }
  }

  moveRound(whatsapp) {
    switch (this.community_cards.length) {
      // Flop
      case 0:
        this.community_cards.push(...this.deck.splice(-3));
        this.resetRound();
        break;

      // Turn
      case 3:
        this.community_cards.push(this.deck.pop());
        this.resetRound();
        break;

      // River
      case 4:
        this.community_cards.push(this.deck.pop());
        this.resetRound();
        break;

      // Showdown
      case 5:
        this.pot.reorgAllIns();
        let end_message = game_functions.showdown(this);
        this.initRound(whatsapp, this.chat.name, end_message);
        break;
    }
  }
  resetPlayersStatus() {
    this.jumpToButton();
    let current = this.order.current_player;
    do {
      current.hand_score = { str: undefined, cards: [] };
      current.current_bet = 0;
      current.is_all_in = false;
      current.is_folded = false;
      current.is_played = false;
      current = current.next_player;
    } while (!current.is_button);
  }

  resetRound() {
    this.pot.last_round_pot = this.pot.main_pot;
    this.pot.current_bet = 0;
    this.pot.current_round_bets = [];
    this.pot.all_ins.forEach((all_in) => {
      all_in.current_bet = -1;
    });
    this.resetPlayersStatus();
    this.order.next();
    if (this.pot.all_ins.length + 1 >= Object.keys(this.players).length) {
      this.chat.sendMessage(
        `*Cards:* \n${game_functions.print_cards(this.community_cards)}
-------------
Pot: $${this.pot.main_pot}`
      );
    } else if (
      this.pot.current_bet - this.order.current_player.current_bet !=
      0
    ) {
      this.chat.sendMessage(
        `*Cards:* \n${game_functions.print_cards(this.community_cards)}
-------------
Pot: $${this.pot.main_pot}
-------------
Action on @${this.order.current_player.contact.id.user} ($${
          this.order.current_player.game_money
        })
-------------
$${this.pot.current_bet - this.order.current_player.current_bet} to call`,
        {
          mentions: [this.order.current_player.contact.id._serialized],
        }
      );
    } else {
      this.chat.sendMessage(
        `*Cards:* \n${game_functions.print_cards(this.community_cards)}
-------------
Pot: $${this.pot.main_pot}
-------------
Action on @${this.order.current_player.contact.id.user} ($${
          this.order.current_player.game_money
        })`,
        {
          mentions: [this.order.current_player.contact.id._serialized],
        }
      );
    }
  }

  show_hands() {
    this.jumpToButton();
    let current = this.order.current_player;
    let hands = "";
    do {
      current = current.next_player();
      hands += game_functions.format_hand(current.name, current.hole_cards);
      hands += "-------------";
    } while (current.is_button == false);

    return hands;
  }
}

module.exports = Game;
