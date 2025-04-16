const constants = require('./constants');
const { logger } = require('./middleware');
const {
  validateMessage,
  validateLock,
  filterWhatsapp,
  filterMessage,
  filterChat,
  lockGame,
  unlockGame,
  getGame,
  messageToCommand,
} = require('./middleware');

// Message validation
function validateMessageObject(message) {
  return message && 
         Array.isArray(message.body) && 
         typeof message.author === 'string' && 
         typeof message.from === 'string' && 
         typeof message.timestamp === 'number';
}

// Group update validation
function validateGroupUpdate(update) {
  return update && 
         update.chat && 
         typeof update.chat.id === 'string' && 
         typeof update.chat.name === 'string' && 
         typeof update.chat.isGroup === 'boolean' && 
         Array.isArray(update.changes) && 
         update.changes.every(change => 
           typeof change.actor === 'string' && 
           typeof change.action === 'string',
         );
}

async function groupUpdate(whatsapp, changes) {
  try {
    const filteredWhatsapp = filterWhatsapp(whatsapp);
    const chat = await filteredWhatsapp.getChatById(changes.chat.id);
    const filteredChat = filterChat(chat);

    if (!validateGroupUpdate({ chat: filteredChat, changes })) {
      throw new Error('Invalid group update format');
    }

    const game = await getGame(filteredChat.id, filteredChat.name);
    if (!game) return;

    // Handle different types of group updates
    for (const change of changes.changes) {
      switch (change.action) {
        case 'promote':
          await handlePromote(game, change);
          break;
        case 'demote':
          await handleDemote(game, change);
          break;
        case 'invite':
          await handleInvite(game, change);
          break;
        case 'remove':
          await handleRemove(game, change);
          break;
        default:
          logger.warn(`Unhandled group update action: ${change.action}`, { metadata: { chatName: filteredChat.name, author: 'System' } });
      }
    }
  } catch (error) {
    logger.error(`Group update error`, { metadata: { chatName: changes.chat.name, author: 'System', error: error.message } });
  }
}

async function groupLeave(whatsapp, chat) {
  try {
    const filteredWhatsapp = filterWhatsapp(whatsapp);
    const filteredChat = filterChat(chat);

    if (!filteredChat.isGroup) return;

    const game = await getGame(filteredChat.id, filteredChat.name);
    if (!game) return;

    await handleGroupLeave(game);
  } catch (error) {
    logger.error(`Group leave error`, { metadata: { chatName: chat.name, author: 'System', error: error.message } });
  }
}

async function groupJoin(event, whatsapp) {
  const chatId = event.chatId.split('@')[0];
  const playerId = event.id.participant.split('@')[0];
  const chatName = (await whatsapp.getChatById(event.chatId)).name;

  if (!middleware.validateEnv(chatName)) {
    return;
  }

  const game = await middleware.getGame(chatId, chatName);

  try {
    await whatsapp.sendMessage(
      `${game.id}@g.us`,
      `*Welcome to the poker table!*\n\n${constants.HELP_MESSAGE}`,
    );

    logger.info(`EVENT Player join`, { metadata: { chatName, author: playerId } });
  } catch (error) {
    logger.error(`EVENT Player join error`, { metadata: { chatName, author: playerId, error: error.message } });
  }
}

async function message(msg) {
  const chat = middleware.filterChat(await msg.getChat());

  if (!chat.isGroup) {
    const output = await middleware.translate(
      msg.body,
      constants.ANSWER_SYSTEM_MESSAGE,
    );

    logger.info(msg.body, { metadata: { chatName: chat.name, author: msg.from } });

    if (process.env.ENV.toLocaleLowerCase().startsWith('dev')) {
      logger.info(`DEV translated message: ${output}`, { metadata: { chatName: chat.name, author: msg.from } });
    } else {
      msg.reply(output);
    }

    return;
  }
}

async function messageCreate(whatsapp, message) {
  try {
    if (!validateMessage(message)) {
      logger.warn('Invalid message format', { metadata: { chatName: message.from, author: message.author } });
      return;
    }

    const filteredWhatsapp = filterWhatsapp(whatsapp);
    const filteredMessage = filterMessage(message);
    const chat = await filteredWhatsapp.getChatById(filteredMessage.from);
    const filteredChat = filterChat(chat);

    // Validate message format
    const validatedMessage = validateMessageObject(filteredMessage);

    // Rate limiting check
    if (!await checkRateLimit(validatedMessage.author)) {
      logger.warn('Rate limit exceeded', { metadata: { chatName: filteredChat.name, author: validatedMessage.author } });
      return;
    }

    // Process message based on chat type
    if (filteredChat.isGroup) {
      await handleGroupMessage(filteredChat, validatedMessage);
    } else {
      await handlePrivateMessage(filteredChat, validatedMessage);
    }
  } catch (error) {
    logger.error(`Message processing error`, { metadata: { chatName: message.from, author: 'System', error: error.message } });
  }
}

// Enhanced group message handler with game state management
async function handleGroupMessage(chat, message) {
  const game = await getGame(chat.id, chat.name);
  if (!game) return;

  try {
    await validateLock(game);
    await lockGame(game);

    const command = await messageToCommand(message.body);
    if (!command || command.length === 0) {
      logger.warn('Invalid command format', { metadata: { chatName: chat.name, author: message.author } });
      return;
    }

    await processGameCommand(game, command, message.author);
  } catch (error) {
    logger.error(`Group message error`, { metadata: { chatName: chat.name, author: 'System', error: error.message } });
  } finally {
    await unlockGame(game);
  }
}

// Enhanced private message handler
async function handlePrivateMessage(chat, message) {
  try {
    const command = await messageToCommand(message.body);
    if (!command || command.length === 0) {
      logger.warn('Invalid command format', { metadata: { chatName: chat.name, author: message.author } });
      return;
    }

    await processPrivateCommand(chat, command, message.author);
  } catch (error) {
    logger.error(`Private message error`, { metadata: { chatName: chat.name, author: 'System', error: error.message } });
  }
}

// Rate limiting implementation
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

async function checkRateLimit(userId) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || { count: 0, windowStart: now };

  if (now - userLimits.windowStart > RATE_LIMIT_WINDOW) {
    userLimits.count = 0;
    userLimits.windowStart = now;
  }

  if (userLimits.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userLimits.count++;
  rateLimits.set(userId, userLimits);
  return true;
}

// Game command processing
async function processGameCommand(game, command, userId) {
  const [action, ...args] = command;
  
  switch (action) {
    case 'join':
      await handleJoin(game, userId);
      break;
    case 'exit':
      await handleExit(game, userId);
      break;
    case 'start':
      await handleStart(game, userId);
      break;
    case 'end':
      await handleEnd(game, userId);
      break;
    default:
      logger.warn(`Unknown command: ${action}`, { metadata: { chatName: game.chatName, author: userId } });
  }
}

// Private command processing
async function processPrivateCommand(chat, command, userId) {
  const [action, ...args] = command;
  
  switch (action) {
    case 'help':
      await handleHelp(chat, userId);
      break;
    case 'stats':
      await handleStats(chat, userId);
      break;
    default:
      logger.warn(`Unknown private command: ${action}`, { metadata: { chatName: chat.name, author: userId } });
  }
}

// Group event handlers
async function handlePromote(game, change) {
  logger.info(`${change.actor} promoted ${change.target}`, { metadata: { chatName: game.chatName, author: 'System' } });
}

async function handleDemote(game, change) {
  logger.info(`${change.actor} demoted ${change.target}`, { metadata: { chatName: game.chatName, author: 'System' } });
}

async function handleInvite(game, change) {
  logger.info(`${change.actor} invited ${change.target}`, { metadata: { chatName: game.chatName, author: 'System' } });
}

async function handleRemove(game, change) {
  logger.info(`${change.actor} removed ${change.target}`, { metadata: { chatName: game.chatName, author: 'System' } });
}

async function handleGroupLeave(game) {
  logger.info('Bot left the group', { metadata: { chatName: game.chatName, author: 'System' } });
  // Clean up game state if needed
}

// Game action handlers
async function handleJoin(game, userId) {
  if (game.isStarted) {
    logger.warn('Cannot join a game that has already started', { metadata: { chatName: game.chatName, author: userId } });
    return;
  }

  if (game.players.includes(userId)) {
    logger.warn('You are already in the game', { metadata: { chatName: game.chatName, author: userId } });
    return;
  }

  game.players.push(userId);
  await game.save();
  logger.info(`${userId} joined the game`, { metadata: { chatName: game.chatName, author: userId } });
}

async function handleExit(game, userId) {
  if (!game.players.includes(userId)) {
    logger.warn('You are not in the game', { metadata: { chatName: game.chatName, author: userId } });
    return;
  }

  game.players = game.players.filter(p => p !== userId);
  await game.save();
  logger.info(`${userId} left the game`, { metadata: { chatName: game.chatName, author: userId } });
}

async function handleStart(game, userId) {
  if (game.isStarted) {
    logger.warn('Game has already started', { metadata: { chatName: game.chatName, author: userId } });
    return;
  }

  if (game.players.length < 2) {
    logger.warn('Not enough players to start the game', { metadata: { chatName: game.chatName, author: userId } });
    return;
  }

  game.isStarted = true;
  await game.save();
  logger.info('Game started!', { metadata: { chatName: game.chatName, author: 'System' } });
}

async function handleEnd(game, userId) {
  if (!game.isStarted) {
    logger.warn('No game is currently running', { metadata: { chatName: game.chatName, author: userId } });
    return;
  }

  game.isStarted = false;
  game.players = [];
  await game.save();
  logger.info('Game ended', { metadata: { chatName: game.chatName, author: 'System' } });
}

// Private command handlers
async function handleHelp(chat, userId) {
  const helpMessage = `
Available commands:
- join: Join the current game
- exit: Leave the current game
- start: Start the game
- end: End the current game
- help: Show this help message
- stats: Show your game statistics
  `;
  
  await chat.sendMessage(helpMessage);
  logger.info('Help message sent', { metadata: { chatName: chat.name, author: userId } });
}

async function handleStats(chat, userId) {
  // Implement stats retrieval and display
  const stats = await getPlayerStats(userId);
  await chat.sendMessage(`Your stats: ${JSON.stringify(stats, null, 2)}`);
  logger.info('Stats sent', { metadata: { chatName: chat.name, author: userId } });
}

// Stats retrieval
async function getPlayerStats(userId) {
  // Implement stats retrieval from database
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    winRate: '0%',
  };
}

module.exports = {
  groupUpdate,
  groupLeave,
  groupJoin,
  message,
  messageCreate,
};
