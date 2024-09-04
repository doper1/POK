//imports
let Game = require("../classes/Game");
let { emote, is_allowed, format_phone_number } = require("./general_functions");
let game_functions = require("../scripts/game_functions");

// pok join (the game)
function join(games, chat_id, message, full_name, contact, chat) {
  let phone_number = format_phone_number(message.author);
  if (games[chat_id] == undefined) {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].addPlayer(full_name, phone_number, contact);

    let current = games[chat_id].players[phone_number];
    chat.sendMessage(`Some @${current.contact.id.user} has joined the game!`, {
      mentions: [current.contact.id._serialized]
    });
  } else if (games[chat_id].players[phone_number] !== undefined) {
    message.reply("You have already joined!");
  } else if (games[chat_id].is_midround == true) {
    games[chat_id].addPlayer(full_name, phone_number, contact);
    games[chat_id].players[phone_number].is_folded = true;
    games[chat_id].folds++;
    games[chat_id].order.insertAfterCurrent(
      games[chat_id].players[phone_number]
    );
    let current = games[chat_id].players[phone_number];
    chat.sendMessage(
      `Some @${current.contact.id.user} has joined the game!
Wait for the next round to start`,
      {
        mentions: [current.contact.id._serialized]
      }
    );
  } else {
    games[chat_id].addPlayer(full_name, phone_number, contact);
    let current = games[chat_id].players[phone_number];
    chat.sendMessage(`Some @${current.contact.id.user} has joined the game!`, {
      mentions: [current.contact.id._serialized]
    });
  }
}

// pok show (players)
function show(game, message) {
  if (game == undefined) {
    message.react(emote("fold"));
    message.reply("There are no players at the table");
  } else if (game.is_midround == true) {
    message.reply(game.getOrderPretty());
  } else {
    message.reply(game.getPlayersPretty());
  }
}

// pok exit (the table)
function exit(games, chat_id, message, full_name) {
  let phone_number = format_phone_number(message.author);
  if (!(chat_id in games) || !(phone_number in games[chat_id].players)) {
    message.react(emote("mistake"));
    message.reply("You have not joined the game yet");
  } else {
    delete games[chat_id].players[phone_number];
    message.react("👋");
    message.reply(`${full_name.split(" ")[0]} left the game`);

    if (
      Object.keys(games[chat_id].players).length == 0 &&
      games[chat_id].is_midround
    ) {
      delete games[chat_id];
      message.reply(`*The game has ended!*`); // Show END message
    } else if (Object.keys(games[chat_id].players).length == 0) {
      delete games[chat_id];
    }
  }
}

// pok start - start the game
function start(game, message, whatsapp) {
  let phone_number = format_phone_number(message.author);
  if (game == undefined) {
    message.reply("There are no players on the table :(");
  } else if (game.players[phone_number] == undefined) {
    message.react(emote("mistake"));
    message.reply("You need to join the game first");
  } else if (Object.keys(game.players).length == 1) {
    message.reply("There is only one player on the table :(");
  } else {
    game.generateOrder();
    let current = game.order.current_player;
    do {
      current.game_money = 100; // Change to some constants, also handle less money situations
      current.money -= 100;
      current = current.next_player;
    } while (!current.is_button);

    game.initRound(whatsapp);
    game.is_midround = true;
    message.react(emote("happy"));
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

// pok check (checks the action)
function check(game, message) {
  if (!is_allowed(game, message)) {
    return false;
  } else if (game.pot.current_bet == game.order.current_player.current_bet) {
    return true;
  } else {
    message.reply(
      `You need to call ($${
        game.pot.current_bet - game.order.current_player.current_bet
      } more)`
    );
    return false;
  }
}

// pok raise X / pok raise all / pok raise all in
// TODO: Move all the false entries to a different function (for all the pok functions)
function raise(game, message, amount) {
  let current = game.order.current_player;
  if (!is_allowed(game, message)) {
    return false;
  } else if (Number.isNaN(amount)) {
    message.react(emote("mistake"));
    message.reply(
      "Please specify a numerical amount (e.g., 'pok raise 3') or go 'all in' (e.g., 'pok raise all in')."
    );
    return false;
  } else if (!Number.isInteger(amount)) {
    message.react(emote("mistake"));
    message.reply(
      "Please enter a whole number (e.g., 4) and not a decimal (e.g., 4.5)."
    );
    return false;
  } else if (amount < 1) {
    message.react(emote("mistake"));
    message.reply("Please Raise a positive amount");
    return false;
  } else if (game.pot.current_bet > amount + current.current_bet) {
    message.react(emote("mistake"));
    message.reply(
      `You need to call, raise at least $${
        game.pot.current_bet - current.current_bet
      } more, or fold`
    );
    return false;
  } else if (current.game_money < amount) {
    message.react(emote("mistake"));
    message.reply(`You only have $${current.game_money}...`);
    return false;
  } else {
    game_functions.all_in_qualification(game);
    current.game_money -= amount;
    current.is_played = true;
    current.current_bet = amount + current.current_bet;
    game.pot.main_pot += amount;
    game.pot.current_bet = current.current_bet;

    return true;
  }
}

// pok all / pok all in
function all_in(game, message, user_msg) {
  if (!is_allowed(game, message)) {
    return false;
  } else {
    game_functions.all_in_qualification(game);
    game_functions.all_in(game, message, user_msg);
    return true;
  }
}

// pok fold
function fold(game, message) {
  if (!is_allowed(game, message)) {
    return false;
  } else {
    message.react(emote("fold"));
    game.order.current_player.is_folded = true;
    game.folds++;
    return true;
  }
}

// pok call
function call(game, message) {
  let current = game.order.current_player;
  if (!is_allowed(game, message)) {
    return false;
  } else if (game.pot.current_bet == current.current_bet) {
    message.react(emote("mistake"));
    message.reply(`Since no one has bet, you don’t need to call`);
    return false;
  } else {
    game_functions.all_in_qualification(game);
    let amount = game.pot.current_bet - current.current_bet;
    current.game_money -= amount;
    current.is_played = true;
    game.pot.main_pot += amount;
    current.current_bet = game.pot.current_bet;
    return true;
  }
}

module.exports = {
  join,
  show,
  exit,
  start,
  end,
  fold,
  check,
  raise,
  call,
  all_in
};
