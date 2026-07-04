require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

async function migrate() {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.log('Schema is mounted into postgres during first container init. No local schema file found.');
    process.exit(0);
  }
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('Migration completed');
  await pool.end();
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
