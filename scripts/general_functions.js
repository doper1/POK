const { suits, ranks, SB, BB } = require('./constants');

// Generate a Deck of cards in an array full of dictionaries of suit: rank.
// For example: [{"Diamond":"4"},{"Cloves": "9"}]
function createDeck() {
    let deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push([suit, rank]);
      }
    }
    return deck;
  }
  
  // Function to deal a hand of cards
  function dealHand(deck, numCards) {
    if (numCards > deck.length) {
      console.log('Not enough cards in the deck!');
      return [];
    }
    return deck.splice(0, numCards);
  }
  
  // Reverse string
  function reverseString(str) {
      return str
        .split("")
        .reverse()
        .join("");
  }
  
  // Shuffle an arrary (for order shuffle and cards shuffle)
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }

  module.exports = {createDeck, dealHand, reverseString, shuffleArray}