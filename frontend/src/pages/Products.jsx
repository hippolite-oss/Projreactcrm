import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search } from 'lucide-react'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="page-loading">Chargement...</div>
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Produits / Services</h1>
          <p>Gestion de votre catalogue</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Nouveau produit
        </button>
      </div>
      <div className="table-container">
        <p style={{ padding: '24px', color: '#6b7280' }}>Liste des produits à venir...</p>
      </div>
    </div>
  )
}

export default Products

