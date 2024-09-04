const general_functions = require("../scripts/general_functions.js");

jest.mock("../classes/Game.js");

describe("is_allowed", () => {
  let game;
  let message;

  beforeEach(() => {
    game = { order: { current_player: { phone_number: "123" } } };
    message = {
      reply: jest.fn(),
      react: jest.fn(),
      author: "different author"
    };

    // jest.spyOn(general_functions, "emote")
  });

  test("Should message that player didn't play in his turn", () => {
    let result = general_functions.is_allowed(game, message);

    expect(message.react).toHaveBeenCalledWith(expect.any(String));
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeFalsy();
  });

  test("Should return true- player is allowed to play right now", () => {
    message.author = game.order.current_player.phone_number;
    let result = general_functions.is_allowed(game, message);

    expect(result).toBeTruthy();
  });
});
