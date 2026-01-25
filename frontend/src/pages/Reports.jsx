import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, 
  Calendar, Download, Filter, RefreshCw, Eye, FileText,
  ArrowUp, ArrowDown, Minus, PieChart, LineChart, Activity,
  FileSpreadsheet, FileImage, Share2, TestTube, Sparkles,
  Target, Zap, Award, Clock, ChevronDown, AlertCircle,
  Grid3X3, List, MoreHorizontal, TrendingDown
} from 'lucide-react';
import api from '../services/api';
import exportService from '../services/exportService';
import { testReportsAPI, testExportFunctions } from '../utils/testReports';
import { useNotifications } from '../contexts/NotificationContext';
import './ReportsAnimations.css';

function Reports() {
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [categoriesViewMode, setCategoriesViewMode] = useState('list'); // 'list' ou 'grid'
  const [reportData, setReportData] = useState({
    sales: {
      total: 0,
      growth: 0,
      orders: 0,
      avgOrder: 0
    },
    clients: {
      total: 0,
      new: 0,
      active: 0,
      growth: 0
    },
    products: {
      total: 0,
      topSelling: [],
      categories: []
    },
    revenue: {
      monthly: [],
      total: 0,
      pending: 0
    }
  });

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  // Fermer le menu d'export en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-menu')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Chargement des rapports depuis l\'API...');
      
      // Appel à l'API réelle
      const response = await api.get(`/api/reports/dashboard?period=${selectedPeriod}`);
      const data = response.data;
      
      console.log('✅ Données reçues:', data);
      
      setReportData({
        sales: data.sales || {
          total: 0,
          growth: 0,
          orders: 0,
          avgOrder: 0
        },
        clients: data.clients || {
          total: 0,
          new: 0,
          active: 0,
          growth: 0
        },
        products: data.products || {
          total: 0,
          topSelling: [],
          categories: []
        },
        revenue: data.revenue || {
          monthly: [],
          total: 0,
          pending: 0
        }
      });
    } catch (error) {
      console.error('❌ Erreur chargement rapports:', error);
      
      // Fallback vers les données simulées en cas d'erreur
      const mockData = {
        sales: {
          total: 125000,
          growth: 12.5,
          orders: 342,
          avgOrder: 365
        },
        clients: {
          total: 156,
          new: 23,
          active: 89,
          growth: 8.3
        },
        products: {
          total: 45,
          topSelling: [
            { name: 'iPhone 15 Pro', sales: 45, revenue: 49500 },
            { name: 'MacBook Air M3', sales: 23, revenue: 27600 },
            { name: 'iPad Pro', sales: 34, revenue: 30600 },
            { name: 'AirPods Pro', sales: 67, revenue: 16750 },
            { name: 'Apple Watch', sales: 28, revenue: 11200 }
          ],
          categories: [
            { name: 'Smartphones', percentage: 35 },
            { name: 'Ordinateurs', percentage: 28 },
            { name: 'Tablettes', percentage: 20 },
            { name: 'Accessoires', percentage: 17 }
          ]
        },
        revenue: {
          monthly: [
            { month: 'Jan', revenue: 45000 },
            { month: 'Fév', revenue: 52000 },
            { month: 'Mar', revenue: 48000 },
            { month: 'Avr', revenue: 61000 },
            { month: 'Mai', revenue: 55000 },
            { month: 'Jun', revenue: 67000 }
          ],
          total: 328000,
          pending: 23500
        }
      };
      
      console.log('🔄 Utilisation des données de fallback');
      setReportData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-emerald-500" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-emerald-600 bg-emerald-50';
    if (growth < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const testPDFExport = () => {
    console.log('🧪 Test spécifique export PDF...');
    
    const testData = {
      sales: { total: 125000, growth: 12.5, orders: 342, avgOrder: 365 },
      clients: { total: 156, new: 23, active: 89, growth: 8.3 },
      products: { 
        total: 45,
        topSelling: [
          { name: 'Test Product 1', sales: 45, revenue: 49500 },
          { name: 'Test Product 2', sales: 23, revenue: 27600 }
        ],
        categories: [
          { name: 'Test Category', percentage: 35 }
        ]
      },
      revenue: {
        monthly: [
          { month: 'Jan', revenue: 45000 },
          { month: 'Fév', revenue: 52000 }
        ],
        total: 328000,
        pending: 23500
      }
    };
    
    showToast('🧪 Test PDF en cours...', 'info');
    
    try {
      exportService.exportToPDF(testData, 'month');
      showToast('✅ Test PDF réussi !', 'success');
    } catch (error) {
      console.error('❌ Erreur test PDF:', error);
      showToast(`❌ Test PDF échoué: ${error.message}`, 'error');
    }
  };

  const runTests = () => {
    console.log('🧪 Lancement des tests...');
    showToast('🧪 Tests en cours...', 'info');
    
    // Test API
    testReportsAPI().then(apiTestResult => {
      // Test des fonctions d'export
      testExportFunctions();
      
      if (apiTestResult) {
        showToast('✅ Tous les tests sont passés !', 'success');
      } else {
        showToast('❌ Certains tests ont échoué', 'error');
      }
    }).catch(error => {
      console.error('❌ Erreur lors des tests:', error);
      showToast('❌ Erreur lors des tests', 'error');
    });
  };

  const exportReport = (type) => {
    console.log(`📄 Export rapport ${type}...`);
    
    showToast('Export en cours...', 'info');
    
    try {
      if (!reportData || Object.keys(reportData).length === 0) {
        throw new Error('Aucune donnée disponible pour l\'export');
      }
      
      console.log('📊 Données à exporter:', reportData);
      
      switch (type) {
        case 'pdf':
          exportService.exportToPDF(reportData, selectedPeriod);
          showToast('✅ Export PDF terminé', 'success');
          break;
        case 'excel':
          exportService.exportToExcel(reportData, selectedPeriod);
          showToast('✅ Export Excel terminé', 'success');
          break;
        case 'csv-kpi':
          exportService.exportToCSV(reportData, 'kpi');
          showToast('✅ Export CSV KPI terminé', 'success');
          break;
        case 'csv-products':
          exportService.exportToCSV(reportData, 'products');
          showToast('✅ Export CSV Produits terminé', 'success');
          break;
        case 'csv-monthly':
          exportService.exportToCSV(reportData, 'monthly');
          showToast('✅ Export CSV Mensuel terminé', 'success');
          break;
        case 'sales':
        case 'clients':
        case 'inventory':
        case 'financial':
          // Actions rapides - export PDF par défaut
          exportService.exportToPDF(reportData, selectedPeriod);
          showToast(`✅ Export ${type} terminé`, 'success');
          break;
        default:
          exportService.exportToPDF(reportData, selectedPeriod);
          showToast('✅ Export terminé', 'success');
      }
      
      // Fermer le menu d'export
      setShowExportMenu(false);
      
    } catch (error) {
      console.error('❌ Erreur export:', error);
      const errorMessage = error.message || 'Erreur inconnue lors de l\'export';
      showToast(`❌ ${errorMessage}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement des rapports</h3>
          <p className="text-gray-600">Analyse des données en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Rapports & Analyses</h1>
              </div>
              <p className="text-gray-600">Tableau de bord analytique et indicateurs de performance</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Sélecteur de période */}
              <div className="relative">
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Boutons d'action */}
              <button 
                onClick={() => loadReportData()}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </button>

              <button 
                onClick={runTests}
                className="inline-flex items-center px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Tests
              </button>

              <button 
                onClick={testPDFExport}
                className="inline-flex items-center px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Test PDF
              </button>

              {/* Menu d'export */}
              <div className="relative">
                <button 
                  onClick={() => exportReport('pdf')}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
              </div>

              <div className="relative export-menu">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Plus
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-[9998]">
                    <div className="py-1">
                      <button 
                        onClick={() => exportReport('excel')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-3" />
                        Export Excel
                      </button>
                      <button 
                        onClick={() => exportReport('csv-kpi')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        CSV - KPI
                      </button>
                      <button 
                        onClick={() => exportReport('csv-products')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        CSV - Produits
                      </button>
                      <button 
                        onClick={() => exportReport('csv-monthly')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        CSV - Mensuel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Chiffre d'Affaires */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGrowthColor(reportData.sales.growth)}`}>
              {getGrowthIcon(reportData.sales.growth)}
              <span className="ml-1">{formatPercentage(reportData.sales.growth)}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Chiffre d'Affaires</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(reportData.sales.total)}</div>
            <p className="text-sm text-gray-500">
              {reportData.sales.orders} commandes • Panier moyen: {formatCurrency(reportData.sales.avgOrder)}
            </p>
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGrowthColor(reportData.clients.growth)}`}>
              {getGrowthIcon(reportData.clients.growth)}
              <span className="ml-1">{formatPercentage(reportData.clients.growth)}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Clients</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">{reportData.clients.total}</div>
            <p className="text-sm text-gray-500">
              {reportData.clients.new} nouveaux • {reportData.clients.active} actifs
            </p>
          </div>
        </div>

        {/* Produits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {reportData.products.total}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Produits</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">{reportData.products.topSelling.length}</div>
            <p className="text-sm text-gray-500">
              Top performers • {reportData.products.categories.length} catégories
            </p>
          </div>
        </div>

        {/* Revenus */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              En attente
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Revenus Totaux</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(reportData.revenue.total)}</div>
            <p className="text-sm text-gray-500">
              En attente: {formatCurrency(reportData.revenue.pending)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Évolution du Chiffre d'Affaires - Version Compacte */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <LineChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Évolution CA</h3>
                <p className="text-xs text-gray-500">6 derniers mois</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{formatCurrency(reportData.revenue.total)}</div>
                <div className="flex items-center text-xs text-emerald-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Graphique en ligne compact */}
          <div className="h-32 relative">
            <div className="flex items-end justify-between h-full">
              {reportData.revenue.monthly.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  {/* Point de données */}
                  <div className="relative mb-2">
                    <div 
                      className="w-2 h-2 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-3 group-hover:h-3 group-hover:bg-blue-600"
                      style={{ 
                        marginBottom: `${(item.revenue / 70000) * 80}px`,
                      }}
                      title={`${item.month}: ${formatCurrency(item.revenue)}`}
                    ></div>
                    
                    {/* Ligne de connexion */}
                    {index < reportData.revenue.monthly.length - 1 && (
                      <div className="absolute top-1 left-2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div>
                    )}
                    
                    {/* Tooltip au hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                  
                  {/* Label du mois */}
                  <span className="text-xs text-gray-500 font-medium">{item.month}</span>
                </div>
              ))}
            </div>
            
            {/* Ligne de base */}
            <div className="absolute bottom-6 left-0 right-0 h-px bg-gray-200"></div>
          </div>
          
          {/* Statistiques rapides */}
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xs text-gray-500">Moyenne</div>
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(reportData.revenue.monthly.reduce((sum, item) => sum + item.revenue, 0) / reportData.revenue.monthly.length)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Maximum</div>
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(Math.max(...reportData.revenue.monthly.map(item => item.revenue)))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Minimum</div>
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(Math.min(...reportData.revenue.monthly.map(item => item.revenue)))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Produits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Top Produits</h3>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {reportData.products.topSelling.map((product, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    #{index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    {product.sales} ventes • {formatCurrency(product.revenue)}
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(product.sales / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par Catégories avec basculement Vue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Catégories</h3>
            </div>
            
            {/* Boutons de basculement Vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCategoriesViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  categoriesViewMode === 'list'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCategoriesViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  categoriesViewMode === 'grid'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Vue grille"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Affichage conditionnel selon le mode */}
          {categoriesViewMode === 'list' ? (
            /* Vue Liste */
            <div className="space-y-4">
              {reportData.products.categories.map((category, index) => (
                <div key={index} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-emerald-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{category.percentage}%</span>
                      <span className="text-xs text-gray-500">({category.count || 0})</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        index === 1 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                        index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Vue Grille */
            <div className="grid grid-cols-2 gap-4">
              {reportData.products.categories.map((category, index) => (
                <div key={index} className="group hover:shadow-md transition-shadow duration-200 bg-gray-50 hover:bg-white border border-gray-100 rounded-xl p-4">
                  <div className="text-center">
                    {/* Icône de catégorie */}
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100 text-blue-600' :
                      index === 1 ? 'bg-emerald-100 text-emerald-600' :
                      index === 2 ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index === 0 ? <ShoppingCart className="w-6 h-6" /> :
                       index === 1 ? <Activity className="w-6 h-6" /> :
                       index === 2 ? <Target className="w-6 h-6" /> :
                       <Award className="w-6 h-6" />}
                    </div>
                    
                    {/* Pourcentage principal */}
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {category.percentage}%
                    </div>
                    
                    {/* Nom de la catégorie */}
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {category.name}
                    </div>
                    
                    {/* Nombre d'éléments */}
                    <div className="text-xs text-gray-500">
                      {category.count || 0} produits
                    </div>
                    
                    {/* Barre de progression circulaire */}
                    <div className="mt-3">
                      <div className={`w-full bg-gray-200 rounded-full h-1.5 ${
                        index === 0 ? 'bg-blue-200' :
                        index === 1 ? 'bg-emerald-200' :
                        index === 2 ? 'bg-purple-200' :
                        'bg-orange-200'
                      }`}>
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-700 ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-emerald-500' :
                            index === 2 ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Statistiques totales */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total des catégories</span>
              <span className="font-semibold text-gray-900">
                {reportData.products.categories.reduce((sum, cat) => sum + (cat.count || 0), 0)} produits
              </span>
            </div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Actions Rapides</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => exportReport('sales')}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-200 group"
            >
              <div className="p-2 bg-emerald-500 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-700">Ventes</span>
            </button>
            
            <button 
              onClick={() => exportReport('clients')}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 group"
            >
              <div className="p-2 bg-blue-500 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-700">Clients</span>
            </button>
            
            <button 
              onClick={() => exportReport('inventory')}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-200 group"
            >
              <div className="p-2 bg-purple-500 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-700">Stock</span>
            </button>
            
            <button 
              onClick={() => exportReport('financial')}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-xl transition-all duration-200 group"
            >
              <div className="p-2 bg-orange-500 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-orange-700">Financier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;

