// Utilitaire de test pour les rapports
import api from '../services/api';

export const testReportsAPI = async () => {
  console.log('🚀 Test des endpoints de rapports');
  
  try {
    // Test de l'endpoint principal
    console.log('📊 Test de /api/reports/dashboard...');
    const dashboardResponse = await api.get('/api/reports/dashboard?period=month');
    console.log('✅ Dashboard OK:', dashboardResponse.data);
    
    // Test des autres endpoints
    const endpoints = [
      '/api/reports/sales',
      '/api/reports/clients', 
      '/api/reports/products',
      '/api/reports/revenue',
      '/api/reports/overview'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📊 Test de ${endpoint}...`);
        const response = await api.get(`${endpoint}?period=month`);
        console.log(`✅ ${endpoint} OK`);
      } catch (error) {
        console.error(`❌ ${endpoint} Erreur:`, error.response?.data || error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test rapports:', error.response?.data || error.message);
    return false;
  }
};

// Test de l'export
export const testExportFunctions = () => {
  console.log('📄 Test des fonctions d\'export');
  
  try {
    // Import du service d'export
    import('../services/exportService').then(exportService => {
      const mockData = {
        sales: { total: 125000, growth: 12.5, orders: 342, avgOrder: 365 },
        clients: { total: 156, new: 23, active: 89, growth: 8.3 },
        products: { 
          total: 45,
          topSelling: [
            { name: 'Test Product', sales: 45, revenue: 49500 }
          ],
          categories: [
            { name: 'Test Category', percentage: 35 }
          ]
        },
        revenue: {
          monthly: [{ month: 'Jan', revenue: 45000 }],
          total: 328000,
          pending: 23500
        }
      };
      
      console.log('✅ Service d\'export chargé');
      console.log('📄 Test export PDF...');
      exportService.default.exportToPDF(mockData, 'month');
      console.log('✅ Export PDF OK');
      
      console.log('📊 Test export Excel...');
      exportService.default.exportToExcel(mockData, 'month');
      console.log('✅ Export Excel OK');
      
      console.log('📋 Test export CSV...');
      exportService.default.exportToCSV(mockData, 'kpi');
      console.log('✅ Export CSV OK');
      
    }).catch(error => {
      console.error('❌ Erreur chargement service export:', error);
    });
    
  } catch (error) {
    console.error('❌ Erreur test export:', error);
  }
};

export default { testReportsAPI, testExportFunctions };