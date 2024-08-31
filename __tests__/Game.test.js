const Game = require("../classes/Game.js");

describe("update_round", () => {
  let whatsapp;
  let action_message;
  let game;
  let id;
  let chat;

  beforeEach(() => {
    whatsapp = {};
    action_message = "some message";
    id = "some_id";
    chat = "some_chat";
    game = new Game(id, chat);
    game.order = { current_player: { name: "Adam" } };
    game.players = {
      p1: { contact: { id: { _serialized: "1234" } } },
      p2: { contact: { id: { _serialized: "12343333" } } },
      P3: { contact: { id: { _serialized: "111134" } } },
    };
    game.pot = { all_ins: [1, 2, 3] };
    game.chat = {
      sendMessage: jest.fn(),
    };
    game.chat.sendMessage.mockReturnValue("message_data");
  });

  test("Should rush to showdown by all players in pot in all in", () => {
    jest.spyOn(game, "rushRound").mockImplementation(() => {});
    game.updateRound(whatsapp, action_message);
    expect(game.chat.sendMessage).toHaveBeenCalledWith(
      expect.any(String),
      expect.anything()
    ); // Rec, by the 'all_ins' attribute that everybody is all in
    // expect(game.rushRound).toHaveBeenCalledWith("message_data"); // Handle winner logic
  });
  // DONE IN CODE
  // test("Should move action to the next player in order", () => {
  //   game.order.current_player.next_player.is_folded = false;
  //   game.order.current_player.next_player.is_all_in = false;
  //   game.order.current_player.next_player.is_played = false;
  //   game.order.current_player.next_player.current_bet = 0;

  //   expect(game.moveAction).toHaveBeenCalled();
  // });
  // DONE IN CODE
  //   test("Should move from preflop to flop", () => {
  //     expect(); // One cards dealing
  //     expect(); // Move action to the first player that didn't fold
  //     expect(); // Update of last_round_pot
  //     expect(); // Removal of is_played flags
  //   });
  // DONE IN CODE
  //   test("Should move from flop to turn", () => {
  //     expect(); // One card dealing
  //     expect(); // Move action to the first player that didn't fold
  //     expect(); // Update of last_round_pot
  //     expect(); // Removal of is_played flags
  //   });
  // DONE IN CODE
  //   test("Should move from turn to river", () => {
  //     expect(); // One card dealing
  //     expect(); // Move action to the first player that didn't fold
  //     expect(); // Update of last_round_pot
  //     expect(); // Removal of is_played flags
  //   });
  // DONE IN CODE
  //   test("Should move from river to showdown", () => {
  //     expect(); // Reorganize the all in pots (if they exists)
  //     expect(); // Deal money to players from the smallest all in pot to the largest one, and keep track of the players, ignore players that already folded
  //     expect(); // Deal the main pot to one player
  //     expect(); // Handle split pots in main pots and in all in pots- with winners list per pot
  //     expect(); // Start a new round by calling the initRound function
  //   });

  // DONE IN CODE
  //   test("Should finish game by everybody folding except one player", () => {
  //     expect(); // Recognize by the 'folds' attribute that everybody except one player had folded
  //     expect(); // Message about the winner (call showdown)
  //     expect(); // Handle winner logic
  //   });
  // DONE IN CODE
  //   test("Should rush to showdown by everyone in pot all in except one player that called the biggest all in", () => {
  //     expect(); // Recognize by the 'all_ins' attribute that everybody is all in
  //     expect(); // Message about the winner (Call showdown)
  //     expect(); // Handle winner logic
  //   });
});
