// Packages
let qrcode = require("qrcode-terminal");
let { Client, LocalAuth } = require("whatsapp-web.js");

// Scripts
let constants = require("./constants");
let pok_functions = require("./scripts/pok_functions");
let general_functions = require("./scripts/general_functions");

// Classes
let game = require("./classes/Game");

let whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

whatsapp.on("call", async (call) => {
  await call.reject();
  await client.sendMessage(
    call.from,
    `\`\`\`This number can only receive text messages!\`\`\``
  );
});

let games = {};
whatsapp.on("message_create", async (msg) => {
  // On production change from "message_create" to "message" -> to prevent spamming of this function
  let message = await msg;
  let chat = await message.getChat();
  let chat_id = chat.id.user;
  let contact = await message.getContact();

  if (contact.pushname === undefined) {
    full_name = contact.id.user;
  } else {
    full_name = contact.pushname;
  }

  if (
    chat.name.includes("נבחרתם שבוע הבא") ||
    chat.name.includes("טסטים פוקר") ||
    chat.name.includes("קלף חינם")
  ) {
    // Remove on production
    let user_msg = message.body.toLowerCase().split(" ");

    if (user_msg[0] === "pok") {
      if (!(games[chat_id] != undefined && games[chat_id].is_midround)) {
        if (user_msg.length === 1) {
          message.reply(constants.help_pre_game);
        } else {
          switch (user_msg[1]) {
            case "help":
              message.reply(constants.help_pre_game);
              break;
            case "join":
              pok_functions.join(
                games,
                chat_id,
                message,
                full_name,
                contact,
                chat
              );
              break;
            case "show":
              pok_functions.show(games, chat_id, message);
              break;
            case "exit":
              pok_functions.exit(games, chat_id, message, full_name);
              break;
            case "start":
              pok_functions.start(games, chat_id, message, whatsapp, chat);
              break;
            default:
              message.reply(constants.help_pre_game);
          }
        }
      } else {
        if (user_msg.length === 1) {
          message.reply(constants.help_in_game);
        } else {
          switch (user_msg[1]) {
            case "check":
              if (general_functions.is_allowed(games[chat_id], message)) {
                if (games[chat_id].current_bet === 0) {
                  pok_functions.check(games, chat_id, message);
                } else {
                  message.reply(
                    `You need to call ($${
                      games[chat_id].current_bet -
                      games[chat_id].players[message.author].current_bet
                    } more)`
                  );
                }
              }
              break;
            case "raise":
              if (general_functions.is_allowed(games[chat_id], message)) {
                if (user_msg.length === 3) {
                  if (!Number.isInteger(Number(user_msg[2]))) {
                    message.reply(
                      `You need to specify a numerical raise amount (e.g. pok raise 100)
                    or either raise all in (e. pok raise all in)`
                    );
                  } else if (
                    games[chat_id].current_bet >
                    Number(user_msg[2]) +
                      games[chat_id].players[message.author].current_bet
                  ) {
                    message.reply(
                      `You need to call ($${
                        games[chat_id].current_bet -
                        games[chat_id].players[message.author].current_bet
                      } more)`
                    );
                  } else {
                    pok_functions.raise(games, chat_id, Number(user_msg[2]));
                  }
                } else {
                  message.react(
                    general_functions.emote(constants.mistake_emojies)
                  );
                  message.reply(`You need to specify a raise amount`);
                }
              }

              break;
            case "fold":
              if (general_functions.is_allowed(games[chat_id], message)) {
                pok_functions.fold(games, chat_id, message, full_name, chat);
              }
              break;
            case "call":
              if (general_functions.is_allowed(games[chat_id], message)) {
                if (
                  games[chat_id].current_bet ===
                  games[chat_id].players[message.author].current_bet
                ) {
                  game.chat.sendMessage(`No one bet so you don't need to call`);
                } else {
                  pok_functions.call(games, chat_id);
                }
              }
              break;
            case "help":
              message.reply(constants.help_in_game);
              break;
            case "join":
              pok_functions.join(
                games,
                chat_id,
                message,
                full_name,
                contact,
                chat
              );
              break;
            case "show":
              pok_functions.show(games, chat_id, message);
              break;
            case "exit":
              pok_functions.exit(games, chat_id, message, contact);
              break;
            case "end":
              pok_functions.end(games, chat_id, message);
              break;
            default:
              if (user_msg[1] === "start") {
                message.react(
                  general_functions.emote(constants.mistake_emojies)
                );
                message.reply("There is a game in progress");
              } else {
                message.reply(constants.help_in_game);
              }
          }
        }
      }
    }
  }
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.initialize();
