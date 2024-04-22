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

function is_allowed(game, message) {
  if (game.order.current_player.phone_number != message.author) {
    // Current player check
    message.react("😬");
    game.chat.sendMessage(`It's not your turn,
it's ${game.order.current_player.name} turn`);
    return false;
  } else if (game.order.current_player.is_folded) {
    // Fold check
    message.react("😬");
    game.chat.sendMessage(`You already folded`);
    return false;
  }
  return true;
}

module.exports = {
  shuffleArray,
  sort_cards,
  hasTwoWords,
  emote,
  is_allowed,
};
