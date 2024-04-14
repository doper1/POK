//let constants = require("../constants");

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

function emote(emojies) {
  return emojies[Math.floor(Math.random() * emojies.length)];
}

module.exports = {
  shuffleArray,
  sort_cards,
  hasTwoWords,
  emote,
};
