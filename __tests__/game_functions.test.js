const {
  calc_strength,
  showdown,
  get_winners,
} = require("../scripts/game_functions.js");

const cards_functions = require("../scripts/cards_functions.js");
let Game = require("../classes/Game.js");

describe("get_winners", () => {
  let game;
  let id;
  let chat;

  beforeEach(() => {
    id = "some_id";
    chat = "some_chat";
    // game = new Game(id, chat);
    game = {
      type: 1,
      community_cards: [
        ["H", "10"],
        ["C", "K"],
        ["D", "Q"],
        ["S", "K"],
        ["H", "A"],
      ],
      order: {
        current_player: null, // This will be set later
        players: [],
      },
      jumpToButton: function () {
        this.order.current_player = this.order.players[0];
      },
    };
    game.players = { p1: {}, p2: "o", P3: "cool" };

    game.pot = { all_ins: [1, 2, 3] };
    game.chat = {
      sendMessage: jest.fn(),
    };
    game.chat.sendMessage.mockReturnValue("message_data");
    jest
      .spyOn(cards_functions, "calc_hands_strength")
      .mockImplementation(() => {
        return {
          1: [
            {
              hole_cards: [
                ["C", "5"],
                ["D", "9"],
              ],
            },
            {
              hole_cards: [
                ["C", "5"],
                ["D", "8"],
              ],
            },
          ],
          2: { p3: "p1" },
        };
      });
  });

  test("Should return one winner", () => {
    jest
      .spyOn(cards_functions, "calc_hands_strength")
      .mockImplementation(() => {
        return {
          1: {
            hole_cards: [
              ["C", "5"],
              ["D", "9"],
            ],
          },
        };
      });

    let result = get_winners(game);
    expect(result).toEqual({
      hole_cards: [
        ["C", "5"],
        ["D", "9"],
      ],
    });
  });

  // test("Should return two winners because the tie", () => {
  //   jest
  //     .spyOn(cards_functions, "calc_hands_strength")
  //     .mockImplementation(() => {
  //       return {
  //         1: [
  //           {
  //             hole_cards: [
  //               ["C", "5"],
  //               ["D", "9"],
  //             ],
  //           },
  //           {
  //             hole_cards: [
  //               ["C", "8"],
  //               ["D", "9"],
  //             ],
  //           },
  //         ],
  //       };
  //     });

  //   let result = get_winners(game);
  //   expect(result).toEqual({
  //     hole_cards: [
  //       ["C", "5"],
  //       ["D", "9"],
  //     ],
  //   });
  // });
  // TEST: tie between two or more players
  // TEST: tie in hand strength but player has high
  // TEST: tie between three players in hand strength but two players has high
});
