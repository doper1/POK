const Order = require('../Order');
const Player = require('../Player');

describe('Order class - removePlayer', () => {
  let order;
  let player1, player2, player3;

  beforeEach(() => {
    order = new Order();

    // Create player instances
    player1 = new Player('Alice', '12345');
    player2 = new Player('Bob', '67890');
    player3 = new Player('Charlie', '54321');
  });

  test('removes the current player and updates the order correctly', () => {
    order.append(player1);
    order.append(player2);
    order.append(player3);

    // Make the list circular
    player3.nextPlayer = player1;

    const result = order.removePlayer('Alice');

    expect(result).toBe(true);
    expect(order.currentPlayer.nextPlayer.id).toBe('Bob'); // Player 2 is now the current player
    expect(player3.nextPlayer).toBe(player2); // Circular structure is maintained
  });

  test('removes a non-current player from the order', () => {
    order.append(player1);
    order.append(player2);
    order.append(player3);

    // Make the list circular
    player3.nextPlayer = player1;

    const result = order.removePlayer('Charlie');

    expect(result).toBe(true);
    expect(player1.nextPlayer).toBe(player2); // Player 1 should point to Player 2 now
    expect(player2.nextPlayer).toBe(player1); // Circular structure is maintained
  });

  test('removes the last player', () => {
    order.append(player1);
    order.append(player2);
    order.append(player3);

    // Make the list circular
    player3.nextPlayer = player1;

    const result = order.removePlayer('Charlie');

    expect(result).toBe(true);
    expect(player1.nextPlayer).toBe(player2); // Player 1 should point to Player 2 now
    expect(player2.nextPlayer).toBe(player1); // Circular structure is maintained
  });
});
