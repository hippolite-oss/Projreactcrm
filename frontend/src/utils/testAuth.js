import api from '../services/api';

/**
 * Test de l'authentification et des catégories
 */
export const testAuthAndCategories = async () => {
  console.log('🔐 Test d\'authentification et catégories');
  
  try {
    // Test 1: Vérifier si on est connecté
    console.log('1. Vérification du token...');
    const token = localStorage.getItem('token');
    console.log('Token présent:', !!token);
    
    if (!token) {
      console.log('❌ Pas de token, tentative de connexion...');
      
      // Tentative de connexion
      const loginResponse = await api.post('/api/auth/login', {
        email: 'admin@test.com',
        password: 'admin123'
      });
      
      console.log('✅ Connexion réussie:', loginResponse.data);
      
      // Le token devrait être automatiquement stocké par l'intercepteur
      const newToken = localStorage.getItem('token');
      console.log('Nouveau token stocké:', !!newToken);
    }
    
    // Test 2: Tester l'API des catégories
    console.log('2. Test API catégories...');
    
    try {
      const statsResponse = await api.get('/api/categories/stats');
      console.log('✅ Stats catégories:', statsResponse.data);
    } catch (error) {
      console.error('❌ Erreur stats:', error.response?.status, error.response?.data);
    }
    
    try {
      const treeResponse = await api.get('/api/categories/tree');
      console.log('✅ Arbre catégories:', treeResponse.data?.length, 'catégories principales');
    } catch (error) {
      console.error('❌ Erreur arbre:', error.response?.status, error.response?.data);
    }
    
    // Test 3: Vérifier les headers d'authentification
    console.log('3. Vérification headers...');
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      console.log('Token actuel (premiers 50 chars):', currentToken.substring(0, 50) + '...');
      
      // Test manuel avec headers
      try {
        const response = await fetch('http://localhost:3001/api/categories/stats', {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Test fetch manuel réussi:', data);
        } else {
          console.error('❌ Test fetch manuel échoué:', response.status, await response.text());
        }
      } catch (error) {
        console.error('❌ Erreur fetch manuel:', error);
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return { success: false, error };
  }
};

// Export pour la console
window.testAuthAndCategories = testAuthAndCategories;

export default testAuthAndCategories;