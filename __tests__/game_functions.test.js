const {
  print_cards,
  sort_cards,
  c_count,
  is_straight,
  is_straight_flush,
  is_four_of_a_kind,
  is_full_house,
  is_flush,
  is_three_of_a_kind,
  is_two_pair,
  is_one_pair,
  update_hand_str,
  parseCardNumber,
  ReverseParseCardNumber,
  isCardInCards,
  calc_strength,
  showdown,
  format_hand,
} = require("../scripts/game_functions.js");

describe("Poker Hand Evaluation Tests", () => {
  test("print_cards formats cards correctly", () => {
    const cards = [
      ["H", "A"],
      ["D", "10"],
      ["S", "K"],
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
      ["D", "3"],
    ];
    expect(is_flush(cards)).toEqual([
      ["H", "2"],
      ["H", "5"],
      ["H", "9"],
      ["H", "Q"],
      ["H", "K"],
    ]);
  });

  test("is_straight detects a straight correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 9],
      ["S", 8],
      ["D", 7],
      ["H", 6],
      ["H", 2],
    ];
    expect(is_straight(cards)).toEqual([
      ["H", 10],
      ["C", 9],
      ["S", 8],
      ["D", 7],
      ["H", 6],
    ]);
  });

  test("is_straight_flush detects a straight flush correctly", () => {
    const cards = [
      ["H", 10],
      ["H", 9],
      ["H", 8],
      ["H", 7],
      ["H", 6],
      ["D", 3],
    ];
    expect(is_straight_flush(cards)).toEqual([
      ["H", 10],
      ["H", 9],
      ["H", 8],
      ["H", 7],
      ["H", 6],
    ]);
  });

  test("is_four_of_a_kind detects four of a kind correctly", () => {
    const cards = [
      ["H", 9],
      ["D", 9],
      ["S", 9],
      ["C", 9],
      ["H", 6],
    ];
    expect(is_four_of_a_kind(cards)).toEqual([
      ["H", 9],
      ["D", 9],
      ["S", 9],
      ["C", 9],
    ]);
  });

  test("is_full_house detects a full house correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 10],
      ["D", 6],
      ["H", 6],
    ];
    expect(is_full_house(cards)).toEqual([
      ["H", 10],
      ["C", 10],
      ["S", 10],
      ["D", 6],
      ["H", 6],
    ]);
  });

  test("is_three_of_a_kind detects three of a kind correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 10],
      ["D", 6],
      ["H", 2],
    ];
    expect(is_three_of_a_kind(cards)).toEqual([
      ["H", 10],
      ["C", 10],
      ["S", 10],
    ]);
  });

  test("is_two_pair detects two pairs correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 6],
      ["D", 6],
      ["H", 2],
    ];
    expect(is_two_pair(cards)).toEqual([
      ["H", 10],
      ["C", 10],
      ["S", 6],
      ["D", 6],
    ]);
  });

  test("is_one_pair detects one pair correctly", () => {
    const cards = [
      ["H", 10],
      ["C", 10],
      ["S", 6],
      ["D", 7],
      ["H", 2],
    ];
    expect(is_one_pair(cards)).toEqual([
      ["H", 10],
      ["C", 10],
    ]);
  });

  test("sort_cards sorts cards correctly by rank", () => {
    const cards = [
      ["H", 2],
      ["H", 14],
      ["D", 10],
      ["C", 7],
      ["S", 9],
    ];
    expect(sort_cards(cards)).toEqual([
      ["H", 14],
      ["D", 10],
      ["S", 9],
      ["C", 7],
      ["H", 2],
    ]);
  });

  test("showdown determines the winner correctly", () => {
    const game = {
      type: 1,
      community_cards: [
        ["H", "A"],
        ["H", "K"],
        ["H", "Q"],
        ["H", "J"],
        ["H", "10"],
      ],
      pot: {
        main_pot: 100,
      },
      players: {
        "+123456789": {
          game_money: 0,
          hole_cards: [
            ["C", "2"],
            ["D", "3"],
          ],
        },
      },
      order: {
        current_player: {
          name: "Player1",
          phone_number: "+123456789",
          next_player: { is_button: true },
        },
      },
      jumpToButton: () => {},
    };

    const message = showdown(game);
    expect(message).toBe(
      "Player1 Won $100 with *|C2|* *|D3|*\nRoyal Flush - *|HA|* *|HK|* *|HQ|* *|HJ|* *|H10|*"
    );
  });

  test("all_in updates game state correctly", () => {
    const game = {
      pot: {
        main_pot: 100,
        current_round_bets: [],
        current_bet: 50,
        addAllIn: jest.fn(),
      },
      order: {
        current_player: {
          game_money: 50,
          current_bet: 0,
          is_all_in: false,
          is_played: false,
        },
      },
    };

    const result = all_in(game);

    expect(result).toBe(true);
    expect(game.pot.main_pot).toBe(150);
    expect(game.pot.current_round_bets).toEqual([50]);
    expect(game.pot.current_bet).toBe(100);
    expect(game.order.current_player.is_all_in).toBe(true);
    expect(game.order.current_player.is_played).toBe(true);
    expect(game.order.current_player.game_money).toBe(0);
    expect(game.pot.addAllIn).toHaveBeenCalled();
  });

  test("format_hand formats hand correctly", () => {
    const player_name = "Player1";
    const hole_cards = [
      ["H", "A"],
      ["D", "K"],
    ];
    const result = format_hand(player_name, hole_cards);
    expect(result).toBe("Player1: *|HA|* *|DK|*");
  });
});
