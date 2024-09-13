const Game = require('../../../classes/Game.js');
const { formatId } = require('../../../generalFunctions.js');
const { join, show, exit } = require('../actions.js');

// Mocking the required classes and functions
jest.mock('../../../classes/Game.js');
jest.mock('../../../generalFunctions.js');

describe('Game Functions', () => {
  let games;
  let chat;
  let message;
  let id;

  beforeEach(() => {
    games = {};
    chat = {
      sendMessage: jest.fn(),
    };
    message = {
      author: 'TestAuthor',
      react: jest.fn(),
      reply: jest.fn(),
    };
    id = 'test_user';

    formatId.mockImplementation((author) => `formatted${author}`);
  });

  describe('join', () => {
    it('should add a new player to the game and send a welcome message', () => {
      const chatId = 'chat123';
      const message = { author: 'TestAuthor' };
      const phoneNumber = 'test_user';

      const gameInstance = new Game();
      Game.mockImplementation(() => gameInstance);
      gameInstance.addPlayer = jest.fn();
      gameInstance.isMidRound = false;
      gameInstance.players = {};
      gameInstance.players['formattedTestAuthor'] = { id, isFolded: false };

      join(games, chatId, message, phoneNumber, chat);

      expect(Game).toHaveBeenCalledWith(chatId, chat);
      expect(gameInstance.addPlayer).toHaveBeenCalledWith(
        'formattedTestAuthor',
        id,
      );
      expect(chat.sendMessage).toHaveBeenCalledWith(expect.any(String), {
        mentions: ['formattedTestAuthor'],
      });
    });

    it('should handle mid-round scenario and update message accordingly', () => {
      const chatId = 'chat123';
      const message = { author: 'TestAuthor' };

      const gameInstance = new Game();
      Game.mockImplementation(() => gameInstance);
      gameInstance.isMidRound = true;
      gameInstance.players = {};
      gameInstance.players['formattedTestAuthor'] = { id };
      gameInstance.order = { insertAfterCurrent: jest.fn() };
      gameInstance.folds = 0; // Ensure folds is initialized

      join(games, chatId, message, id, chat);

      expect(gameInstance.players['formattedTestAuthor'].isFolded).toBe(true);
      expect(gameInstance.folds).toBe(1); // Check if folds is incremented
      expect(gameInstance.order.insertAfterCurrent).toHaveBeenCalledWith(
        gameInstance.players['formattedTestAuthor'],
      );
      expect(chat.sendMessage).toHaveBeenCalledWith(expect.any(String), {
        mentions: ['formattedTestAuthor'],
      });
    });
  });

  describe('show', () => {
    it('should send the order if mid-round, otherwise send the players', () => {
      const gameInstance = new Game();
      gameInstance.isMidRound = true;
      gameInstance.getOrderPretty = jest.fn(() => 'getOrderPretty');
      gameInstance.getMentions = jest.fn(() => ['mention1']);

      show(gameInstance, chat);

      expect(chat.sendMessage).toHaveBeenCalledWith('getOrderPretty', {
        mentions: ['mention1'],
      });

      gameInstance.isMidRound = false;
      gameInstance.getPlayersPretty = jest.fn(() => 'getPlayersPretty');

      show(gameInstance, chat);

      expect(chat.sendMessage).toHaveBeenCalledWith('getPlayersPretty', {
        mentions: ['mention1'],
      });
    });
  });

  describe('exit', () => {
    it('should delete the player and send goodbye messages', () => {
      const chatId = 'chat123';
      games = {};
      games[chatId] = {
        players: {
          formattedTestAuthor: { isFolded: true },
        },
        isMidRound: false,
      };
      exit(games, chatId, message);
      expect(games[chatId]).toBeUndefined();
      expect(message.react).toHaveBeenCalledWith('👋');
      expect(message.reply).toHaveBeenCalledWith('Goodbye!');
      // Check if the game was deleted from games
      expect(games[chatId]).toBeUndefined();
    });
    it('should handle game end when no players are left mid-round', () => {
      const chatId = 'chat123';
      games[chatId] = {
        players: { formattedTestAuthor: { isFolded: true } },
        isMidRound: false,
        order: { removePlayer: jest.fn() },
      };
      message = { author: 'TestAuthor', react: jest.fn(), reply: jest.fn() };

      exit(games, chatId, message);
      expect(games[chatId]).toBeUndefined();
      expect(message.reply).toHaveBeenCalledWith('Goodbye!');
    });
    it('should handle game end when no players are left', () => {
      const chatId = 'chat123';
      games[chatId] = {
        players: { formattedTestAuthor: { isFolded: true } },
        isMidRound: false,
        order: { removePlayer: jest.fn() },
      };
      message = { author: 'TestAuthor', react: jest.fn(), reply: jest.fn() };

      exit(games, chatId, message);
      expect(games[chatId]).toBeUndefined();
    });
  });
});
