// Packages
let qrcode = require("qrcode-terminal");
let { Client, LocalAuth } = require("whatsapp-web.js");

// Scripts
let constants = require("./constants");
let general_functions = require("./scripts/general_functions");
let game_functions = require("./scripts/game_functions");
let pok_functions = require("./scripts/pok_functions");

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
  if (!chat.isGroup) return; // Prevents the bot from replaying to non-group chats
  let contact = await message.getContact();
  let chat_id = chat.id.user;

  if (
    chat.name.includes("נבחרתם שבוע הבא") ||
    chat.name.includes("טסטים פוקר") ||
    chat.name.includes("קלף חינם")
  ) {
    let user_msg = message.body.toLowerCase().split(" ");

    if (user_msg[0] === "pok") {
      if (!(games[chat_id] != undefined && games[chat_id].midround)) {
        if (user_msg.length === 1) {
          message.reply(constants.help_pre_game);
        } else {
          switch (user_msg[1]) {
            case "help":
              message.reply(constants.help_pre_game);
              break;
            case "join":
              pok_functions.join(games, chat_id, message, contact);
              break;
            case "show":
              pok_functions.show(games, chat_id, message);
              break;
            case "exit":
              pok_functions.exit(games, chat_id, message);
              break;
            case "start":
              pok_functions.start(whatsapp, chat, chat_id, message, games);
              break;
            case "end":
              pok_functions.end(games, chat_id, message, contact);
              break;
            case "open": // TO REMOVE
              games[chat_id].CommunityCards.push(games[chat_id].deck.pop());
              games[chat_id].players.forEach((player) => {
                game_functions.update_hand_str(games[chat_id], player);
              });
              message.reply(
                `Cards on table are:
                \n ${game_functions.print_cards(games[chat_id].CommunityCards)}`
              );
              for (let i = 0; i < games[chat_id].players.length; i++) {
                whatsapp.sendMessage(
                  games[chat_id].players[i].getPhoneNumber(),
                  `${chat.name}
-------------
Community Cards:
${game_functions.print_cards(games[chat_id].CommunityCards)}
Hand Cards: ${game_functions.print_cards(games[chat_id].players[i].hole_cards)}
Hand strength: ${
                    constants.strength_dict[
                      Object.keys(games[chat_id].players[i].hand_score)[0]
                    ]
                  }
      ${game_functions.print_cards(
        games[chat_id].players[i].hand_score[
          Object.keys(games[chat_id].players[i].hand_score)[0]
        ]
      )}
Stack: $${games[chat_id].players[i].game_money}`
                );
              }
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
            case "help":
              message.reply(constants.help_in_game);
              break;
            case "join":
              pok_functions.join(games, chat_id, message, contact);
              break;
            case "show":
              pok_functions.show(games, chat_id, message);
              break;
            case "exit":
              pok_functions.exit(games, chat_id, message, contact);
              break;
            default:
              message.reply(constants.help_in_game);
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
