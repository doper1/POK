// Packages
let qrcode = require("qrcode-terminal");
let { Client, LocalAuth } = require("whatsapp-web.js");

// Scripts
let constants = require("./constants");
let pok_functions = require("./scripts/pok_functions");
let { emote } = require("./scripts/general_functions");

const mode = process.env.ENV;
// Variables that differs between prod and dev
let event;
if (mode === "prod") {
  console.log("PRODUCTION MODE");

  // Prod variables
  event = "message";
} else {
  console.log("DEVELOPEMNT MODE");

  // Dev variables
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

let games = {};
whatsapp.on(event, async (msg) => {
  // On production change from "message_create" to "message" -> to prevent spamming of this function
  let message = await msg;
  let contact = await message.getContact();
  let chat = await message.getChat();
  let chat_id = chat.id.user;
  let user_msg = message.body.toLowerCase().split(" ");

  // Prevents response to all messages
  const message_age = Math.floor(Date.now() / 1000) - message.timestamp;
  if (message_age > constants.MESSAGE_TIMEOUT) return;

  // Prevents response to messages in DM
  if (!chat.isGroup) return;

  // Prevents response to unrelated messages in groups the bot is a member of
  if (user_msg[0] != "pok") return;

  let full_name;
  // Prevent crushes when the user does not have a whatsapp name
  if (contact.pushname == undefined) {
    full_name = contact.id.user;
  } else {
    full_name = contact.pushname;
  }

  let game = games[chat_id];
  if (!(game != undefined && game.is_midround)) {
    // Before a game starts
    switch (user_msg[1]) {
      case "help":
        message.reply(constants.HELP_PRE_GAME);
        break;
      case "join":
        pok_functions.join(games, chat_id, message, full_name, contact, chat);
        break;
      case "show":
        pok_functions.show(game, message);
        break;
      case "exit":
        pok_functions.exit(games, chat_id, message, full_name);
        break;
      case "start":
        pok_functions.start(game, message, whatsapp);
        break;
      default:
        message.reply(constants.HELP_PRE_GAME);
    }
  } else {
    let current = game.order.current_player;
    let raise_amount;

    // During a game
    switch (user_msg[1]) {
      case "check":
        if (pok_functions.check(game, message))
          game.updateRound(whatsapp, `@${current.contact.id.user} checked`);
        break;
      case "raise":
        raise_amount = Number(user_msg[2]);

        if (user_msg[2] == "all" || current.game_money == raise_amount) {
          if (pok_functions.all_in(game, message, user_msg)) {
            game.updateRound(
              whatsapp,
              `@${current.contact.id.user} is ALL IN for $${current.game_money} more (total $${current.current_bet})`
            );
          }
        } else if (pok_functions.raise(game, message, raise_amount)) {
          game.updateRound(
            whatsapp,
            `@${current.contact.id.user} raised $${raise_amount}`
          );
        }
        break;
      case "all":
        raise_amount = current.game_money;

        if (pok_functions.all_in(game, message, user_msg)) {
          game.updateRound(
            whatsapp,
            `@${current.contact.id.user} is ALL IN for $${raise_amount} more (total $${current.current_bet})`
          );
        }
        break;
      case "fold":
        if (pok_functions.fold(game, message))
          game.updateRound(whatsapp, `@${current.contact.id.user} folded`);
        break;
      case "call":
        raise_amount =
          game.pot.current_bet - game.order.current_player.current_bet;
        if (raise_amount >= current.game_money) {
          if (pok_functions.all_in(game, message, user_msg)) {
            game.updateRound(
              whatsapp,
              `@${current.contact.id.user} is ALL IN for $${raise_amount} more (total $${current.current_bet})`
            );
          }
        } else if (pok_functions.call(game, message))
          game.updateRound(
            whatsapp,
            `@${current.contact.id.user} calls $${raise_amount}`
          );
        break;
      case "help":
        message.reply(constants.HELP_IN_GAME);
        break;
      case "join":
        pok_functions.join(games, chat_id, message, full_name, contact, chat);
        break;
      case "show":
        pok_functions.show(game, message);
        break;
      case "exit":
        pok_functions.exit(games, chat_id, message, contact);
        break;
      case "end":
        pok_functions.end(games, chat_id, message);
        break;
      default:
        if (user_msg[1] == "start") {
          message.react(emote("mistake"));
          message.reply("There is a game in progress");
        } else {
          message.reply(constants.HELP_IN_GAME);
        }
    }
  }
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.initialize();
