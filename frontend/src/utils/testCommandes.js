// Script de test pour vérifier la synchronisation des commandes
import api from '../services/api';

export const testCommandes = {
  // Créer une commande de test
  async creerCommandeTest() {
    const commandeTest = {
      nom: 'Test User ' + Date.now(),
      telephone: '229 12 34 56 78',
      email: 'test@example.com',
      adresse: '123 Rue de Test',
      ville: 'Cotonou',
      commande: 'Commande de test créée le ' + new Date().toLocaleString(),
      notes: 'Ceci est une commande de test pour vérifier la synchronisation'
    };

    try {
      console.log('🧪 Test - Création de commande:', commandeTest);
      const response = await api.post('/api/commande-online', commandeTest);
      console.log('✅ Test - Commande créée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Test - Erreur création:', error);
      throw error;
    }
  },

  // Récupérer toutes les commandes (comme le fait Mes commandes)
  async recupererCommandes() {
    try {
      console.log('🧪 Test - Récupération des commandes (comme Mes commandes)');
      const response = await api.get('/api/commande-online');
      console.log('✅ Test - Commandes récupérées:', response.data);
      console.log('📊 Nombre total de commandes:', response.data.data?.length || 0);
      
      // Afficher les 3 dernières commandes
      if (response.data.data && response.data.data.length > 0) {
        console.log('📋 Dernières commandes:');
        response.data.data.slice(0, 3).forEach((cmd, index) => {
          console.log(`  ${index + 1}. ${cmd.nom} - ${cmd.telephone} - ${cmd.statut}`);
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Test - Erreur récupération:', error);
      throw error;
    }
  },

  // Test complet : Créer puis vérifier l'affichage
  async testCreationEtAffichage() {
    console.log('🧪 === TEST CRÉATION → AFFICHAGE ===');
    
    try {
      // 1. Compter les commandes avant
      const commandesAvant = await this.recupererCommandes();
      const nombreAvant = commandesAvant.data?.length || 0;
      console.log('📊 Nombre de commandes AVANT:', nombreAvant);

      // 2. Créer une nouvelle commande
      console.log('📤 Création d\'une nouvelle commande...');
      const nouvelleCommande = await this.creerCommandeTest();

      // 3. Attendre un peu pour la synchronisation
      console.log('⏳ Attente de 2 secondes...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Compter les commandes après
      const commandesApres = await this.recupererCommandes();
      const nombreApres = commandesApres.data?.length || 0;
      console.log('📊 Nombre de commandes APRÈS:', nombreApres);

      // 5. Vérifier l'augmentation
      const augmentation = nombreApres - nombreAvant;
      console.log('📈 Augmentation:', augmentation);

      if (augmentation === 1) {
        console.log('✅ === TEST RÉUSSI : La commande apparaît bien dans la liste ===');
        return { success: true, nouvelleCommande, augmentation };
      } else {
        console.log('❌ === TEST ÉCHOUÉ : La commande n\'apparaît pas dans la liste ===');
        return { success: false, augmentation };
      }

    } catch (error) {
      console.error('❌ === TEST ÉCHOUÉ ===', error);
      return { success: false, error: error.message };
    }
  },

  // Test de synchronisation en temps réel
  async testSynchronisationTempsReel() {
    console.log('🧪 === TEST SYNCHRONISATION TEMPS RÉEL ===');
    
    try {
      // 1. Créer une commande
      console.log('📤 Création d\'une commande...');
      const nouvelleCommande = await this.creerCommandeTest();
      
      // 2. Vérifier immédiatement si elle apparaît
      console.log('🔍 Vérification immédiate...');
      const commandesImmediat = await this.recupererCommandes();
      const commandeTrouvee = commandesImmediat.data?.find(cmd => cmd.id === nouvelleCommande.data?.id);
      
      if (commandeTrouvee) {
        console.log('✅ === SYNCHRONISATION IMMÉDIATE RÉUSSIE ===');
        console.log('📋 Commande trouvée:', commandeTrouvee.nom, '-', commandeTrouvee.statut);
        return { success: true, synchronisationImmediate: true };
      } else {
        console.log('⚠️ === SYNCHRONISATION DIFFÉRÉE ===');
        return { success: true, synchronisationImmediate: false };
      }
      
    } catch (error) {
      console.error('❌ === TEST SYNCHRONISATION ÉCHOUÉ ===', error);
      return { success: false, error: error.message };
    }
  }
};

// Fonction utilitaire pour tester depuis la console
if (typeof window !== 'undefined') {
  window.testCommandes = testCommandes;
}