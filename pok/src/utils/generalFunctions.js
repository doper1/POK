const Mustache = require('mustache');
const constants = require('../utils/constants');
const http = require('http');

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
  if (game.currentPlayer != message.author)
    return replyError(message, "It's not your turn");
  return true;
}

function isPlaying(currentPlayer, message) {
  if (!currentPlayer)
    return replyError(message, 'You need to join the game first');
  return true;
}

function isGameRunning(gameStatus, message) {
  if (gameStatus === 'pending')
    return replyError(message, 'No game is running');
  return true;
}

/**
 * Delays the execution of the next promise in the chain by the specified amount of milliseconds.
 *
 * @function delay
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise} A promise that resolves after the specified delay.
 *
 * @example
 * delay(1000)
 *   .then(() => {})
 *   .catch((error) => console.error(error));
 */
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

/**
 * Notify imagen container about an event
 * @param {string} event Name of the event
 * @param {string} gameId Game ID (UUID)
 * @param {int} cardIndex Index of the first card to use
 * @returns {Promise<void>}
 */
function notifyImagen(event, gameId, cardIndex) {
  let request = `http://${process.env.IMAGEN_HOST}:8080/api/${event}?game_id=${gameId}`;

  switch (event) {
    case 'join':
      request += `&card_index=${cardIndex}`;
      break;
    case 'start':
      break;
  }

  const req = http.get(request);
  req.on('error', () => {});
  req.end();
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
  notifyImagen,
  isPlaying,
  isGameRunning,
};
