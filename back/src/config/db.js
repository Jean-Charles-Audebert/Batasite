const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  user: process.env.POSTGRES_USER || 'batadmin',
  password: process.env.POSTGRES_PASSWORD || 'batpassword',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.POSTGRES_DB || 'batasite',
};

console.log('Database config:', {
  user: poolConfig.user,
  host: poolConfig.host,
  port: poolConfig.port,
  database: poolConfig.database,
});

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute une requête PostgreSQL
 * @param {string} query - Requête SQL
 * @param {array} values - Paramètres
 * @returns {Promise} Résultat de la requête
 */
const query = async (queryText, values) => {
  const start = Date.now();
  try {
    const res = await pool.query(queryText, values);
    const duration = Date.now() - start;
    console.log('Query executed:', { queryText, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

/**
 * Initialise la base de données (création des tables)
 */
const initDb = async () => {
  try {
    console.log('Initializing database...');

    // Table des admins
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin' CHECK(role IN ('admin', 'superadmin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table du contenu global (une seule ligne)
    await query(`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        content JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER REFERENCES admins(id) ON DELETE SET NULL
      )
    `);

    // Index sur updated_at pour les requêtes de récupération
    await query(`
      CREATE INDEX IF NOT EXISTS idx_content_updated_at ON content(updated_at DESC)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Teste la connexion à la base de données
 */
const testConnection = async () => {
  try {
    const res = await query('SELECT NOW()');
    console.log('✓ Database connection successful:', res.rows[0]);
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Ferme la connexion à la base de données
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  query,
  pool,
  initDb,
  testConnection,
  closePool,
};
