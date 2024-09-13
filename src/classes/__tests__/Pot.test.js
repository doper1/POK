const Pot = require('../Pot.js');
const AllIn = require('../AllIn.js');

jest.mock('../AllIn.js');

describe('Pot', () => {
  let pot;
  let game;
  let players;

  beforeEach(() => {
    pot = new Pot();

    players = {
      '+12345': { currentBet: 50 },
      '+67890': { currentBet: 100 },
      '+54321': { currentBet: 75 }
    };

    game = {
      order: {
        currentPlayer: {
          id: '+67890',
          currentBet: 100
        }
      },
      players: players
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('addAllIn', () => {
    test('should add a new AllIn instance with correct players and pot', () => {
      pot.addAllIn(game);

      expect(AllIn).toHaveBeenCalledWith(
        [players['+67890']],
        225, // Pot: 100 + 75 + 50 (capped at current player bet)
        100 // Current player's bet
      );
      expect(pot.allIns.length).toBe(1);
    });
  });

  describe('reorgAllIns', () => {
    test('should reorganize all-ins by pot size in ascending order', () => {
      pot.allIns = [{ pot: 200 }, { pot: 150 }, { pot: 300 }];

      pot.reorgAllIns();

      expect(pot.allIns[0].pot).toBe(150);
      expect(pot.allIns[1].pot).toBe(200);
      expect(pot.allIns[2].pot).toBe(300);
    });

    test('should handle an empty allIn array gracefully', () => {
      pot.reorgAllIns();
      expect(pot.allIns.length).toBe(0);
    });
  });

  describe('Getter and Setter Tests', () => {
    test('should get and set the mainPot value', () => {
      pot.mainPot = 500;
      expect(pot.mainPot).toBe(500);
    });

    test('should get and set the lastRoundPot value', () => {
      pot.lastRoundPot = 300;
      expect(pot.lastRoundPot).toBe(300);
    });
  });
});
