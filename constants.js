module.exports.strength_dict = {
  0: "Royal Flush",
  1: "Straight Flush",
  2: "Four of a Kind",
  3: "Full House",
  4: "Flush",
  5: "Straight",
  6: "Three of a Kind",
  7: "Two Pair",
  8: "Pair",
  9: "High Card",
};
module.exports.small_blind = 1;
module.exports.big_blind = 2;
module.exports.help_pre_game = `Possible Commands:
--------------
♠️ pok help 
♥️ pok join
♣️ pok show
♦️ pok exit
♠️ pok start`;

module.exports.help_in_game = `Possible Commands (in game):
--------------
♠️ pok check
♥️ pok call
♣️ pok raise [raise amount]
♦️ pok fold
♠️ pok help 
♥️ pok join
♣️ pok show
♦️ pok exit
♠️ pok end`;

module.exports.deck = [
  ["♦️", "2"],
  ["♦️", "3"],
  ["♦️", "4"],
  ["♦️", "5"],
  ["♦️", "6"],
  ["♦️", "7"],
  ["♦️", "8"],
  ["♦️", "9"],
  ["♦️", "10"],
  ["♦️", "J"],
  ["♦️", "Q"],
  ["♦️", "K"],
  ["♦️", "A"],
  ["♥️", "2"],
  ["♥️", "3"],
  ["♥️", "4"],
  ["♥️", "5"],
  ["♥️", "6"],
  ["♥️", "7"],
  ["♥️", "8"],
  ["♥️", "9"],
  ["♥️", "10"],
  ["♥️", "J"],
  ["♥️", "Q"],
  ["♥️", "K"],
  ["♥️", "A"],
  ["♣️", "2"],
  ["♣️", "3"],
  ["♣️", "4"],
  ["♣️", "5"],
  ["♣️", "6"],
  ["♣️", "7"],
  ["♣️", "8"],
  ["♣️", "9"],
  ["♣️", "10"],
  ["♣️", "J"],
  ["♣️", "Q"],
  ["♣️", "K"],
  ["♣️", "A"],
  ["♠️", "2"],
  ["♠️", "3"],
  ["♠️", "4"],
  ["♠️", "5"],
  ["♠️", "6"],
  ["♠️", "7"],
  ["♠️", "8"],
  ["♠️", "9"],
  ["♠️", "10"],
  ["♠️", "J"],
  ["♠️", "Q"],
  ["♠️", "K"],
  ["♠️", "A"],
];

module.exports.fold_emojies = ["☹️", "😒", "🤒", "🤕", "😵", "😪", "😬", "😩"];
module.exports.start_emojies = ["🥹", "😎", "😋", "🥳", "🤩", "🤠", "🤗", "😛"];
module.exports.mistake_emojies = ["🫠", "😬", "🧐", "😳", "😑", "🤤", "🥴"];
