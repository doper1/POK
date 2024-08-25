class AllIn {
  constructor(players, pot, current_bet) {
    this._players = players;
    this._pot = pot;
    this._current_bet = current_bet;
  }

  get players() {
    return this._players;
  }

  addPlayer(player) {
    this._players.push(player);
  }

  get pot() {
    return this._pot;
  }

  set pot(pot) {
    this._pot = pot;
  }

  get current_bet() {
    return this._current_bet;
  }

  set current_bet(current_bet) {
    this._current_bet = current_bet;
  }
}

module.exports = AllIn;
