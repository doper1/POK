let constants = require("../constants.js");

function print_cards(cards) {
  let to_string = "";
  for (let i = 0; i < cards.length - 1; i++) {
    to_string += `*|${cards[i][0]}${cards[i][1]}|*  `;
  }
  return `${to_string}*|${cards[cards.length - 1][0]}${
    cards[cards.length - 1][1]
  }|*`;
}

function pre_flop(games, chat_id, message, whatsapp, chat) {
  let pos = games[chat_id].order.head;
}

function flop() {}

function turn() {}

function river() {}

module.exports = { print_cards };
