const { db } = require('../../db/db.ts');
const { pot, participant } = require('../../db/schema.ts');
const { eq } = require('drizzle-orm');

async function getPot(id) {
  return (await db.select().from(pot).where(eq(pot.id, id)).limit(1))[0];
}

async function createPot(gameId, value = 0, highestBet = 0) {
  return (
    await db
      .insert(pot)
      .values({
        gameId,
        value,
        highestBet,
      })
      .returning()
  )[0];
}

async function updatePot(id, property, value) {
  await db
    .update(pot)
    .set({ [property]: value })
    .where(eq(pot.id, id));
}

async function getParticipants(potId) {
  return await db
    .select()
    .from(participant)
    .where(eq(participant.potId, potId));
}

async function deleteParticipants(potId) {
  await db.delete(participant).where(eq(participant.potId, potId));
}

module.exports = {
  getPot,
  createPot,
  updatePot,
  deleteParticipants,
  getParticipants,
};
