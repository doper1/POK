class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Adds an element to the end of the linked list.
   *
   * @param {any} element The element to be added.
   * @returns {void}
   */
  append(element) {
    const node = {
      element,
      next: null,
    };

    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
  }

  /**
   * Removes the first occurrence of a specific element from the linked list.
   *
   * @param {any} element The element to be removed.
   * @returns {boolean} Returns `true` if the element is removed, otherwise `false`.
   */
  remove(element) {
    let current = this.head;
    let previous = null;

    while (current !== null) {
      if (current.element === element) {
        if (previous === null) {
          this.head = current.next;
        } else {
          previous.next = current.next;
          if (current === this.tail) {
            this.tail = previous;
          }
        }

        this.length--;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  }

  /**
   * Returns the element at the specified index.
   *
   * @param {number} index The index of the element to be returned.
   * @returns {any} The element at the specified index.
   */
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

  /**
   * Sets the element at the specified index.
   *
   * @param {number} index The index of the element to be set.
   * @param {any} newElement The new element to be set.
   * @returns {void}
   */
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

  /**
   * Returns the number of elements in the linked list.
   *
   * @returns {number} The number of elements in the linked list.
   */
  size() {
    return this.length;
  }
}
