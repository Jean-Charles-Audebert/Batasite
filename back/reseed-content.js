/**
 * Script pour réinitialiser et réinsérer le contenu depuis data.json
 * Utile quand data.json a été modifié mais la DB ne reflète pas les changements
 */
const { query, pool, seedContent } = require('./src/config/db');
require('dotenv').config();

async function reseedContent() {
  try {
    console.log('🔄 Reseeding content from data.json...\n');

    // Supprimer le contenu existant
    await query('DELETE FROM content');
    console.log('✓ Cleared existing content');

    // Reseed le contenu depuis data.json
    await seedContent();
    console.log('✓ Content reseeded successfully');

    // Vérifier le résultat
    const result = await query('SELECT content FROM content LIMIT 1');
    if (result.rows[0]) {
      const content = result.rows[0].content;
      console.log('\n📊 Content statistics:');
      console.log(`   • Sections: ${content.sections ? content.sections.length : 0}`);
      
      const events = content.sections?.find(s => s.type === 'events')?.events || [];
      const images = content.sections?.find(s => s.type === 'gallery')?.images || [];
      const videos = content.sections?.find(s => s.type === 'gallery')?.videos || [];
      
      console.log(`   • Events: ${events.length}`);
      console.log(`   • Gallery Images: ${images.length}`);
      console.log(`   • Gallery Videos: ${videos.length}`);
    }

    await pool.end();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

reseedContent();
