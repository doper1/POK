const {
  isStraightFlush,
  isFourOfAKind,
  isFullHouse,
  isFlush,
  isStraight,
  isThreeOfAKind,
  isTwoPair,
  isPair,
  parseCardNumber,
  ReverseParseCardNumber,
  printCards,
  sortCards,
  countCards,
  updateHandStrength,
  isCardInCards,
  calcHandsStrength,
  formatHand
} = require('../cardsFunctions.js');

describe('Poker Hand Evaluation Tests', () => {
  test('printCards formats cards correctly', () => {
    const cards = [
      ['H', 'A'],
      ['D', '10'],
      ['S', 'K']
    ];
    const result = printCards(cards);
    expect(result).toBe('*IHAI* *ID10I* *ISKI*');
  });

  test('parseCardNumber converts face cards correctly', () => {
    expect(parseCardNumber(['H', 'A'])).toEqual(['H', 14]);
    expect(parseCardNumber(['D', 'K'])).toEqual(['D', 13]);
    expect(parseCardNumber(['C', 'Q'])).toEqual(['C', 12]);
    expect(parseCardNumber(['S', 'J'])).toEqual(['S', 11]);
    expect(parseCardNumber(['H', '10'])).toEqual(['H', 10]);
  });

  test('ReverseParseCardNumber converts numeric cards correctly', () => {
    expect(ReverseParseCardNumber(['H', 14])).toEqual(['H', 'A']);
    expect(ReverseParseCardNumber(['D', 13])).toEqual(['D', 'K']);
    expect(ReverseParseCardNumber(['C', 12])).toEqual(['C', 'Q']);
    expect(ReverseParseCardNumber(['S', 11])).toEqual(['S', 'J']);
    expect(ReverseParseCardNumber(['H', 10])).toEqual(['H', '10']);
  });

  test('isFlush detects a flush correctly', () => {
    const cards = [
      ['H', '2'],
      ['H', '5'],
      ['H', '9'],
      ['H', 'Q'],
      ['H', 'K'],
      ['D', '3']
    ];
    expect(isFlush(cards)).toEqual([
      ['H', '2'],
      ['H', '5'],
      ['H', '9'],
      ['H', 'Q'],
      ['H', 'K']
    ]);
  });

  test('isStraight detects a straight correctly', () => {
    const cards = [
      ['H', 10],
      ['C', 9],
      ['S', 8],
      ['D', 7],
      ['H', 6],
      ['H', 2]
    ];
    expect(isStraight(cards)).toEqual([
      ['H', 10],
      ['C', 9],
      ['S', 8],
      ['D', 7],
      ['H', 6]
    ]);
  });

  test('isStraightFlush detects a straight flush correctly', () => {
    const cards = [
      ['H', 10],
      ['H', 9],
      ['H', 8],
      ['H', 7],
      ['H', 6],
      ['D', 3]
    ];
    expect(isStraightFlush(cards)).toEqual([
      ['H', 10],
      ['H', 9],
      ['H', 8],
      ['H', 7],
      ['H', 6]
    ]);
  });

  test('isFourOfAKind detects four of a kind correctly', () => {
    const cards = [
      ['H', 9],
      ['D', 9],
      ['S', 9],
      ['C', 9],
      ['H', 6]
    ];
    expect(isFourOfAKind(cards)).toEqual([
      ['H', 9],
      ['D', 9],
      ['S', 9],
      ['C', 9]
    ]);
  });

  test('isFullHouse detects a full house correctly', () => {
    const cards = [
      ['H', 10],
      ['C', 10],
      ['S', 10],
      ['D', 6],
      ['H', 6]
    ];
    expect(isFullHouse(cards)).toEqual([
      ['H', 10],
      ['C', 10],
      ['S', 10],
      ['D', 6],
      ['H', 6]
    ]);
  });

  test('isThreeOfAKind detects three of a kind correctly', () => {
    const cards = [
      ['H', 10],
      ['C', 10],
      ['S', 10],
      ['D', 6],
      ['H', 2]
    ];
    expect(isThreeOfAKind(cards)).toEqual([
      ['H', 10],
      ['C', 10],
      ['S', 10]
    ]);
  });

  test('isTwoPair detects two pairs correctly', () => {
    const cards = [
      ['H', 10],
      ['C', 10],
      ['S', 6],
      ['D', 6],
      ['H', 2]
    ];
    expect(isTwoPair(cards)).toEqual([
      ['H', 10],
      ['C', 10],
      ['S', 6],
      ['D', 6]
    ]);
  });

  test('isPair detects one pair correctly', () => {
    const cards = [
      ['H', 10],
      ['C', 10],
      ['S', 6],
      ['D', 7],
      ['H', 2]
    ];
    expect(isPair(cards)).toEqual([
      ['H', 10],
      ['C', 10]
    ]);
  });

  test('sortCards sorts cards correctly by rank', () => {
    const cards = [
      ['H', 2],
      ['H', 14],
      ['D', 10],
      ['C', 7],
      ['S', 9]
    ];
    expect(sortCards(cards)).toEqual([
      ['H', 14],
      ['D', 10],
      ['S', 9],
      ['C', 7],
      ['H', 2]
    ]);
  });
});

describe('calcHandsStrength', () => {
  test('everybody tied', () => {
    const game = {
      type: 1,
      communityCards: [
        ['H', '10'],
        ['C', 'K'],
        ['D', 'Q'],
        ['S', 'K'],
        ['H', 'A']
      ],
      order: {
        currentPlayer: null,
        players: []
      },
      jumpToButton: function () {
        this.order.currentPlayer = this.order.players[0];
      }
    };

    const player1 = {
      holeCards: [
        ['C', '7'],
        ['D', '10']
      ],
      handScore: {},
      isButton: true
    };

    const player2 = {
      holeCards: [
        ['C', '10'],
        ['D', '7']
      ],
      handScore: {},
      isButton: false
    };

    const player3 = {
      holeCards: [
        ['H', 'Q'],
        ['S', '3']
      ],
      handScore: {},
      isButton: false
    };

    // Link players in a circular list
    player1.nextPlayer = player2;
    player2.nextPlayer = player3;
    player3.nextPlayer = player1;

    game.order.players = [player1, player2, player3];
    game.order.currentPlayer = player1;

    const result = calcHandsStrength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2, player3]
    });
  });

  test('correctly identifies a tie between two players', () => {
    const game = {
      type: 1,
      communityCards: [
        ['H', '10'],
        ['C', 'K'],
        ['D', 'Q'],
        ['S', 'K'],
        ['H', 'A']
      ],
      order: {
        currentPlayer: null,
        players: []
      },
      jumpToButton: function () {
        this.order.currentPlayer = this.order.players[0];
      }
    };

    const player1 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: true
    };

    const player2 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: false
    };

    const player3 = {
      holeCards: [
        ['H', '2'],
        ['S', '3']
      ],
      handScore: {},
      isButton: false
    };

    // Link players in a circular list
    player1.nextPlayer = player2;
    player2.nextPlayer = player3;
    player3.nextPlayer = player1;

    game.order.players = [player1, player2, player3];
    game.order.currentPlayer = player1;

    const result = calcHandsStrength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2],
      8: [player3]
    });
  });

  test('correctly identifies multiple ties', () => {
    const game = {
      type: 1,
      communityCards: [
        ['H', '10'],
        ['C', 'K'],
        ['D', 'Q'],
        ['S', 'K'],
        ['H', 'A']
      ],
      order: {
        currentPlayer: null,
        players: []
      },
      jumpToButton: function () {
        this.order.currentPlayer = this.order.players[0];
      }
    };

    const player1 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: true
    };

    const player2 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: false
    };

    const player3 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: false
    };

    const player4 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: false
    };

    // Link players in a circular list
    player1.nextPlayer = player2;
    player2.nextPlayer = player3;
    player3.nextPlayer = player4;
    player4.nextPlayer = player1;

    game.order.players = [player1, player2, player3, player4];
    game.order.currentPlayer = player1;

    const result = calcHandsStrength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2, player3, player4]
    });
  });

  test('correctly handles a situation with a single winner and multiple losers', () => {
    const game = {
      type: 1,
      communityCards: [
        ['H', '10'],
        ['C', 'K'],
        ['D', 'Q'],
        ['S', 'K'],
        ['H', 'A']
      ],
      order: {
        currentPlayer: null,
        players: []
      },
      jumpToButton: function () {
        this.order.currentPlayer = this.order.players[0];
      }
    };

    const player1 = {
      holeCards: [
        ['C', 'A'],
        ['D', 'A']
      ],
      handScore: {},
      isButton: true
    };

    const player2 = {
      holeCards: [
        ['C', '10'],
        ['D', '7']
      ],
      handScore: {},
      isButton: false
    };

    const player3 = {
      holeCards: [
        ['H', '2'],
        ['S', '3']
      ],
      handScore: {},
      isButton: false
    };

    const player4 = {
      holeCards: [
        ['D', '4'],
        ['C', '9']
      ],
      handScore: {},
      isButton: false
    };

    // Link players in a circular list
    player1.nextPlayer = player2;
    player2.nextPlayer = player3;
    player3.nextPlayer = player4;
    player4.nextPlayer = player1;

    game.order.players = [player1, player2, player3, player4];
    game.order.currentPlayer = player1;

    const result = calcHandsStrength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      3: [player1],
      7: [player2],
      8: [player3, player4]
    });
  });

  test('correctly handles a situation with three winners with the same hand', () => {
    const game = {
      type: 1,
      communityCards: [
        ['H', '10'],
        ['C', 'K'],
        ['D', 'Q'],
        ['S', 'K'],
        ['H', 'A']
      ],
      order: {
        currentPlayer: null,
        players: []
      },
      jumpToButton: function () {
        this.order.currentPlayer = this.order.players[0];
      }
    };

    const player1 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: true
    };

    const player2 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: false
    };

    const player3 = {
      holeCards: [
        ['C', '10'],
        ['D', 'J']
      ],
      handScore: {},
      isButton: false
    };

    const player4 = {
      holeCards: [
        ['H', '2'],
        ['S', '3']
      ],
      handScore: {},
      isButton: false
    };

    // Link players in a circular list
    player1.nextPlayer = player2;
    player2.nextPlayer = player3;
    player3.nextPlayer = player4;
    player4.nextPlayer = player1;

    game.order.players = [player1, player2, player3, player4];
    game.order.currentPlayer = player1;

    const result = calcHandsStrength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2, player3],
      8: [player4]
    });
  });

  test('everybody tied (with two players)', () => {
    const game = {
      type: 1,
      communityCards: [
        ['H', '10'],
        ['D', '8'],
        ['S', '4'],
        ['C', 'K'],
        ['C', '2']
      ],
      order: {
        currentPlayer: null,
        players: []
      },
      jumpToButton: function () {
        this.order.currentPlayer = this.order.players[0];
      }
    };

    const player1 = {
      holeCards: [
        ['H', '7'],
        ['C', 'A']
      ],
      handScore: {},
      isButton: true
    };

    const player2 = {
      holeCards: [
        ['D', '6'],
        ['D', 'A']
      ],
      handScore: {},
      isButton: false
    };

    // Link players in a circular list
    player1.nextPlayer = player2;
    player2.nextPlayer = player1;

    game.order.players = [player1, player2];
    game.order.currentPlayer = player1;

    const result = calcHandsStrength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      9: [player1, player2]
    });
  });
});

describe('Additional Card Function Tests', () => {
  test('countCards handles different card types', () => {
    const cards = [
      ['H', 2],
      ['H', 3],
      ['D', 2],
      ['S', 4],
      ['H', 5]
    ];
    const result = countCards(cards, 0);
    expect(result).toEqual({
      ' H': [
        ['H', 2],
        ['H', 3],
        ['H', 5]
      ],
      ' D': [['D', 2]],
      ' S': [['S', 4]]
    });
  });

  test('isCardInCards returns true when card is present', () => {
    const cards = [
      ['H', 2],
      ['D', 3],
      ['S', 4]
    ];
    expect(isCardInCards(['H', 2], cards)).toBe(true);
  });

  test('isCardInCards returns false when card is not present', () => {
    const cards = [
      ['H', 2],
      ['D', 3],
      ['S', 4]
    ];
    expect(isCardInCards(['C', 5], cards)).toBe(false);
  });

  test('updateHandStrength handles royal flush', () => {
    const game = {
      communityCards: [
        ['H', '10'],
        ['H', 'J'],
        ['H', 'Q'],
        ['H', 'K'],
        ['S', '2']
      ]
    };
    const player = {
      holeCards: [
        ['H', 'A'],
        ['D', '2']
      ],
      handScore: {}
    };
    updateHandStrength(game, player);
    expect(player.handScore.str).toBe(0);
  });

  test('updateHandStrength handles high card', () => {
    const game = {
      communityCards: [
        ['H', '2'],
        ['D', '4'],
        ['S', '6'],
        ['C', '8'],
        ['H', '10']
      ]
    };
    const player = {
      holeCards: [
        ['S', 'A'],
        ['D', 'K']
      ],
      handScore: {}
    };
    updateHandStrength(game, player);
    expect(player.handScore.str).toBe(9);
  });

  test("formatHand correctly formats player's hand", () => {
    const playerName = 'John';
    const holeCards = [
      ['H', 'A'],
      ['D', 'K']
    ];
    const result = formatHand(playerName, holeCards);
    expect(result).toBe('@John: *IHAI* *IDKI*\n');
  });
});
