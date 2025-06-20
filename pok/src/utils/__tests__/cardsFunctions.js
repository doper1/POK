const { getHand, parseCardNumber } = require('../cardsFunctions');

describe('getHand - Comprehensive Tests', () => {
  // Helper function to parse cards into the correct format
  const createCards = (cards) => cards.map(parseCardNumber);

  it('should identify a Royal Flush', () => {
    const communityCards = createCards([
      ['2', 'A'],
      ['2', 'K'],
      ['2', 'Q'],
      ['2', 'J'],
      ['2', '10'],
    ]);
    const holeCards = createCards([
      ['3', '5'],
      ['4', '2'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(0); // Royal Flush
  });

  it('should identify a Straight Flush', () => {
    const communityCards = createCards([
      ['2', '9'],
      ['2', '8'],
      ['2', '7'],
      ['2', '6'],
      ['2', '5'],
    ]);
    const holeCards = createCards([
      ['4', '2'],
      ['3', '10'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(1); // Straight Flush
  });

  it('should identify Four of a Kind', () => {
    const communityCards = createCards([
      ['3', '6'],
      ['4', '6'],
      ['2', '6'],
      ['1', '6'],
      ['2', 'K'],
    ]);
    const holeCards = createCards([
      ['4', '5'],
      ['2', '2'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(2); // Four of a Kind
  });

  it('should identify a Full House', () => {
    const communityCards = createCards([
      ['2', 'K'],
      ['3', 'K'],
      ['4', '6'],
      ['1', '3'],
      ['3', '9'],
    ]);
    const holeCards = createCards([
      ['2', '6'],
      ['3', 'K'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(3); // Full House
  });

  it('should identify double Full House', () => {
    const communityCards = createCards([
      ['2', 'K'],
      ['3', 'K'],
      ['4', '6'],
      ['1', '6'],
      ['3', '9'],
    ]);
    const holeCards = createCards([
      ['2', '6'],
      ['3', 'K'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(3); // Full House
  });

  it('should identify a Flush', () => {
    const communityCards = createCards([
      ['1', 'A'],
      ['1', 'K'],
      ['1', 'Q'],
      ['1', '10'],
      ['3', '2'],
    ]);
    const holeCards = createCards([
      ['1', '5'],
      ['1', '3'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(4); // Flush
  });

  it('should identify a Straight', () => {
    const communityCards = createCards([
      ['2', '9'],
      ['3', '8'],
      ['4', '7'],
      ['1', '6'],
      ['3', '5'],
    ]);
    const holeCards = createCards([
      ['4', '2'],
      ['1', '4'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(5); // Straight
  });

  it('should identify a Wheel Straight (A-2-3-4-5)', () => {
    const communityCards = createCards([
      ['2', 'A'],
      ['3', '2'],
      ['4', '3'],
      ['1', '4'],
      ['3', '5'],
    ]);
    const holeCards = createCards([
      ['4', '9'],
      ['2', 'J'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(5); // Straight (Wheel)
  });

  it('should identify Three of a Kind', () => {
    const communityCards = createCards([
      ['3', '7'],
      ['4', '7'],
      ['2', '7'],
      ['1', '2'],
      ['3', '4'],
    ]);
    const holeCards = createCards([
      ['4', 'K'],
      ['2', 'A'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(6); // Three of a Kind
  });

  it('should identify Two Pair', () => {
    const communityCards = createCards([
      ['3', 'K'],
      ['4', 'K'],
      ['2', '6'],
      ['1', '6'],
      ['3', '4'],
    ]);
    const holeCards = createCards([
      ['4', '5'],
      ['2', '9'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(7); // Two Pair
  });

  it('should identify a Pair', () => {
    const communityCards = createCards([
      ['1', 'K'],
      ['2', '7'],
      ['3', '2'],
      ['4', '4'],
      ['2', '5'],
    ]);
    const holeCards = createCards([
      ['3', '4'],
      ['1', '6'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(8); // Pair
  });

  it('should identify High Card', () => {
    const communityCards = createCards([
      ['1', 'A'],
      ['3', 'K'],
      ['4', '9'],
      ['2', '6'],
      ['3', '3'],
    ]);
    const holeCards = createCards([
      ['4', '5'],
      ['2', '2'],
    ]);
    const game = { communityCards };
    const player = { holeCards };

    const result = getHand(game, player);
    expect(result.strength).toBe(9); // High Card
  });
});
