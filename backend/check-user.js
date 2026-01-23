const { Client } = require('pg');

async function checkUser() {
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

    // Vérifier l'utilisateur existant
    const result = await client.query(`
      SELECT id, email, "firstName", "lastName", role, "isActive", "createdAt"
      FROM users 
      ORDER BY "createdAt" DESC;
    `);

    console.log('\n👥 Utilisateurs dans la base:');
    result.rows.forEach(user => {
      console.log(`🆔 ID: ${user.id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Nom: ${user.firstName} ${user.lastName}`);
      console.log(`🔑 Rôle: ${user.role}`);
      console.log(`✅ Actif: ${user.isActive}`);
      console.log(`📅 Créé: ${user.createdAt}`);
      console.log('---');
    });

    // Vérifier spécifiquement admin@test.com
    const adminCheck = await client.query(`
      SELECT id, email, "firstName", "lastName", role, "isActive"
      FROM users 
      WHERE email = 'admin@test.com';
    `);

    if (adminCheck.rows.length > 0) {
      console.log('✅ L\'utilisateur admin@test.com existe');
      const admin = adminCheck.rows[0];
      console.log(`🆔 ID: ${admin.id}`);
      console.log(`🔑 Rôle: ${admin.role}`);
      console.log(`✅ Actif: ${admin.isActive}`);
    } else {
      console.log('❌ L\'utilisateur admin@test.com n\'existe pas');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkUser();