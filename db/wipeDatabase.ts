require('dotenv').config();
const { db, connection } = require('./db.ts');
const { sql } = require('drizzle-orm');

async function wipe() {
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
  await connection.end();
}

wipe();
export {};
