const Pot = require("../classes/Pot.js");
const AllIn = require("../classes/AllIn.js");

jest.mock("../Classes/AllIn.js");

describe("Pot", () => {
  let pot;
  let game;
  let players;

  beforeEach(() => {
    pot = new Pot();

    players = {
      "+12345": { current_bet: 50 },
      "+67890": { current_bet: 100 },
      "+54321": { current_bet: 75 }
    };

    game = {
      order: {
        current_player: {
          phone_number: "+67890",
          current_bet: 100
        }
      },
      players: players
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("addAllIn", () => {
    test("should add a new AllIn instance with correct players and pot", () => {
      pot.addAllIn(game);

      expect(AllIn).toHaveBeenCalledWith(
        [players["+67890"]],
        225, // Pot: 100 + 75 + 50 (capped at current player bet)
        100 // Current player's bet
      );
      expect(pot.all_ins.length).toBe(1);
    });
  });

  describe("reorgAllIns", () => {
    test("should reorganize all-ins by pot size in ascending order", () => {
      pot._all_ins = [{ pot: 200 }, { pot: 150 }, { pot: 300 }];

      pot.reorgAllIns();

      expect(pot.all_ins[0].pot).toBe(150);
      expect(pot.all_ins[1].pot).toBe(200);
      expect(pot.all_ins[2].pot).toBe(300);
    });

    test("should handle an empty _all_ins array gracefully", () => {
      pot.reorgAllIns();
      expect(pot.all_ins.length).toBe(0);
    });
  });

  describe("Getter and Setter Tests", () => {
    test("should get and set the main_pot value", () => {
      pot.main_pot = 500;
      expect(pot.main_pot).toBe(500);
    });

    test("should get and set the last_round_pot value", () => {
      pot.last_round_pot = 300;
      expect(pot.last_round_pot).toBe(300);
    });
  });
});
