//set vars / chat, chat_id, contact, message, args(games...)

//imports
let Game = require("../classes/Game");

// pok help - learn about the functions
function help(chat, chat_id, contact, message, games) {
  message.reply(
    `The Usage is:
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
function join(chat, chat_id, contact, message, games) {
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
      message.reply(`${contact.pushname.split(" ")[0]} have joined the game!`);
    }
  }
}
// pok show (players)
function show(chat, chat_id, contact, message, games) {
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
function exit(chat, chat_id, contact, message, games) {
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
  if (games[chat_id].players.length === 0) delete games[chat_id];
}
// pok start - start the game
function start(chat, chat_id, contact, message, games) {
  console.log("started start");
  games[chat_id].initRound();

  let order = "The order is: \n";
  for (let i = 0; i < games[chat_id].players.length; i++) {
    order += `${i + 1}. ${games[chat_id].players[i].name}\n`;
  }
  message.reply(`\n${order}\n`);
}

// pok end - ends the game
function end(chat, chat_id, contact, message, games) {
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
module.exports = { help, join, show, exit, start, end };
