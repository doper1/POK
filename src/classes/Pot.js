const AllIn = require('./AllIn');

class Pot {
  constructor() {
    this._mainPot = 0;
    this._lastRoundPot = 0;
    this._allIns = [];
    this._currentBet = 0;
  }

  get mainPot() {
    return this._mainPot;
  }

  set mainPot(value) {
    this._mainPot = value;
  }

  get lastRoundPot() {
    return this._lastRoundPot;
  }

  set lastRoundPot(pot) {
    this._lastRoundPot = pot;
  }

  get allIns() {
    return this._allIns;
  }

  addAllIn(game) {
    let current = game.order.currentPlayer;
    let pot = 0;
    let players = [];

    for (const id in game.players) {
      let player = game.players[id];
      if (player.currentBet < current.currentBet) {
        pot += player.currentBet;
      } else {
        pot += current.currentBet;
        players.push(player);
      }
    }

    this._allIns.push(new AllIn(players, pot, current.currentBet));
  }

  reorgAllIns() {
    this._allIns.sort((a, b) => a.pot - b.pot); // sort the pots from smallest to largest
  }
}

module.exports = Pot;
