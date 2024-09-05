const constants = require("../constants");

// Shuffle an arrary (for order shuffle and cards shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hasTwoWords(string) {
  return /^\S+\s+\S+$/.test(string);
}

/** Choose a random emoji from the wanted emoji type
 *  - Can handle both lower case and UPPER case
 *  @param {String} emoji_type - type from the EMOJIES constant.
 *  @returns {String}
 *  @example message.react(emote("mistake")); */
function emote(emoji_type) {
  emoji_type = emoji_type.toUpperCase();
  if (!(emoji_type in constants.EMOJIES)) {
    throw new Error(`Emoji type '${emoji_type}' doesn't exists`);
  } else {
    let random_index = Math.floor(
      Math.random() * constants.EMOJIES[emoji_type].length
    );
    return constants.EMOJIES[emoji_type][random_index];
  }
}

function is_allowed(game, message) {
  let phone_number = format_phone_number(message.author);

  if (game.order.current_player.phone_number != phone_number) {
    // Current player check
    message.react(emote("mistake"));
    message.reply(`It's not your turn,
it's ${game.order.current_player.name} turn`);
    return false;
  }
  return true;
}

function format_phone_number(phone_number) {
  return phone_number.replace(/:\d+@/, "@");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  shuffleArray,
  hasTwoWords,
  emote,
  is_allowed,
  format_phone_number,
  delay
};
