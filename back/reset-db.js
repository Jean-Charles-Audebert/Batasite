const { query, pool } = require('./src/config/db');
require('dotenv').config();

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Supprimer les tables
    await query(`DROP TABLE IF EXISTS content CASCADE`);
    console.log('✓ Dropped content table');
    
    await query(`DROP TABLE IF EXISTS admins CASCADE`);
    console.log('✓ Dropped admins table');
    
    console.log('\n✓ Database reset complete');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
