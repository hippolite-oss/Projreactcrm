const { Client } = require('pg');

async function checkTables() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin123',
    database: 'crm',
  });

  try {
    await client.connect();
    console.log('✅ Connexion à la base de données réussie');

    // Vérifier les tables existantes
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Tables existantes:');
    if (result.rows.length === 0) {
      console.log('❌ Aucune table trouvée');
    } else {
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // Vérifier spécifiquement la table users
    const usersCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users';
    `);

    if (usersCheck.rows[0].count === '0') {
      console.log('\n❌ La table "users" n\'existe pas');
      console.log('🔧 Le backend doit créer les tables automatiquement au démarrage');
    } else {
      console.log('\n✅ La table "users" existe');
      
      // Compter les utilisateurs
      const userCount = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Nombre d'utilisateurs: ${userCount.rows[0].count}`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();