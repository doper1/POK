const Game = require("../../classes/Game");
const { format_phone_number } = require("../../generalFunctions");

function join(games, chat_id, message, full_name, contact, chat) {
  let game = games[chat_id];
  let phone_number = format_phone_number(message.author);

  if (game == undefined) {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].addPlayer(full_name, contact, phone_number);

    let current = games[chat_id].players[phone_number];
    chat.sendMessage(`Some @${current.contact.id.user} has joined the game!`, {
      mentions: [phone_number],
    });
  } else if (game.is_midround == true) {
    game.addPlayer(full_name, contact, phone_number);
    game.players[phone_number].is_folded = true;
    game.folds++;
    game.order.insertAfterCurrent(game.players[phone_number]);
    let current = game.players[phone_number];
    chat.sendMessage(
      `Some @${current.contact.id.user} has joined the game!
Wait for the next round to start`,
      {
        mentions: [phone_number],
      }
    );
  } else {
    game.addPlayer(full_name, contact, phone_number);
    let current = game.players[phone_number];
    chat.sendMessage(`Some @${current.contact.id.user} has joined the game!`, {
      mentions: [phone_number],
    });
  }
}

function show(game, message) {
  if (game.is_midround == true) {
    message.reply(game.getOrderPretty());
  } else {
    message.reply(game.getPlayersPretty());
  }
}

function exit(games, chat_id, message, full_name) {
  delete games[chat_id].players[format_phone_number(message.author)];
  message.react("👋");
  message.reply(`${full_name.split(" ")[0]} left the game`);
  if (
    Object.keys(games[chat_id].players).length == 0 &&
    games[chat_id].is_midround
  ) {
    delete games[chat_id];
    message.reply(`*The game has ended!*`); // TODO: Show END message with stacks and stacks changes summary
  } else if (Object.keys(games[chat_id].players).length == 0) {
    delete games[chat_id];
  }
}

module.exports = {
  join,
  show,
  exit,
};
