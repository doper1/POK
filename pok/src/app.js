require('dotenv').config();
const qrCode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const middleware = require('./utils/middleware.js');
const router = require('./router/index.js');
const constants = require('./utils/constants');
const actions = require('./router/actions.js');

middleware.validateEnvVariables();

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
whatsapp = middleware.filterWhatsapp(whatsapp);

// message_create: in case you want to play with the number the bot is hosted on
// message: will be more optimized - ignore all of its own messages
whatsapp.on('message_create', async (msg) => {
  if (msg.author == undefined) return; // Prevents replying to its own replies and on private chats

  const message = middleware.filterMessage(msg);
  const chat = middleware.filterChat(await msg.getChat());

  if (!middleware.validateEnv(chat.name)) {
    return;
  }

  if (!middleware.validateMessage(msg)) {
    middleware.logMessage(
      message.body.join(' '),
      message.author,
      chat.name,
      'invalid',
    );
    return;
  }

  const game = await middleware.getGame(chat.id.user, chat.name);

  if (!(await middleware.validateLock(game))) {
    middleware.logMessage(
      message.body.join(' '),
      message.author,
      chat.name,
      'locked',
    );
    return;
  }

  if (message.body[0] !== 'pok') {
    message.body = await middleware.messageToCommand(message.body);
  }

  if (message.body[0] !== 'pok') {
    return;
  }

  middleware.logMessage(
    message.body.join(' '),
    message.author,
    chat.name,
    'success',
  );

  await middleware.lockGame(game);

  const current = await game.getPlayer(message.author);

  const params = {
    whatsapp,
    message,
    chat,
    game,
    current,
  };

  await router(params);

  await middleware.unlockGame(game);
});

// Handle private messages
whatsapp.on('message', async (msg) => {
  const chat = middleware.filterChat(await msg.getChat());

  if (!chat.isGroup) {
    const output = await middleware.translate(
      msg.body,
      constants.ANSWER_SYSTEM_MESSAGE,
    );

    middleware.logMessage(msg.body, msg.from, chat.name, 'success');

    if (process.env.ENV.toLocaleLowerCase().startsWith('dev')) {
      console.log(`DEV translated message: ${output}`);
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

  if (!middleware.validateEnv(chatName)) {
    return;
  }

  const game = await middleware.getGame(chatId, chatName);

  try {
    await whatsapp.sendMessage(
      `${game.id}@g.us`,
      `*Welcome to the poker table!*\n\n${constants.HELP_MESSAGE}`,
    );

    middleware.logMessage(`EVENT Player join`, playerId, chatName, 'success');
  } catch (error) {
    middleware.logMessage(
      `EVENT Player join error: ${error}`,
      playerId,
      chatName,
      'error',
    );
  }
});
// When player leaves or is removed, exit them from the game.
// If the bot is removed, delete the game data and exit all players.
whatsapp.on('group_leave', async (event) => {
  const chatId = event.chatId.split('@')[0];
  const playerId = event.id.participant.split('@')[0];
  const game = await middleware.getGame(chatId);
  const groupName = game.groupName;

  if (!middleware.validateEnv(groupName)) {
    return;
  }

  if (event.id.participant.startsWith(process.env.PHONE_NUMBER)) {
    try {
      const players = await game.getPlayers();

      // Refund all players by "exiting" them.
      for (const player of players) {
        await actions.exit(game, player, whatsapp, true);

        middleware.logMessage(
          `EVENT Exited player`,
          player.userId,
          groupName,
          'success',
        );
      }

      await game.delete();

      middleware.logMessage(
        `EVENT Chat removed and game data cleaned for group`,
        'System',
        groupName,
        'success',
      );
    } catch (error) {
      middleware.logMessage(
        `EVENT Error handling chat removal: ${error}`,
        'System',
        groupName,
        'error',
      );
    }
    return;
  }

  try {
    const current = await game.getPlayer(playerId);

    if (current !== undefined) {
      await actions.exit(game, current, whatsapp, false);
    }

    middleware.logMessage(`EVENT Group leave`, playerId, groupName, 'success');
  } catch (error) {
    middleware.logMessage(
      `EVENT Group leave error: ${error}`,
      playerId,
      groupName,
      'error',
    );
  }
});

// Update the name of a group on name change
whatsapp.on('group_update', async (event) => {
  const chatId = event.chatId.split('@')[0];
  const chatName = (await whatsapp.getChatById(event.chatId)).name;
  const game = await middleware.getGame(chatId, chatName);
  const oldName = game.groupName;

  if (!middleware.validateEnv(oldName)) {
    return;
  }

  switch (event.type) {
    case 'subject': {
      try {
        await game.set('groupName', event.body);
        middleware.logMessage(
          `EVENT Subject change: ${event.body}`,
          event.id.participant,
          oldName,
          'success',
        );
      } catch (error) {
        middleware.logMessage(
          `EVENT Subject change error: ${error}`,
          event.id.participant,
          event.body,
          'error',
        );
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
  console.warn('-----| Client is ready |-----');
});

whatsapp.initialize();
