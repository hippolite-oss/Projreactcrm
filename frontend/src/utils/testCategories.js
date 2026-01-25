import api from '../services/api';

/**
 * Script de test pour les catégories
 * Utilisation: testCategories() dans la console du navigateur
 */

export const testCategories = async () => {
  console.log('🧪 Test des catégories - Début');
  
  try {
    // Test 1: Récupérer les statistiques
    console.log('📊 Test 1: Statistiques des catégories');
    const statsResponse = await api.get('/categories/stats');
    console.log('✅ Statistiques:', statsResponse.data);
    
    // Test 2: Récupérer l'arbre des catégories
    console.log('🌳 Test 2: Arbre des catégories');
    const treeResponse = await api.get('/categories/tree');
    console.log('✅ Arbre des catégories:', treeResponse.data);
    console.log(`   Nombre de catégories principales: ${treeResponse.data.length}`);
    
    // Test 3: Récupérer toutes les catégories (liste plate)
    console.log('📋 Test 3: Liste des catégories');
    const listResponse = await api.get('/categories');
    console.log('✅ Liste des catégories:', listResponse.data);
    console.log(`   Nombre total de catégories: ${listResponse.data.length}`);
    
    // Test 4: Créer une catégorie de test
    console.log('➕ Test 4: Création d\'une catégorie de test');
    const newCategory = {
      name: 'Test Catégorie',
      description: 'Catégorie créée pour les tests',
      icon: 'Settings',
      color: 'blue',
      active: true
    };
    
    const createResponse = await api.post('/categories', newCategory);
    console.log('✅ Catégorie créée:', createResponse.data);
    const createdId = createResponse.data.id;
    
    // Test 5: Récupérer la catégorie créée
    console.log('🔍 Test 5: Récupération de la catégorie créée');
    const getResponse = await api.get(`/categories/${createdId}`);
    console.log('✅ Catégorie récupérée:', getResponse.data);
    
    // Test 6: Modifier la catégorie
    console.log('✏️ Test 6: Modification de la catégorie');
    const updateData = {
      name: 'Test Catégorie Modifiée',
      description: 'Description mise à jour',
      color: 'green'
    };
    
    const updateResponse = await api.patch(`/categories/${createdId}`, updateData);
    console.log('✅ Catégorie modifiée:', updateResponse.data);
    
    // Test 7: Supprimer la catégorie de test
    console.log('🗑️ Test 7: Suppression de la catégorie de test');
    await api.delete(`/categories/${createdId}`);
    console.log('✅ Catégorie supprimée');
    
    // Test 8: Vérifier les statistiques finales
    console.log('📊 Test 8: Statistiques finales');
    const finalStatsResponse = await api.get('/categories/stats');
    console.log('✅ Statistiques finales:', finalStatsResponse.data);
    
    console.log('🎉 Tous les tests sont passés avec succès !');
    
    return {
      success: true,
      stats: finalStatsResponse.data,
      categories: treeResponse.data
    };
    
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

// Test spécifique pour l'interface utilisateur
export const testCategoriesUI = async () => {
  console.log('🎨 Test de l\'interface utilisateur des catégories');
  
  try {
    // Simuler les actions de l'interface
    const stats = await api.get('/categories/stats');
    const tree = await api.get('/categories/tree');
    const list = await api.get('/categories?includeInactive=true');
    
    console.log('✅ Interface prête avec:');
    console.log(`   - ${stats.data.total} catégories au total`);
    console.log(`   - ${stats.data.parents} catégories principales`);
    console.log(`   - ${stats.data.children} sous-catégories`);
    console.log(`   - ${stats.data.active} catégories actives`);
    
    // Tester la recherche par slug
    if (tree.data.length > 0) {
      const firstCategory = tree.data[0];
      console.log(`🔍 Test recherche par slug: ${firstCategory.slug}`);
      const slugResponse = await api.get(`/categories/slug/${firstCategory.slug}`);
      console.log('✅ Recherche par slug réussie:', slugResponse.data.name);
    }
    
    return {
      success: true,
      ready: true,
      stats: stats.data,
      tree: tree.data
    };
    
  } catch (error) {
    console.error('❌ Erreur test interface:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fonction utilitaire pour afficher l'arbre dans la console
export const displayCategoryTree = (categories, level = 0) => {
  categories.forEach(category => {
    const indent = '  '.repeat(level);
    const icon = category.children && category.children.length > 0 ? '📂' : '📄';
    console.log(`${indent}${icon} ${category.name} (${category.children?.length || 0} enfants)`);
    
    if (category.children && category.children.length > 0) {
      displayCategoryTree(category.children, level + 1);
    }
  });
};

// Export pour utilisation dans la console
window.testCategories = testCategories;
window.testCategoriesUI = testCategoriesUI;
window.displayCategoryTree = displayCategoryTree;

export default {
  testCategories,
  testCategoriesUI,
  displayCategoryTree
};