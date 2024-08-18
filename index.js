// Packages
let qrcode = require("qrcode-terminal");
let { Client, LocalAuth } = require("whatsapp-web.js");

// Scripts
let constants = require("./constants");
let pok_functions = require("./scripts/pok_functions");
let general_functions = require("./scripts/general_functions");

whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

whatsapp.on("call", async (call) => {
  await call.reject();
  await whatsapp.sendMessage(call.from, `Don't call me, I'm just a bot :)`);
});

let games = {};
whatsapp.on("message_create", async (msg) => {
  // On production change from "message_create" to "message" -> to prevent spamming of this function
  let message = await msg;
  let contact = await message.getContact();
  let chat = await message.getChat();
  let chat_id = chat.id.user;
  let user_msg = message.body.toLowerCase().split(" ");

  const message_age = Math.floor(Date.now() / 1000) - message.timestamp;
  if (message_age > constants.message_timeout) return;

  if (user_msg[0] != "pok") return; // Do not respond to messages that do not start with "pok"

  if (contact.pushname === undefined) {
    // Prevent crushes when the user does not have a whatsapp name
    full_name = contact.id.user;
  } else {
    full_name = contact.pushname;
  }

  // Answer only when message starts with "pok"
  if (!(games[chat_id] != undefined && games[chat_id].is_midround)) {
    // Before the game starts
    switch (user_msg[1]) {
      case "help":
        message.reply(constants.help_pre_game);
        break;
      case "join":
        pok_functions.join(games, chat_id, message, full_name, contact, chat);
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
  } else {
    // During the game
    switch (user_msg[1]) {
      case "check":
        if (pok_functions.check(games[chat_id], message))
          games[chat_id].updateRound(
            whatsapp,
            `${games[chat_id].order.current_player.name} checked`
          );
        break;
      case "raise":
        let raise_amount = Number(user_msg[2]);

        if (user_msg[2] == "all") {
          if (pok_functions.all_in(games[chat_id], message, user_msg)) {
            games[chat_id].updateRound(
              whatsapp,
              `${
                games[chat_id].order.current_player.name
              } is ALL IN for $${games[chat_id].pot.current_round_bets.at(-1)}`
            );
          }
        } else if (!Number.isNaN(raise_amount)) {
          if (pok_functions.raise(games[chat_id], message, raise_amount)) {
            games[chat_id].updateRound(
              whatsapp,
              `${games[chat_id].order.current_player.name} raised $${games[
                chat_id
              ].pot.current_round_bets.at(-1)}`
            );
          }
        } else {
          message.reply("Enter either amount (e.g. 3) or 'all in'");
        }
        break;
      case "all":
        if (pok_functions.all_in(games[chat_id], message, user_msg)) {
          games[chat_id].updateRound(
            whatsapp,
            `${games[chat_id].order.current_player.name} is ALL IN for $${games[
              chat_id
            ].pot.current_round_bets.at(-1)}`
          );
        }
        break;
      case "fold":
        if (pok_functions.fold(games[chat_id], message))
          games[chat_id].updateRound(
            whatsapp,
            `${games[chat_id].order.current_player.name} folded`
          );
        break;
      case "call":
        if (pok_functions.call(games[chat_id], message))
          games[chat_id].updateRound(
            whatsapp,
            `${games[chat_id].order.current_player.name} calls $${games[
              chat_id
            ].pot.current_round_bets.at(-1)}`
          );
        break;
      case "help":
        message.reply(constants.help_in_game);
        break;
      case "join":
        pok_functions.join(games, chat_id, message, full_name, contact, chat);
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
          message.react(general_functions.emote(constants.mistake_emojies));
          message.reply("There is a game in progress");
        } else {
          message.reply(constants.help_in_game);
        }
    }
  }
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.initialize();
