require('dotenv').config();
const qrCode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { logger, validateEnvVariables, filterWhatsapp, filterMessage, filterChat, validateEnv, validateMessage, getGame, validateLock, lockGame, messageToCommand, unlockGame, translate, validateDatabaseConnection } = require('./utils/middleware.js');
const router = require('./router/index.js');
const constants = require('./utils/constants');
const actions = require('./router/actions.js');

validateEnvVariables();

// Validate database connection at startup
(async () => {
  try {
    await validateDatabaseConnection();
  } catch (error) {
    logger.error(`Failed to connect to PostgreSQL database: ${error.message}`, { 
      metadata: { 
        errorCode: error.code,
        database: process.env.POSTGRES_DB 
      } 
    });
    
    // In development mode, continue without database (non-blocking)
    if (process.env.ENV?.toLowerCase().startsWith('dev')) {
      logger.warn('Running in development mode - continuing without database connection');
    } else {
      // In production mode, exit on database failure
      logger.error('Production mode - exiting due to database connection failure');
      process.exit(1);
    }
  }
})();

let whatsapp = new Client({
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  },
  authStrategy: new LocalAuth({ dataPath: './auth' }),
});

// Clean up the whatsapp instance before passing it to the routes
whatsapp = filterWhatsapp(whatsapp);

// message_create: in case you want to play with the number the bot is hosted on
// message: will be more optimized - ignore all of its own messages
whatsapp.on('message_create', async (msg) => {
  if (msg.author == undefined) return; // Prevents replying to its own replies and on private chats
  const message = await filterMessage(msg);
  const chat = filterChat(await msg.getChat());

  if (!validateEnv(chat.name)) {
    return;
  }

  if (!validateMessage(msg)) {
    logger.warn(message.body.join(' '), { metadata: { author: message.author, chatName: chat.name } });
    return;
  }

  const game = await getGame(chat.id.user, chat.name);

  if (!(await validateLock(game))) {
    logger.warn(message.body.join(' '), { metadata: { author: message.author, chatName: chat.name } });
    return;
  }

  if (message.body[0] !== 'pok') {
    message.body = await messageToCommand(message.body);
  }

  if (message.body[0] !== 'pok') {
    return;
  }

  // Pass author and chatName directly, not nested under 'metadata'
  logger.info(message.body.join(' '), { author: message.author, chatName: chat.name });

  await lockGame(game);

  const current = await game.getPlayer(message.author);

  const params = {
    whatsapp,
    message,
    chat,
    game,
    current,
  };

  await router(params);

  await unlockGame(game);
});

// Handle private messages
whatsapp.on('message', async (msg) => {
  const chat = filterChat(await msg.getChat());

  if (!chat.isGroup) {
    const output = await translate(
      msg.body,
      constants.ANSWER_SYSTEM_MESSAGE,
    );

    logger.info(msg.body, { metadata: { author: msg.from, chatName: chat.name } });

    if (process.env.ENV.toLocaleLowerCase().startsWith('dev')) {
      logger.info(`DEV translated message: ${output}`, { metadata: { author: msg.from, chatName: chat.name } });
    } else {
      msg.reply(output);
    }

    return;
  }
});

// ----- Special Event Handlers -----

// When player is added/joined using invite, greet them with a helper message.
whatsapp.on('group_join', async (event) => {
  const chatId = event.chatId.split('@')[0];
  const playerId = event.id.participant.split('@')[0];
  const chatName = (await whatsapp.getChatById(event.chatId)).name;

  if (!validateEnv(chatName)) {
    return;
  }

  const game = await getGame(chatId, chatName);

  try {
    await whatsapp.sendMessage(
      `${game.id}@g.us`,
      `*Welcome to the poker table!*\n\n${constants.HELP_MESSAGE}`,
    );

    logger.info('EVENT Player join', { metadata: { author: playerId, chatName: chatName } });
  } catch (error) {
    logger.error('EVENT Player join error', { metadata: { author: playerId, chatName: chatName, error: error.message } });
  }
});
// When player leaves or is removed, exit them from the game.
// If the bot is removed, delete the game data and exit all players.
whatsapp.on('group_leave', async (event) => {
  const chatId = event.chatId.split('@')[0];
  const playerId = event.id.participant.split('@')[0];
  const game = await getGame(chatId);
  const groupName = game.groupName;

  if (!validateEnv(groupName)) {
    return;
  }

  if (event.id.participant.startsWith(process.env.PHONE_NUMBER)) {
    try {
      const players = await game.getPlayers();

      // Refund all players by "exiting" them.
      for (const player of players) {
        await actions.exit(game, player, whatsapp, true);

        logger.info('EVENT Exited player', { metadata: { author: player.userId, chatName: groupName } });
      }

      await game.delete();

      logger.info('EVENT Chat removed and game data cleaned for group', { metadata: { author: 'System', chatName: groupName } });
    } catch (error) {
      logger.error('EVENT Error handling chat removal', { metadata: { author: 'System', chatName: groupName, error: error.message } });
    }
    return;
  }

  try {
    const current = await game.getPlayer(playerId);

    if (current !== undefined) {
      await actions.exit(game, current, whatsapp, false);
    }

    logger.info('EVENT Group leave', { metadata: { author: playerId, chatName: groupName } });
  } catch (error) {
    logger.error('EVENT Group leave error', { metadata: { author: playerId, chatName: groupName, error: error.message } });
  }
});

// Update the name of a group on name change
whatsapp.on('group_update', async (event) => {
  const chatId = event.chatId.split('@')[0];
  const chatName = (await whatsapp.getChatById(event.chatId)).name;
  const game = await getGame(chatId, chatName);
  const oldName = game.groupName;

  if (!validateEnv(oldName)) {
    return;
  }

  switch (event.type) {
    case 'subject': {
      try {
        await game.set('groupName', event.body);
        logger.info(`EVENT Subject change: ${event.body}`, { metadata: { author: event.id.participant, chatName: oldName } });
      } catch (error) {
        logger.error('EVENT Subject change error', { metadata: { author: event.id.participant, chatName: oldName, error: error.message } });
      }
      break;
    }
  }
});

// Reject phone calls
whatsapp.on('call', async (call) => {
  if (process.env.ENV !== 'dev') await call.reject();
});

// Generate a QR to authenticate the bot
whatsapp.on('qr', (qr) => {
  qrCode.generate(qr, {
    small: true,
  });
});

whatsapp.on('ready', () => {
  logger.warn('-----| Client is ready |-----');
});

whatsapp.initialize();
