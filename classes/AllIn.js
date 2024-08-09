class AllIn {
  constructor(current_player, pot) {
    this.players = [current_player];
    this.pot = pot;
    this.current_bet = current_player.current_bet;
  }

  get players() {
    return this._players;
  }

  get pot() {
    return this.pot;
  }

  set pot(pot) {
    this.pot = pot;
  }

  get current_bet() {
    return this._current_bet;
  }

  set current_bet(current_bet) {
    this.current_bet = current_bet;
  }

  addPlayer(player) {
    this.players.push(player);
  }
}

module.exports = AllIn;
