const { db } = require('../../db/db.ts');
const { game, player, user, pot } = require('../../db/schema.ts');
const { eq, and } = require('drizzle-orm');

async function createGame(id, groupName) {
  return (await db.insert(game).values({ id, groupName }).returning())[0];
}

async function getGame(id) {
  return (await db.select().from(game).where(eq(game.id, id)).limit(1))[0];
}

async function updateGame(id, property, value) {
  await db
    .update(game)
    .set({ [property]: value })
    .where(eq(game.id, id));
}

async function getPlayers(gameId) {
  return await db.select().from(player).where(eq(player.gameId, gameId));
}
async function getPlayersWithMoney(gameId) {
  return await db
    .select({
      ...player,
      money: user.money,
    })
    .from(user)
    .innerJoin(player, eq(player.userId, user.id))
    .where(eq(player.gameId, gameId));
}

async function getPots(gameId) {
  return await db.select().from(pot).where(eq(pot.gameId, gameId));
}

async function deletePots(gameId) {
  await db.delete(pot).where(eq(pot.gameId, gameId));
}

async function getUsers(gameId) {
  return await db
    .select({ user })
    .from(user)
    .innerJoin(player, eq(player.userId, user.id))
    .where(eq(player.gameId, gameId));
}

async function addCommunityCards(gameId, cardsAmount) {
  await db.transaction(async (tx) => {
    let fetchedGame = (
      await tx
        .select({ deck: game.deck, communityCards: game.communityCards })
        .from(game)
        .where(eq(game.id, gameId))
        .limit(1)
    )[0];
    let cardsToAdd = fetchedGame.deck.splice(0, cardsAmount);

    await tx
      .update(game)
      .set({
        communityCards: fetchedGame.communityCards.concat(cardsToAdd),
      })
      .where(eq(game.id, gameId));
    await tx
      .update(game)
      .set({ deck: fetchedGame.deck })
      .where(eq(game.id, gameId));
  });
}

async function addPlayerMidGame(gameId, userId) {
  await db.transaction(async (tx) => {
    await tx
      .update(player)
      .set({ status: 'middle join' })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));

    let currentPlayer = (
      await tx
        .select({ ...player })
        .from(player)
        .innerJoin(game, eq(game.id, player.gameId))
        .where(
          and(eq(player.gameId, gameId), eq(player.userId, game.currentPlayer)),
        )
    )[0];

    await tx
      .update(player)
      .set({ nextPlayer: currentPlayer.nextPlayer })
      .where(and(eq(player.gameId, gameId), eq(player.userId, userId)));
    await tx
      .update(player)
      .set({ nextPlayer: userId })
      .where(
        and(eq(player.gameId, gameId), eq(player.userId, currentPlayer.userId)),
      );
  });
}

async function deleteGame(gameId) {
  await db.delete(game).where(eq(game.id, gameId));
}

module.exports = {
  createGame,
  getGame,
  updateGame,
  getPlayers,
  getPlayersWithMoney,
  getPots,
  deletePots,
  addCommunityCards,
  getUsers,
  addPlayerMidGame,
  deleteGame,
};
