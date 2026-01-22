const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin123',
    database: 'postgres', // Connexion à la DB par défaut d'abord
  });

  try {
    await client.connect();
    console.log('✅ Connexion PostgreSQL réussie');
    
    // Vérifier si la base de données CRM existe
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'crm'");
    
    if (result.rows.length === 0) {
      console.log('❌ Base de données "crm" n\'existe pas');
      console.log('Création de la base de données...');
      await client.query('CREATE DATABASE crm');
      console.log('✅ Base de données "crm" créée');
    } else {
      console.log('✅ Base de données "crm" existe');
    }
    
    await client.end();
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    console.log('\n📋 Vérifications à faire:');
    console.log('1. PostgreSQL est-il installé et démarré ?');
    console.log('2. L\'utilisateur "postgres" existe-t-il avec le mot de passe "admin123" ?');
    console.log('3. Le serveur PostgreSQL écoute-t-il sur le port 5432 ?');
  }
}

testConnection();