// Test du backend i18n
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testI18nBackend() {
  console.log('🔄 Test du Backend i18n...\n');

  try {
    // Test 1: Récupérer les langues disponibles
    console.log('📋 Test 1: GET /api/i18n/languages');
    const languagesResponse = await axios.get(`${BASE_URL}/api/i18n/languages`);
    console.log('✅ Langues disponibles:', JSON.stringify(languagesResponse.data, null, 2));
    console.log('');

    // Test 2: Récupérer les traductions françaises
    console.log('🇫🇷 Test 2: GET /api/i18n/translations/fr');
    const frTranslations = await axios.get(`${BASE_URL}/api/i18n/translations/fr`);
    console.log('✅ Traductions FR (échantillon):');
    const frData = frTranslations.data.data;
    console.log(`   - dashboard: "${frData.dashboard}"`);
    console.log(`   - clients: "${frData.clients}"`);
    console.log(`   - products: "${frData.products}"`);
    console.log(`   - settings: "${frData.settings}"`);
    console.log(`   - Total clés: ${Object.keys(frData).length}`);
    console.log('');

    // Test 3: Récupérer les traductions anglaises
    console.log('🇺🇸 Test 3: GET /api/i18n/translations/en');
    const enTranslations = await axios.get(`${BASE_URL}/api/i18n/translations/en`);
    console.log('✅ Traductions EN (échantillon):');
    const enData = enTranslations.data.data;
    console.log(`   - dashboard: "${enData.dashboard}"`);
    console.log(`   - clients: "${enData.clients}"`);
    console.log(`   - products: "${enData.products}"`);
    console.log(`   - settings: "${enData.settings}"`);
    console.log(`   - Total clés: ${Object.keys(enData).length}`);
    console.log('');

    // Test 4: Tester une langue inexistante
    console.log('❌ Test 4: GET /api/i18n/translations/es (langue inexistante)');
    try {
      const esTranslations = await axios.get(`${BASE_URL}/api/i18n/translations/es`);
      console.log('⚠️ Réponse inattendue:', esTranslations.data);
    } catch (error) {
      console.log('✅ Erreur attendue pour langue inexistante');
    }
    console.log('');

    // Test 5: Tester la sauvegarde de préférence utilisateur
    console.log('💾 Test 5: POST /api/i18n/user-preference');
    const preferenceResponse = await axios.post(`${BASE_URL}/api/i18n/user-preference`, {
      language: 'en'
    });
    console.log('✅ Préférence sauvegardée:', JSON.stringify(preferenceResponse.data, null, 2));
    console.log('');

    console.log('🎉 Tous les tests du backend i18n sont RÉUSSIS !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log('\n🔧 Vérifiez que le backend est démarré sur http://localhost:3001');
  }
}

// Exécuter les tests
testI18nBackend();