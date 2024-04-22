let Player = require("./Player");

class LinkedList {
  constructor() {
    this.current_player = null;
  }
  append(player) {
    const newPlayer = player;
    if (!this.current_player) {
      this.current_player = newPlayer;
      return;
    }

    let current = this.current_player;
    while (current.next_player) {
      current = current.next_player;
    }
    current.next_player = newPlayer;
  }

  insertAfterCurrent(newPlayer) {
    let nextPlayer = this.current_player.next_player;
    this.current_player.next_player = newPlayer;
    newPlayer.next_player = nextPlayer;
  }

  visualize() {
    let current = this.current_player;
    let output = "";

    if (!current) {
      return output;
    }

    if (!current.next_player) {
      return current.player;
    }

    let initialNode = current;

    while (current) {
      output += current.player.name;
      if (current.next_player && current.next_player !== initialNode) {
        output += " ---> ";
      } else {
        break;
      }
      current = current.next_player;
    }

    return output;
  }
}

module.exports = { LinkedList };
