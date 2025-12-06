import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Read init SQL
    const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(initSQL);
    console.log('✓ Database schema created');
    
    // Read seed data
    const seedData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8')
    );
    
    // Clear existing data
    await client.query('TRUNCATE TABLE content, clients RESTART IDENTITY CASCADE');
    console.log('✓ Existing data cleared');
    
    // Insert clients
    const clientMap = {};
    for (const clientData of seedData.clients) {
      const result = await client.query(
        'INSERT INTO clients (name, slug, description, logo_url, active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [clientData.name, clientData.slug, clientData.description, clientData.logo_url, clientData.active]
      );
      clientMap[clientData.slug] = result.rows[0].id;
      console.log(`✓ Client created: ${clientData.name}`);
    }
    
    // Insert content
    for (const contentData of seedData.content) {
      const clientId = clientMap[contentData.client_slug];
      if (clientId) {
        await client.query(
          'INSERT INTO content (client_id, title, content_type, body, media_url, published) VALUES ($1, $2, $3, $4, $5, $6)',
          [clientId, contentData.title, contentData.content_type, contentData.body, contentData.media_url, contentData.published]
        );
        console.log(`✓ Content created: ${contentData.title}`);
      }
    }
    
    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
