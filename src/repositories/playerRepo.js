const { db } = require('../db/db.ts');
const { player, user, pot, game } = require('../db/schema.ts');
const { eq, and, sql } = require('drizzle-orm');
const potRepo = require('./potRepo.js');
const gameRepo = require('./gameRepo.js');

async function createPlayer(gameId, userId) {
  return (await db.insert(player).values({ gameId, userId }).returning())[0];
}

async function getPlayer(gameId, userId) {
  return (
    await db
      .select()
      .from(player)
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)))
      .limit(1)
  )[0];
}

async function getPreviousPlayer(gameId, userId) {
  return (
    await db
      .select()
      .from(player)
      .where(and(eq(player.gameId, gameId), eq(player.nextPlayer, userId)))
      .limit(1)
  )[0];
}

async function updatePlayer(gameId, userId, property, value) {
  await db
    .update(player)
    .set({ [property]: value })
    .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
}

async function deletePlayer(gameId, userId) {
  return await db
    .delete(player)
    .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
}

async function buyPreGame(gameId, userId, amount) {
  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({ money: sql`${user.money} - ${amount}` })
      .where(eq(user.id, userId));
    await tx
      .update(player)
      .set({ sessionBalance: sql`${player.sessionBalance} - ${amount}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(player)
      .set({ gameMoney: sql`${player.gameMoney} + ${amount}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
  });
}

async function buyInGame(gameId, userId, amount) {
  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({ money: sql`${user.money} - ${amount}` })
      .where(eq(user.id, userId));
    await tx
      .update(player)
      .set({ sessionBalance: sql`${player.sessionBalance} - ${amount}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(player)
      .set({ reBuy: sql`${player.reBuy} + ${amount}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
  });
}

async function checkout(gameId, userId, gameMoney) {
  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({ money: sql`${user.money} + ${gameMoney}` })
      .where(eq(user.id, userId));
    await tx
      .update(player)
      .set({
        sessionBalance: sql`${player.sessionBalance} + ${player.gameMoney}`,
      })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(player)
      .set({ gameMoney: 0 })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
  });
}

async function reBuy(gameId, userId) {
  await db.transaction(async (tx) => {
    await tx
      .update(player)
      .set({ gameMoney: sql`${player.gameMoney} + ${player.reBuy}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(player)
      .set({ reBuy: 0 })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
  });
}

async function bet(gameId, userId, amount, potId) {
  await db.transaction(async (tx) => {
    await tx
      .update(player)
      .set({ gameMoney: sql`${player.gameMoney} - ${amount}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(player)
      .set({ currentBet: sql`${player.currentBet} + ${amount}` })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(pot)
      .set({ value: sql`${pot.value} + ${amount}` })
      .where(eq(pot.id, potId));
  });

  let playerBet = (await getPlayer(gameId, userId)).currentBet;
  let mainPot = await potRepo.getPot((await gameRepo.getGame(gameId)).mainPot);

  if (playerBet > mainPot.highestBet) {
    await potRepo.updatePot(mainPot.id, 'highestBet', playerBet);
  }
}

async function addHoleCards(gameId, userId, cardsAmount) {
  await db.transaction(async (tx) => {
    let fetchedGame = (
      await tx
        .select({ deck: game.deck })
        .from(game)
        .where(eq(game.id, gameId))
        .limit(1)
    )[0];
    let cardsToAdd = fetchedGame.deck.splice(0, cardsAmount);
    let fetchedPlayer = (
      await tx
        .select({ holeCards: player.holeCards })
        .from(player)
        .where(and(eq(player.gameId, gameId), eq(player.userId, userId)))
        .limit(1)
    )[0];

    await tx
      .update(player)
      .set({
        holeCards: fetchedPlayer.holeCards.concat(cardsToAdd),
      })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(game)
      .set({ deck: fetchedGame.deck })
      .where(eq(game.id, gameId));
  });
}

module.exports = {
  createPlayer,
  getPlayer,
  getPreviousPlayer,
  deletePlayer,
  updatePlayer,
  buyPreGame,
  buyInGame,
  checkout,
  reBuy,
  bet,
  addHoleCards,
};
