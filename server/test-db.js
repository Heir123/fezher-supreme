const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_WVXwm3lns6bU@ep-lucky-smoke-b2vrc392-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
  if (err) {
    console.error('❌ Connection error:', err.message);
  } else {
    console.log('✅ Connected successfully!');
  }
  process.exit();
});