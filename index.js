// Packages
let qrcode = require("qrcode-terminal");
let { Client, LocalAuth } = require("whatsapp-web.js");

// Scripts
let constants = require("./scripts/constants");
let general_functions = require("./scripts/general_functions");
let game_functions = require("./scripts/game_functions");
let pok_functions = require("./scripts/pok_functions");

// Classes

let whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});
let games = {};
whatsapp.on("message_create", async (msg) => {
  let message = await msg;
  let chat = await message.getChat();
  let contact = await message.getContact();
  let chat_id = chat.id._serialized.replace(/\D/g, "");

  if (
    chat.name.includes("נבחרתם שבוע הבא") ||
    chat.name.includes("טסטים פוקר") ||
    chat.name.includes("קלף חינם")
  ) {
    let user_msg = message.body.toLowerCase();
    let user_msg_split = user_msg.split(" ");

    if (user_msg_split[0] === "pok") {
      if (user_msg_split.length < 2) {
        pok_functions.help(chat, chat_id, contact, message, games);
      } else {
        try {
          if (games[chat_id] != undefined) {
            if (games[chat_id].midround) {
              if (user_msg_split in constants.ALLOWEDMIDROUND) {
                eval(
                  `game_functions.${user_msg_split[1]}(whatsapp,chat, chat_id, contact, message, games)`
                );
              } else {
                message.reply("in mid Not allowed mid round");
              }
            } else {
              eval(
                `pok_functions.${user_msg_split[1]}(whatsapp,chat, chat_id, contact, message, games)`
              );
            }
          } else {
            eval(
              `pok_functions.${user_msg_split[1]}(whatsapp,chat, chat_id, contact, message, games)`
            );
          }
        } catch (e) {
          message.reply("not a valid command!");
          console.log(e);
        }
      }
    }
  }
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.initialize();
