// Script de test pour vérifier la configuration OAuth
console.log('🔍 Vérification de la configuration OAuth...\n');

// Lire directement le fichier .env
const fs = require('fs');
const path = require('path');

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('📄 Contenu du fichier .env OAuth :');
  
  const lines = envContent.split('\n');
  const oauthLines = lines.filter(line => 
    line.includes('GOOGLE_') || line.includes('GITHUB_')
  );
  
  oauthLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      const isPlaceholder = value && (
        value.includes('your-') || 
        value === 'your-google-client-id' ||
        value === 'your-google-client-secret' ||
        value === 'your-github-client-id' ||
        value === 'your-github-client-secret'
      );
      
      console.log(`${isPlaceholder ? '❌' : '✅'} ${key}: ${isPlaceholder ? 'Placeholder (à configurer)' : 'Configuré'}`);
    }
  });
  
  console.log('\n🔧 Action requise :');
  console.log('1. Suivez CONFIGURATION_GOOGLE_OAUTH_DETAILLEE.md');
  console.log('2. Remplacez les valeurs placeholder dans .env');
  console.log('3. Redémarrez le backend');
  
} catch (error) {
  console.error('❌ Erreur lecture .env:', error.message);
}