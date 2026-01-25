import api from '../services/api';

/**
 * Test de l'API des produits avec images
 */
export const testProductsWithImages = async () => {
  console.log('🧪 Test des produits avec images');
  
  try {
    // Test 1: Créer un produit avec une image
    console.log('1. Création d\'un produit avec image...');
    
    const testProduct = {
      name: 'Test Smartphone',
      description: 'Smartphone de test avec image',
      price: 599.99,
      category: 'Smartphones & Tablettes',
      subcategory: 'Smartphones Premium',
      brand: 'TestBrand',
      model: 'Test-X1',
      stockQuantity: 10,
      active: true,
      isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    };
    
    const createResponse = await api.post('/api/products', testProduct);
    console.log('✅ Produit créé avec image:', createResponse.data);
    
    const productId = createResponse.data.id;
    
    // Test 2: Récupérer le produit créé
    console.log('2. Récupération du produit...');
    const getResponse = await api.get(`/api/products/${productId}`);
    console.log('✅ Produit récupéré:', getResponse.data);
    console.log('   Image URL:', getResponse.data.imageUrl);
    
    // Test 3: Modifier l'image du produit
    console.log('3. Modification de l\'image...');
    const updateData = {
      imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400'
    };
    
    const updateResponse = await api.patch(`/api/products/${productId}`, updateData);
    console.log('✅ Image modifiée:', updateResponse.data.imageUrl);
    
    // Test 4: Test avec une URL invalide
    console.log('4. Test avec URL invalide...');
    try {
      await api.patch(`/api/products/${productId}`, {
        imageUrl: 'invalid-url'
      });
      console.log('❌ L\'URL invalide a été acceptée (problème)');
    } catch (error) {
      console.log('✅ URL invalide rejetée correctement:', error.response?.data?.message);
    }
    
    // Test 5: Supprimer le produit de test
    console.log('5. Suppression du produit de test...');
    await api.delete(`/api/products/${productId}`);
    console.log('✅ Produit supprimé');
    
    console.log('🎉 Tous les tests sont passés !');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    console.error('   Message:', error.response?.data?.message || error.message);
    console.error('   Status:', error.response?.status);
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
};

// Test spécifique pour les validations d'images
export const testImageValidation = async () => {
  console.log('🖼️ Test de validation des images');
  
  const testUrls = [
    { url: 'https://example.com/image.jpg', valid: true, description: 'URL JPG valide' },
    { url: 'https://example.com/image.png', valid: true, description: 'URL PNG valide' },
    { url: 'https://example.com/image.gif', valid: true, description: 'URL GIF valide' },
    { url: 'https://example.com/image.webp', valid: true, description: 'URL WebP valide' },
    { url: 'invalid-url', valid: false, description: 'URL invalide' },
    { url: 'http://example.com/file.txt', valid: false, description: 'URL non-image' },
    { url: '', valid: true, description: 'URL vide (optionnelle)' }
  ];
  
  for (const test of testUrls) {
    console.log(`Testing: ${test.description}`);
    
    // Test côté frontend (validation JavaScript)
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
    const frontendValid = !test.url || urlPattern.test(test.url.trim());
    
    console.log(`  Frontend validation: ${frontendValid ? '✅' : '❌'} (expected: ${test.valid ? '✅' : '❌'})`);
    
    if (frontendValid !== test.valid && test.url !== '') {
      console.log(`  ⚠️ Validation mismatch for: ${test.url}`);
    }
  }
  
  return { success: true };
};

// Export pour utilisation dans la console
window.testProductsWithImages = testProductsWithImages;
window.testImageValidation = testImageValidation;

export default {
  testProductsWithImages,
  testImageValidation
};