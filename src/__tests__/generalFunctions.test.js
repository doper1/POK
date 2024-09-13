const generalFunctions = require('../generalFunctions.js');

jest.mock('../classes/Game.js');

describe('isAllowed', () => {
  let game;
  let message;

  beforeEach(() => {
    game = { order: { currentPlayer: { id: '123' } } };
    message = {
      reply: jest.fn(),
      react: jest.fn(),
      author: 'different author',
    };

    // jest.spyOn(generalFunctions, "emote")
  });

  test("Should message that player didn't play in his turn", () => {
    let result = generalFunctions.isAllowed(game, message);

    expect(message.react).toHaveBeenCalledWith(expect.any(String));
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeFalsy();
  });

  test('Should return true- player is allowed to play right now', () => {
    message.author = game.order.currentPlayer.id;
    let result = generalFunctions.isAllowed(game, message);

    expect(result).toBeTruthy();
  });
});
