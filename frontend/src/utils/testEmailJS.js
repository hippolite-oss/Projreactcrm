/**
 * Script de test pour vérifier la configuration EmailJS
 * À exécuter dans la console du navigateur après configuration
 */

import emailService from '../services/emailService.js';

// Données de test
const commandeTest = {
  nom: 'Test Client',
  telephone: '0123456789',
  email: 'test@example.com', // Remplacez par votre vraie adresse email
  ville: 'Paris',
  adresse: '123 Rue de Test',
  commande: 'Commande de test pour vérifier EmailJS',
  notes: 'Ceci est un test',
  createdAt: new Date().toISOString()
};

// Fonction de test
export const testerEmailJS = async () => {
  console.log('🧪 Test EmailJS en cours...');
  
  try {
    const result = await emailService.envoyerConfirmationReception(commandeTest);
    
    if (result.success) {
      console.log('✅ Test EmailJS réussi !');
      console.log('📧 Email envoyé avec succès');
      console.log('📋 Résultat:', result);
      alert('✅ Test EmailJS réussi ! Vérifiez votre boîte email.');
    } else {
      console.error('❌ Test EmailJS échoué');
      console.error('📋 Erreur:', result.message);
      alert(`❌ Test échoué: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    alert(`❌ Erreur: ${error.message}`);
  }
};

// Fonction de test de configuration
export const testerConfiguration = async () => {
  console.log('🔧 Test de configuration EmailJS...');
  
  try {
    const result = await emailService.testerConfiguration();
    
    if (result.success) {
      console.log('✅ Configuration EmailJS OK !');
      alert('✅ Configuration EmailJS fonctionnelle !');
    } else {
      console.log('❌ Problème de configuration');
      console.error('📋 Erreur:', result.message);
      alert(`❌ Configuration incorrecte: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Erreur configuration:', error);
    alert(`❌ Erreur configuration: ${error.message}`);
  }
};

// Instructions d'utilisation
console.log(`
📧 Tests EmailJS disponibles :

1. Test de configuration :
   testerConfiguration()

2. Test d'envoi d'email :
   testerEmailJS()

Utilisez ces fonctions dans la console après avoir configuré vos clés EmailJS.
`);

export default {
  testerEmailJS,
  testerConfiguration
};