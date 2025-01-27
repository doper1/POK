module.exports.MODEL_GLHF = 'hf:meta-llama/Llama-3.3-70B-Instruct';
module.exports.MODEL_GROQ = 'llama-3.3-70b-versatile';
module.exports.MODEL_AIML - 'deepseek/deepseek-r1';
module.exports.GAME_TYPES = ['nlh'];
module.exports.GAME_STATUSES = ['pending', 'running', 'to end'];
module.exports.GAME_RUNNING_STATUSES = ['running', 'to end'];
module.exports.PLAYER_STATUSES = [
  'pending',
  'played',
  'folded',
  'all in',
  'no money',
  'middle join',
];

module.exports.STILL_PLAYING_STATUSES = ['pending', 'played'];
module.exports.IN_THE_GAME_STATUSES = ['pending', 'played', 'all in'];
module.exports.MESSAGE_MAX_AGE = 30;
module.exports.LOCK_MAX_AGE = 22;
module.exports.MAX_PLAYERS = 23;
module.exports.BASE_MONEY = 1000;
module.exports.GAME_MONEY = 100;
module.exports.SEPARATOR = '___________________';
module.exports.STRENGTH_DICT = {
  0: '👑*ROYAL FLUSH*👑',
  1: '🚀*STRAIGHT FLUSH*🚀',
  2: '💰*QUADS*💰',
  3: '💵*FULL HOUSE*💵',
  4: 'Flush',
  5: 'Straight',
  6: 'Three of a Kind',
  7: 'Two Pair',
  8: 'Pair',
  9: 'High Card',
};
module.exports.SMALL_BLIND = 1;
module.exports.BIG_BLIND = 2;
module.exports.HELP_PRE_GAME = `Message your action. You can do the following:
♠️ help 
♥️ join [amount]
♣️ show
♦️ exit
♠️ start
♥️ buy [amount]
♣️ small blind [amount]
♦️ big blind [amount]`;

module.exports.HELP_IN_GAME = `Message your action. You can do the following:
♠️ check
♥️ call
♣️ raise [amount]
♦️ all in
♠️ fold
♥️ buy [amount] 
♣️ help 
♦️ join [amount]
♠️ show
♥️ exit
♣️ end
♦️ small blind [amount]
♠️ big blind [amount]`;

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

module.exports.TRANSLATE_SYSTEM_MESSAGE = `
Your name is Pok.

The message you will receive is poker related.
Your goal is to translate it to a command.

The possible commands are:
pok check - checks the actions and move the turn to the next player.
pok call - calls the current bet
pok all (in) - puts all your chips in the pot
pok raise [amount] - raises the specified amount. Can be:
-  Some Numeric value
- 'pot', 'double', 'triple', 'quadruple', 'half', 'third', 'quarter'
- X pots -> a fitting word. For example: 2 pots -> 'double', 3 pots -> 'triple', 4 pots -> 'quadruple'

pok fold - folds the hand
pok buy [amount] - buys more chips to the table
pok help - Shows the available commands
pok start - starts the game
pok join [amount] - adds you to the game. If you also specified an amount, it will buy that amount
pok show - Shows the pot value, the players, the players order, the players statues, the players bets and the current player
pok exit - remove you from the game
pok end - ends the game for everyone
pok small [amount] - sets the small blind
pok big [amount] - sets the big blind

Answer either:
1. A command from the command list exactly as it's written
2. Only 'not related'

Don't include any extra data in your answer
For non-humanly readable messages return 'not related'
`;

module.exports.ANSWER_SYSTEM_MESSAGE = `
You are a poker dealer on whatsapp that was designed to help people play poker comfortably on whatsapp.
You can also help users with general questions about anything (age restricted and legal restricted)
Your name is pok. However, your goal is to answer to question you received.
Beware that you won't have the context of previous messages in the same conversation and in other conversations.
You may also remind it to the player if you encounter weird message. The game itself is on whatsapp groups- No physical table.

There is another instance of you that handles the game, your role is to answer questions about poker and about life, not about specific games.
If player wants to perform an in-game action, it can only happen inside a group chat (which you will not get message from, you can only receive messages from private chat).
The ONLY game related thing that happens in a private chat is the dealing of the hole cards, other than that- everything is done in a group chat

The rules are:
- Poker texas hold'em
- When you first join, you get 1000$ in-game
- Your money is global throughout all whatsapp groups
- Actions should be done in group chats

It's highly recommended to create new whatsapp group for playing

For the answer use whatsapp text formatting:
Bold - *text*
Italic - _text_
`;

module.exports.MAX_CACHE_SIZE = 10000;

module.exports.DATE_CACHE_NAME = 'date_cache';

module.exports.PARTIAL_RAISE_SIZES = [
  'pot',
  'half',
  'third',
  'quarter',
  'fifth',
];

module.exports.FULL_RAISE_SIZES = ['pot', 'double', 'triple', 'quadruple'];
