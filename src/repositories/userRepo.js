const { db } = require('../db/db.ts');
const { user } = require('../db/schema.ts');
const { eq } = require('drizzle-orm');

async function createUser(id) {
  return (await db.insert(user).values({ id }).returning())[0];
}
async function getUser(id) {
  return (await db.select().from(user).where(eq(user.id, id)).limit(1))[0];
}

async function updateUser(id, property, value) {
  await db
    .update(user)
    .set({ [property]: value })
    .where(eq(user.id, id));
}

module.exports = {
  getUser,
  createUser,
  updateUser,
};
