let constants = require("../constants");

// Scripts
let { shuffleArray } = require("../scripts/general_functions");
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
      players_string += `\n${index++}. ${value.name}`;
    }
    return `*Players:*${players_string}`;
  }

  getOrderPretty() {
    let current = this.order.current_player;
    let order_string = "";
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      if (current === this.order.current_player) {
        order_string += `\n*${i}. ${current.name}*`;
      } else if (current.is_folded) {
        order_string += `\n~${i}. ${current.name}~`;
      } else {
        order_string += `\n${i}. ${current.name}`;
      }
      if (current.is_button) {
        order_string += " ⚪";
      }
      if (current.is_all_in) {
        order_string += " 🔴";
      }
      current = current.next_player;
    }
    return `*Pot:* $${this.pot.main_pot}\n\n*Playing Order:* ${order_string}`;
  }

  resetGameStatus() {
    this.deck = shuffleArray(constants.DECK);
    this.community_cards = [];
    this.folds = 0;
    this.pot = new Pot();
    this.resetPlayersStatus(true);
  }

  dealCards(whatsapp, chat_name) {
    this.jumpToButton();
    let current = this.order.current_player;
    do {
      current.hole_cards = [];
      current.setHoleCards(...this.deck.splice(-2));
      whatsapp.sendMessage(
        current.phone_number,
        `${game_functions.print_cards(current.getHoleCards())}\n
${chat_name}`
      );
      current = current.next_player;
    } while (!current.is_button);
  }

  initRound(whatsapp, chat_name, last_round_message = "") {
    this.resetGameStatus();
    this.dealCards(whatsapp, chat_name);
    this.moveButton();

    // For games with two players, the button is also the SB- so there is one extra order shift
    if (Object.keys(this.players).length == 2) {
      this.order.next();
    }
    this.putBlinds();
    let new_message = "";

    if (last_round_message != "") {
      new_message += `${last_round_message}\n\n`;
    }
    let current = this.order.current_player;
    new_message += `${this.getOrderPretty()}\n
Check your DM for your cards 🤫\n
Action on @${current.contact.id.user} ($${current.game_money})\n
$${this.pot.current_bet - current.current_bet} to call`;

    this.chat.sendMessage(new_message, {
      mentions: [current.contact.id._serialized],
    });
  }

  generateOrder() {
    let players = shuffleArray(Object.values(this.players));
    for (let i = 0; i < players.length; i++) {
      this.order.append(players[i]);
    }

    // Closes the linkedlist as a loop
    let current = this.order.current_player;
    while (current.next_player) {
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
    let current = this.order.current_player;
    let new_message = `Pot: $${this.pot.main_pot}\n
${action_message}\n
Action on @${current.contact.id.user} ($${current.game_money})`;

    if (this.pot.current_bet - current.current_bet != 0) {
      new_message += `\n$${this.pot.current_bet - current.current_bet} to call`;
    }
    this.chat.sendMessage(new_message, {
      mentions: [current.contact.id._serialized],
    });
  }

  putBlinds() {
    this.pot.main_pot += constants.SMALL_BLIND + constants.BIG_BLIND;
    this.pot.current_bet = constants.BIG_BLIND;

    this.order.next();
    this.order.current_player.game_money -= constants.SMALL_BLIND;
    this.order.current_player.current_bet = constants.SMALL_BLIND;
    this.order.next();
    this.order.current_player.game_money -= constants.BIG_BLIND;
    this.order.current_player.current_bet = constants.BIG_BLIND;
    this.order.next();
  }

  updateRound(whatsapp, action_message) {
    let current = this.order.current_player;
    let next = current.next_player;
    let players_count = Object.keys(this.players).length;
    let all_ins_count = this.pot.all_ins.length;

    // Everybody folded except one player
    if (this.folds + 1 == players_count) {
      while (current.is_folded) {
        current = current.next_player;
      }
      current.game_money += this.pot.main_pot;
      this.initRound(
        whatsapp,
        this.chat.name,
        `${current.name} Won $${this.pot.main_pot}!`
      );
    }
    // More then one player is all in and everybody else folded
    else if (all_ins_count + this.folds == players_count && all_ins_count > 1) {
      this.moveRound(whatsapp);
      this.updateRound(whatsapp, "");
    }
    if (next.is_folded || next.is_all_in) {
      this.moveRound(whatsapp);
      this.updateRound(whatsapp, "");
    } else if (this.folds == players_count - 1) {
      this.pot.reorgAllIns();
    } else if (next.is_folded || next.is_all_in) {
      this.order.next();
      this.updateRound();
    } else if (next.is_played && next.current_bet == this.pot.current_bet) {
      this.moveRound(whatsapp);
    } else {
      current.is_played = true;
      this.moveAction(action_message);
    }
  }

  moveRound(whatsapp) {
    switch (this.community_cards.length) {
      // Flop
      case 0:
        this.community_cards.push(...this.deck.splice(-3));
        this.resetRoundStatus();
        break;

      // Turn
      case 3:
        this.community_cards.push(this.deck.pop());
        this.resetRoundStatus();
        break;

      // River
      case 4:
        this.community_cards.push(this.deck.pop());
        this.resetRoundStatus();
        break;

      // Showdown
      case 5:
        this.pot.reorgAllIns();
        let end_message = game_functions.showdown(this);
        this.initRound(whatsapp, this.chat.name, end_message);
        break;
    }
  }
  resetPlayersStatus(is_new_hand) {
    this.jumpToButton();
    let current = this.order.current_player;
    do {
      if (is_new_hand) {
        current.is_all_in = false;
        current.is_folded = false;
        current.hand_score = { str: undefined, cards: [] };
      }
      current.current_bet = 0;
      current.is_played = false;
      current = current.next_player;
    } while (!current.is_button);
  }

  resetRoundStatus() {
    this.pot.last_round_pot = this.pot.main_pot;
    this.pot.current_bet = 0;
    this.pot.all_ins.forEach((all_in) => {
      all_in.current_bet = -1;
    });
    this.resetPlayersStatus(false);
    this.order.next();
    let current = this.order.current_player;
    let new_message = `Pot: $${this.pot.main_pot}\n
*Cards:* \n${game_functions.print_cards(this.community_cards)}\n
Action on @${current.contact.id.user} ($${current.game_money})`;

    if (this.pot.current_bet - current.current_bet != 0) {
      new_message += `\n$${this.pot.current_bet - current.current_bet} to call`;
    }
    this.chat.sendMessage(new_message, {
      mentions: [current.contact.id._serialized],
    });
  }

  show_hands() {
    this.jumpToButton();
    let current = this.order.current_player;
    let hands = "";
    do {
      current = current.next_player();
      hands += `${game_functions.format_hand(
        current.name,
        current.hole_cards
      )}\n`;
    } while (current.is_button == false);

    return hands;
  }
}

module.exports = Game;
