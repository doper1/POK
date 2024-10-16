const { db } = require('../../db/db.ts');
const { participant } = require('../../db/schema.ts');
const { eq, and } = require('drizzle-orm');

async function createParticipant(potId, userId) {
  return (
    await db.insert(participant).values({ potId, userId }).returning()
  )[0];
}

async function getParticipant(potId, userId) {
  return (
    await db
      .select()
      .from(participant)
      .where(and(eq(participant.userId, userId), eq(participant.potId, potId)))
      .limit(1)
  )[0];
}

module.exports = {
  getParticipant,
  createParticipant,
};
