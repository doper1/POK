require('dotenv').config();
const { db, connection } = require('./db.ts');
const { sql } = require('drizzle-orm');

async function wipe() {
  try {
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`DROP SCHEMA drizzle CASCADE`);
  } catch (error) {}
  try {
    await db.execute(sql`CREATE SCHEMA public`);
  } catch (error) {}
  await connection.end();
}

wipe();
export {};
