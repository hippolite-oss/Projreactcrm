// Script de test pour vérifier l'authentification et la récupération des commandes
import api from '../services/api';

export const testAuthentification = {
  
  // Vérifier si l'utilisateur est connecté
  async verifierConnexion() {
    console.log('🔐 === VÉRIFICATION CONNEXION ===');
    
    const token = localStorage.getItem('token');
    console.log('🎫 Token présent:', !!token);
    
    if (token) {
      console.log('🎫 Token (premiers caractères):', token.substring(0, 20) + '...');
    }
    
    return !!token;
  },

  // Tester la connexion admin
  async testerConnexionAdmin() {
    console.log('🔐 === TEST CONNEXION ADMIN ===');
    
    try {
      const response = await api.post('/api/auth/login', {
        email: 'admin@test.com',
        password: 'admin123'
      });
      
      console.log('✅ Connexion admin réussie:', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        console.log('🎫 Token sauvegardé');
        return { success: true, token: response.data.access_token };
      }
      
    } catch (error) {
      console.error('❌ Erreur connexion admin:', error);
      return { success: false, error: error.message };
    }
  },

  // Créer une commande test (sans authentification)
  async creerCommandeTest() {
    console.log('📤 === CRÉATION COMMANDE TEST (SANS AUTH) ===');
    
    const commandeTest = {
      nom: 'Client Test ' + Date.now(),
      telephone: '229 98 76 54 32',
      email: 'client.test@example.com',
      adresse: 'Adresse test client',
      ville: 'Cotonou',
      commande: 'Commande test créée depuis la page Home - ' + new Date().toLocaleString(),
      notes: 'Test de synchronisation client → admin'
    };

    try {
      // Temporairement supprimer le token pour simuler un client non connecté
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
      
      const response = await api.post('/api/commande-online', commandeTest);
      console.log('✅ Commande créée (client):', response.data);
      
      // Remettre le token
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return { success: true, commande: response.data };
      
    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les commandes (avec authentification admin)
  async recupererCommandesAdmin() {
    console.log('📥 === RÉCUPÉRATION COMMANDES ADMIN (AVEC AUTH) ===');
    
    try {
      const response = await api.get('/api/commande-online');
      console.log('✅ Commandes récupérées (admin):', response.data);
      console.log('📊 Nombre de commandes:', response.data.data?.length || 0);
      
      if (response.data.data && response.data.data.length > 0) {
        console.log('📋 Dernières commandes:');
        response.data.data.slice(0, 3).forEach((cmd, index) => {
          console.log(`  ${index + 1}. ${cmd.nom} - ${cmd.telephone} - ${cmd.statut} - ${new Date(cmd.createdAt).toLocaleString()}`);
        });
      }
      
      return { success: true, commandes: response.data };
      
    } catch (error) {
      console.error('❌ Erreur récupération commandes:', error);
      return { success: false, error: error.message };
    }
  },

  // Test complet du flux client → admin
  async testFluxComplet() {
    console.log('🔄 === TEST FLUX COMPLET CLIENT → ADMIN ===');
    
    try {
      // 1. Vérifier/établir la connexion admin
      console.log('1️⃣ Connexion admin...');
      const connexion = await this.testerConnexionAdmin();
      if (!connexion.success) {
        throw new Error('Impossible de se connecter en tant qu\'admin');
      }

      // 2. Compter les commandes avant
      console.log('2️⃣ Comptage commandes avant...');
      const commandesAvant = await this.recupererCommandesAdmin();
      const nombreAvant = commandesAvant.success ? commandesAvant.commandes.data?.length || 0 : 0;
      console.log('📊 Commandes avant:', nombreAvant);

      // 3. Créer une commande côté client
      console.log('3️⃣ Création commande client...');
      const nouvelleCommande = await this.creerCommandeTest();
      if (!nouvelleCommande.success) {
        throw new Error('Impossible de créer la commande');
      }

      // 4. Attendre un peu
      console.log('4️⃣ Attente 2 secondes...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 5. Compter les commandes après
      console.log('5️⃣ Comptage commandes après...');
      const commandesApres = await this.recupererCommandesAdmin();
      const nombreApres = commandesApres.success ? commandesApres.commandes.data?.length || 0 : 0;
      console.log('📊 Commandes après:', nombreApres);

      // 6. Vérifier l'augmentation
      const augmentation = nombreApres - nombreAvant;
      console.log('📈 Augmentation:', augmentation);

      if (augmentation >= 1) {
        console.log('✅ === FLUX COMPLET RÉUSSI ===');
        console.log('🎉 Les commandes créées côté client sont visibles côté admin !');
        return { 
          success: true, 
          nombreAvant, 
          nombreApres, 
          augmentation,
          nouvelleCommande: nouvelleCommande.commande
        };
      } else {
        console.log('❌ === FLUX PARTIELLEMENT ÉCHOUÉ ===');
        console.log('⚠️ La commande a été créée mais n\'est pas visible côté admin');
        return { 
          success: false, 
          nombreAvant, 
          nombreApres, 
          augmentation,
          message: 'Problème de synchronisation client → admin'
        };
      }

    } catch (error) {
      console.error('❌ === FLUX COMPLET ÉCHOUÉ ===', error);
      return { success: false, error: error.message };
    }
  },

  // Instructions pour l'utilisateur
  afficherInstructions() {
    console.log(`
🎯 === INSTRUCTIONS DE TEST AUTHENTIFICATION ===

Pour tester le flux client → admin :

1. Ouvrez la console (F12)
2. Exécutez : testAuthentification.testFluxComplet()
3. Observez les logs pour identifier le problème

Tests individuels disponibles :
- testAuthentification.verifierConnexion()
- testAuthentification.testerConnexionAdmin()
- testAuthentification.creerCommandeTest()
- testAuthentification.recupererCommandesAdmin()

Le test complet vérifie :
✅ Connexion admin possible
✅ Création commande côté client (sans auth)
✅ Récupération commandes côté admin (avec auth)
✅ Synchronisation entre les deux
    `);
  }
};

// Rendre disponible dans la console
if (typeof window !== 'undefined') {
  window.testAuthentification = testAuthentification;
  
  // Afficher les instructions au chargement
  setTimeout(() => {
    testAuthentification.afficherInstructions();
  }, 1000);
}

export default testAuthentification;