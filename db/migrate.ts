require('dotenv').config();
const { db, connection } = require('./db.ts');
const { migrate } = require('drizzle-orm/postgres-js/migrator');

async function runMigration() {
  console.log('Migrating database...');
  await migrate(db, { migrationsFolder: 'db/migrations' });
  await connection.end();
  console.warn('Migration completed successfully');
}

runMigration().catch((error) => {
  console.error('Error during migration:', error);
  process.exit(1);
});

module.exports = { runMigration };
export {};
