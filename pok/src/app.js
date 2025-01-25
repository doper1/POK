require('dotenv').config();
const qrCode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const middleware = require('./utils/middleware.js');
const preGameRoute = require('./routes/preGame/index.js');
const inGameRoute = require('./routes/inGame/index.js');
const constants = require('./utils/constants');

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
// message: will be more optimized- ignore all of it's own messages
whatsapp.on('message_create', async (msg) => {
  if (msg.author == undefined) return; // Prevents replying to it's own replies and on private chats

  const message = middleware.filterMessage(msg);
  const chat = middleware.filterChat(await msg.getChat());

  if (!middleware.validateEnv(chat.name)) {
    return;
  }

  if (!middleware.validateMessage(msg)) {
    middleware.logMessage(message.body.join(' '), chat.name, 'invalid');
    return;
  }

  const game = await middleware.getGame(chat);

  if (!(await middleware.validateLock(game))) {
    middleware.logMessage(message.body.join(' '), chat.name, 'locked');
    return;
  }

  if (message.body[0] !== 'pok') {
    message.body = await middleware.messageToCommand(message.body);
  }

  if (message.body[0] !== 'pok') {
    return;
  }

  middleware.logMessage(message.body.join(' '), chat.name, 'success');

  await middleware.lockGame(game);

  const current = await game.getPlayer(message.author);

  const params = {
    whatsapp,
    message,
    chat,
    game,
    current,
  };

  if (!current || game.status === 'pending') {
    await preGameRoute(params);
  } else {
    await inGameRoute(params);
  }

  await middleware.unlockGame(game);
});

whatsapp.on('message', async (msg) => {
  const chat = middleware.filterChat(await msg.getChat());

  if (!chat.isGroup) {
    const output = await middleware.translate(
      msg.body,
      constants.ANSWER_SYSTEM_MESSAGE,
    );

    middleware.logMessage(msg.body, chat.name, 'success');

    if (process.env.env === 'dev') {
      console.log(`DEV translated message: ${output}`);
    } else {
      msg.reply(output);
    }

    return;
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
