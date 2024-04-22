//imports
let Game = require("../classes/Game");
let general_functions = require("./general_functions");
let constants = require("../constants");

// pok join (the game)
function join(games, chat_id, message, full_name, contact, chat) {
  if (games[chat_id] === undefined) {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].addPlayer(full_name, message.author, contact);
    message.reply(`_*${full_name}*_ has joined the game!`);
  } else if (games[chat_id].players[message.author] !== undefined) {
    message.reply("you have already joined!");
  } else if (games[chat_id].is_midround === true) {
    games[chat_id].addPlayer(full_name, message.author, contact);
    games[chat_id].players[message.author].is_folded = true;
    games[chat_id].order.insertAfterCurrent(
      games[chat_id].players[message.author]
    );
    message.reply(`${full_name} have joined the game!
    Wait for the next round`);
  } else {
    games[chat_id].addPlayer(full_name, message.author, contact);
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
    !games.hasOwnProperty(chat_id) ||
    !games[chat_id].players.hasOwnProperty(message.author)
  ) {
    message.react(general_functions.emote(constants.mistake_emojies));
    message.reply("You have not joined the game yet");
  } else {
    delete games[chat_id].players[message.author];
    message.react("👋");
    message.reply(`${full_name} left the game`);

    if (
      Object.keys(games[chat_id].players).length === 0 &&
      games[chat_id].is_midround
    ) {
      delete games[chat_id];
      message.reply(`*The game has ended!*`); // Show END message
    } else if (Object.keys(games[chat_id].players).length === 0) {
      delete games[chat_id];
    }
  }
}

// pok start - start the game
function start(games, chat_id, message, whatsapp, chat) {
  if (games[chat_id] === undefined) {
    message.reply("There are no players on the table :(");
  } else if (games[chat_id].players[message.author] === undefined) {
    message.react(general_functions.emote(constants.mistake_emojies));
    message.reply("You need to join the game first");
  } else if (Object.keys(games[chat_id].players).length === 1) {
    message.reply("There is only one player on the table :(");
  } else {
    games[chat_id].generateOrder();
    chat.sendMessage(games[chat_id].getOrderPretty());
    games[chat_id].initRound(whatsapp, chat.name);
    games[chat_id].is_midround = true;

    message.react(general_functions.emote(constants.start_emojies));
    chat.sendMessage("Check your DM for your cards 🤫");
    chat.sendMessage(
      `Action on @${games[chat_id].order.current_player.contact.id.user}`,
      {
        mentions: [games[chat_id].order.current_player.contact.id._serialized],
      }
    );
    //(money - game_money) for all the players
  }
}

// pok end - ends the game
function end(games, chat_id, message) {
  let msg = "";
  if (games[chat_id] != undefined) {
    msg += `*The game has ended!*`;
    delete games[chat_id];
    message.reply(msg);
  } else {
    message.reply("There are no players on the table :(");
  }
}

function check(games, chat_id) {
  games[chat_id].chat.sendMessage(
    `${games[chat_id].order.current_player.name} checked`
  );
  games[chat_id].update_round();
}

function raise(games, chat_id, amount) {
  games[chat_id].order.current_player.game_money -= amount;
  games[chat_id].pot += amount;
  games[chat_id].current_bet +=
    amount -
    (games[chat_id].current_bet -
      games[chat_id].order.current_player.current_bet);
  games[chat_id].chat.sendMessage(
    `${games[chat_id].order.current_player.name} raised $${amount}`
  );
  games[chat_id].order.current_player.current_bet = games[chat_id].current_bet;
  games[chat_id].update_round();
}

//Fold
function fold(games, chat_id, message, full_name) {
  message.react(general_functions.emote(constants.fold_emojies));
  games[chat_id].chat.sendMessage(`${full_name} folded`);

  games[chat_id].order.current_player.is_folded = true;
  games[chat_id].update_round();
}
function call(games, chat_id) {
  let amount =
    games[chat_id].current_bet -
    games[chat_id].order.current_player.current_bet;
  games[chat_id].order.current_player.game_money -= amount;
  games[chat_id].pot += amount;
  games[chat_id].order.current_player.current_bet = games[chat_id].current_bet;
  games[chat_id].chat.sendMessage(
    `${games[chat_id].order.current_player.name} called $${amount}`
  );
  games[chat_id].update_round();
}

module.exports = { join, show, exit, start, end, fold, check, raise, call };
