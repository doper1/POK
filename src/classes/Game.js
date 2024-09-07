const constants = require("../constants");

// Scripts
const { shuffleArray, delay, setLock } = require("../generalFunctions.js");
const cardsFunctions = require("../game/cardsFunctions.js");
const game_functions = require("../game/gameFunctions.js");

// Classes
const Player = require("./Player");
const LinkedList = require("./LinkedList");
const Pot = require("./Pot");

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

  addPlayer(contact, phone_number) {
    this.players[phone_number] = new Player(contact, phone_number);
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
    for (let player of Object.values(this.players)) {
      players_string += `\n${index++}. @${player.contact.id.user}`;
    }
    return `*Players:*${players_string}`;
  }

  getOrderPretty() {
    let real_current = this.order.current_player;
    this.jumpToButton();

    let players_count = Object.keys(this.players).length;
    if (players_count == 2) {
      // After preflop
      if (this.community_cards.length != 0) {
        this.order.next(); // SB
      }
    } else {
      // Preflop
      if (this.community_cards.length == 0) {
        this.order.next(); // SB
        this.order.next(); // BB
        this.order.next(); // UTG
      }
      // After preflop
      else {
        this.order.next(); // SB
      }
    }

    // Define virtual current for looping over the players
    let v_current = this.order.current_player;

    // Return the real current player to it's place
    this.order.current_player = real_current;

    let order_string = "";
    for (let i = 1; i < Object.keys(this.players).length + 1; i++) {
      order_string += "\n";
      if (v_current === this.order.current_player) {
        order_string += `_*${i}.@${v_current.contact.id.user}*_\u00A0I`;
      } else if (v_current.is_folded) {
        order_string += `~${i}.@${v_current.contact.id.user}~\u00A0I`;
      } else {
        order_string += `${i}.@${v_current.contact.id.user}I`;
      }

      order_string += `  $${v_current.current_bet}  I  $${v_current.game_money}  `;
      if (v_current.is_button) {
        order_string += "I⚪";
      }
      if (v_current.is_all_in) {
        order_string += "I🔴";
      }

      v_current = v_current.next_player;
    }

    if (this.community_cards.length != 0) {
      return `*Pot:* $${this.pot.main_pot}\n\n*Community Cards:*\n${cardsFunctions.print_cards(this.community_cards)}\n\n*Playing Order | Bet | Stack* ${order_string}`;
    }
    return `*Pot:* $${this.pot.main_pot}\n\n*Playing Order | Bet | Stack* ${order_string}`;
  }

  resetGameStatus() {
    this.deck = shuffleArray(constants.DECK.map((card) => [...card]));
    this.community_cards = [];
    this.folds = 0;
    this.pot = new Pot();
    this.resetPlayersStatus(true);
  }

  dealCards(whatsapp) {
    this.jumpToButton();
    let current = this.order.current_player;
    do {
      current.hole_cards = [];
      current.setHoleCards(...this.deck.splice(-2));
      whatsapp.sendMessage(
        current.phone_number,
        `${cardsFunctions.print_cards(current.getHoleCards())}\n
${this.chat.name}`
      );
      current = current.next_player;
    } while (!current.is_button);
  }

  initRound(whatsapp, last_round_message = "") {
    this.resetGameStatus();
    this.dealCards(whatsapp);
    this.moveButton();

    // For games with two players, the button is also the SB- so there is one extra order shift
    if (Object.keys(this.players).length == 2) {
      this.order.next();
    }
    this.putBlinds();
    let new_message = "";

    if (last_round_message != "") {
      new_message += `${last_round_message}\n`;
    }
    let current = this.order.current_player;
    new_message += `${this.getOrderPretty()}\n
Check your DM for your cards 🤫\n
Action on @${current.contact.id.user} ($${current.game_money})\n
$${this.pot.current_bet - current.current_bet} to call`;
    this.chat.sendMessage(new_message, {
      mentions: this.getMentions()
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
      mentions: this.getMentions()
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

  async updateRound(whatsapp, action_message) {
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
        `Congrats! @${current.contact.id.user} Won $${this.pot.main_pot}!
---------------------------------`
      );
    }
    // More then one player is all in and everybody else folded
    else if (
      all_ins_count + this.folds == players_count ||
      (all_ins_count == players_count - this.folds - 1 &&
        next.current_bet == this.pot.current_bet)
    ) {
      setLock(true);
      let new_message = `${action_message}\n\n*Pot:* $${this.pot.main_pot}\n\n`;
      Object.values(this.players).forEach((player) => {
        if (!player.is_folded) {
          new_message += `${cardsFunctions.format_hand(
            player.contact.id.user,
            player.hole_cards
          )}`;
        }
      });
      if (this.community_cards.length != 0) {
        new_message += `\n*Community Cards:*\n${cardsFunctions.print_cards(this.community_cards)}`;
      } else {
        new_message += "\n*Community Cards:*\n-";
      }
      let message = await this.chat.sendMessage(new_message, {
        mentions: this.getMentions()
      });

      await delay(1000);
      await this.rushRound(message, whatsapp, new_message);
      let end_message = game_functions.showdown(this);
      this.initRound(whatsapp, end_message);
      setLock(false);
    } else if (next.is_all_in || next.is_folded) {
      this.order.next();
      this.updateRound(whatsapp, action_message);
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
      // Turn / River
      case 3:
      case 4:
        this.community_cards.push(this.deck.pop());
        this.resetRoundStatus();
        break;
      // Showdown
      case 5:
        this.initRound(whatsapp, game_functions.showdown(this));
        break;
    }
  }

  async rushRound(message, whatsapp, body) {
    const edit_message = async (message) => {
      let new_message = body.replace(/\n.*$/, "").trim();
      new_message += `\n${cardsFunctions.print_cards(this.community_cards)}`;
      await message.edit(new_message, { mentions: this.getMentions() });

      return message;
    };

    switch (this.community_cards.length) {
      // Flop
      case 0:
        this.community_cards.push(...this.deck.splice(-3));
        message = await edit_message(message);
        break;
      // Turn / River
      case 3:
      case 4:
        this.community_cards.push(this.deck.pop());
        message = await edit_message(message);
        break;
      default:
        return;
    }

    await delay((this.community_cards.length - 1) * 1000);
    await this.rushRound(message, whatsapp, body);
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
    console.log(this.pot.all_ins);
    this.resetPlayersStatus(false);
    this.order.next();
    let current = this.order.current_player;
    while (current.is_all_in || current.is_folded) {
      current = current.next_player;
    }
    this.order.current_player = current;
    let new_message = `Pot: $${this.pot.main_pot}\n
*Community Cards:*\n${cardsFunctions.print_cards(this.community_cards)}\n
Action on @${current.contact.id.user} ($${current.game_money})`;

    if (this.pot.current_bet - current.current_bet != 0) {
      new_message += `\n$${this.pot.current_bet - current.current_bet} to call`;
    }
    this.chat.sendMessage(new_message, {
      mentions: this.getMentions()
    });
  }

  show_hands() {
    this.jumpToButton();
    let current = this.order.current_player;
    let hands = "";
    do {
      current = current.next_player;
      hands += `${cardsFunctions.format_hand(
        current.contact.id.user,
        current.hole_cards
      )}\n`;
    } while (current.is_button == false);

    return hands;
  }

  getMentions() {
    return Object.values(this.players).map((player) => player.phone_number);
  }
}

module.exports = Game;
