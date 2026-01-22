// Configuration centralisée des variables d'environnement

export const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  // Server Configuration
  PORT: import.meta.env.VITE_PORT || 5173,
  HOST: import.meta.env.VITE_HOST || 'localhost',
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  
  // URLs complètes
  FRONTEND_URL: `http://${import.meta.env.VITE_HOST || 'localhost'}:${import.meta.env.VITE_PORT || 5173}`,
  BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
}

// Log de la configuration en mode développement
if (config.IS_DEV) {
  console.log('🔧 Configuration Environment:', {
    'Frontend URL': config.FRONTEND_URL,
    'Backend URL': config.BACKEND_URL,
    'API URL': config.API_URL,
    'Mode': config.MODE,
    'Environment': config.NODE_ENV
  })
}

export default config