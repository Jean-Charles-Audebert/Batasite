const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
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
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin' CHECK(role IN ('admin', 'superadmin')),
        is_active BOOLEAN DEFAULT true,
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ajouter les colonnes manquantes si elles n'existent pas
    try {
      await query(`
        ALTER TABLE admins
        ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
        ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP
      `);
    } catch (error) {
      // Les colonnes existent peut-être déjà ou il y a une autre erreur
      if (!error.message.includes('already exists')) {
        console.warn('Note: Could not add reset token columns:', error.message);
      }
    }

    // Si password_hash existe mais est NOT NULL, le rendre nullable
    try {
      await query(`
        ALTER TABLE admins
        ALTER COLUMN password_hash DROP NOT NULL
      `);
    } catch (error) {
      // La colonne est peut-être déjà nullable
      if (!error.message.includes('already')) {
        console.warn('Note: Could not alter password_hash constraint:', error.message);
      }
    }

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
 * Seed des admins par défaut (si table vide)
 */
const seedAdmins = async () => {
  try {
    const { hash } = require('argon2');

    // Vérifier si des admins existent déjà
    const res = await query('SELECT COUNT(*) as count FROM admins');
    if (res.rows[0].count > 0) {
      console.log(`✓ Admins already seeded (${res.rows[0].count} found)`);
      return;
    }

    console.log('Seeding default admins...');

    // Admin par défaut
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@batasite.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const adminHash = await hash(adminPassword, { type: 2 });
    
    await query(
      `INSERT INTO admins (email, password_hash, role, is_active) 
       VALUES ($1, $2, $3, $4)`,
      [adminEmail, adminHash, 'admin', true]
    );

    // Superadmin par défaut
    const superadminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@batasite.local';
    const superadminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdminPassword123!';
    const superadminHash = await hash(superadminPassword, { type: 2 });
    
    await query(
      `INSERT INTO admins (email, password_hash, role, is_active) 
       VALUES ($1, $2, $3, $4)`,
      [superadminEmail, superadminHash, 'superadmin', true]
    );

    console.log('✓ Default admins seeded successfully');
    console.log(`  • Admin: ${adminEmail}`);
    console.log(`  • Superadmin: ${superadminEmail}`);
  } catch (error) {
    // Ignorer si les admins existent déjà
    if (error.message.includes('duplicate key')) {
      console.log('✓ Admins already exist, skipping seed');
      return;
    }
    console.error('Error seeding admins:', error);
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
  seedAdmins,
  testConnection,
  closePool,
};
