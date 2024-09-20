const { emote, formatId } = require('../../../generalFunctions');
const actions = require('../actions');
const Mustache = require('mustache');

jest.mock('../../../generalFunctions');
jest.mock('../../../game/gameFunctions');
jest.mock('mustache');

describe('Game Functions', () => {
  let mockGames;
  let mockGame;
  let mockMessage;
  let mockWhatsapp;
  let mockChat;

  beforeEach(() => {
    mockGames = {};
    mockGame = {
      order: {
        currentPlayer: {
          phoneNumber: '1234567890',
          isPlayed: false,
          currentBet: 0,
          gameMoney: 1000,
        },
        insertAfterCurrent: jest.fn(), // Mock insertAfterCurrent
        removePlayer: jest.fn(), // Mock removePlayer
      },
      chat: {
        sendMessage: jest.fn(),
      },
      pot: {
        mainPot: 0,
        currentBet: 0,
        addAllIn: jest.fn(),
      },
      folds: 0,
      players: {},
      updateRound: jest.fn(),
      addPlayer: jest.fn(),
      getOrderPretty: jest.fn(),
      getMentions: jest.fn(),
      endGame: jest.fn(),
      removePlayer: jest.fn(),
    };
    mockMessage = {
      reply: jest.fn(),
      react: jest.fn(),
      author: '1234567890@c.us',
    };
    mockWhatsapp = {};
    mockChat = {
      sendMessage: jest.fn(),
    };

    emote.mockReturnValue('👍');
    formatId.mockReturnValue('1234567890@c.us');
    Mustache.render.mockImplementation((template) => `Rendered: ${template}`);
  });

  test('check function', () => {
    actions.check(mockGame, mockWhatsapp);
    expect(mockGame.updateRound).toHaveBeenCalledWith(
      mockWhatsapp,
      'Rendered: @{{name}} checked',
    );
  });

  test('raise function', () => {
    actions.raise(mockGame, 100, mockWhatsapp);
    expect(mockGame.pot.mainPot).toBe(100);
    expect(mockGame.order.currentPlayer.gameMoney).toBe(900);
    expect(mockGame.updateRound).toHaveBeenCalledWith(
      mockWhatsapp,
      'Rendered: @{{name}} raised $100',
    );
  });

  test('allIn function', () => {
    actions.allIn(mockGame, mockWhatsapp);
    expect(mockGame.order.currentPlayer.isAllIn).toBe(true);
    expect(mockGame.order.currentPlayer.gameMoney).toBe(0);
    expect(mockGame.pot.addAllIn).toHaveBeenCalledWith(mockGame);
    expect(mockGame.updateRound).toHaveBeenCalledWith(
      mockWhatsapp,
      'Rendered: Wow! @{{name}} is *ALL IN* for ${{amount}} more (total ${{totalBet}})',
    );
  });

  test('fold function', () => {
    actions.fold(mockGame, mockMessage, mockWhatsapp);
    expect(mockGame.order.currentPlayer.isFolded).toBe(true);
    expect(mockGame.folds).toBe(1);
    expect(mockMessage.react).toHaveBeenCalledWith('👍');
    expect(mockGame.updateRound).toHaveBeenCalledWith(
      mockWhatsapp,
      'Rendered: @{{name}} folded',
    );
  });

  test('call function', () => {
    mockGame.pot.currentBet = 100;
    actions.call(mockGame, mockWhatsapp);
    expect(mockGame.order.currentPlayer.gameMoney).toBe(900);
    expect(mockGame.pot.mainPot).toBe(100);
    expect(mockGame.updateRound).toHaveBeenCalledWith(
      mockWhatsapp,
      'Rendered: Nice! @{{name}} calls ${{amount}}',
    );
  });

  test('reBuy function', () => {
    mockGame.players['1234567890@c.us'] = {
      phoneNumber: '1234567890',
      money: 2000,
      gameMoney: 0,
      queueReBuy: jest.fn(),
    };
    mockGame = { ...mockGame, chat: { sendMessage: jest.fn() } };
    actions.buy(mockGame, mockMessage, 500);
    expect(mockGame.players['1234567890@c.us'].money).toBe(1500);
    expect(mockMessage.react).toHaveBeenCalledWith('👍');
    expect(mockGame.chat.sendMessage).toHaveBeenCalled();
  });

  test('join function', () => {
    mockGame.players['1234567890@c.us'] = {
      phoneNumber: '1234567890',
      money: 2000,
      gameMoney: 0,
    };
    mockGames['chat123'] = mockGame;
    mockGames['chat123'].addPlayer = jest.fn();
    actions.join(mockGames, 'chat123', mockMessage, '1234567890', mockChat);
    expect(mockGame.addPlayer).toHaveBeenCalledWith(
      '1234567890@c.us',
      '1234567890',
    );
    expect(mockChat.sendMessage).toHaveBeenCalled();
  });

  test('show function', () => {
    actions.show(mockGame, mockChat);
    expect(mockGame.getOrderPretty).toHaveBeenCalled();
    expect(mockGame.getMentions).toHaveBeenCalled();
    expect(mockChat.sendMessage).toHaveBeenCalled();
  });

  test('exit function with more than 2 players', () => {
    mockGames['chat123'] = mockGame;
    mockGame.players = {
      '1234567890@c.us': { isFolded: false },
      '0987654321@c.us': { isFolded: false },
      '1111111111@c.us': { isFolded: false, hi: true },
    };
    mockGame.order.currentPlayer = mockGame.players['1234567890@c.us'];
    actions.exit(mockGames['chat123'], mockMessage);
    expect(mockMessage.react).toHaveBeenCalledWith('👋');
  });

  test('exit function with 2 players', () => {
    mockGames['chat123'] = mockGame;
    mockGame.players = {
      '1234567890@c.us': { isFolded: false },
      '0987654321@c.us': {},
    };
    mockGame.order.currentPlayer.nextPlayer =
      mockGame.players['0987654321@c.us'];

    mockGame.order.currentPlayer.nextPlayer.nextPlayer =
      mockGame.players['1234567890@c.us'];

    mockGame.order.removePlayer = jest.fn();

    actions.exit(mockGames['chat123'], mockMessage);
    expect(mockMessage.react).toHaveBeenCalledWith('👋');
  });
});
