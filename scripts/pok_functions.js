//set vars / chat, chat_id, contact, message, args(games...)

//imports
let Game = require("../classes/Game");
let constants = require("../constants");

// pok help - learn about the functions
// function help() {
//   if (games[chat_id] != undefined && games[chat_id].midround) {
//     message.reply(constants.help_in_game);
//   } else {
// message.reply(constants.help_pre_game);
// }
//}

// pok join (the game)
function join(games, chat_id, message, contact) {
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
function show(games, chat_id, message) {
  if (chat_id in games) {
    let players_list = "";
    let players = games[chat_id].players;

    if (!(chat_id in games)) {
      message.reply("There are no players on the table :(");
    } else {
      for (let i = 0; i < players.length; i++) {
        players_list += `\n${i + 1}. ${players[i].name}`;
      }
      message.reply(`Players: ${players_list}`);
    }
  } else {
    message.reply("There are no players on the table :(");
  }
}
// pok exit (the table)
function exit(games, chat_id, message, contact) {
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
function start(whatsapp, chat, chat_id, contact, message, games) {
  games[chat_id].initRound(whatsapp, chat.name);

  let order = "The order is:";
  for (let i = 0; i < games[chat_id].players.length; i++) {
    order += `\n${i + 1}. ${games[chat_id].players[i].name}`;
  }
  message.reply(`${order}`);
}

// pok end - ends the game
function end(games, chat_id, message) {
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

module.exports = { join, show, exit, start, end };
