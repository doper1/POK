const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const router = require("./routes/router.js");
const { isLocked } = require("./generalFunctions.js");

// globals
let games = {};

// Variables that differs between prod and dev
let event;

const mode = process.env.ENV;
if (mode === "prod") {
  console.log("PRODUCTION MODE");
  event = "message";
} else {
  console.log("DEVELOPEMNT MODE");
  event = "message_create";
}

let whatsapp = new Client({
  authStrategy: new LocalAuth()
});

whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true
  });
});

whatsapp.on("call", async (call) => {
  await call.reject();
});

// The main entry point
whatsapp.on(event, async (message_promise) => {
  let message = await message_promise;
  const chat = await message.getChat();
  const body = message.body.toLowerCase().split(" ");

  if (!isLocked()) {
    if (router.validateMessage(message, body, chat)) {
      router.route(whatsapp, message, body, chat, games);
    }
  }
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.initialize();
