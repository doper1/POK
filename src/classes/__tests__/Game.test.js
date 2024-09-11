const Game = require("../Game");
const Player = require("../Player");
const Order = require("../Order");
const Pot = require("../Pot");
// const constants = require("../../constants.js");
// const cards_functions = require("../../game/cardsFunctions.js");
// const game_functions = require("../../game/gameFunctions.js");
// const { shuffleArray, delay } = require("../../generalFunctions.js");

jest.mock("../../constants", () => ({
  DECK: [
    /* mock deck of cards */
  ],
  SMALL_BLIND: 1,
  BIG_BLIND: 2
}));

jest.mock("../../game/cardsFunctions.js", () => ({
  print_cards: jest.fn(),
  format_hand: jest.fn()
}));

jest.mock("../../game/gameFunctions.js", () => ({
  showdown: jest.fn()
}));

jest.mock("../../generalFunctions.js", () => ({
  shuffleArray: jest.fn(),
  delay: jest.fn()
}));

describe("Game", () => {
  let game;
  let whatsapp;

  beforeEach(() => {
    whatsapp = { sendMessage: jest.fn() };
    game = new Game("game1", whatsapp);
    game.players = {
      123: new Player("contact1", "123"),
      456: new Player("contact2", "456")
    };
    game.order = new Order();
    game.pot = new Pot();
    game.deck = [
      /* mock deck of cards */
    ];
    // Create a linked list and assign players
    const playerIds = Object.keys(game.players);
    playerIds.forEach((id) => {
      game.order.append(game.players[id]);
    });
    // Set the button for the first player in the list
    game.order.current_player.is_button = true;
    // Close the linked list loop
    let current = game.order.current_player;
    while (current.next_player) {
      current = current.next_player;
    }
    current.next_player = game.order.current_player;
  });

  test("should initialize game correctly", () => {
    expect(game.id).toBe("game1");
    expect(game.chat).toBe(whatsapp);
    expect(game.players).toEqual(
      expect.objectContaining({
        123: expect.objectContaining({ is_button: true }),
        456: expect.objectContaining({ is_button: false })
      })
    );
    expect(game.order).toBeInstanceOf(Order);
    expect(game.pot).toBeInstanceOf(Pot);
    expect(game.deck).toEqual([]);
    expect(game.type).toBe(1);
    expect(game.community_cards).toEqual([]);
    expect(game.is_midround).toBe(false);
    expect(game.folds).toBe(0);
  });

  test("should add player correctly", () => {
    game.addPlayer("contact3", "789");
    expect(game.players["789"]).toBeInstanceOf(Player);
    expect(game.players["789"].contact).toBe("contact3");
    expect(game.players["789"].is_button).toBe(false);
  });

  test("should return players correctly", () => {
    expect(game.getPlayers()).toEqual(game.players);
  });

  // test("should get order pretty", () => {
  //   const result = game.getOrderPretty();
  //   expect(result).toContain("*1. @contact1*");
  //   expect(result).toContain("⚪");
  //   expect(result).toContain("2. @contact2");
  //   expect(result).not.toContain("⚪");
  // });

  // test("should update round", async () => {
  //   await game.updateRound(whatsapp, "Action message");
  //   expect(whatsapp.sendMessage).toHaveBeenCalledWith(
  //     expect.any(String),
  //     expect.any(Object)
  //   );
  // });

  // Additional tests can be added here to cover other functionalities
});
