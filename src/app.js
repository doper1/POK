const qrCode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const router = require('./routes/router.js');
const { isLocked, cleanInstance } = require('./generalFunctions.js');

// globals
let games = {};

// Variables that differs between prod and dev
let event;

const mode = process.env.ENV;
if (mode === 'prod') {
  console.log('PRODUCTION MODE');
  event = 'message';
} else {
  console.log('DEVELOPMENT MODE');
  event = 'message_create';
}

let whatsapp = new Client({
  authStrategy: new LocalAuth()
});

// Clean up the whatsapp instance before passing it to the router
whatsapp = cleanInstance(whatsapp, [], ['sendMessage', 'on', 'initialize']);

// Event listeners
whatsapp.on(event, async (messagePromise) => {
  let message = await messagePromise;
  let chat = await message.getChat();
  const body = message.body.toLowerCase().split(' ');

  message = cleanInstance(
    message,
    ['timestamp', 'author'],
    ['getContact', 'getChat', 'react', 'reply']
  );
  chat = cleanInstance(chat, ['id', 'name', 'isGroup'], ['sendMessage']);

  if (!isLocked()) {
    if (router.validateMessage(message, body, chat)) {
      router.route(whatsapp, message, body, chat, games);
    }
  }
});

whatsapp.on('call', async (call) => {
  await call.reject();
});

whatsapp.on('qr', (qr) => {
  qrCode.generate(qr, {
    small: true
  });
});

whatsapp.on('ready', () => {
  console.log('Client is ready!');
});

whatsapp.initialize();
