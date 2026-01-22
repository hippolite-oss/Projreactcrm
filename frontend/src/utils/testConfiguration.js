// Script de test pour vérifier la configuration centralisée des ports
import config from '../config/env.js';

export const testConfiguration = {
  
  // Afficher la configuration actuelle
  afficherConfiguration() {
    console.log('🔧 === CONFIGURATION CENTRALISÉE ===');
    console.log('');
    
    console.log('📊 Configuration Frontend:');
    console.log(`  • Port: ${config.PORT}`);
    console.log(`  • Host: ${config.HOST}`);
    console.log(`  • URL Frontend: ${config.FRONTEND_URL}`);
    console.log(`  • Mode: ${config.MODE}`);
    console.log(`  • Environnement: ${config.NODE_ENV}`);
    console.log('');
    
    console.log('🔗 Configuration API:');
    console.log(`  • URL API: ${config.API_URL}`);
    console.log(`  • URL Backend: ${config.BACKEND_URL}`);
    console.log('');
    
    console.log('🌍 Variables d\'environnement Vite:');
    console.log(`  • VITE_PORT: ${import.meta.env.VITE_PORT || 'non défini'}`);
    console.log(`  • VITE_HOST: ${import.meta.env.VITE_HOST || 'non défini'}`);
    console.log(`  • VITE_API_URL: ${import.meta.env.VITE_API_URL || 'non défini'}`);
    console.log(`  • MODE: ${import.meta.env.MODE}`);
    console.log(`  • DEV: ${import.meta.env.DEV}`);
    console.log(`  • PROD: ${import.meta.env.PROD}`);
    console.log('');
    
    return config;
  },

  // Tester la connexion à l'API avec la nouvelle configuration
  async testerConnexionAPI() {
    console.log('🔌 === TEST CONNEXION API ===');
    console.log(`📡 Tentative de connexion à: ${config.API_URL}`);
    
    try {
      const response = await fetch(`${config.API_URL}/api/commande-online/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'no-token'}`
        }
      });
      
      console.log(`✅ Statut de réponse: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Données reçues:', data);
        return { success: true, data, status: response.status };
      } else {
        console.log(`⚠️ Réponse non-OK: ${response.status} ${response.statusText}`);
        return { success: false, status: response.status, statusText: response.statusText };
      }
      
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Vérifier la cohérence des ports
  verifierCoherencePorts() {
    console.log('🔍 === VÉRIFICATION COHÉRENCE PORTS ===');
    
    const frontendPort = import.meta.env.VITE_PORT || '5173';
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const backendPort = apiUrl.match(/:(\d+)/)?.[1] || '3001';
    
    console.log(`🖥️ Port Frontend configuré: ${frontendPort}`);
    console.log(`🔗 Port Backend dans API URL: ${backendPort}`);
    console.log(`📍 URL actuelle: ${window.location.origin}`);
    
    const urlActuelle = window.location.origin;
    const portActuel = urlActuelle.match(/:(\d+)/)?.[1] || '80';
    
    const coherenceFrontend = portActuel === frontendPort;
    const coherenceAPI = apiUrl.includes(backendPort);
    
    console.log('');
    console.log('📋 Résultats:');
    console.log(`  • Frontend cohérent: ${coherenceFrontend ? '✅' : '❌'}`);
    console.log(`  • API cohérente: ${coherenceAPI ? '✅' : '❌'}`);
    
    if (coherenceFrontend && coherenceAPI) {
      console.log('🎉 Configuration parfaitement cohérente !');
    } else {
      console.log('⚠️ Incohérences détectées dans la configuration');
    }
    
    return {
      coherenceFrontend,
      coherenceAPI,
      frontendPort,
      backendPort,
      portActuel
    };
  },

  // Test complet de la configuration
  async testComplet() {
    console.log('🧪 === TEST COMPLET CONFIGURATION ===');
    console.log('');
    
    // 1. Afficher la configuration
    console.log('1️⃣ Configuration...');
    const config = this.afficherConfiguration();
    
    // 2. Vérifier la cohérence
    console.log('2️⃣ Cohérence des ports...');
    const coherence = this.verifierCoherencePorts();
    
    // 3. Tester la connexion API
    console.log('3️⃣ Connexion API...');
    const connexion = await this.testerConnexionAPI();
    
    // 4. Résumé
    console.log('📋 === RÉSUMÉ ===');
    const success = coherence.coherenceFrontend && coherence.coherenceAPI && connexion.success;
    
    if (success) {
      console.log('🎉 ✅ Configuration parfaitement fonctionnelle !');
      console.log(`   • Frontend: http://localhost:${coherence.frontendPort}`);
      console.log(`   • Backend: http://localhost:${coherence.backendPort}`);
    } else {
      console.log('⚠️ ❌ Problèmes détectés dans la configuration');
      if (!coherence.coherenceFrontend) console.log('   • Port frontend incohérent');
      if (!coherence.coherenceAPI) console.log('   • URL API incohérente');
      if (!connexion.success) console.log('   • Connexion API échouée');
    }
    
    return {
      success,
      config,
      coherence,
      connexion
    };
  },

  // Instructions pour l'utilisateur
  afficherInstructions() {
    console.log(`
🎯 === INSTRUCTIONS TEST CONFIGURATION ===

Pour tester la configuration centralisée :

1. Configuration actuelle :
   testConfiguration.afficherConfiguration()

2. Vérifier la cohérence :
   testConfiguration.verifierCoherencePorts()

3. Tester la connexion API :
   testConfiguration.testerConnexionAPI()

4. Test complet :
   testConfiguration.testComplet()

📁 Fichiers de configuration :
• backend/.env - Configuration backend (PORT=3001)
• frontend/.env - Configuration frontend (VITE_PORT=5173)
• frontend/src/config/env.js - Configuration centralisée

🔧 Pour changer les ports :
1. Modifier les fichiers .env
2. Redémarrer les serveurs
3. Exécuter testConfiguration.testComplet()
    `);
  }
};

// Rendre disponible dans la console
if (typeof window !== 'undefined') {
  window.testConfiguration = testConfiguration;
  
  // Afficher les instructions au chargement
  setTimeout(() => {
    testConfiguration.afficherInstructions();
  }, 1000);
}

export default testConfiguration;