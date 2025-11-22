// migrate.js (placed at C:\Users\jadav\quick-order\migrate.js)
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log("Running migration...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      input_text TEXT,
      parsed JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("Migration completed!");
  await pool.end();
}

migrate().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});


