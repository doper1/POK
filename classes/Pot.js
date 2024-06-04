let AllIn = require("./AllIn");

class Pot {
  constructor() {
    this._main_pot = 0;
    this._last_round_pot = 0;
    this._all_ins = [];
    this._current_bet = 0;
    this._current_round_bets = [];
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

  get current_round_bets() {
    return this._current_round_bets;
  }

  set current_round_bets(crb) {
    this._current_round_bets = crb;
  }

  addCurrentRoundBet(bet) {
    this.current_round_bets.push(bet);
  }

  addAllIn(game) {
    let all_in_bet = game.order.current_player.current_bet;
    let all_in_pot = all_in_bet + this.last_round_pot;
    for (let i = 0; i < this._current_round_bets; i++) {
      if (this._current_round_bets[i] <= all_in_bet)
        all_in_pot += this._current_round_bets[i];
      else {
        all_in_pot += all_in_bet;
      }
    }
    this._all_ins.push(new AllIn(game.order.current_player));
  }

  reorgAllIns() {
    this._all_ins.sort((a, b) => b.pot - a.pot); // sort the pots from large to small pot
    for (let i = 0; i < this._all_ins.length; i++) {
      console.log(this._all_ins[i]);
    }
    // Remove pots in showdown
  }
}

module.exports = Pot;
