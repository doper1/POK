const Game = require('../Game');
const Player = require('../Player');
const Order = require('../Order');
const Pot = require('../Pot');

jest.mock('../../constants', () => ({
  DECK: [
    /* mock deck of cards */
  ],
  SMALL_BLIND: 1,
  BIG_BLIND: 2
}));

jest.mock('../../game/cardsFunctions.js', () => ({
  printCards: jest.fn(),
  formatHand: jest.fn()
}));

jest.mock('../../game/gameFunctions.js', () => ({
  showdown: jest.fn()
}));

jest.mock('../../generalFunctions.js', () => ({
  shuffleArray: jest.fn(),
  delay: jest.fn()
}));

describe('Game', () => {
  let game;
  let whatsapp;

  beforeEach(() => {
    whatsapp = { sendMessage: jest.fn() };
    game = new Game('game1', whatsapp);
    game.players = {
      123: new Player('contact1', '123'),
      456: new Player('contact2', '456')
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
    game.order.currentPlayer.isButton = true;
    // Close the linked list loop
    let current = game.order.currentPlayer;
    while (current.nextPlayer) {
      current = current.nextPlayer;
    }
    current.nextPlayer = game.order.currentPlayer;
  });

  test('should initialize game correctly', () => {
    expect(game.id).toBe('game1');
    expect(game.chat).toBe(whatsapp);
    expect(game.players).toEqual(
      expect.objectContaining({
        123: expect.objectContaining({ isButton: true }),
        456: expect.objectContaining({ isButton: false })
      })
    );
    expect(game.order).toBeInstanceOf(Order);
    expect(game.pot).toBeInstanceOf(Pot);
    expect(game.deck).toEqual([]);
    expect(game.type).toBe(1);
    expect(game.communityCards).toEqual([]);
    expect(game.isMidRound).toBe(false);
    expect(game.folds).toBe(0);
  });

  test('should add player correctly', () => {
    game.addPlayer('contact3', '789');
    expect(game.players['789']).toBeInstanceOf(Player);
    expect(game.players['789'].contact).toBe('contact3');
    expect(game.players['789'].isButton).toBe(false);
  });

  test('should return players correctly', () => {
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
