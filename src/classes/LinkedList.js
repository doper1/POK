class LinkedList {
  constructor() {
    this.current_player = null;
  }
  append(player) {
    const new_player = player;
    if (!this.current_player) {
      this.current_player = new_player;
      return;
    }

    let current = this.current_player;
    while (current.next_player) {
      current = current.next_player;
    }
    current.next_player = new_player;
  }

  insertAfterCurrent(new_player) {
    let nextPlayer = this.current_player.next_player;
    this.current_player.next_player = new_player;
    new_player.next_player = nextPlayer;
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

  next() {
    this.current_player = this.current_player.next_player;
  }
}

module.exports = LinkedList;
