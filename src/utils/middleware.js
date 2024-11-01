const constants = require('./constants');
const { rand, getProperties, currentTime } = require('./generalFunctions');
const Mustache = require('mustache');
const Game = require('../models/Game.js');
const Groq = require('groq-sdk');

function logMessage(message, chatName, messageLevel) {
  const template = `CHAT: {{chatName}} || FROM: {{author}} || MESSAGE: {{body}}`;
  const values = {
    chatName,
    author: message.author,
    body: message.body.join(' '),
  };
  const newMessage = Mustache.render(template, values);

  switch (messageLevel) {
    case 'success':
      console.log(newMessage);
      break;
    case 'locked':
      console.warn(newMessage);
      break;
    case 'invalid':
      console.error(newMessage);
      break;
  }
}

function filterWhatsapp(whatsapp) {
  return getProperties(whatsapp, [], ['sendMessage', 'on', 'initialize']);
}

function filterMessage(message) {
  message.body = message.body
    .toLowerCase()
    .split(' ')
    .filter((word) => word != '');
  message.author = message.author.match(/\d+/)[0];

  return getProperties(message, ['body', 'author', 'from'], ['react', 'reply']);
}

function filterChat(chat) {
  return getProperties(chat, ['id', 'name', 'isGroup'], ['sendMessage']);
}

function validateMessage(msg, chat) {
  return (
    currentTime() - msg.timestamp < constants.MESSAGE_MAX_AGE && chat.isGroup
  );
}

async function lockGame(game) {
  await game.set('lock', currentTime());
}

async function unlockGame(game) {
  await game.set('lock', null);
}

async function validateLock(game) {
  if (!game.lock) {
    return true;
  } else if (BigInt(currentTime()) - game.lock > constants.LOCK_MAX_AGE) {
    // For cases where a game still has a lock because of an external error
    await unlockGame(game);
    return true;
  } else {
    return false;
  }
}

async function getGame(chat) {
  let game = await Game.get(chat.id.user);
  if (!game) {
    game = await Game.create(chat.id.user, chat.name);
  }

  return game;
}
const getRandomKey = () => {
  const values = process.env.GROQ_API_KEYS.split(',').filter(
    (key) => key != '',
  );
  return values[rand(values.length)];
};

async function translate(body) {
  const groq = new Groq({ apiKey: getRandomKey() });

  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
Your name is Pok.

The message you will receive is poker related.
Your goal is to translate it to a command.

The possible commands are:
pok check - checks the actions and move the turn to the next player.
pok call - calls the current bet
pok all (in) - puts all your chips in the pot
pok raise [amount] - raises the specified amount
pok fold - folds the hand
pok buy [amount] - buys more chips to the table
pok help - Shows the available commands
pok start - starts the game
pok join [amount] - adds you to the game. If you also specified an amount, it will buy that amount
pok show - Shows the pot value, the players, the players order, the players statues, the players bets and the current player
pok exit - remove you from the game
pok end - ends the game for everyone

Answer either:
1.  A command from the command list exactly as it's written
2. Only 'not related'

Don't include any extra data in your answer
For non-English messages return 'not related'

Translate:
`,
      },
      {
        role: 'user',
        content: `${body} `,
      },
    ],

    model: `${constants.MODEL}`,
    temperature: 0.7,
  });
}

async function messageToCommand(body) {
  const groqOutput = await translate(body);

  let newBody = groqOutput.choices[0]?.message?.content;
  return newBody.split(' ').filter((word) => word != '' && word !== '\n');
}

module.exports = {
  validateMessage,
  filterWhatsapp,
  filterMessage,
  filterChat,
  logMessage,
  validateLock,
  lockGame,
  unlockGame,
  getGame,
  translate,
  messageToCommand,
};
