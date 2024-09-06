const Game = require("../../../classes/Game.js");
const { format_phone_number } = require("../../../generalFunctions.js");
const { join, show, exit } = require("../actions.js");

// Mocking the required classes and functions
jest.mock("../../../classes/Game.js");
jest.mock("../../../generalFunctions.js");

describe("Game Functions", () => {
  let games;
  let chat;
  let message;
  let contact;

  beforeEach(() => {
    games = {};
    chat = {
      sendMessage: jest.fn()
    };
    message = {
      author: "test_author",
      react: jest.fn(),
      reply: jest.fn()
    };
    contact = {
      id: {
        user: "test_user"
      }
    };
    format_phone_number.mockImplementation((author) => `formatted_${author}`);
  });

  describe("join", () => {
    it("should add a new player to the game and send a welcome message", () => {
      const chat_id = "chat123";
      const message = { author: "test_author" };

      const gameInstance = new Game();
      Game.mockImplementation(() => gameInstance);
      gameInstance.addPlayer = jest.fn();
      gameInstance.is_midround = false;
      gameInstance.players = {};
      gameInstance.players["formatted_test_author"] = { contact };

      join(games, chat_id, message, contact, chat);

      expect(Game).toHaveBeenCalledWith(chat_id, chat);
      expect(gameInstance.addPlayer).toHaveBeenCalledWith(
        contact,
        "formatted_test_author"
      );
      expect(chat.sendMessage).toHaveBeenCalledWith(
        "Hi @test_user, welcome to the game!",
        { mentions: ["formatted_test_author"] }
      );
    });

    it("should handle mid-round scenario and update message accordingly", () => {
      const chat_id = "chat123";
      const message = { author: "test_author" };

      const gameInstance = new Game();
      Game.mockImplementation(() => gameInstance);
      gameInstance.addPlayer = jest.fn();
      gameInstance.is_midround = true;
      gameInstance.players = {};
      gameInstance.players["formatted_test_author"] = { contact };
      gameInstance.order = { insertAfterCurrent: jest.fn() };
      gameInstance.folds = 0; // Ensure folds is initialized

      join(games, chat_id, message, contact, chat);

      expect(gameInstance.players["formatted_test_author"].is_folded).toBe(
        true
      );
      expect(gameInstance.folds).toBe(1); // Check if folds is incremented
      expect(gameInstance.order.insertAfterCurrent).toHaveBeenCalledWith(
        gameInstance.players["formatted_test_author"]
      );
      expect(chat.sendMessage).toHaveBeenCalledWith(
        "Hi @test_user, welcome to the game!Wait for the next round to start",
        { mentions: ["formatted_test_author"] }
      );
    });
  });

  describe("show", () => {
    it("should send the order if mid-round, otherwise send the players", () => {
      const gameInstance = new Game();
      gameInstance.is_midround = true;
      gameInstance.getOrderPretty = jest.fn(() => "order_pretty");
      gameInstance.getMentions = jest.fn(() => ["mention1"]);

      show(gameInstance, chat);

      expect(chat.sendMessage).toHaveBeenCalledWith("order_pretty", {
        mentions: ["mention1"]
      });

      gameInstance.is_midround = false;
      gameInstance.getPlayersPretty = jest.fn(() => "players_pretty");

      show(gameInstance, chat);

      expect(chat.sendMessage).toHaveBeenCalledWith("players_pretty", {
        mentions: ["mention1"]
      });
    });
  });

  describe("exit", () => {
    it("should delete the player and send goodbye messages", () => {
      const chat_id = "chat123";
      games[chat_id] = {
        players: {
          formatted_test_author: {}
        },
        is_midround: false
      };

      exit(games, chat_id, message);
      expect(games[chat_id]).toBeUndefined();
      expect(message.react).toHaveBeenCalledWith("👋");
      expect(message.reply).toHaveBeenCalledWith("Goodbye!");
      // Check if the game was deleted from games
      expect(games[chat_id]).toBeUndefined();
    });

    it("should handle game end when no players are left mid-round", () => {
      const chat_id = "chat123";
      games[chat_id] = {
        players: {},
        is_midround: true
      };

      exit(games, chat_id, message);

      expect(games[chat_id]).toBeUndefined();
      expect(message.reply).toHaveBeenCalledWith("*The game has ended!*");
    });

    it("should handle game end when no players are left", () => {
      const chat_id = "chat123";
      games[chat_id] = {
        players: {},
        is_midround: false
      };

      exit(games, chat_id, message);

      expect(games[chat_id]).toBeUndefined();
    });
  });
});
