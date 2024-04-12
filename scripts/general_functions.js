// Function to deal a hand of cards
function dealHand(deck, numCards) {
  if (numCards > deck.length) {
    console.log("Not enough cards in the deck!");
    return [];
  }
  return deck.splice(0, numCards);
}

// Reverse string
function reverseString(str) {
  return str.split("").reverse().join("");
}

// Shuffle an arrary (for order shuffle and cards shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function sort_cards(cards) {
  return cards.slice().sort((a, b) => a[1] - b[1]);
}

function hasTwoWords(string) {
  return /^\S+\s+\S+$/.test(string);
}

module.exports = {
  dealHand,
  reverseString,
  shuffleArray,
  sort_cards,
  hasTwoWords,
};
