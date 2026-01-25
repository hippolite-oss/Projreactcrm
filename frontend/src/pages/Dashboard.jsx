import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  Users, Package, FileText, Receipt, TrendingUp, DollarSign, 
  UserPlus, Calendar, BarChart3, Target, Activity, Download,
  MoreVertical, ArrowUpRight, ArrowDownRight, Eye, Filter,
  Home, ShoppingCart, Clock, AlertTriangle, CheckCircle,
  Bell, Settings, RefreshCw, CreditCard, Globe,
  Server, Database, Cloud, Cpu, Shield, Star, Zap,
  HardDrive, Wifi, Truck, Headphones
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    quotes: 0,
    invoices: 0,
    revenue: 0,
    growth: 0,
    newClients: 0,
    conversionRate: 0
  })
  
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(new Date())
  const [timeRange, setTimeRange] = useState('month')
  const [clientData, setClientData] = useState([
    { month: 'Jan', clients: 25, prospects: 15 },
    { month: 'Fév', clients: 30, prospects: 18 },
    { month: 'Mar', clients: 35, prospects: 22 },
    { month: 'Avr', clients: 40, prospects: 25 },
    { month: 'Mai', clients: 45, prospects: 28 },
    { month: 'Jun', clients: 50, prospects: 30 }
  ])
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 25000, target: 45000 },
    { month: 'Fév', revenue: 30000, target: 45000 },
    { month: 'Mar', revenue: 35000, target: 45000 },
    { month: 'Avr', revenue: 40000, target: 45000 },
    { month: 'Mai', revenue: 45000, target: 45000 },
    { month: 'Jun', revenue: 50000, target: 45000 }
  ])
  const [statusData, setStatusData] = useState([
    { name: 'Actifs', value: 45 },
    { name: 'Inactifs', value: 15 },
    { name: 'Prospects', value: 25 }
  ])
  const [recentActivities, setRecentActivities] = useState([])
  const [notifications, setNotifications] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [systemStatus, setSystemStatus] = useState({
    database: 'online',
    api: 'online',
    storage: '85%',
    uptime: '99.8%'
  })

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('€', 'F')
  }

  // Mettre à jour l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Charger les données du dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Appel API pour les statistiques
      const statsResponse = await api.get('/api/dashboard/stats');
      
      if (statsResponse.data) {
        setStats({
          clients: statsResponse.data.clients || 0,
          products: statsResponse.data.products || 0,
          quotes: statsResponse.data.quotes || 0,
          invoices: statsResponse.data.invoices || 0,
          revenue: statsResponse.data.revenue || 0,
          growth: statsResponse.data.growth || 0,
          newClients: statsResponse.data.newClients || 0,
          conversionRate: statsResponse.data.conversionRate || 0
        });
      }
      
      // Appels API pour les graphiques (si les endpoints existent)
      try {
        const clientsResponse = await api.get('/api/dashboard/clients-growth');
        if (clientsResponse.data && clientsResponse.data.success) {
          setClientData(clientsResponse.data.data || []);
        } else {
          // Données par défaut
          setClientData([
            { month: 'Jan', clients: 25, prospects: 15 },
            { month: 'Fév', clients: 30, prospects: 18 },
            { month: 'Mar', clients: 35, prospects: 22 },
            { month: 'Avr', clients: 40, prospects: 25 },
            { month: 'Mai', clients: 45, prospects: 28 },
            { month: 'Jun', clients: 50, prospects: 30 }
          ]);
        }
      } catch (error) {
        console.log('Endpoint clients-growth non disponible');
        // Données par défaut
        setClientData([
          { month: 'Jan', clients: 25, prospects: 15 },
          { month: 'Fév', clients: 30, prospects: 18 },
          { month: 'Mar', clients: 35, prospects: 22 },
          { month: 'Avr', clients: 40, prospects: 25 },
          { month: 'Mai', clients: 45, prospects: 28 },
          { month: 'Jun', clients: 50, prospects: 30 }
        ]);
      }
      
      try {
        const revenueResponse = await api.get('/api/dashboard/revenue');
        if (revenueResponse.data && revenueResponse.data.success) {
          setRevenueData(revenueResponse.data.data || []);
        } else {
          // Données par défaut
          setRevenueData([
            { month: 'Jan', revenue: 25000, target: 45000 },
            { month: 'Fév', revenue: 30000, target: 45000 },
            { month: 'Mar', revenue: 35000, target: 45000 },
            { month: 'Avr', revenue: 40000, target: 45000 },
            { month: 'Mai', revenue: 45000, target: 45000 },
            { month: 'Jun', revenue: 50000, target: 45000 }
          ]);
        }
      } catch (error) {
        console.log('Endpoint revenue non disponible');
        // Données par défaut
        setRevenueData([
          { month: 'Jan', revenue: 25000, target: 45000 },
          { month: 'Fév', revenue: 30000, target: 45000 },
          { month: 'Mar', revenue: 35000, target: 45000 },
          { month: 'Avr', revenue: 40000, target: 45000 },
          { month: 'Mai', revenue: 45000, target: 45000 },
          { month: 'Jun', revenue: 50000, target: 45000 }
        ]);
      }
      
      try {
        const statusResponse = await api.get('/api/dashboard/client-status');
        if (statusResponse.data && statusResponse.data.success) {
          // Transformer les données en format pour le graphique
          const statusInfo = statusResponse.data.data;
          const formattedStatusData = [
            { name: 'Actifs', value: statusInfo.actifs || 0 },
            { name: 'Inactifs', value: statusInfo.inactifs || 0 },
            { name: 'Prospects', value: statusInfo.prospects || 0 }
          ];
          setStatusData(formattedStatusData);
        } else {
          // Données par défaut si l'API échoue
          setStatusData([
            { name: 'Actifs', value: 45 },
            { name: 'Inactifs', value: 15 },
            { name: 'Prospects', value: 25 }
          ]);
        }
      } catch (error) {
        console.log('Endpoint client-status non disponible');
        // Données par défaut
        setStatusData([
          { name: 'Actifs', value: 45 },
          { name: 'Inactifs', value: 15 },
          { name: 'Prospects', value: 25 }
        ]);
      }
      
      // Charger les activités récentes
      try {
        const activitiesResponse = await api.get('/api/dashboard/recent-activities');
        if (activitiesResponse.data && activitiesResponse.data.success) {
          setRecentActivities(activitiesResponse.data.data || []);
        }
      } catch (error) {
        console.log('Endpoint recent-activities non disponible');
      }

      // Charger les notifications
      try {
        const notificationsResponse = await api.get('/api/dashboard/notifications');
        if (notificationsResponse.data && notificationsResponse.data.success) {
          setNotifications(notificationsResponse.data.data || []);
        }
      } catch (error) {
        console.log('Endpoint notifications non disponible');
      }

      // Charger les produits populaires
      try {
        const productsResponse = await api.get('/api/dashboard/top-products');
        if (productsResponse.data && productsResponse.data.success) {
          setTopProducts(productsResponse.data.data || []);
        }
      } catch (error) {
        console.log('Endpoint top-products non disponible');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
      // Fallback sur données simulées
      loadMockData();
    }
  };

  // Données simulées en cas d'erreur API
  const loadMockData = () => {
    setStats({
      clients: 195,
      products: 87,
      quotes: 42,
      invoices: 156,
      revenue: 395000,
      growth: 12.5,
      newClients: 22,
      conversionRate: 68
    });
    
    setClientData([
      { month: 'Jan', clients: 120, newClients: 15 },
      { month: 'Fév', clients: 135, newClients: 18 },
      { month: 'Mar', clients: 142, newClients: 12 },
      { month: 'Avr', clients: 158, newClients: 20 },
      { month: 'Mai', clients: 170, newClients: 16 },
      { month: 'Juin', clients: 185, newClients: 22 }
    ]);
    
    setRevenueData([
      { month: 'Jan', revenue: 45000, target: 50000 },
      { month: 'Fév', revenue: 52000, target: 50000 },
      { month: 'Mar', revenue: 48000, target: 55000 },
      { month: 'Avr', revenue: 61000, target: 60000 },
      { month: 'Mai', revenue: 58000, target: 60000 },
      { month: 'Juin', revenue: 72000, target: 65000 }
    ]);
    
    setStatusData([
      { name: 'Actifs', value: 156, color: '#10b981' },
      { name: 'Potentiels', value: 78, color: '#f59e0b' },
      { name: 'Inactifs', value: 42, color: '#ef4444' },
      { name: 'Suspendus', value: 15, color: '#6b7280' }
    ]);

    setRecentActivities([
      { id: 1, user: 'Admin', action: 'a ajouté un nouveau client', time: '10:30', icon: 'plus' },
      { id: 2, user: 'Vendeur1', action: `a effectué une vente de ${formatCurrency(2500)}`, time: '11:15', icon: 'cart' },
      { id: 3, user: 'Admin', action: 'a créé une facture #INV-2456', time: '13:45', icon: 'edit' },
      { id: 4, user: 'System', action: 'sauvegarde automatique effectuée', time: '14:00', icon: 'save' },
      { id: 5, user: 'Vendeur2', action: 'a créé un nouveau contact', time: '15:30', icon: 'user' }
    ]);

    setNotifications([
      { id: 1, type: 'alert', message: '3 produits en rupture de stock', time: '10 min', read: false },
      { id: 2, type: 'warning', message: '8 produits atteignent le seuil bas', time: '30 min', read: true },
      { id: 3, type: 'info', message: 'Nouvelle commande reçue #ORD-2456', time: '1h', read: true },
      { id: 4, type: 'success', message: `Paiement reçu de ${formatCurrency(1200)}`, time: '2h', read: true }
    ]);

    setTopProducts([
      { id: 1, name: 'Service Premium', sales: 28, revenue: 25197, stock: 15, trend: 'up' },
      { id: 2, name: 'Formation Pro', sales: 45, revenue: 31495, stock: 8, trend: 'up' },
      { id: 3, name: 'Consulting', sales: 67, revenue: 13393, stock: 20, trend: 'up' },
      { id: 4, name: 'Support Annuel', sales: 89, revenue: 6221, stock: 5, trend: 'up' }
    ]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Données supplémentaires pour votre thème
  const quickActionsMock = [
    { id: 1, title: 'Nouveau Client', icon: <Users className="w-5 h-5" />, color: 'bg-orange-500', link: '/dashboard/clients' },
    { id: 2, title: 'Nouvelle Commande', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-green-500', link: '/dashboard/CommandesOnline' },
    { id: 3, title: 'Nouveau Produit', icon: <Package className="w-5 h-5" />, color: 'bg-blue-500', link: '/dashboard/products' },
    { id: 4, title: 'Contacts', icon: <Users className="w-5 h-5" />, color: 'bg-purple-500', link: '/dashboard/prospects' },
    { id: 5, title: 'Générer Rapport', icon: <BarChart3 className="w-5 h-5" />, color: 'bg-indigo-500', link: '/dashboard/reports' },
    { id: 6, title: 'Paramètres', icon: <Settings className="w-5 h-5" />, color: 'bg-red-500', link: '/dashboard/settings' }
  ]

  const realTimeStats = [
    { id: 1, label: 'Clients en ligne', value: 7, change: '+2', trend: 'up' },
    { id: 2, label: 'Commandes du jour', value: 12, change: '+3', trend: 'up' },
    { id: 3, label: 'Prospects actifs', value: 8, change: '-1', trend: 'down' },
    { id: 4, label: 'Temps réponse', value: '0.8s', change: '-0.2s', trend: 'down' }
  ]

  const dailyGoals = [
    { id: 1, title: 'Chiffre d\'affaires', target: formatCurrency(10000), current: formatCurrency(8950), progress: 89, color: 'bg-green-500' },
    { id: 2, title: 'Nouveaux clients', target: 15, current: 12, progress: 80, color: 'bg-blue-500' },
    { id: 3, title: 'Commandes traitées', target: 50, current: 42, progress: 84, color: 'bg-purple-500' },
    { id: 4, title: 'Taux de conversion', target: '75%', current: '68%', progress: 90, color: 'bg-orange-500' }
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280']

  const statCards = [
    { 
      label: 'Total Clients', 
      value: stats.clients, 
      icon: Users, 
      color: '#2563eb',
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Nouveaux Clients', 
      value: stats.newClients, 
      icon: UserPlus, 
      color: '#10b981',
      change: '+18%',
      trend: 'up'
    },
    { 
      label: 'Taux de Conversion', 
      value: `${stats.conversionRate}%`, 
      icon: Target, 
      color: '#8b5cf6',
      change: '+5%',
      trend: 'up'
    },
    { 
      label: 'Revenu Total', 
      value: formatCurrency(stats.revenue), 
      icon: DollarSign, 
      color: '#f59e0b',
      change: '+12.5%',
      trend: 'up'
    }
  ]

  const getActivityIcon = (icon) => {
    switch(icon) {
      case 'plus': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'cart': return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'edit': return <Settings className="w-4 h-4 text-purple-600" />;
      case 'save': return <Database className="w-4 h-4 text-gray-600" />;
      case 'user': return <Users className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  }

  const getNotificationColor = (type) => {
    switch(type) {
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mx-auto mb-6"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Chargement du tableau de bord...
          </p>
          <p className="text-lg text-gray-300 mt-2 font-medium">Préparation de vos données</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50">
      {/* En-tête amélioré */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-slate-100 shadow-xl border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 via-slate-700 to-gray-800 bg-clip-text text-transparent">
                  Tableau de Bord
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-lg text-gray-700 font-medium">
                    {time.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {time.toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                className="px-6 py-3 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm text-slate-700 font-medium focus:ring-4 focus:ring-blue-200 focus:border-blue-300 transition-all duration-300"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week" className="text-gray-900">Cette semaine</option>
                <option value="month" className="text-gray-900">Ce mois</option>
                <option value="quarter" className="text-gray-900">Ce trimestre</option>
                <option value="year" className="text-gray-900">Cette année</option>
              </select>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats principales avec design spectaculaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((card, index) => {
            const Icon = card.icon
            const gradients = [
              'from-pink-500 via-red-500 to-yellow-500',
              'from-green-400 via-blue-500 to-purple-600', 
              'from-purple-400 via-pink-500 to-red-500',
              'from-yellow-400 via-orange-500 to-red-500'
            ]
            const iconBgs = [
              'from-pink-400 to-red-500',
              'from-green-400 to-blue-500',
              'from-purple-400 to-pink-500', 
              'from-yellow-400 to-orange-500'
            ]
            return (
              <div key={index} className={`bg-gradient-to-br ${gradients[index]} p-1 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1`}>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">{card.label}</p>
                      <p className="text-4xl font-black text-gray-900 mb-3">
                        {card.value}
                      </p>
                      <div className="flex items-center gap-2">
                        {card.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-sm font-bold ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {card.change}
                        </span>
                        <span className="text-xs text-gray-600 ml-1 font-medium">vs mois dernier</span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${iconBgs[index]} shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Graphiques professionnels avec design sobre */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Évolution des clients - Graphique fréquentiel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                Évolution des Clients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Analyse fréquentielle mensuelle
              </p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280" 
                      fontSize={12} 
                      fontWeight="500"
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12} 
                      fontWeight="500"
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="clients" 
                      name="Total Clients" 
                      fill="#3b82f6"
                      radius={[2, 2, 0, 0]}
                      stroke="#2563eb"
                      strokeWidth={1}
                    />
                    <Bar 
                      dataKey="newClients" 
                      name="Nouveaux Clients" 
                      fill="#10b981"
                      radius={[2, 2, 0, 0]}
                      stroke="#059669"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Statistiques fréquentielles */}
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {Math.round(clientData.reduce((acc, item) => acc + item.clients, 0) / clientData.length)}
                  </div>
                  <div className="text-xs text-gray-500">Moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.max(...clientData.map(item => item.clients))}
                  </div>
                  <div className="text-xs text-gray-500">Maximum</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    +{clientData[clientData.length - 1]?.clients - clientData[0]?.clients || 0}
                  </div>
                  <div className="text-xs text-gray-500">Croissance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition par statut - Dashboard professionnel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-slate-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Répartition des Clients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Distribution par statut d'activité
              </p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {statusData.map((entry, index) => {
                        const colors = ['#3b82f6', '#10b981', '#6b7280', '#f59e0b'];
                        return (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        );
                      })}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Légende professionnelle */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                {statusData.map((item, index) => {
                  const colors = ['#3b82f6', '#10b981', '#6b7280', '#f59e0b'];
                  const bgColors = ['bg-blue-600', 'bg-green-600', 'bg-gray-600', 'bg-yellow-600'];
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${bgColors[index]}`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">{item.name}</div>
                        <div className="text-lg font-bold text-gray-800">{item.value}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {((item.value / statusData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

       
       

          

        
                

        
      </div>
      {/* Footer simple */}
      <footer className="mt-16 py-6 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">© 2024 Système de Gestion CRM Professionnel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}





// Composant TrendingDown
function TrendingDown({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}

export default Dashboard