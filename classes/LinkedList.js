class Node {
  constructor(player) {
    this.player = player;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.player_id;
  }
  append(player, id) {
    const newNode = new Node(player);
    if (!this.head) {
      this.head = newNode;
      this.player_id = id;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  printNumberedNodes() {
    let current = this.head;
    let output = "";
    let count = 1;
    while (current) {
      output += `${count}. ${current.player}\n`;
      current = current.next;
      count++;
    }
    return output;
  }

  remove(player) {
    if (!this.head) {
      return;
    }
    if (this.head.player === player) {
      this.head = this.head.next;
      return;
    }
    let current = this.head;
    let previous = null;
    while (current && current.player !== player) {
      previous = current;
      current = current.next;
    }
    if (!current) {
      return; // Node not found
    }
    previous.next = current.next;
  }

  visualize() {
    let current = this.head;
    let output = "";

    if (!current) {
      return output;
    }

    if (!current.next) {
      return current.player;
    }

    let initialNode = current;

    while (current) {
      output += current.player.name;
      if (current.next && current.next !== initialNode) {
        output += " ---> ";
      } else {
        break;
      }
      current = current.next;
    }

    return output;
  }
}

module.exports = { LinkedList };
