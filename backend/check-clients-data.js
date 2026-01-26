const { Client } = require('pg');

async function checkClientsData() {
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

    // Vérifier si la table clients existe
    const tableCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'clients';
    `);

    if (tableCheck.rows[0].count === '0') {
      console.log('❌ La table "clients" n\'existe pas');
      console.log('🔧 Vous devez démarrer le backend pour créer les tables automatiquement');
      return;
    }

    console.log('✅ La table "clients" existe');

    // Compter les clients existants
    const clientCount = await client.query('SELECT COUNT(*) as count FROM clients');
    console.log(`👥 Nombre de clients dans la base: ${clientCount.rows[0].count}`);

    // Afficher les clients existants
    const clients = await client.query(`
      SELECT id, name, email, phone, city, "createdAt" 
      FROM clients 
      ORDER BY "createdAt" DESC
    `);

    if (clients.rows.length > 0) {
      console.log('\n📋 Clients existants:');
      clients.rows.forEach((client, index) => {
        console.log(`${index + 1}. ${client.name}`);
        console.log(`   📧 Email: ${client.email || 'Non renseigné'}`);
        console.log(`   📞 Téléphone: ${client.phone || 'Non renseigné'}`);
        console.log(`   🏙️ Ville: ${client.city || 'Non renseignée'}`);
        console.log(`   📅 Créé le: ${new Date(client.createdAt).toLocaleDateString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Aucun client trouvé dans la base de données');
      console.log('💡 Les 4 clients mentionnés dans le dashboard sont probablement des données simulées');
    }

    // Vérifier aussi les prospects (contacts)
    const contactCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'contacts';
    `);

    if (contactCheck.rows[0].count > 0) {
      const contactCount = await client.query('SELECT COUNT(*) as count FROM contacts');
      console.log(`📞 Nombre de contacts/prospects dans la base: ${contactCount.rows[0].count}`);

      const contacts = await client.query(`
        SELECT id, "firstName", "lastName", email, phone, position, "createdAt" 
        FROM contacts 
        ORDER BY "createdAt" DESC 
        LIMIT 5
      `);

      if (contacts.rows.length > 0) {
        console.log('\n📋 Derniers contacts/prospects:');
        contacts.rows.forEach((contact, index) => {
          const fullName = `${contact.firstName} ${contact.lastName}`;
          console.log(`${index + 1}. ${fullName}`);
          console.log(`   📧 Email: ${contact.email || 'Non renseigné'}`);
          console.log(`   📞 Téléphone: ${contact.phone || 'Non renseigné'}`);
          console.log(`   💼 Poste: ${contact.position || 'Non renseigné'}`);
          console.log(`   📅 Créé le: ${new Date(contact.createdAt).toLocaleDateString('fr-FR')}`);
          console.log('');
        });
      }
    }

    // Vérifier les commandes en ligne
    const commandeCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'commandes_online';
    `);

    if (commandeCheck.rows[0].count > 0) {
      const commandeCount = await client.query('SELECT COUNT(*) as count FROM commandes_online');
      console.log(`📦 Nombre de commandes en ligne: ${commandeCount.rows[0].count}`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkClientsData();