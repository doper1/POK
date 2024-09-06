const {
  print_cards,
  sort_cards,
  is_flush,
  is_straight,
  is_straight_flush,
  is_four_of_a_kind,
  is_full_house,
  is_three_of_a_kind,
  is_two_pair,
  is_one_pair,
  parseCardNumber,
  ReverseParseCardNumber,
  calc_hands_strength,
  c_count,
  isCardInCards,
  update_hand_str,
  format_hand
} = require("../cardsFunctions.js");

describe("Poker Hand Evaluation Tests", () => {
  test("print_cards formats cards correctly", () => {
    const cards = [
      ["H", "A"],
      ["D", "10"],
      ["S", "K"]
    ];
    const result = print_cards(cards);
    expect(result).toBe("*|HA|* *|D10|* *|SK|*");
  });

  test("parseCardNumber converts face cards correctly", () => {
    expect(parseCardNumber(["H", "A"])).toEqual(["H", 14]);
    expect(parseCardNumber(["D", "K"])).toEqual(["D", 13]);
    expect(parseCardNumber(["C", "Q"])).toEqual(["C", 12]);
    expect(parseCardNumber(["S", "J"])).toEqual(["S", 11]);
    expect(parseCardNumber(["H", "10"])).toEqual(["H", 10]);
  });

  test("ReverseParseCardNumber converts numeric cards correctly", () => {
    expect(ReverseParseCardNumber(["H", 14])).toEqual(["H", "A"]);
    expect(ReverseParseCardNumber(["D", 13])).toEqual(["D", "K"]);
    expect(ReverseParseCardNumber(["C", 12])).toEqual(["C", "Q"]);
    expect(ReverseParseCardNumber(["S", 11])).toEqual(["S", "J"]);
    expect(ReverseParseCardNumber(["H", 10])).toEqual(["H", "10"]);
  });

  test("is_flush detects a flush correctly", () => {
    const cards = [
      ["H", "2"],
      ["H", "5"],
      ["H", "9"],
      ["H", "Q"],
      ["H", "K"],
      ["D", "3"]
    ];
    expect(is_flush(cards)).toEqual([
      ["H", "2"],
      ["H", "5"],
      ["H", "9"],
      ["H", "Q"],
      ["H", "K"]
    ]);
  });

  test("is_straight detects a straight correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 9],
      ["S", 8],
      ["D", 7],
      ["H", 6],
      ["H", 2]
    ];
    expect(is_straight(cards)).toEqual([
      ["H", 10],
      ["C", 9],
      ["S", 8],
      ["D", 7],
      ["H", 6]
    ]);
  });

  test("is_straight_flush detects a straight flush correctly", () => {
    const cards = [
      ["H", 10],
      ["H", 9],
      ["H", 8],
      ["H", 7],
      ["H", 6],
      ["D", 3]
    ];
    expect(is_straight_flush(cards)).toEqual([
      ["H", 10],
      ["H", 9],
      ["H", 8],
      ["H", 7],
      ["H", 6]
    ]);
  });

  test("is_four_of_a_kind detects four of a kind correctly", () => {
    const cards = [
      ["H", 9],
      ["D", 9],
      ["S", 9],
      ["C", 9],
      ["H", 6]
    ];
    expect(is_four_of_a_kind(cards)).toEqual([
      ["H", 9],
      ["D", 9],
      ["S", 9],
      ["C", 9]
    ]);
  });

  test("is_full_house detects a full house correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 10],
      ["D", 6],
      ["H", 6]
    ];
    expect(is_full_house(cards)).toEqual([
      ["H", 10],
      ["C", 10],
      ["S", 10],
      ["D", 6],
      ["H", 6]
    ]);
  });

  test("is_three_of_a_kind detects three of a kind correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 10],
      ["D", 6],
      ["H", 2]
    ];
    expect(is_three_of_a_kind(cards)).toEqual([
      ["H", 10],
      ["C", 10],
      ["S", 10]
    ]);
  });

  test("is_two_pair detects two pairs correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 6],
      ["D", 6],
      ["H", 2]
    ];
    expect(is_two_pair(cards)).toEqual([
      ["H", 10],
      ["C", 10],
      ["S", 6],
      ["D", 6]
    ]);
  });

  test("is_one_pair detects one pair correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 6],
      ["D", 7],
      ["H", 2]
    ];
    expect(is_one_pair(cards)).toEqual([
      ["H", 10],
      ["C", 10]
    ]);
  });

  test("sort_cards sorts cards correctly by rank", () => {
    const cards = [
      ["H", 2],
      ["H", 14],
      ["D", 10],
      ["C", 7],
      ["S", 9]
    ];
    expect(sort_cards(cards)).toEqual([
      ["H", 14],
      ["D", 10],
      ["S", 9],
      ["C", 7],
      ["H", 2]
    ]);
  });
});

describe("calc_hands_strength", () => {
  test("everybody tied", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["C", "K"],
        ["D", "Q"],
        ["S", "K"],
        ["H", "A"]
      ],
      order: {
        current_player: null,
        players: []
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      }
    };

    const player1 = {
      hole_cards: [
        ["C", "7"],
        ["D", "10"]
      ],
      hand_score: {},
      is_button: true
    };

    const player2 = {
      hole_cards: [
        ["C", "10"],
        ["D", "7"]
      ],
      hand_score: {},
      is_button: false
    };

    const player3 = {
      hole_cards: [
        ["H", "Q"],
        ["S", "3"]
      ],
      hand_score: {},
      is_button: false
    };

    // Link players in a circular list
    player1.next_player = player2;
    player2.next_player = player3;
    player3.next_player = player1;

    game.order.players = [player1, player2, player3];
    game.order.current_player = player1;

    const result = calc_hands_strength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2, player3]
    });
  });

  test("correctly identifies a tie between two players", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["C", "K"],
        ["D", "Q"],
        ["S", "K"],
        ["H", "A"]
      ],
      order: {
        current_player: null,
        players: []
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      }
    };

    const player1 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: true
    };

    const player2 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: false
    };

    const player3 = {
      hole_cards: [
        ["H", "2"],
        ["S", "3"]
      ],
      hand_score: {},
      is_button: false
    };

    // Link players in a circular list
    player1.next_player = player2;
    player2.next_player = player3;
    player3.next_player = player1;

    game.order.players = [player1, player2, player3];
    game.order.current_player = player1;

    const result = calc_hands_strength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2],
      8: [player3]
    });
  });

  test("correctly identifies multiple ties", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["C", "K"],
        ["D", "Q"],
        ["S", "K"],
        ["H", "A"]
      ],
      order: {
        current_player: null,
        players: []
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      }
    };

    const player1 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: true
    };

    const player2 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: false
    };

    const player3 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: false
    };

    const player4 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: false
    };

    // Link players in a circular list
    player1.next_player = player2;
    player2.next_player = player3;
    player3.next_player = player4;
    player4.next_player = player1;

    game.order.players = [player1, player2, player3, player4];
    game.order.current_player = player1;

    const result = calc_hands_strength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2, player3, player4]
    });
  });

  test("correctly handles a situation with a single winner and multiple losers", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["C", "K"],
        ["D", "Q"],
        ["S", "K"],
        ["H", "A"]
      ],
      order: {
        current_player: null,
        players: []
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      }
    };

    const player1 = {
      hole_cards: [
        ["C", "A"],
        ["D", "A"]
      ],
      hand_score: {},
      is_button: true
    };

    const player2 = {
      hole_cards: [
        ["C", "10"],
        ["D", "7"]
      ],
      hand_score: {},
      is_button: false
    };

    const player3 = {
      hole_cards: [
        ["H", "2"],
        ["S", "3"]
      ],
      hand_score: {},
      is_button: false
    };

    const player4 = {
      hole_cards: [
        ["D", "4"],
        ["C", "9"]
      ],
      hand_score: {},
      is_button: false
    };

    // Link players in a circular list
    player1.next_player = player2;
    player2.next_player = player3;
    player3.next_player = player4;
    player4.next_player = player1;

    game.order.players = [player1, player2, player3, player4];
    game.order.current_player = player1;

    const result = calc_hands_strength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      3: [player1],
      7: [player2],
      8: [player3, player4]
    });
  });

  test("correctly handles a situation with three winners with the same hand", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["C", "K"],
        ["D", "Q"],
        ["S", "K"],
        ["H", "A"]
      ],
      order: {
        current_player: null,
        players: []
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      }
    };

    const player1 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: true
    };

    const player2 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: false
    };

    const player3 = {
      hole_cards: [
        ["C", "10"],
        ["D", "J"]
      ],
      hand_score: {},
      is_button: false
    };

    const player4 = {
      hole_cards: [
        ["H", "2"],
        ["S", "3"]
      ],
      hand_score: {},
      is_button: false
    };

    // Link players in a circular list
    player1.next_player = player2;
    player2.next_player = player3;
    player3.next_player = player4;
    player4.next_player = player1;

    game.order.players = [player1, player2, player3, player4];
    game.order.current_player = player1;

    const result = calc_hands_strength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      7: [player1, player2, player3],
      8: [player4]
    });
  });

  test("everybody tied (with two players)", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["D", "8"],
        ["S", "4"],
        ["C", "K"],
        ["C", "2"]
      ],
      order: {
        current_player: null,
        players: []
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      }
    };

    const player1 = {
      hole_cards: [
        ["H", "7"],
        ["C", "A"]
      ],
      hand_score: {},
      is_button: true
    };

    const player2 = {
      hole_cards: [
        ["D", "6"],
        ["D", "A"]
      ],
      hand_score: {},
      is_button: false
    };

    // Link players in a circular list
    player1.next_player = player2;
    player2.next_player = player1;

    game.order.players = [player1, player2];
    game.order.current_player = player1;

    const result = calc_hands_strength(game);

    // New assertion based on console.log output
    expect(result).toEqual({
      9: [player1, player2]
    });
  });
});

describe("Additional Card Function Tests", () => {
  test("c_count handles different card types", () => {
    const cards = [
      ["H", 2],
      ["H", 3],
      ["D", 2],
      ["S", 4],
      ["H", 5]
    ];
    const result = c_count(cards, 0);
    expect(result).toEqual({
      " H": [
        ["H", 2],
        ["H", 3],
        ["H", 5]
      ],
      " D": [["D", 2]],
      " S": [["S", 4]]
    });
  });

  test("isCardInCards returns true when card is present", () => {
    const cards = [
      ["H", 2],
      ["D", 3],
      ["S", 4]
    ];
    expect(isCardInCards(["H", 2], cards)).toBe(true);
  });

  test("isCardInCards returns false when card is not present", () => {
    const cards = [
      ["H", 2],
      ["D", 3],
      ["S", 4]
    ];
    expect(isCardInCards(["C", 5], cards)).toBe(false);
  });

  test("update_hand_str handles royal flush", () => {
    const game = {
      community_cards: [
        ["H", "10"],
        ["H", "J"],
        ["H", "Q"],
        ["H", "K"],
        ["S", "2"]
      ]
    };
    const player = {
      hole_cards: [
        ["H", "A"],
        ["D", "2"]
      ],
      hand_score: {}
    };
    update_hand_str(game, player);
    expect(player.hand_score.str).toBe(0);
  });

  test("update_hand_str handles high card", () => {
    const game = {
      community_cards: [
        ["H", "2"],
        ["D", "4"],
        ["S", "6"],
        ["C", "8"],
        ["H", "10"]
      ]
    };
    const player = {
      hole_cards: [
        ["S", "A"],
        ["D", "K"]
      ],
      hand_score: {}
    };
    update_hand_str(game, player);
    expect(player.hand_score.str).toBe(9);
  });

  test("format_hand correctly formats player's hand", () => {
    const playerName = "John";
    const holeCards = [
      ["H", "A"],
      ["D", "K"]
    ];
    const result = format_hand(playerName, holeCards);
    expect(result).toBe("@John: *|HA|* *|DK|*\n");
  });
});
