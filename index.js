// Packages
let qrcode = require("qrcode-terminal");
let { Client, LocalAuth } = require("whatsapp-web.js");

// Scripts
let constants = require("./scripts/constants");
let general_functions = require("./scripts/general_functions");
let poker_functions = require("./scripts/poker_functions");

// Classes
let Game = require("./classes/Game");

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

    // pok help - learn about the functions
    if (user_msg === "pok help") {
      message.reply(
        `Usage:
-------
♠️ pok help
♥️ pok join
♣️ pok show
♦️ pok exit
♠️ pok start
♥️ pok end
♣️ pok check
♦️ pok raise [raise amount]
♠️ pok fold`
      );
    }

    // pok join (the game)
    if (user_msg === "pok join") {
      if (!(chat_id in games)) {
        games[chat_id] = new Game(chat_id);
        games[chat_id].addPlayer(contact.pushname, message.author);
        message.reply(`${contact.pushname.split(" ")[0]} has joined the game!`);
      } else {
        let found = false;
        for (let i = 0; i < games[chat_id].players.length; i++) {
          if (message.author === games[chat_id].players[i].phone_number) {
            found = true;
            break;
          }
        }

        if (found) message.reply("you have already joined!");
        else {
          games[chat_id].addPlayer(contact.pushname, message.author);
          message.reply(
            `${contact.pushname.split(" ")[0]} have joined the game!`
          );
        }
      }
    }

    // pok show (players)
    if (user_msg === "pok show") {
      if (chat_id in games) {
        let players_list = "";
        let players = games[chat_id].players;

        if (!(chat_id in games)) {
          message.reply("There are no players on the table :(");
        } else {
          for (let i = 0; i < players.length; i++) {
            players_list += `${i + 1}. ${players[i].name}\n`;
          }
          message.reply(`Players:\n ${players_list}`);
        }
      } else {
        message.reply("There are no players on the table :(");
      }
    }

    // pok exit (the table)
    if (user_msg === "pok exit") {
      if (!(chat_id in games))
        message.reply("There are no players on the table :(");
      else
        for (let i = 0; i < games[chat_id].players.length; i++)
          if (message.author === games[chat_id].players[i].phone_number) {
            games[chat_id].players.splice(i, 1);
            message.reply(
              `${contact.pushname.split(" ")[0]} have exited the game!`
            );
            break;
          }
    }
    // pok start - start the game
    if (user_msg === "pok start") {
      games[chat_id].players = general_functions.shuffleArray(
        games[chat_id].players
      );
      let order = "The order is: \n";
      for (let i = 0; i < games[chat_id].players.length; i++) {
        order += `${i + 1}. ${games[chat_id].players[i].name}\n`;
      }
      message.reply(`\n${order}\n`);
      games[chat_id].initRound();
    }

    // pok end - ends the game
    if (user_msg === "pok end") {
      let msg = "";
      if (chat_id in games) {
        for (let i = 0; i < games[chat_id].players.length; i++)
          msg += `${i + 1}. ${games[chat_id].players[i].name} has ${
            games[chat_id].players[i].money
          }\n`;
        msg += `The game has ended!\n`;
        delete games[chat_id];
        message.reply(msg);
      } else message.reply("There are no players on the table :(");
    }
  }
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});

whatsapp.initialize();
