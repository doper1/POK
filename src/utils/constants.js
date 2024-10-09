module.exports.GAME_TYPES = ['nlh'];
module.exports.GAME_STATUSES = ['pending', 'running', 'to end'];
module.exports.PLAYER_STATUSES = [
  'pending',
  'played',
  'folded',
  'all in',
  'no money',
];
module.exports.MESSAGE_MAX_AGE = 10;
module.exports.LOCK_MAX_AGE = 30;
module.exports.MAX_PLAYERS = 23;
module.exports.BASE_MONEY = 1000;
module.exports.GAME_MONEY = 100;
module.exports.SEPARATOR = '___________________';
module.exports.STRENGTH_DICT = {
  0: '*ROYAL FLUSH*',
  1: '*STRAIGHT FLUSH*',
  2: '*QUADS*',
  3: '*FULL HOUSE*',
  4: 'Flush',
  5: 'Straight',
  6: 'Three of a Kind',
  7: 'Two Pair',
  8: 'Pair',
  9: 'High Card',
};
module.exports.SMALL_BLIND = 1;
module.exports.BIG_BLIND = 2;
module.exports.HELP_PRE_GAME = `Possible Commands:
♠️ pok help 
♥️ pok join [amount]
♣️ pok show
♦️ pok exit
♠️ pok start
♥️ pok buy [amount]`;

module.exports.HELP_IN_GAME = `Possible Commands:
♠️ pok check
♥️ pok call
♣️ pok raise [amount]
♦️ pok all (in)
♠️ pok fold
♥️ pok buy [amount] 
♣️ pok help 
♦️ pok join [amount]
♠️ pok show
♥️ pok exit
♣️ pok end`;

module.exports.DECK = [
  ['♦️', '2'],
  ['♦️', '3'],
  ['♦️', '4'],
  ['♦️', '5'],
  ['♦️', '6'],
  ['♦️', '7'],
  ['♦️', '8'],
  ['♦️', '9'],
  ['♦️', '10'],
  ['♦️', 'J'],
  ['♦️', 'Q'],
  ['♦️', 'K'],
  ['♦️', 'A'],
  ['♥️', '2'],
  ['♥️', '3'],
  ['♥️', '4'],
  ['♥️', '5'],
  ['♥️', '6'],
  ['♥️', '7'],
  ['♥️', '8'],
  ['♥️', '9'],
  ['♥️', '10'],
  ['♥️', 'J'],
  ['♥️', 'Q'],
  ['♥️', 'K'],
  ['♥️', 'A'],
  ['♣️', '2'],
  ['♣️', '3'],
  ['♣️', '4'],
  ['♣️', '5'],
  ['♣️', '6'],
  ['♣️', '7'],
  ['♣️', '8'],
  ['♣️', '9'],
  ['♣️', '10'],
  ['♣️', 'J'],
  ['♣️', 'Q'],
  ['♣️', 'K'],
  ['♣️', 'A'],
  ['♠️', '2'],
  ['♠️', '3'],
  ['♠️', '4'],
  ['♠️', '5'],
  ['♠️', '6'],
  ['♠️', '7'],
  ['♠️', '8'],
  ['♠️', '9'],
  ['♠️', '10'],
  ['♠️', 'J'],
  ['♠️', 'Q'],
  ['♠️', 'K'],
  ['♠️', 'A'],
];

module.exports.EMOJIES = {
  FOLD: ['☹️', '😒', '🤒', '🤕', '😵', '😪', '😬', '😩'],
  HAPPY: ['🥹', '😎', '😋', '🥳', '🤩', '🤠', '🤗', '😛'],
  MISTAKE: ['🫠', '😬', '🧐', '😳', '😑', '🤤', '🥴'],
  SAD: ['😔', '😕', '🙁', '😫', '😖', '🙄', '😪'],
};
