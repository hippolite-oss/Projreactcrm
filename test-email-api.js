const axios = require('axios');

async function testEmailAPI() {
  console.log('Test de l\'API email...\n');
  
  try {
    // Test de l'endpoint de test d'email
    console.log('1. Test de l\'endpoint /api/email/test');
    const response = await axios.post('http://localhost:3001/api/email/test', {
      destinataire: 'hippoliteagbodamakou@gmail.com'
    });
    
    console.log('Reponse:', response.data);
    console.log('Status:', response.status);
    
  } catch (error) {
    console.error('Erreur lors du test:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testEmailAPI();