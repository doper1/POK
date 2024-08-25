let AllIn = require("./AllIn");

class Pot {
  constructor() {
    this._main_pot = 0;
    this._last_round_pot = 0;
    this._all_ins = [];
    this._current_bet = 0;
  }

  get main_pot() {
    return this._main_pot;
  }

  set main_pot(value) {
    this._main_pot = value;
  }

  get last_round_pot() {
    return this._last_round_pot;
  }

  set last_round_pot(pot) {
    this._last_round_pot = pot;
  }

  get all_ins() {
    return this._all_ins;
  }

  addAllIn(game) {
    let current = game.order.current_player;
    let pot = 0;
    let players = [current];

    for (const phone_number in game.players) {
      let player = game.players[phone_number];
      if (player.current_bet < current.current_bet) {
        pot += player.current_bet;
      } else {
        pot += current.current_bet;
        players.push(player);
      }
    }

    this.all_ins.push(new AllIn(players, pot, current.current_bet));
  }

  reorgAllIns() {
    this._all_ins.sort((a, b) => b.pot - a.pot); // sort the pots from large to small pot
    for (let i = 0; i < this.all_ins.length; i++) {
      console.log(this.all_ins[i]);
    }
    // Remove pots in showdown
  }
}

module.exports = Pot;
