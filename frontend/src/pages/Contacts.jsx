import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search } from 'lucide-react'
import './Contacts.css'

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contacts')
      setContacts(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="page-loading">Chargement...</div>
  }

  return (
    <div className="contacts-page">
      <div className="page-header">
        <div>
          <h1>Contacts</h1>
          <p>Gestion de vos contacts</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Nouveau contact
        </button>
      </div>
      <div className="page-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="table-container">
        <p style={{ padding: '24px', color: '#6b7280' }}>Liste des contacts à venir...</p>
      </div>
    </div>
  )
}

export default Contacts

