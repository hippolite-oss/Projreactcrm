// Script de test pour les endpoints de rapports
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Fonction pour tester la connexion
async function testLogin() {
  try {
    console.log('🔐 Test de connexion...');
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    });
    
    console.log('✅ Connexion réussie');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour tester les endpoints de rapports
async function testReportsEndpoints(token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    '/reports/dashboard',
    '/reports/sales',
    '/reports/clients',
    '/reports/products',
    '/reports/revenue',
    '/reports/overview'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Test de ${endpoint}...`);
      const response = await axios.get(`${API_BASE}${endpoint}?period=month`, { headers });
      console.log(`✅ ${endpoint} - OK`);
      console.log(`   Données reçues:`, Object.keys(response.data));
    } catch (error) {
      console.error(`❌ ${endpoint} - Erreur:`, error.response?.data || error.message);
    }
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Test des endpoints de rapports\n');
  
  const token = await testLogin();
  if (!token) {
    console.log('❌ Impossible de continuer sans token');
    return;
  }
  
  console.log('\n📊 Test des endpoints de rapports...\n');
  await testReportsEndpoints(token);
  
  console.log('\n✅ Tests terminés');
}

// Attendre que le serveur soit prêt
setTimeout(() => {
  main().catch(console.error);
}, 5000);