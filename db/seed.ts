require('dotenv').config();
const { db, connection } = require('./db.ts');
const schema = require('./schema');
const constants = require('../src/utils/constants');

async function seed() {
  try {
    // Seed users
    const users = await db
      .insert(schema.user)
      .values([
        { id: 'user1', money: constants.BASE_MONEY },
        { id: 'user2', money: constants.BASE_MONEY },
        { id: 'user3', money: constants.BASE_MONEY },
        { id: 'user4', money: constants.BASE_MONEY },
      ])
      .returning();

    console.log('Users seeded:', users);

    // Seed a game
    const [game] = await db
      .insert(schema.game)
      .values({
        id: 'game1',
        type: 'nlh',
        status: 'ongoing',
        currentPlayer: users[0].id,
        button: users[1].id,
        deck: [
          ['A', 's'],
          ['K', 'h'],
          ['Q', 'd'],
          ['J', 'c'],
          ['T', 's'],
          ['9', 'h'],
          ['8', 'd'],
          ['7', 'c'],
        ],
        communityCards: [
          ['A', 'h'],
          ['K', 's'],
          ['Q', 'c'],
        ],
        lastRoundPot: 100,
      })
      .returning();

    console.log('Game seeded:', game);

    // Seed players
    const players = await db
      .insert(schema.player)
      .values([
        {
          gameId: game.id,
          userId: users[0].id,
          gameMoney: 1000,
          currentBet: 50,
          status: 'active',
          holeCards: [
            ['A', 's'],
            ['K', 'h'],
          ],
          nextPlayer: users[1].id,
        },
        {
          gameId: game.id,
          userId: users[1].id,
          gameMoney: 950,
          currentBet: 100,
          status: 'active',
          holeCards: [
            ['Q', 'd'],
            ['J', 'c'],
          ],
          nextPlayer: users[2].id,
        },
        {
          gameId: game.id,
          userId: users[2].id,
          gameMoney: 1000,
          currentBet: 0,
          status: 'folded',
          holeCards: [
            ['T', 's'],
            ['9', 'h'],
          ],
          nextPlayer: users[3].id,
        },
        {
          gameId: game.id,
          userId: users[3].id,
          gameMoney: 1050,
          currentBet: 50,
          status: 'active',
          holeCards: [
            ['8', 'd'],
            ['7', 'c'],
          ],
          nextPlayer: users[0].id,
        },
      ])
      .returning();

    console.log('Players seeded:', players);

    // Seed pot
    const [pot] = await db
      .insert(schema.pot)
      .values({
        gameId: game.id,
        value: 200,
        highestBet: 100,
      })
      .returning();

    console.log('Pot seeded:', pot);

    // Seed participants
    const participants = await db
      .insert(schema.participant)
      .values([
        { potId: pot.id, userId: users[0].id },
        { potId: pot.id, userId: users[1].id },
        { potId: pot.id, userId: users[3].id },
      ])
      .returning();

    console.log('Participants seeded:', participants);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seed();

export {};
