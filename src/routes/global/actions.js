const Mustache = require("mustache");
const Game = require("../../classes/Game");
const { format_phone_number } = require("../../generalFunctions");

function join(games, chat_id, message, contact, chat) {
  let phone_number = format_phone_number(message.author);
  let new_message = "Hi @{{name}}, welcome to the game!";

  if (games[chat_id] == undefined) games[chat_id] = new Game(chat_id, chat);

  let game = games[chat_id];
  game.addPlayer(contact, phone_number);

  if (game.is_midround) {
    game.players[phone_number].is_folded = true;
    game.folds++;
    game.order.insertAfterCurrent(game.players[phone_number]); // TODO: needs to be tested
    new_message += "Wait for the next round to start";
  }

  chat.sendMessage(
    Mustache.render(new_message, {
      name: game.players[phone_number].contact.id.user
    }),
    {
      mentions: [phone_number]
    }
  );
}

function show(game, chat) {
  if (game.is_midround == true) {
    chat.sendMessage(game.getOrderPretty(), { mentions: game.getMentions() });
  } else {
    chat.sendMessage(game.getPlayersPretty(), { mentions: game.getMentions() });
  }
}

function exit(games, chat_id, message) {
  delete games[chat_id].players[format_phone_number(message.author)];
  message.react("👋");
  message.reply("Goodbye!");
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
  exit
};
