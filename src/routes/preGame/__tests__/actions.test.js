const actions = require('../actions');
const Game = require('../../../models/Game');

describe('pok join - preGame', () => {
  beforeEach(async () => {
    newGame = async (gameId) => {
      return {
        ...(await Game.get(gameId)),
        addPlayer: jest.fn(() => {
          return { buy: jest.fn() };
        }),
        getMentions: jest.fn(),
        addPlayerMidGame: jest.fn(),
      };
    };

    message = (gameId) => {
      return {
        body: ['pok', 'join'],
        author: 'newPlayer',
        from: gameId,
        react: jest.fn(),
        reply: jest.fn(),
      };
    };

    chat = (gameId) => {
      return {
        id: gameId,
        name: 'NAME',
        isGroup: true,
        sendMessage: jest.fn(),
      };
    };

    amount = 100;
  });
  test('game is not running (with money)', async () => {
    let gameId = '646113435532609000';

    newGame = await newGame(gameId);
    chat = chat(gameId);
    await actions.join(newGame, message(gameId), chat, amount);

    expect(newGame.addPlayerMidGame).not.toHaveBeenCalled();
    expect(chat.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining('bought'),
      expect.anything(),
    );
  });

  test('game is not running (without money)', async () => {
    let gameId = '646113435532609000';
    amount = '';

    newGame = await newGame(gameId);
    chat = chat(gameId);
    await actions.join(newGame, message(gameId), chat, amount);

    expect(newGame.addPlayerMidGame).not.toHaveBeenCalled();
    expect(chat.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining('Buy'),
      expect.anything(),
    );
  });

  test('game is running (with money)', async () => {
    let gameId = '670576926195342800';
    newGame = await newGame(gameId);
    chat = chat(gameId);
    await actions.join(newGame, message(gameId), chat, amount);

    expect(newGame.addPlayerMidGame).toHaveBeenCalled();
    expect(chat.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining('bought'),
      expect.anything(),
    );
  });

  test('game is running (without money)', async () => {
    let gameId = '670576926195342800';
    amount = '';

    newGame = await newGame(gameId);
    chat = chat(gameId);
    await actions.join(newGame, message(gameId), chat, amount);

    expect(newGame.addPlayerMidGame).toHaveBeenCalled();
    expect(chat.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining('Buy'),
      expect.anything(),
    );
  });
});
