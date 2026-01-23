/**
 * Script de test pour l'interface administrateur des commandes
 * Vérifie les fonctionnalités de traitement et d'annulation
 */

import api from '../services/api';

class TestInterfaceAdmin {
  constructor() {
    this.baseUrl = '/api/commande-online';
  }

  /**
   * Test de récupération des commandes avec filtres
   */
  async testRecuperationCommandes() {
    console.log('🧪 Test: Récupération des commandes...');
    
    try {
      // Test récupération basique
      const response = await api.get(this.baseUrl);
      console.log('✅ Récupération basique:', response.data.data?.length || 0, 'commandes');
      
      // Test avec filtres
      const responseFiltered = await api.get(this.baseUrl, {
        params: { statut: 'nouveau', page: 1, limit: 5 }
      });
      console.log('✅ Avec filtre "nouveau":', responseFiltered.data.data?.length || 0, 'commandes');
      
      // Test recherche
      const responseSearch = await api.get(this.baseUrl, {
        params: { search: 'test', page: 1, limit: 5 }
      });
      console.log('✅ Recherche "test":', responseSearch.data.data?.length || 0, 'commandes');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur récupération:', error.message);
      return false;
    }
  }

  /**
   * Test des statistiques
   */
  async testStatistiques() {
    console.log('🧪 Test: Statistiques...');
    
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      const stats = response.data;
      
      console.log('✅ Statistiques récupérées:');
      console.log('  - Total:', stats.total);
      console.log('  - Nouveau:', stats.nouveau);
      console.log('  - Lu:', stats.lu);
      console.log('  - Traité:', stats.traite);
      console.log('  - Annulé:', stats.annule);
      console.log('  - Emails envoyés:', stats.emails_envoyes);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur statistiques:', error.message);
      return false;
    }
  }

  /**
   * Test de marquage comme lu
   */
  async testMarquageLu(commandeId) {
    console.log(`🧪 Test: Marquage commande ${commandeId} comme lue...`);
    
    try {
      const response = await api.put(`${this.baseUrl}/${commandeId}/mark-as-read`);
      console.log('✅ Commande marquée comme lue:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Erreur marquage:', error.message);
      return false;
    }
  }

  /**
   * Test de traitement d'une commande
   */
  async testTraitementCommande(commandeId, notesAdmin = 'Test de traitement automatique') {
    console.log(`🧪 Test: Traitement commande ${commandeId}...`);
    
    try {
      const response = await api.put(`${this.baseUrl}/${commandeId}/traiter`, {
        notes_admin: notesAdmin,
        envoyer_email: true
      });
      
      console.log('✅ Commande traitée:', response.data);
      console.log('  - Email envoyé:', response.data.emailEnvoye);
      return true;
    } catch (error) {
      console.error('❌ Erreur traitement:', error.message);
      return false;
    }
  }

  /**
   * Test d'annulation d'une commande
   */
  async testAnnulationCommande(commandeId, raison = 'Test d\'annulation automatique') {
    console.log(`🧪 Test: Annulation commande ${commandeId}...`);
    
    try {
      const response = await api.put(`${this.baseUrl}/${commandeId}/annuler`, {
        raison_annulation: raison,
        envoyer_email: true
      });
      
      console.log('✅ Commande annulée:', response.data);
      console.log('  - Email envoyé:', response.data.emailEnvoye);
      return true;
    } catch (error) {
      console.error('❌ Erreur annulation:', error.message);
      return false;
    }
  }

  /**
   * Test de renvoi d'email
   */
  async testRenvoiEmail(commandeId) {
    console.log(`🧪 Test: Renvoi email commande ${commandeId}...`);
    
    try {
      const response = await api.put(`${this.baseUrl}/${commandeId}/renvoyer-email`);
      console.log('✅ Email renvoyé:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Erreur renvoi email:', error.message);
      return false;
    }
  }

  /**
   * Test complet de l'interface admin
   */
  async testComplet() {
    console.log('🚀 Début des tests de l\'interface administrateur...');
    console.log('='.repeat(60));
    
    const resultats = {
      recuperation: await this.testRecuperationCommandes(),
      statistiques: await this.testStatistiques(),
    };
    
    // Récupérer une commande pour les tests d'actions
    try {
      const commandesResponse = await api.get(this.baseUrl, { params: { limit: 1 } });
      const commandes = commandesResponse.data.data;
      
      if (commandes && commandes.length > 0) {
        const commandeTest = commandes[0];
        const commandeId = commandeTest.id || commandeTest._id;
        
        console.log(`📋 Commande de test trouvée: ID ${commandeId}, Statut: ${commandeTest.statut}`);
        
        // Tests selon le statut
        if (commandeTest.statut === 'nouveau') {
          resultats.marquageLu = await this.testMarquageLu(commandeId);
        }
        
        if (commandeTest.statut === 'nouveau' || commandeTest.statut === 'lu') {
          // Note: Ne pas traiter automatiquement en production
          console.log('⚠️ Test de traitement disponible mais non exécuté automatiquement');
        }
        
        if (commandeTest.statut === 'traite' && commandeTest.email) {
          resultats.renvoiEmail = await this.testRenvoiEmail(commandeId);
        }
      } else {
        console.log('ℹ️ Aucune commande disponible pour les tests d\'actions');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des commandes de test:', error.message);
    }
    
    console.log('='.repeat(60));
    console.log('📊 Résultats des tests:');
    Object.entries(resultats).forEach(([test, resultat]) => {
      console.log(`  ${resultat ? '✅' : '❌'} ${test}`);
    });
    
    const testsReussis = Object.values(resultats).filter(Boolean).length;
    const totalTests = Object.keys(resultats).length;
    
    console.log(`\n🎯 Score: ${testsReussis}/${totalTests} tests réussis`);
    
    if (testsReussis === totalTests) {
      console.log('🎉 Tous les tests sont passés ! Interface admin fonctionnelle.');
    } else {
      console.log('⚠️ Certains tests ont échoué. Vérifiez la configuration.');
    }
    
    return resultats;
  }
}

// Export pour utilisation
export default TestInterfaceAdmin;

// Fonction utilitaire pour lancer les tests depuis la console
export const lancerTestsAdmin = async () => {
  const testeur = new TestInterfaceAdmin();
  return await testeur.testComplet();
};

// Instructions d'utilisation
console.log(`
📋 Instructions d'utilisation:

1. Dans la console du navigateur:
   import { lancerTestsAdmin } from './src/utils/testInterfaceAdmin.js';
   lancerTestsAdmin();

2. Ou créer une instance:
   import TestInterfaceAdmin from './src/utils/testInterfaceAdmin.js';
   const testeur = new TestInterfaceAdmin();
   testeur.testComplet();

3. Tests individuels:
   testeur.testRecuperationCommandes();
   testeur.testStatistiques();
   testeur.testMarquageLu(commandeId);
   testeur.testTraitementCommande(commandeId, 'Notes admin');
   testeur.testAnnulationCommande(commandeId, 'Raison annulation');
   testeur.testRenvoiEmail(commandeId);
`);