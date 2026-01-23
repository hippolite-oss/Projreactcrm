import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'  // <--- ici

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 AuthContext: Initialisation...');
    const token = localStorage.getItem('token')
    console.log('🔑 Token trouvé:', token ? 'Oui' : 'Non');
    
    if (token) {
      // Vérifier si le token semble valide (format JWT basique)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('❌ Token malformé, suppression...');
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('📡 Vérification du token avec /api/auth/me...');

      api.get('/api/auth/me')
        .then(res => {
          console.log('✅ Token valide, utilisateur:', res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.log('❌ Token invalide:', err.response?.status, err.response?.data);
          console.log('🧹 Nettoyage du localStorage...');
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete api.defaults.headers.common['Authorization']
          setUser(null);
        })
        .finally(() => {
          console.log('🏁 Chargement terminé');
          setLoading(false);
        })
    } else {
      console.log('🏁 Pas de token, chargement terminé');
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Erreur de connexion',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
