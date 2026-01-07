import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import './Quotes.css'

function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('/api/quotes')
      setQuotes(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des devis:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="page-loading">Chargement...</div>
  }

  return (
    <div className="quotes-page">
      <div className="page-header">
        <div>
          <h1>Devis</h1>
          <p>Création et suivi des devis</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Nouveau devis
        </button>
      </div>
      <div className="table-container">
        <p style={{ padding: '24px', color: '#6b7280' }}>Liste des devis à venir...</p>
      </div>
    </div>
  )
}

export default Quotes

