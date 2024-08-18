class AllIn {
  constructor(current_player, pot) {
    this.players = [current_player];
    this.pot = pot;
    this.current_bet = current_player.current_bet;
  }

  getPlayers() {
    return this._players;
  }

  setPot(pot) {
    this.pot = pot;
  }

  getCurrentBet() {
    return this.current_bet;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPot() {
    return this.pot;
  }

  setCurrentBet(current_bet) {
    this.current_bet = current_bet;
  }
}

module.exports = AllIn;
