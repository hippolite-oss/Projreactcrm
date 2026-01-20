import { useEffect, useState } from 'react'
import axios from 'axios'
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
  const [clientData, setClientData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [systemStatus, setSystemStatus] = useState({
    database: 'online',
    api: 'online',
    storage: '85%',
    uptime: '99.8%'
  })

  // Mettre à jour l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simulation de données avec votre thème
      const mockClientData = [
        { month: 'Jan', clients: 120, newClients: 15 },
        { month: 'Fév', clients: 135, newClients: 18 },
        { month: 'Mar', clients: 142, newClients: 12 },
        { month: 'Avr', clients: 158, newClients: 20 },
        { month: 'Mai', clients: 170, newClients: 16 },
        { month: 'Juin', clients: 185, newClients: 22 },
        { month: 'Juil', clients: 195, newClients: 18 }
      ]

      const mockRevenueData = [
        { month: 'Jan', revenue: 45000, target: 50000 },
        { month: 'Fév', revenue: 52000, target: 50000 },
        { month: 'Mar', revenue: 48000, target: 55000 },
        { month: 'Avr', revenue: 61000, target: 60000 },
        { month: 'Mai', revenue: 58000, target: 60000 },
        { month: 'Juin', revenue: 72000, target: 65000 },
        { month: 'Juil', revenue: 68000, target: 70000 }
      ]

      const mockStatusData = [
        { name: 'Actifs', value: 156, color: '#10b981' },
        { name: 'Potentiels', value: 78, color: '#f59e0b' },
        { name: 'Inactifs', value: 42, color: '#ef4444' },
        { name: 'Suspendus', value: 15, color: '#6b7280' }
      ]

      const mockRecentActivities = [
        { id: 1, user: 'Admin', action: 'a ajouté un nouveau client', time: '10:30', icon: 'plus' },
        { id: 2, user: 'Vendeur1', action: 'a effectué une vente de €2,500', time: '11:15', icon: 'cart' },
        { id: 3, user: 'Admin', action: 'a créé une facture #INV-2456', time: '13:45', icon: 'edit' },
        { id: 4, user: 'System', action: 'sauvegarde automatique effectuée', time: '14:00', icon: 'save' },
        { id: 5, user: 'Vendeur2', action: 'a créé un nouveau contact', time: '15:30', icon: 'user' }
      ]

      // Simuler un appel API
      setTimeout(() => {
        setStats({
          clients: 195,
          products: 87,
          quotes: 42,
          invoices: 156,
          revenue: 395000,
          growth: 12.5,
          newClients: 22,
          conversionRate: 68
        })
        
        setClientData(mockClientData)
        setRevenueData(mockRevenueData)
        setStatusData(mockStatusData)
        setRecentActivities(mockRecentActivities)
        setLoading(false)
      }, 1000)

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setLoading(false)
    }
  }

  // Données supplémentaires pour votre thème
  const notificationsMock = [
    { id: 1, type: 'alert', message: '3 produits en rupture de stock', time: '10 min', read: false },
    { id: 2, type: 'warning', message: '8 produits atteignent le seuil bas', time: '30 min', read: true },
    { id: 3, type: 'info', message: 'Nouvelle commande reçue #ORD-2456', time: '1h', read: true },
    { id: 4, type: 'success', message: 'Paiement reçu de €1,200', time: '2h', read: true }
  ]

  const quickActionsMock = [
    { id: 1, title: 'Nouveau Client', icon: <Users className="w-5 h-5" />, color: 'bg-orange-500', link: '/nouveauclient' },
    { id: 2, title: 'Nouvelle Vente', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-green-500', link: '/commande' },
    { id: 3, title: 'Nouvelle Facture', icon: <Receipt className="w-5 h-5" />, color: 'bg-purple-500', link: '/invoices' },
    { id: 4, title: 'Nouveau Produit', icon: <Package className="w-5 h-5" />, color: 'bg-blue-500', link: '/products' },
    { id: 5, title: 'Générer Rapport', icon: <BarChart3 className="w-5 h-5" />, color: 'bg-indigo-500', link: '/reports' },
    { id: 6, title: 'Voir Alertes', icon: <Bell className="w-5 h-5" />, color: 'bg-red-500', link: '/alerts' }
  ]

  const realTimeStats = [
    { id: 1, label: 'Clients en ligne', value: 7, change: '+2', trend: 'up' },
    { id: 2, label: 'Factures générées', value: 12, change: '+3', trend: 'up' },
    { id: 3, label: 'Devis en attente', value: 8, change: '-1', trend: 'down' },
    { id: 4, label: 'Temps réponse', value: '0.8s', change: '-0.2s', trend: 'down' }
  ]

  const dailyGoals = [
    { id: 1, title: 'Chiffre d\'affaires', target: '€10,000', current: '€8,950', progress: 89, color: 'bg-green-500' },
    { id: 2, title: 'Nouveaux clients', target: 15, current: 12, progress: 80, color: 'bg-blue-500' },
    { id: 3, title: 'Factures émises', target: 50, current: 42, progress: 84, color: 'bg-purple-500' },
    { id: 4, title: 'Taux de conversion', target: '75%', current: '68%', progress: 90, color: 'bg-orange-500' }
  ]

  const popularProducts = [
    { id: 1, name: 'Service Premium', sales: 28, revenue: 25197, stock: 15, trend: 'up' },
    { id: 2, name: 'Formation Pro', sales: 45, revenue: 31495, stock: 8, trend: 'up' },
    { id: 3, name: 'Consulting', sales: 67, revenue: 13393, stock: 20, trend: 'up' },
    { id: 4, name: 'Support Annuel', sales: 89, revenue: 6221, stock: 5, trend: 'up' }
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
      value: `€${(stats.revenue).toLocaleString()}`, 
      icon: DollarSign, 
      color: '#f59e0b',
      change: '+12.5%',
      trend: 'up'
    }
  ]

  const formatCurrency = (amount) => {
    return '€' + new Intl.NumberFormat('fr-FR').format(amount)
  }

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centre de Contrôle</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
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
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {card.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {card.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {card.trend === 'up' ? '+' : ''}{card.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${card.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Deuxième ligne : Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Évolution des clients */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Évolution des Clients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Croissance mensuelle de votre clientèle
              </p>
            </div>
            <div className="p-5">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clientData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="clients" 
                      stroke="#2563eb" 
                      fill="#2563eb" 
                      fillOpacity={0.1}
                      name="Total Clients"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newClients" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.1}
                      name="Nouveaux Clients"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Répartition par statut */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Répartition des Clients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Distribution par statut d'activité
              </p>
            </div>
            <div className="p-5">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}:</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Troisième ligne : Actions rapides et Revenus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Actions rapides */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Actions Rapides
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Accédez rapidement aux fonctionnalités principales
                </p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActionsMock.map((action) => (
                    <a
                      key={action.id}
                      href={action.link}
                      className="group"
                    >
                      <div className="bg-gray-50 hover:bg-gray-100 border rounded-xl p-4 text-center transition-all duration-200 group-hover:shadow-md">
                        <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                          {action.icon}
                        </div>
                        <div className="font-medium text-gray-900">{action.title}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Revenus vs Objectifs */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Revenus vs Objectifs
              </h2>
            </div>
            <div className="p-5">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenus Réels" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="target" 
                      name="Objectifs" 
                      fill="#f59e0b" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        
      </div>
      {/* Footer */}
      <footer className="mt-8 py-6 border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 Tableau de Bord Professionnel - Gestion Client Pro</p>
            <p className="mt-1">
              <span className="text-green-600">● Système en ligne</span> | 
              <span className="ml-2">Uptime: {systemStatus.uptime}</span> | 
              <span className="ml-2 text-blue-600">
                Dernière mise à jour: {time.toLocaleTimeString('fr-FR')}
              </span>
            </p>
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