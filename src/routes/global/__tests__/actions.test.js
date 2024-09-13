const Game = require('../../../classes/Game.js');
const { formatPhoneNumber } = require('../../../generalFunctions.js');
const { join, show, exit } = require('../actions.js');

// Mocking the required classes and functions
jest.mock('../../../classes/Game.js');
jest.mock('../../../generalFunctions.js');

describe('Game Functions', () => {
  let games;
  let chat;
  let message;
  let contact;

  beforeEach(() => {
    games = {};
    chat = {
      sendMessage: jest.fn()
    };
    message = {
      author: 'test_author',
      react: jest.fn(),
      reply: jest.fn()
    };
    contact = {
      id: {
        user: 'test_user'
      }
    };
    formatPhoneNumber.mockImplementation((author) => `formatted_${author}`);
  });

  describe('join', () => {
    it('should add a new player to the game and send a welcome message', () => {
      const chatId = 'chat123';
      const message = { author: 'test_author' };

      const gameInstance = new Game();
      Game.mockImplementation(() => gameInstance);
      gameInstance.addPlayer = jest.fn();
      gameInstance.isMidRound = false;
      gameInstance.players = {};
      gameInstance.players['formattedTestAuthor'] = { contact };

      join(games, chatId, message, contact, chat);

      expect(Game).toHaveBeenCalledWith(chatId, chat);
      expect(gameInstance.addPlayer).toHaveBeenCalledWith(
        contact,
        'formattedTestAuthor'
      );
      expect(chat.sendMessage).toHaveBeenCalledWith(
        'Hi @test_user, welcome to the game!',
        { mentions: ['formattedTestAuthor'] }
      );
    });

    it('should handle mid-round scenario and update message accordingly', () => {
      const chatId = 'chat123';
      const message = { author: 'test_author' };

      const gameInstance = new Game();
      Game.mockImplementation(() => gameInstance);
      gameInstance.addPlayer = jest.fn();
      gameInstance.isMidRound = true;
      gameInstance.players = {};
      gameInstance.players['formattedTestAuthor'] = { contact };
      gameInstance.order = { insertAfterCurrent: jest.fn() };
      gameInstance.folds = 0; // Ensure folds is initialized

      join(games, chatId, message, contact, chat);

      expect(gameInstance.players['formattedTestAuthor'].isFolded).toBe(true);
      expect(gameInstance.folds).toBe(1); // Check if folds is incremented
      expect(gameInstance.order.insertAfterCurrent).toHaveBeenCalledWith(
        gameInstance.players['formattedTestAuthor']
      );
      expect(chat.sendMessage).toHaveBeenCalledWith(
        'Hi @test_user, welcome to the game!Wait for the next round to start',
        { mentions: ['formattedTestAuthor'] }
      );
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
        mentions: ['mention1']
      });

      gameInstance.isMidRound = false;
      gameInstance.getPlayersPretty = jest.fn(() => 'getPlayersPretty');

      show(gameInstance, chat);

      expect(chat.sendMessage).toHaveBeenCalledWith('getPlayersPretty', {
        mentions: ['mention1']
      });
    });
  });

  describe('exit', () => {
    it('should delete the player and send goodbye messages', () => {
      const chatId = 'chat123';
      games[chatId] = {
        players: {
          formattedTestAuthor: {}
        },
        isMidRound: false
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
        players: {},
        isMidRound: true
      };

      exit(games, chatId, message);

      expect(games[chatId]).toBeUndefined();
      expect(message.reply).toHaveBeenCalledWith('Goodbye!');
    });

    it('should handle game end when no players are left', () => {
      const chatId = 'chat123';
      games[chatId] = {
        players: {},
        isMidRound: false
      };

      exit(games, chatId, message);

      expect(games[chatId]).toBeUndefined();
    });
  });
});
