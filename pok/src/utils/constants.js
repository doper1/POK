module.exports.MODEL_GLHF = 'hf:meta-llama/Meta-Llama-3.1-405B-Instruct';
module.exports.MODEL_GROQ = 'llama-3.1-70b-versatile';
module.exports.GAME_TYPES = ['nlh'];
module.exports.GAME_STATUSES = ['pending', 'running', 'to end'];
module.exports.PLAYER_STATUSES = [
  'pending',
  'played',
  'folded',
  'all in',
  'no money',
];
module.exports.MESSAGE_MAX_AGE = 30;
module.exports.LOCK_MAX_AGE = 20;
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

module.exports.SHAPES = ['️️️♠️', '♥️', '♣️', '♦️'];

module.exports.DECK = [
  ['1', '2'],
  ['1', '3'],
  ['1', '4'],
  ['1', '5'],
  ['1', '6'],
  ['1', '7'],
  ['1', '8'],
  ['1', '9'],
  ['1', '10'],
  ['1', 'J'],
  ['1', 'Q'],
  ['1', 'K'],
  ['1', 'A'],
  ['2', '2'],
  ['2', '3'],
  ['2', '4'],
  ['2', '5'],
  ['2', '6'],
  ['2', '7'],
  ['2', '8'],
  ['2', '9'],
  ['2', '10'],
  ['2', 'J'],
  ['2', 'Q'],
  ['2', 'K'],
  ['2', 'A'],
  ['3', '2'],
  ['3', '3'],
  ['3', '4'],
  ['3', '5'],
  ['3', '6'],
  ['3', '7'],
  ['3', '8'],
  ['3', '9'],
  ['3', '10'],
  ['3', 'J'],
  ['3', 'Q'],
  ['3', 'K'],
  ['3', 'A'],
  ['4', '2'],
  ['4', '3'],
  ['4', '4'],
  ['4', '5'],
  ['4', '6'],
  ['4', '7'],
  ['4', '8'],
  ['4', '9'],
  ['4', '10'],
  ['4', 'J'],
  ['4', 'Q'],
  ['4', 'K'],
  ['4', 'A'],
];

module.exports.EMOJIES = {
  FOLD: ['☹️', '😒', '🤒', '🤕', '😵', '😪', '😬', '😩'],
  HAPPY: ['🥹', '😎', '😋', '🥳', '🤩', '🤠', '🤗', '😛'],
  MISTAKE: ['🫠', '😬', '🧐', '😳', '😑', '🤤', '🥴'],
  SAD: ['😔', '😕', '🙁', '😫', '😖', '🙄', '😪'],
};

module.exports.LLM_SYSTEM_MESSAGE = `
Your name is Pok.

The message you will receive is poker related.
Your goal is to translate it to a command.

The possible commands are:
pok check - checks the actions and move the turn to the next player.
pok call - calls the current bet
pok all (in) - puts all your chips in the pot
pok raise [amount] - raises the specified amount
pok fold - folds the hand
pok buy [amount] - buys more chips to the table
pok help - Shows the available commands
pok start - starts the game
pok join [amount] - adds you to the game. If you also specified an amount, it will buy that amount
pok show - Shows the pot value, the players, the players order, the players statues, the players bets and the current player
pok exit - remove you from the game
pok end - ends the game for everyone

Answer either:
1.  A command from the command list exactly as it's written
2. Only 'not related'

Don't include any extra data in your answer
For non-English messages return 'not related'
For non-humanly readable messages return 'not related'
`;
