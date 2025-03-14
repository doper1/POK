require('dotenv').config();
const { Pool } = require('pg');

let poolRW = null;
let poolRO = null;

// Helper to create a pool and test connectivity
async function getPool(host, desc) {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: host,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });
  try {
    await pool.query('SELECT 1');
    console.log(`${desc} connected successfully (${host})`);
    return pool;
  } catch (err) {
    console.error(`${desc} connection failed (${host}): ${err.message}`);
    return null;
  }
}

// Initialize connections using three fallback options:
// Option 1: Try separate endpoints for RW and RO.
// Option 2: If Option 1 fails, try using `${POSTGRES_HOST}-rw` for both.
// Option 3: Finally, fallback to the base host for both.
async function initConnections() {
  const base = process.env.POSTGRES_HOST;

  // Option 1
  poolRW = await getPool(`${base}-rw`, 'Option 1 RW');
  poolRO = await getPool(`${base}-ro`, 'Option 1 RO');
  if (poolRW) {
    if (!poolRO) {
      console.log('Option 1 fallback: RO unavailable, using RW for both.');
      poolRO = poolRW;
    }
    return;
  }

  // Option 2
  poolRW = await getPool(`${base}-rw`, 'Option 2 RW');
  if (poolRW) {
    console.log('Option 2: Using RW for both RW and RO.');
    poolRO = poolRW;
    return;
  }

  // Option 3
  poolRW = await getPool(base, 'Option 3 RW');
  if (poolRW) {
    console.log('Option 3: Using base host for both RW and RO.');
    poolRO = poolRW;
    return;
  }

  console.error('No valid database connection found. Exiting.');
  process.exit(1);
}

// Export a promise that resolves when the DB is initialized.
const dbInitialization = initConnections();

module.exports = {
  dbInitialization,
  dbRW: {
    query: (text, params) => {
      if (!poolRW) throw new Error('Database connection is not available');
      return poolRW.query(text, params);
    },
  },
  dbRO: {
    query: (text, params) => {
      if (!poolRO) throw new Error('Database connection is not available');
      return poolRO.query(text, params);
    },
  },
  get poolRW() {
    return poolRW;
  },
  get poolRO() {
    return poolRO;
  },
};
