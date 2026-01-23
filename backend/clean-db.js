const { Client } = require('pg');

async function cleanDatabase() {
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
    
    // Supprimer tous les index personnalisés d'abord
    try {
      const indexResult = await client.query(`
        SELECT indexname FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname LIKE 'IDX_%'
      `);
      
      for (const row of indexResult.rows) {
        try {
          await client.query(`DROP INDEX IF EXISTS "${row.indexname}" CASCADE`);
          console.log(`✅ Index ${row.indexname} supprimé`);
        } catch (error) {
          console.log(`⚠️  Erreur suppression index ${row.indexname}: ${error.message}`);
        }
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de la suppression des index:', error.message);
    }
    
    // Supprimer les tables dans l'ordre correct (en tenant compte des contraintes de clés étrangères)
    const tables = [
      'quote_items',
      'invoice_items',
      'quotes',
      'invoices',
      'contacts',
      'products',
      'clients',
      'commandes_online',  // Ajouter la table des commandes
      'users'
    ];
    
    for (const table of tables) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        console.log(`✅ Table ${table} supprimée`);
      } catch (error) {
        console.log(`⚠️  Table ${table} n'existe pas ou erreur: ${error.message}`);
      }
    }
    
    // Supprimer les types enum
    const enumTypes = [
      'users_role_enum',
      'quotes_status_enum',
      'invoices_status_enum',
      'products_unit_enum',
      'commandes_online_statut_enum'  // Ajouter l'enum des commandes
    ];
    
    for (const enumType of enumTypes) {
      try {
        await client.query(`DROP TYPE IF EXISTS "${enumType}" CASCADE`);
        console.log(`✅ Type enum ${enumType} supprimé`);
      } catch (error) {
        console.log(`⚠️  Type enum ${enumType} n'existe pas ou erreur: ${error.message}`);
      }
    }
    
    console.log('🎉 Nettoyage complet de la base de données terminé');
    console.log('📝 Vous pouvez maintenant redémarrer le backend');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  } finally {
    await client.end();
  }
}

cleanDatabase();