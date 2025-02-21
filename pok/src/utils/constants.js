module.exports.MODEL_GLHF = 'hf:meta-llama/Llama-3.3-70B-Instruct';
module.exports.MODEL_GROQ = 'llama-3.3-70b-versatile';
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

module.exports.PLAYER_STILL_PLAYING_STATUSES = ['pending', 'played'];
module.exports.PLAYER_IN_THE_GAME_STATUSES = ['pending', 'played', 'all in'];
module.exports.PLAYER_NOT_AT_THE_TABLE_STATUSES = ['no money', 'middle join'];
module.exports.MESSAGE_MAX_AGE = 30;
module.exports.LOCK_MAX_AGE = 22;
module.exports.MAX_PLAYERS = 23;
module.exports.BASE_MONEY = 1000;
module.exports.SEPARATOR = '___________________';
module.exports.STRENGTH_DICT = {
  0: '👑👑👑 *ROYAL FLUSH* 👑👑👑',
  1: '🚀🚀🚀 *STRAIGHT FLUSH* 🚀🚀🚀',
  2: '💰💰💰 *QUADS* 💰💰💰',
  3: '💵💵💵 *FULL HOUSE* 💵💵💵',
  4: '🚽 *Flush* 🚽',
  5: '➖➖ *Straight* ➖➖',
  6: '🙈🙉🙊 *Three of a Kind* 🙈🙉🙊',
  7: '🧦🧦 *Two Pair* 🧦🧦',
  8: '🧦 *Pair* 🧦',
  9: '🍺 *High Card* 🍺',
};
module.exports.SMALL_BLIND = 1;
module.exports.BIG_BLIND = 2;
module.exports.HELP = `🃏 *How to Play Poker on WhatsApp* 🃏  

Use the following commands in your *WhatsApp group* to play:

♠ *Game Actions:*  
- *join [amount]* – Join the game (optional: buy-in with an amount).  
- *start* – Starts the game.  
- *exit* – Leave the game.  
- *end* – Ends the game for everyone.  
- *buy [amount]* – Buy more chips.

️♥ *Betting:*  
- *fold* – Fold your hand.  
- *check* – Check (if no bet has been made).  
- *call* – Call the current bet.  
- *raise [amount]* – Raise the bet by the specified amount.

♣ *Blinds:*  
- *small [amount]* – Set the small blind.  
- *big [amount]* – Set the big blind.

♦ *Game Info:*  
- *show* – Show the pot, players, bets, and current turn.  
- *help* – Show this list of commands.

💰 You start with $1000, and your money is shared across all WhatsApp groups!  

📌 Remember: All actions must be done in a group chat! (But you can always ask questions in my private chat)
🌍 Feel free to use any language and even natural language for your actions– just make sure to follow the basic format!`;

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

module.exports.TRANSLATE_SYSTEM_MESSAGE = `You are Pok, a poker command translator. When you receive a poker-related message, output exactly one of these commands:
- pok check – Check and pass the turn.
- pok call – Call the current bet.
- pok all in – Bet all your chips.
- pok raise [amount] – Raise by the specified amount. Amount can be a number (e.g., 1, 2, 3, 4),
  a word (e.g., pot, double, triple, quadruple, half, third, quarter), or a phrase like "2 pots" (meaning double, etc.).
- pok fold – Fold your hand.
- pok buy [amount] – Buy chips for the table.
- pok help – Explains how to play.
- pok start – Start the game.
- pok join [amount] – Join the game (optionally buying chips with the given amount).
- pok show – Display the pot value, players, order, statuses, bets, and current player.
- pok exit – Leave the game.
- pok end – End the game for everyone.
- pok small [amount] – Set the small blind.
- pok big [amount] – Set the big blind.

If the message isn’t clearly poker-related or is non-readable, output 'not related'.
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
Do not use TOO much formatting

Answer in the same language as the question.
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
