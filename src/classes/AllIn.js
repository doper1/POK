class AllIn {
  constructor(players, pot, currentBet) {
    this._players = players;
    this._pot = pot;
    this._currentBet = currentBet;
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

  get currentBet() {
    return this._currentBet;
  }

  set currentBet(currentBet) {
    this._currentBet = currentBet;
  }
}

module.exports = AllIn;
