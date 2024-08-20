const {
  join,
  show,
  exit,
  start,
  end,
  fold,
  check,
  raise,
  call,
  all_in,
} = require("../scripts/pok_functions.js");
const general_functions = require("../scripts/general_functions.js");
const Game = require("../classes/Game.js");
const LinkedList = require("../classes/LinkedList.js");

jest.mock("../classes/Game.js");
jest.mock("../scripts/general_functions.js");

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
    join(games, chat_id, message, full_name, contact, chat);

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
    join(games, chat_id, message, full_name, contact, chat);

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

    join(games, chat_id, message, full_name, contact, chat);

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
  let message = { reply: jest.fn() };

  test("Should message when table empty", () => {
    show(games, chat_id, message);

    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
  });

  test("Should return order", () => {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].is_midround = true;

    show(games, chat_id, message);

    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
  });

  test("Should return players", () => {
    games[chat_id] = new Game(chat_id, chat);
    games[chat_id].is_midround = false;

    show(games, chat_id, message);

    expect(message.reply).toHaveBeenCalledWith(expect.any(String));
  });
});
