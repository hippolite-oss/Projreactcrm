const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createAdmin() {
  // Essayons différentes configurations
  const configs = [
    {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'admin123',
      database: 'crm',
    },
    {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '',
      database: 'crm',
    },
    {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'crm',
    }
  ];

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    console.log(`🔄 Tentative ${i + 1} avec mot de passe: "${config.password}"`);
    
    const client = new Client(config);

    try {
      await client.connect();
      console.log('✅ Connexion réussie !');

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        ['admin@test.com']
      );

      if (existingUser.rows.length > 0) {
        console.log('ℹ️ L\'utilisateur admin existe déjà');
        await client.end();
        return;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Créer l'utilisateur admin
      const result = await client.query(`
        INSERT INTO users (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, email, "firstName", "lastName", role
      `, [
        'admin@test.com',
        hashedPassword,
        'Admin',
        'System',
        'admin',
        true
      ]);

      console.log('✅ Utilisateur admin créé avec succès:');
      console.log('📧 Email:', result.rows[0].email);
      console.log('👤 Nom:', result.rows[0].firstName, result.rows[0].lastName);
      console.log('🔑 Rôle:', result.rows[0].role);
      console.log('🆔 ID:', result.rows[0].id);
      
      console.log('\n🎯 Identifiants de connexion:');
      console.log('Email: admin@test.com');
      console.log('Mot de passe: admin123');

      await client.end();
      return;

    } catch (error) {
      console.error(`❌ Échec tentative ${i + 1}:`, error.message);
      try {
        await client.end();
      } catch (e) {
        // Ignore
      }
    }
  }
  
  console.log('❌ Toutes les tentatives de connexion ont échoué');
}

createAdmin();