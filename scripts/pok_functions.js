//imports
let Game = require("../classes/Game");
let general_functions = require("./general_functions");
let constants = require("../constants");

// pok join (the game)
function join(games, chat_id, message, full_name) {
  if (games[chat_id] === undefined) {
    games[chat_id] = new Game(chat_id);
    games[chat_id].addPlayer(full_name, message.author);
    message.reply(`${full_name} has joined the game!`);
  } else if (games[chat_id].players[message.author] !== undefined) {
    message.reply("you have already joined!");
  } else {
    games[chat_id].addPlayer(full_name, message.author);
    message.reply(`${full_name} have joined the game!`);
  }
}

// pok show (players)
function show(games, chat_id, message) {
  if (games[chat_id] === undefined) {
    message.reply("There are no players on the table :(");
  } else if (games[chat_id].is_midround === true) {
    message.reply(games[chat_id].getOrderPretty());
  } else {
    message.reply(games[chat_id].getPlayersPretty());
  }
}

// pok exit (the table)
function exit(games, chat_id, message, full_name) {
  if (
    games[chat_id] === undefined ||
    games[chat_id].players[message.author] === undefined
  ) {
    message.react("🧐");
    message.reply("You have not joined the game yet");
  } else {
    if (Object.keys(games[chat_id].players).length === 1) {
      end(games, chat_id, message);
    } else {
      delete games[chat_id].players[message.author];
      message.react("👋");
      message.reply(`${full_name} left the game`);
    }
  }
}

// pok start - start the game
function start(games, chat_id, message, whatsapp, chat) {
  if (games[chat_id] === undefined) {
    message.reply("There are no players on the table :(");
  } else if (games[chat_id].players[message.author] === undefined) {
    message.react("🫠");
    message.reply("You need to join the game first");
  } else if (Object.keys(games[chat_id].players).length === 1) {
    message.reply("There is only one player on the table :(");
  } else {
    games[chat_id].generateOrder();
    games[chat_id].initRound(whatsapp, chat.name);
    games[chat_id].is_midround = true;

    message.react(general_functions.emote(constants.start_emojies));
    whatsapp.sendMessage(chat.id._serialized, "*The game has started!*");
    whatsapp.sendMessage(chat.id._serialized, games[chat_id].getOrderPretty());
    whatsapp.sendMessage(chat.id._serialized, "Check your DM for the cards 🤫");
  }
}

// pok end - ends the game
function end(games, chat_id, message) {
  let msg = "";
  if (games[chat_id] != undefined) {
    // for (let i = 0; i < games[chat_id].players.length; i++)
    //   msg += `${i + 1}. ${games[chat_id].players[i].name} has ${
    //     games[chat_id].players[i].money
    //   }\n`; // FIX print money
    msg += `*The game has ended!*`;
    delete games[chat_id];
    message.reply(msg);
  } else {
    message.reply("There are no players on the table :(");
  }
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
function fold(games, chat_id, message, full_name) {
  if (games[chat_id].order.head.player.is_folded === false) {
    message.react(general_functions.emote(constants.fold_emojies));
    games[chat_id].order.head.player.is_folded = true;
    message.reply(`${full_name} folded`);
  } else {
    message.react(general_functions.emote(constants.fold_emojies));
    message.reply(`You are already folded!`);
  }
}
function call() {}

module.exports = { join, show, exit, start, end, fold, check, raise, call };
