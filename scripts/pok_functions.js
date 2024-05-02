//imports
let Game = require("../classes/Game");
let general_functions = require("./general_functions");
let constants = require("../constants");

// pok join (the game)
function join(games, chat_id, message, full_name, contact, chat) {
  let phone_number = general_functions.format_phone_number(message.author);
  if (games[chat_id] === undefined) {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].addPlayer(full_name, phone_number, contact);
    message.reply(`_*${full_name}*_ has joined the game!`);
  } else if (games[chat_id].players[phone_number] !== undefined) {
    message.reply("you have already joined!");
  } else if (games[chat_id].is_midround === true) {
    games[chat_id].addPlayer(full_name, phone_number, contact);
    games[chat_id].players[phone_number].is_folded = true;
    game.folds++;
    games[chat_id].order.insertAfterCurrent(
      games[chat_id].players[phone_number]
    );
    message.reply(`${full_name} have joined the game!
    Wait for the next round`);
  } else {
    games[chat_id].addPlayer(full_name, phone_number, contact);
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
  let phone_number = general_functions.format_phone_number(message.author);
  if (
    !games.hasOwnProperty(chat_id) ||
    !games[chat_id].players.hasOwnProperty(phone_number)
  ) {
    message.react(general_functions.emote(constants.mistake_emojies));
    message.reply("You have not joined the game yet");
  } else {
    delete games[chat_id].players[phone_number];
    message.react("👋");
    message.reply(`${full_name.split(" ")[0]} left the game`);

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
  let phone_number = general_functions.format_phone_number(message.author);
  if (games[chat_id] === undefined) {
    message.reply("There are no players on the table :(");
  } else if (games[chat_id].players[phone_number] === undefined) {
    message.react(general_functions.emote(constants.mistake_emojies));
    message.reply("You need to join the game first");
  } else if (Object.keys(games[chat_id].players).length === 1) {
    message.reply("There is only one player on the table :(");
  } else {
    games[chat_id].generateOrder();
    let current = games[chat_id].order.current_player;
    do {
      current.game_money = 100; // Change to some constants, also handle less money situations
      current.money -= 100;
      current = current.next_player;
    } while (!current.is_button);

    games[chat_id].initRound(whatsapp, chat.name);
    games[chat_id].is_midround = true;

    message.react(general_functions.emote(constants.start_emojies));
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

function check(game, message) {
  if (general_functions.is_allowed(game, message)) {
    if (game.current_bet === game.order.current_player.current_bet) {
      return true;
    } else {
      message.reply(
        `You need to call ($${
          game.current_bet - game.order.current_player.current_bet
        } more)`
      );
      return false;
    }
  }
}

function raise(game, message, user_msg) {
  if (general_functions.is_allowed(game, message)) {
    let amount = Number(user_msg[2]);

    if (user_msg[2] === "all") {
      game_function.all_in(game, user_msg);
      return true;
    } else if (!Number.isInteger(amount)) {
      message.reply(
        "Specify a number (e.g. 'pok raise 100') or 'all in' (e.g. 'pok raise all in')."
      );
      return false;
    } else if (
      game.current_bet >
      amount + game.order.current_player.current_bet
    ) {
      message.reply(
        `You need to call, or raise at least $${
          game.current_bet - game.order.current_player.current_bet
        } more`
      );
      return false;
    } else {
      game.order.current_player.game_money -= amount;
      game.pot += amount;
      game.current_bet +=
        amount - (game.current_bet - game.order.current_player.current_bet);
      game.order.current_player.current_bet = game.current_bet;
      return true;
    }
  }
}

//Fold
function fold(game, message) {
  if (general_functions.is_allowed(game, message)) {
    message.react(general_functions.emote(constants.fold_emojies));
    game.order.current_player.is_folded = true;
    game.folds++;
    return true;
  }
}

function call(game, message) {
  if (general_functions.is_allowed(game, message)) {
    if (game.current_bet === game.order.current_player.current_bet) {
      game.chat.sendMessage(`No one bet so you don't need to call`);
      return false;
    } else {
      let amount = game.current_bet - game.order.current_player.current_bet;
      game.order.current_player.game_money -= amount;
      game.pot += amount;
      game.order.current_player.current_bet = game.current_bet;
      return true;
    }
  }
}

module.exports = { join, show, exit, start, end, fold, check, raise, call };
