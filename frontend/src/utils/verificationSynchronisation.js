// Script de vérification de la synchronisation des commandes
// Ce script peut être exécuté dans la console du navigateur pour tester

export const verificationSynchronisation = {
  
  // Vérifier que les hooks et contextes sont bien connectés
  async verifierConnexions() {
    console.log('🔍 === VÉRIFICATION DES CONNEXIONS ===');
    
    // Vérifier que l'API est accessible
    try {
      const response = await fetch('http://localhost:3001/api/commande-online/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const stats = await response.json();
        console.log('✅ API accessible - Stats:', stats);
        return { apiAccessible: true, stats };
      } else {
        console.log('❌ API non accessible - Status:', response.status);
        return { apiAccessible: false, status: response.status };
      }
    } catch (error) {
      console.error('❌ Erreur connexion API:', error);
      return { apiAccessible: false, error: error.message };
    }
  },

  // Vérifier le flux complet
  async verifierFluxComplet() {
    console.log('🔄 === VÉRIFICATION FLUX COMPLET ===');
    
    try {
      // 1. Vérifier les connexions
      const connexions = await this.verifierConnexions();
      if (!connexions.apiAccessible) {
        throw new Error('API non accessible');
      }

      // 2. Compter les commandes actuelles
      const statsAvant = connexions.stats;
      console.log('📊 Commandes avant test:', statsAvant);

      // 3. Créer une commande de test
      const commandeTest = {
        nom: 'Test Synchronisation ' + new Date().getTime(),
        telephone: '229 99 88 77 66',
        email: 'test.sync@example.com',
        adresse: 'Adresse de test synchronisation',
        ville: 'Cotonou Test',
        commande: 'Test de synchronisation automatique - ' + new Date().toLocaleString(),
        notes: 'Commande créée pour tester la synchronisation'
      };

      console.log('📤 Création commande test...');
      const responseCreation = await fetch('http://localhost:3001/api/commande-online', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commandeTest)
      });

      if (!responseCreation.ok) {
        throw new Error('Erreur création commande');
      }

      const commandeCreee = await responseCreation.json();
      console.log('✅ Commande créée:', commandeCreee);

      // 4. Attendre un peu
      console.log('⏳ Attente 3 secondes...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 5. Vérifier les nouvelles stats
      const nouvellesStats = await this.verifierConnexions();
      console.log('📊 Nouvelles stats:', nouvellesStats.stats);

      // 6. Comparer
      const augmentation = nouvellesStats.stats.total - statsAvant.total;
      console.log('📈 Augmentation détectée:', augmentation);

      if (augmentation >= 1) {
        console.log('✅ === SYNCHRONISATION RÉUSSIE ===');
        return { 
          success: true, 
          augmentation,
          commandeCreee: commandeCreee.data || commandeCreee
        };
      } else {
        console.log('⚠️ === SYNCHRONISATION PARTIELLE ===');
        return { 
          success: false, 
          augmentation,
          message: 'La commande a été créée mais les stats ne reflètent pas l\'augmentation'
        };
      }

    } catch (error) {
      console.error('❌ === ERREUR FLUX COMPLET ===', error);
      return { success: false, error: error.message };
    }
  },

  // Instructions pour l'utilisateur
  afficherInstructions() {
    console.log(`
🎯 === INSTRUCTIONS DE TEST ===

Pour tester la synchronisation, suivez ces étapes :

1. Ouvrez la console du navigateur (F12)
2. Exécutez : verificationSynchronisation.verifierFluxComplet()
3. Observez les logs pour voir si la synchronisation fonctionne

Ou testez manuellement :
1. Allez sur la page "Nouvelle commande"
2. Remplissez et envoyez une commande
3. Allez sur "Mes commandes"
4. Vérifiez que la nouvelle commande apparaît dans la liste
5. Vérifiez que le badge de notification dans le Topbar se met à jour

Si tout fonctionne :
✅ La commande apparaît immédiatement dans "Mes commandes"
✅ Le badge de notification se met à jour
✅ Cliquer sur la notification redirige vers "Mes commandes"
    `);
  }
};

// Rendre disponible dans la console
if (typeof window !== 'undefined') {
  window.verificationSynchronisation = verificationSynchronisation;
  
  // Afficher les instructions au chargement
  setTimeout(() => {
    verificationSynchronisation.afficherInstructions();
  }, 1000);
}

export default verificationSynchronisation;