class Order {
  constructor() {
    this.currentPlayer = null;
  }
  append(player) {
    const newPlayer = player;
    if (!this.currentPlayer) {
      this.currentPlayer = newPlayer;
      return;
    }

    let current = this.currentPlayer;
    while (current.nextPlayer) {
      current = current.nextPlayer;
    }
    current.nextPlayer = newPlayer;
  }

  insertAfterCurrent(newPlayer) {
    let nextPlayer = this.currentPlayer.nextPlayer;
    this.currentPlayer.nextPlayer = newPlayer;
    newPlayer.nextPlayer = nextPlayer;
  }

  removePlayer(id) {
    let current = this.currentPlayer;
    let previous = false;

    while (current.id != id || !previous) {
      previous = current;
      current = current.nextPlayer;
    }
    previous.nextPlayer = current.nextPlayer;

    // This will be the case when only one player remains
    if (previous.id === previous.nextPlayer.id) {
      previous.nextPlayer = null;
    }

    // When the current player is the one who is being removed
    if (this.currentPlayer.id === id) {
      this.currentPlayer = current;
    }

    return true;
  }

  visualize() {
    let current = this.currentPlayer;
    let output = '';

    if (!current) {
      return output;
    }

    if (!current.nextPlayer) {
      return current.player;
    }

    let initialNode = current;

    while (current) {
      output += current.player.name;
      if (current.nextPlayer && current.nextPlayer !== initialNode) {
        output += ' ---> ';
      } else {
        break;
      }
      current = current.nextPlayer;
    }

    return output;
  }

  next() {
    this.currentPlayer = this.currentPlayer.nextPlayer;
  }
}

module.exports = Order;
