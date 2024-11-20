const gameRepo = require('../gameRepo');
const Game = require('../../models/Game');

describe('gameRepo', () => {
  beforeEach(async () => {
    newGame = {
      ...(await Game.get('293544077846006600')),
      status: 'running',
      addPlayer: jest.fn(() => {
        return { buy: jest.fn(), holeCards: [] };
      }),
      getMentions: jest.fn(),
      addPlayerMidGame: jest.fn(),
      deal: jest.fn(),
    };
  });
  test('addPlayerMidGame', async () => {
    const gameId = '293544077846006600';
    const userId = '252821822895';

    await gameRepo.addPlayerMidGame(gameId, userId);
  });
});
