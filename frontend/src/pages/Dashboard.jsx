import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users, Package, FileText, Receipt, TrendingUp, DollarSign } from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    products: 0,
    quotes: 0,
    invoices: 0,
    revenue: 0,
    growth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats')
      const data = response.data || {}
      setStats({
        clients: data.clients ?? 0,
        products: data.products ?? 0,
        quotes: data.quotes ?? 0,
        invoices: data.invoices ?? 0,
        revenue: data.revenue ?? 0,
        growth: data.growth ?? 0
      })
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Clients', value: stats.clients ?? 0, icon: Users, color: '#2563eb' },
    { label: 'Produits', value: stats.products ?? 0, icon: Package, color: '#10b981' },
    { label: 'Devis', value: stats.quotes ?? 0, icon: FileText, color: '#f59e0b' },
    { label: 'Factures', value: stats.invoices ?? 0, icon: Receipt, color: '#ef4444' },
    { 
      label: 'Revenus', 
      value: `€${(stats.revenue ?? 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: '#8b5cf6' 
    },
    { 
      label: 'Croissance', 
      value: `${stats.growth ?? 0}%`, 
      icon: TrendingUp, 
      color: '#06b6d4' 
    }
  ]

  if (loading) {
    return <div className="dashboard-loading">Chargement...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de votre activité</p>
      </div>
      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
