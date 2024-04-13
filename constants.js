module.exports.suits = ["♦️", "♥️", "♣️", "♠️"];
module.exports.ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
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
module.exports.SB = 10;
module.exports.BB = 20;
module.exports.ALLOWEDMIDROUND = ["fold", "check", "raise", "all_in"];
module.exports.help_pre_game = `Commands menu:
--------------
♠️ pok help 
♥️ pok join
♣️ pok show
♦️ pok exit
♠️ pok start`;

module.exports.help_in_game = `In game menu:
--------------
♠️ pok check
♥️ pok raise [raise amount]
♣️ pok fold
♦️ pok help 
♠️ pok join
♥️ pok show
♣️ pok exit
♦️ pok end`;
