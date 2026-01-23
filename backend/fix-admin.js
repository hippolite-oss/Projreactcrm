const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function fixAdmin() {
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

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Mettre à jour l'utilisateur existant
    const result = await client.query(`
      UPDATE users 
      SET 
        password = $1,
        "firstName" = $2,
        "lastName" = $3,
        role = $4,
        "isActive" = $5,
        "updatedAt" = NOW()
      WHERE email = $6
      RETURNING id, email, "firstName", "lastName", role, "isActive";
    `, [
      hashedPassword,
      'Admin',
      'System',
      'admin',
      true,
      'admin@test.com'
    ]);

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('✅ Utilisateur admin mis à jour avec succès:');
      console.log(`🆔 ID: ${admin.id}`);
      console.log(`📧 Email: ${admin.email}`);
      console.log(`👤 Nom: ${admin.firstName} ${admin.lastName}`);
      console.log(`🔑 Rôle: ${admin.role}`);
      console.log(`✅ Actif: ${admin.isActive}`);
      
      console.log('\n🎯 Identifiants de connexion:');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Mot de passe: admin123');
      console.log('🚀 Vous pouvez maintenant vous connecter !');
    } else {
      console.log('❌ Aucun utilisateur trouvé avec l\'email admin@test.com');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

fixAdmin();