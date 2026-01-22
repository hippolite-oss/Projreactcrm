import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      host: env.VITE_HOST || 'localhost',
      open: true, // Ouvre automatiquement le navigateur
    },
    // Définir les variables d'environnement pour l'application
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  }
})