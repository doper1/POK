class AllIn {
  constructor(current_player, pot) {
    this._players = [current_player];
    this._pot = pot;
    this._current_bet = current_player.current_bet;
  }

  get players() {
    return this._players;
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

  addPlayer(player) {
    this._players.push(player);
  }
}

module.exports = AllIn;
