import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})

// Intercepteur pour ajouter automatiquement le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Log de la configuration pour debug
console.log('🔧 API Configuration:', {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV
})

export default api
