const { formatId, emote } = require("../../generalFunctions");

function start(game, message) {
  if (game == undefined) {
    message.reply("There are no players on the table :(");
    return false;
  } else if (game.players[formatId(message.author)] == undefined) {
    message.react(emote("mistake"));
    message.reply("You need to join the game first");
    return false;
  } else if (Object.keys(game.players).length == 1) {
    message.reply("There is only one player at the table :(");
    return false;
  }
  return true;
}

module.exports = { start };
