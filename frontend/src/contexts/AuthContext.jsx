import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'  // <--- ici

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
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
