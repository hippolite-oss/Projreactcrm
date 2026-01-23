/**
 * Script de test pour vérifier l'envoi d'emails aux prospects
 */

import api from '../services/api';

const testEmailProspects = async () => {
  console.log('🧪 Test d\'envoi d\'email aux prospects');
  console.log('=====================================');

  try {
    // 1. Récupérer la liste des prospects
    console.log('📡 1. Récupération des prospects...');
    const prospectsResponse = await api.get('/api/prospects');
    
    if (!prospectsResponse.data.success || prospectsResponse.data.data.length === 0) {
      console.log('⚠️ Aucun prospect trouvé. Créons un prospect de test...');
      
      // Créer un prospect de test
      const testProspect = {
        nom: 'Test Prospect',
        email: 'test@example.com',
        entreprise: 'Test Company',
        telephone: '0123456789',
        message: 'Demande de test pour vérifier l\'envoi d\'emails'
      };
      
      const createResponse = await api.post('/api/prospects', testProspect);
      console.log('✅ Prospect de test créé:', createResponse.data);
      
      if (createResponse.data.success) {
        const prospectId = createResponse.data.data.id;
        console.log(`📧 2. Test d'envoi d'email au prospect ${prospectId}...`);
        
        // Tester l'envoi d'email
        const emailResponse = await api.post(`/api/prospects/${prospectId}/email`, {
          template: 'welcome',
          subject: 'Test - Merci pour votre intérêt',
          message: 'Ceci est un email de test pour vérifier la configuration.'
        });
        
        console.log('📬 Résultat envoi email:', emailResponse.data);
        
        if (emailResponse.data.success) {
          console.log('✅ Email envoyé avec succès !');
          console.log('🎯 Le système d\'email pour prospects fonctionne correctement.');
        } else {
          console.log('❌ Échec envoi email:', emailResponse.data.message);
        }
      }
    } else {
      // Utiliser le premier prospect existant
      const prospect = prospectsResponse.data.data[0];
      console.log(`✅ Prospect trouvé: ${prospect.nom} (${prospect.email})`);
      
      console.log(`📧 2. Test d'envoi d'email au prospect ${prospect.id}...`);
      
      // Tester l'envoi d'email
      const emailResponse = await api.post(`/api/prospects/${prospect.id}/email`, {
        template: 'welcome',
        subject: 'Test - Merci pour votre intérêt',
        message: 'Ceci est un email de test pour vérifier la configuration.'
      });
      
      console.log('📬 Résultat envoi email:', emailResponse.data);
      
      if (emailResponse.data.success) {
        console.log('✅ Email envoyé avec succès !');
        console.log('🎯 Le système d\'email pour prospects fonctionne correctement.');
      } else {
        console.log('❌ Échec envoi email:', emailResponse.data.message);
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    
    if (error.response) {
      console.error('📡 Réponse serveur:', error.response.data);
      console.error('📡 Status:', error.response.status);
    }
  }
};

// Instructions d'utilisation
console.log(`
📋 Instructions pour tester les emails prospects:

1. Ouvrez la console du navigateur (F12)
2. Collez ce code:

   import('./utils/testEmailProspects.js').then(module => module.default());

3. Vérifiez les logs pour voir si l'email est envoyé

Note: Assurez-vous que:
- Le backend est démarré (port 3001)
- Vous êtes connecté en tant qu'admin
- La configuration SMTP est correcte dans le backend/.env
`);

export default testEmailProspects;