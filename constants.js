module.exports.MESSAGE_TIMEOUT = 10;
module.exports.STRENGTH_DICT = {
  0: "*ROYAL FLUSH*",
  1: "*STRAIGHT FLUSH*",
  2: "*QUADS*",
  3: "*FULL HOUSE*",
  4: "Flush",
  5: "Straight",
  6: "Three of a Kind",
  7: "Two Pair",
  8: "Pair",
  9: "High Card",
};
module.exports.SMALL_BLIND = 1;
module.exports.BIG_BLIND = 2;
module.exports.HELP_PRE_GAME = `Possible Commands:
--------------
♠️ pok help 
♥️ pok join
♣️ pok show
♦️ pok exit
♠️ pok start`;

module.exports.HELP_IN_GAME = `Possible Commands (in game):
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

module.exports.DECK = [
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

module.exports.EMOJIES = {
  FOLD: ["☹️", "😒", "🤒", "🤕", "😵", "😪", "😬", "😩"],
  HAPPY: ["🥹", "😎", "😋", "🥳", "🤩", "🤠", "🤗", "😛"],
  MISTAKE: ["🫠", "😬", "🧐", "😳", "😑", "🤤", "🥴"],
  SAD: ["😔", "😕", "🙁", "😫", "😖", "🙄", "😪"],
};
