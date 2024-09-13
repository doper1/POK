const { formatId, emote } = require("../../generalFunctions");

function join(game, message) {
  if (
    game != undefined &&
    game.players[formatId(message.author)] !== undefined
  ) {
    message.reply("You have already joined!");
    return false;
  }
  return true;
}

function show(game, message) {
  if (game == undefined) {
    message.react(emote("fold"));
    message.reply("There are no players at the table");
    return false;
  }
  return true;
}

function exit(game, message) {
  if (
    game === undefined ||
    game.players[formatId(message.author)] === undefined
  ) {
    message.react(emote("mistake"));
    message.reply("You have not joined the game yet");
    return false;
  }
  return true;
}
module.exports = { join, show, exit };
