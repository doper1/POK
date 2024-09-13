const {
  isValidWinner,
  rakeToWinners,
  getWinners,
  compareHands,
  randomWinnerKey
} = require('../gameFunctions');

const cardsFunctions = require('../cardsFunctions');

jest.mock('../cardsFunctions');
jest.mock('../../classes/AllIn');
jest.mock('../../constants', () => ({
  STRENGTH_DICT: {
    STRAIGHT: 'Straight',
    FLUSH: 'Flush'
  }
}));
jest.mock('../cardsFunctions');

describe('gameFunctions module', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(cardsFunctions, 'parseCardNumber').mockImplementation((card) => {
      switch (card[1]) {
        case 'A':
          return [card[0], 14];
        case 'K':
          return [card[0], 13];
        case 'Q':
          return [card[0], 12];
        case 'J':
          return [card[0], 11];
        default:
          return [card[0], parseInt(card[1])];
      }
    });
  });

  describe('isValidWinner,', () => {
    it('should return true if the player is in the all-in players list', () => {
      const mockPlayer = { id: '12345' };
      const mockAllIn = { players: [{ id: '12345' }] };

      const result = isValidWinner(mockPlayer, mockAllIn);

      expect(result).toBe(true);
    });

    it('should return false if the player is not in the all-in players list', () => {
      const mockPlayer = { id: '12345' };
      const mockAllIn = { players: [{ id: '67890' }] };

      const result = isValidWinner(mockPlayer, mockAllIn);

      expect(result).toBe(false);
    });
  });

  describe('rakeToWinners,', () => {
    it('should distribute winnings equally among players', () => {
      const mockPlayer1 = { id: '12345', gameMoney: 0 };
      const mockPlayer2 = { id: '67890', gameMoney: 0 };
      const mockPlayers = [mockPlayer1, mockPlayer2];
      const amount = 100;
      let winners = {};

      winners = rakeToWinners(mockPlayers, amount, winners);

      expect(winners['12345'][1]).toBe(50);
      expect(winners['67890'][1]).toBe(50);
      expect(mockPlayer1.gameMoney).toBe(50);
      expect(mockPlayer2.gameMoney).toBe(50);
    });

    it('should handle remainder of the amount properly', () => {
      const mockPlayer1 = { id: '12345', gameMoney: 0 };
      const mockPlayers = [mockPlayer1];
      const amount = 75;
      let winners = {};

      (winners = rakeToWinners), (mockPlayers, amount, winners);

      expect(winners['12345'][1]).toBe(75);
      expect(mockPlayer1.gameMoney).toBe(75);
    });
  });

  describe('getWinners,', () => {
    it('should return the player with the strongest hand', () => {
      const mockPlayer1 = {
        handScore: {
          cards: [
            ['♥️', 'A'],
            ['♠️', '6']
          ]
        }
      };
      const mockPlayer2 = {
        handScore: {
          cards: [
            ['♥️', 'A'],
            ['♠️', '7']
          ]
        }
      };
      const mockPlayers = [mockPlayer1, mockPlayer2];

      const winners = getWinners(mockPlayers);

      expect(winners.length).toBe(1);
      expect(winners[0]).toBe(mockPlayer2);
    });

    it('should return multiple players if hands are equal', () => {
      const mockPlayer1 = {
        handScore: {
          cards: [
            ['♦️', '1'],
            ['♦️', 'J']
          ]
        }
      };
      const mockPlayer2 = {
        handScore: {
          cards: [
            ['♦️', '1'],
            ['♦️', 'J']
          ]
        }
      };
      const mockPlayers = [mockPlayer1, mockPlayer2];

      const winners = getWinners(mockPlayers);

      expect(winners.length).toBe(2);
      expect(winners).toContain(mockPlayer1);
      expect(winners).toContain(mockPlayer2);
    });
  });

  it('should return two winners (a tie)', () => {
    const mockPlayer1 = {
      handScore: {
        cards: [
          ['H', 'A'],
          ['C', 'K'],
          ['D', 'Q'],
          ['S', 'J'],
          ['H', '10']
        ]
      }
    };
    const mockPlayer2 = {
      handScore: {
        cards: [
          ['H', 'A'],
          ['D', 'K'],
          ['C', 'Q'],
          ['S', 'J'],
          ['H', '10']
        ]
      }
    };
    const mockPlayers = [mockPlayer1, mockPlayer2];

    const winners = getWinners(mockPlayers);

    expect(winners.length).toBe(2);
    expect(winners).toContain(mockPlayer1);
    expect(winners).toContain(mockPlayer2);
  });
});

describe('compareHands', () => {
  it('should return -1 if the first hand is stronger', () => {
    const hand1 = [
      ['H', 'A'],
      ['C', 'K'],
      ['D', 'Q'],
      ['S', 'J'],
      ['H', '10']
    ];

    const hand2 = [
      ['H', 'A'],
      ['C', 'K'],
      ['D', 'Q'],
      ['S', '8'],
      ['H', '10']
    ];

    const result = compareHands(hand1, hand2);

    expect(result).toBe(-1);
  });

  it('should return 1 if the second hand is stronger', () => {
    const hand1 = [
      ['H', 'A'],
      ['C', 'K'],
      ['D', 'Q'],
      ['S', '8'],
      ['H', '10']
    ];

    const hand2 = [
      ['H', 'A'],
      ['C', 'K'],
      ['D', 'Q'],
      ['S', 'J'],
      ['H', '10']
    ];

    const result = compareHands(hand1, hand2);

    expect(result).toBe(1);
  });

  it('should return 0 if both hands are equal', () => {
    const hand1 = [
      ['H', 'A'],
      ['C', 'K'],
      ['D', 'Q'],
      ['S', 'J'],
      ['H', '10']
    ];

    const hand2 = [
      ['H', 'A'],
      ['C', 'K'],
      ['D', 'Q'],
      ['S', 'J'],
      ['H', '10']
    ];

    const result = compareHands(hand1, hand2);

    expect(result).toBe(0);
  });
});

describe('randomWinnerKey', () => {
  it('should return a random key from the winners object', () => {
    const mockWinners = {
      12345: ['player1', 100],
      67890: ['player2', 200]
    };
    const randomKey = randomWinnerKey(mockWinners);

    expect(Object.keys(mockWinners)).toContain(randomKey);
  });
});
