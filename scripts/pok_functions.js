//set vars / chat, chat_id, full_name, message, args(games...)

//imports
let Game = require("../classes/Game");

// pok join (the game)
function join(games, chat_id, message, full_name) {
  if (!(chat_id in games)) {
    games[chat_id] = new Game(chat_id);
    games[chat_id].addPlayer(full_name, message.author);
    message.reply(`${full_name.split(" ")[0]} has joined the game!`);
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
      games[chat_id].addPlayer(full_name, message.author);
      message.reply(`${full_name.split(" ")[0]} have joined the game!`);
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
function exit(games, chat_id, message, full_name) {
  if (!(chat_id in games))
    message.reply("There are no players on the table :(");
  else
    for (let i = 0; i < games[chat_id].players.length; i++)
      if (message.author === games[chat_id].players[i].phone_number) {
        games[chat_id].players.splice(i, 1);
        message.reply(
          `${full_name.pushname.split(" ")[0]} have exited the game!`
        );
        break;
      }
  if (games[chat_id].players.length === 0) delete games[chat_id];
}
// pok start - start the game
function start(games, chat_id, message, whatsapp, chat) {
  if (games[chat_id] === undefined) {
    message.reply("There are no players on the table :(");
  } else if (games[chat_id].players.length === 1) {
    message.reply("There is only one player on the table :(");
  } else {
    games[chat_id].initRound(whatsapp, chat.name);

    let order = `Playing Order:\n---------------`;
    for (let i = 0; i < games[chat_id].players.length; i++) {
      order += `\n${i + 1}. ${games[chat_id].players[i].name}`;
    }
    message.reply(`${order}`);
  }
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

function check() {
  // move current player
}

//Raise
function raise() {
  // move current player
  //pot += player_bet;
  //player_money -= player_bet;
}

//Fold
function fold() {
  //player.pop() from mini linked list
  //check_player_amount()
}

module.exports = { join, show, exit, start, end, check, raise, fold };
