class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(element) {
    const node = {
      element,
      next: null,
      previous: null,
    };

    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.previous = this.tail;
      this.tail = node;
    }

    this.length++;
  }

  remove(element) {
    let current = this.head;
    let previous = null;

    while (current !== null) {
      if (current.element === element) {
        if (previous === null) {
          this.head = current.next;
        } else {
          previous.next = current.next;
          current.next.previous = previous;
        }

        this.length--;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of range");
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }

    return current.element;
  }

  set(index, newElement) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index out of range");
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }

    current.element = newElement;
  }

  size() {
    return this.length;
  }
}
module.exports = LinkedList;
