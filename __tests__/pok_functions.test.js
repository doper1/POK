const pok_functions = require("../scripts/pok_functions.js");
const general_functions = require("../scripts/general_functions.js");
const Game = require("../classes/Game.js");
const LinkedList = require("../classes/LinkedList.js");

jest.mock("../classes/Game.js");
jest.mock("../scripts/general_functions.js");
jest.mock("../classes/Player.js");

describe("pok join", () => {
  let games;
  let chat_id;
  let message;
  let full_name;
  let contact;
  let chat;
  let phone_number;

  beforeEach(() => {
    games = {};
    chat_id = "some_id";
    message = {
      author: "1232213",
      reply: jest.fn(),
    };
    full_name = "bob smith";
    contact = "1232213";
    chat = "some chat";
    phone_number = "123221355";

    general_functions.format_phone_number.mockReturnValue("123221355");
  });

  test("Should add a new Player to a new game", () => {
    pok_functions.join(games, chat_id, message, full_name, contact, chat);

    expect(games[chat_id]).toBeInstanceOf(Game);
    expect(games[chat_id].addPlayer).toHaveBeenCalledWith(
      full_name,
      phone_number,
      contact
    );
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
  });

  test("Should deny player from joining again", () => {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].players = {};
    games[chat_id].players[phone_number] = "bob";
    pok_functions.join(games, chat_id, message, full_name, contact, chat);

    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
  });

  test("Should allow player to join midround as folded player", () => {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].is_midround = true;
    games[chat_id].players = {};
    games[chat_id].players[111111] = { bob: "Hi" };
    games[chat_id].folds = 0;
    games[chat_id].order = new LinkedList();

    jest.spyOn(games[chat_id], "addPlayer").mockImplementation(() => {
      games[chat_id].players[phone_number] = { is_folded: false };
    });

    jest
      .spyOn(games[chat_id].order, "insertAfterCurrent")
      .mockImplementation(() => {
        console.log("Player inserted");
      });

    pok_functions.join(games, chat_id, message, full_name, contact, chat);

    expect(games[chat_id].addPlayer).toHaveBeenCalledWith(
      full_name,
      phone_number,
      contact
    );

    expect(games[chat_id].players[phone_number].is_folded).toBe(true);
    expect(games[chat_id].folds).toBe(1);
    expect(games[chat_id].order.insertAfterCurrent).toHaveBeenCalledWith(
      games[chat_id].players[phone_number]
    );
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
  });
});

describe("pok show", () => {
  let games = {};
  let chat = "some_chat";
  let chat_id = "some_id";
  let message;

  beforeEach(() => {
    message = { reply: jest.fn(), react: jest.fn() };
  });

  test("Should react and reply when the table is empty (no game)", () => {
    pok_functions.show(games[chat_id], message);

    jest.spyOn(general_functions, "emote").mockImplementation(() => {});
    expect(message.react).toHaveBeenCalledWith(general_functions.emote("fold"));
    expect(message.reply).toHaveBeenCalledWith(
      "There are no players at the table"
    );
  });

  test("Should reply with order when in the middle of a round", () => {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].is_midround = true;

    games[chat_id].getOrderPretty = jest
      .fn()
      .mockReturnValue("Order: Player1, Player2");

    pok_functions.show(games[chat_id], message);

    expect(message.reply).toHaveBeenCalledWith("Order: Player1, Player2");
  });

  test("Should reply with players when not in the middle of a round", () => {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].is_midround = false;

    games[chat_id].getPlayersPretty = jest
      .fn()
      .mockReturnValue("Players: Player1, Player2");

    pok_functions.show(games[chat_id], message);

    expect(message.reply).toHaveBeenCalledWith("Players: Player1, Player2");
  });
});

describe("pok raise", () => {
  let game;
  let message;
  let amount;

  beforeEach(() => {
    game = {
      order: {
        current_player: {
          current_bet: 3,
          game_money: 100,
          is_all_in: false,
          is_played: false,
        },
      },
      pot: {
        main_pot: 0,
        addAllIn: jest.fn(),
      },
    };
    message = { reply: jest.fn(), react: jest.fn() };

    jest.spyOn(general_functions, "is_allowed").mockImplementation(() => {
      return true;
    });
    jest.spyOn(general_functions, "emote").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // test("Should be all in by amount", () => {
  //   jest.spyOn(general_functions, "is_allowed").mockImplementation(() => {
  //     return true;
  //   });

  //   jest.spyOn(game_functions, "all_in").mockImplementation(() => {
  //     return true;
  //   });
  //   amount = game.order.current_player.game_money;
  //   let result = pok_functions.raise(game, message, amount);

  //   expect(game_functions.all_in).toHaveBeenCalledWith(game);
  // });

  test("Should message about wrong input type (NaN)", () => {
    amount = NaN;

    let result = pok_functions.raise(game, message, amount);

    expect(message.react).toHaveBeenCalledWith(
      general_functions.emote("mistake")
    );
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeFalsy();
  });

  test("Should message about float instead of int", () => {
    amount = 4.5;
    let result = pok_functions.raise(game, message, amount);

    expect(message.react).toHaveBeenCalledWith(
      general_functions.emote("mistake")
    );
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeFalsy();
  });

  test("Should message about amount smaller then 1 (Negative amount)", () => {
    amount = 4.5;
    let result = pok_functions.raise(game, message, amount);

    expect(message.react).toHaveBeenCalledWith(
      general_functions.emote("mistake")
    );
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeFalsy();
  });

  test("Should message about less money then bet amount", () => {
    amount = 40;
    game.order.current_player.game_money = 20;
    let result = pok_functions.raise(game, message, amount);

    expect(message.react).toHaveBeenCalledWith(
      general_functions.emote("mistake")
    );
    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeFalsy();
  });

  test("Should raise the expected amount", () => {
    amount = 40;
    // TODO
  });
});

describe("pok fold", () => {
  let game = { order: { current_player: { is_folded: true } }, folds: 1 };
  let message = { reply: jest.fn(), react: jest.fn() };

  jest.spyOn(general_functions, "is_allowed").mockImplementation(() => {
    return true;
  });
  jest.spyOn(general_functions, "emote").mockImplementation(() => {});
  test("Should mark player as folded and print a message", () => {
    let result = pok_functions.fold(game, message);

    expect(message.react).toHaveBeenCalledWith(general_functions.emote("fold"));
    expect(game.order.current_player.is_folded).toBeTruthy();
    expect(game.folds).toBe(2);
    expect(result).toBeTruthy();
  });
});
