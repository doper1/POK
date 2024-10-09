const Mustache = require('mustache');
const constants = require('../utils/constants');

function rand(length) {
  return Math.floor(Math.random() * length);
}

function currentTime() {
  return Math.floor(Date.now() / 1000);
}

// Shuffle an arrary (for order shuffle and cards shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = rand(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
      Mustache.render(`Emoji type '{{emojiType}}' doesn't exist`, {
        emojiType,
      }),
    );
  } else {
    let randomIndex = Math.floor(
      Math.random() * constants.EMOJIES[emojiType].length,
    );
    return constants.EMOJIES[emojiType][randomIndex];
  }
}

function isCurrent(game, message) {
  if (game.currentPlayer != message.author) {
    message.react(emote('mistake'));
    message.reply("It's not your turn");
    return false;
  }
  return true;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getProperties(instance, keepProperties, keepMethods) {
  const properties = Object.fromEntries(
    keepProperties.map((prop) => [prop, instance[prop]]),
  );

  const methods = Object.fromEntries(
    keepMethods.map((method) => [method, instance[method].bind(instance)]),
  );

  return { ...properties, ...methods };
}

function replyError(message, errorMessage) {
  message.react(emote('mistake'));
  message.reply(errorMessage);
  return false;
}

module.exports = {
  rand,
  currentTime,
  shuffleArray,
  emote,
  isCurrent,
  delay,
  getProperties,
  replyError,
};
