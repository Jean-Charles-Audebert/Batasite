/**
 * Tests d'intégration pour la base de données
 * ATTENTION: Requiert une instance PostgreSQL active
 * Ces tests sont skippés s'il n'y a pas de connexion DB
 * Pour lancer ces tests : npm run test:integration
 */
const { query, initDb, testConnection, closePool } = require('../config/db');

describe.skip('Database Tests (Intégration)', () => {
  afterAll(async () => {
    await closePool();
  });

  test('should connect to database', async () => {
    const connected = await testConnection();
    expect(connected).toBe(true);
  });

  test('should initialize database tables', async () => {
    await initDb();
    
    // Vérifie que les tables existent
    const tablesResult = await query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_name IN ('admins', 'content')`
    );

    expect(tablesResult.rows.length).toBe(2);
  });

  test('should have proper admins table structure', async () => {
    const columnsResult = await query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'admins'`
    );

    const columnNames = columnsResult.rows.map(r => r.column_name);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('email');
    expect(columnNames).toContain('username');
    expect(columnNames).toContain('password_hash');
    expect(columnNames).toContain('is_active');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('updated_at');
  });

  test('should have proper content table structure', async () => {
    const columnsResult = await query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'content'`
    );

    const columnNames = columnsResult.rows.map(r => r.column_name);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('data');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('updated_at');
    expect(columnNames).toContain('updated_by');
  });
});
