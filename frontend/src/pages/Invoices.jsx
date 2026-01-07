import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import './Invoices.css'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices')
      setInvoices(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="page-loading">Chargement...</div>
  }

  return (
    <div className="invoices-page">
      <div className="page-header">
        <div>
          <h1>Factures</h1>
          <p>Gestion des factures et paiements</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Nouvelle facture
        </button>
      </div>
      <div className="table-container">
        <p style={{ padding: '24px', color: '#6b7280' }}>Liste des factures à venir...</p>
      </div>
    </div>
  )
}

export default Invoices

