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
    this.all_ins = {}; // {phone_number: [120, 0], phone_number2: [pot, 50] } if(all_in.length != 0 ) -> call/raise + player.bet {Adam(id): [200, 0], Ben(id): [260, 0], Elad)id): [320, 30]}
    this.deck = [];
    this.type = 1; // for Omaha chap or more // 1,2,3
    this.community_cards = []; //  if 0 and round end -> 3
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
        order_string += `\n${i}. ${current_player.name} ⚪`;
      } else {
        order_string += `\n${i}. ${current_player.name}`;
      }
      current_player = current_player.next_player;
    }
    return `*Playing Order:* ${order_string}`;
  }
  initRound(whatsapp, chat_name) {
    this.deck = general_functions.shuffleArray(constants.deck);
    let current = this.order.current_player;
    do {
      current.setHoleCards(this.deck.pop(), this.deck.pop());
      whatsapp.sendMessage(
        current.phone_number,
        `*Cards:* ${game_functions.print_cards(current.getHoleCards())}
*Stack:* $${current.game_money}
-------------
*${chat_name}*`
      );
      current = current.next_player;
    } while (!current.is_button);
    this.resetPlayersStatus();
    this.community_cards = [];
    this.folds = 0;
    this.moveButton();
    if (Object.keys(this.players).length === 2) {
      this.order.next();
    }
    this.putBlinds();
    this.chat.sendMessage(
      `${this.getOrderPretty()}
----------------
Check your DM for your cards 🤫);
----------------
Action on @${this.order.current_player.contact.id.user} ($${
        this.order.current_player.game_money
      })`,
      {
        mentions: [this.order.current_player.contact.id._serialized],
      }
    );
  }

  setType() {
    this.type = this.type; // for omaha
  }

  getIsMidround() {
    return this.is_midround;
  }

  setIsMidround(newMidround) {
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

  moveAction() {
    this.order.next();
    this.chat.sendMessage(
      `Pot: $${this.pot}
-------------
Action on @${this.order.current_player.contact.id.user} ($${this.order.current_player.game_money})`,
      {
        mentions: [this.order.current_player.contact.id._serialized],
      }
    );
  }

  putBlinds() {
    this.current_bet = constants.big_blind;
    this.order.next();
    this.order.current_player.game_money -= constants.small_blind;
    this.order.current_player.current_bet = constants.small_blind;
    this.order.next();
    this.order.current_player.game_money -= constants.big_blind;
    this.order.current_player.current_bet = constants.big_blind;
    this.pot += constants.small_blind + constants.big_blind;
    this.order.next();
  }

  updateRound(whatsapp) {
    if (this.folds === Object.keys(this.players).length - 1) {
      game_functions.showdown(this);
      this.initRound(whatsapp, this.chat.name);
    } else if (this.order.current_player.next_player.is_folded) {
      this.order.next();
      this.updateRound();
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
          this.jumpToButton();
          this.resetPlayersStatus();
          this.moveAction();
          break;

        // Turn
        case 3:
          this.community_cards.push(this.deck.pop());
          this.chat.sendMessage(
            `*Cards:* \n${game_functions.print_cards(this.community_cards)}`
          );
          this.current_bet = 0;
          this.jumpToButton();
          this.resetPlayersStatus();
          this.moveAction();
          break;

        // River
        case 4:
          this.community_cards.push(this.deck.pop());
          this.chat.sendMessage(
            `*Cards:* \n${game_functions.print_cards(this.community_cards)}`
          );
          this.current_bet = 0;
          this.jumpToButton();
          this.resetPlayersStatus();
          this.moveAction();
          break;

        // Showdown
        case 5:
          game_functions.showdown(this);
          this.initRound(whatsapp, this.chat.name);
          break;
      }
    } else {
      this.order.current_player.is_played = true;
      this.moveAction();
    }
  }

  resetPlayersStatus() {
    let current = this.order.current_player;
    do {
      current.hole_cards = [];
      current.hand_score = { str: undefined, cards: [] };
      current.current_bet = 0;
      current.is_all_in = false;
      current.is_folded = false;
      current.is_played = false;
      current = current.next_player;
    } while (!current.is_button);
  }
}

module.exports = Game;
