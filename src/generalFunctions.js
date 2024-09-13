const mustache = require('mustache');
const constants = require('./constants');

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
 *  @param {String} emojiType - type from the EMOJIES constant.
 *  @returns {String}
 *  @example message.react(emote("mistake")); */
function emote(emojiType) {
  emojiType = emojiType.toUpperCase();
  if (!(emojiType in constants.EMOJIES)) {
    throw new Error(
      mustache.render(`Emoji type '{{emojiType}}' doesn't exist`, {
        emojiType
      })
    );
  } else {
    let randomIndex = Math.floor(
      Math.random() * constants.EMOJIES[emojiType].length
    );
    return constants.EMOJIES[emojiType][randomIndex];
  }
}

function isAllowed(game, message) {
  let id = formatPhoneNumber(message.author);

  if (game.order.currentPlayer.id != id) {
    message.react(emote('mistake'));
    message.reply("It's not your turn");
    return false;
  }
  return true;
}

function formatPhoneNumber(id) {
  return id.replace(/:\d+@/, '@');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let actionLock = false;

function setLock(state) {
  actionLock = state;
}

function isLocked() {
  return actionLock;
}

function cleanInstance(instance, keepProperties, keepMethods) {
  const properties = Object.fromEntries(
    keepProperties.map((prop) => [prop, instance[prop]])
  );

  const methods = Object.fromEntries(
    keepMethods.map((method) => [method, instance[method].bind(instance)])
  );

  return { ...properties, ...methods };
}

module.exports = {
  shuffleArray,
  hasTwoWords,
  emote,
  isAllowed,
  formatPhoneNumber,
  delay,
  setLock,
  isLocked,
  cleanInstance
};
