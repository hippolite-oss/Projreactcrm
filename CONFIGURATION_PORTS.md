# 🔧 Configuration Centralisée des Ports

## 📁 Structure des Fichiers de Configuration

```
├── backend/
│   ├── .env                 # Configuration backend (ports, DB, etc.)
│   ├── .env.example         # Template de configuration
│   └── src/main.ts          # Utilise process.env.PORT
├── frontend/
│   ├── .env                 # Configuration frontend (ports, API URL)
│   ├── .env.example         # Template de configuration
│   ├── vite.config.js       # Utilise VITE_PORT
│   └── src/
│       ├── config/env.js    # Configuration centralisée
│       └── services/api.js  # Utilise VITE_API_URL
```

## ⚙️ Configuration Backend

### Fichier : `backend/.env`
```env
# Configuration des ports
PORT=3001
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin123
DB_DATABASE=crm

# Sécurité
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### Utilisation dans `backend/src/main.ts`
```typescript
const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

await app.listen(port);
console.log(`🚀 Backend API running on http://localhost:${port}`);
```

## ⚙️ Configuration Frontend

### Fichier : `frontend/.env`
```env
# Configuration des ports
VITE_PORT=5173
VITE_HOST=localhost

# Configuration API Backend
VITE_API_URL=http://localhost:3001
VITE_API_BASE_URL=http://localhost:3001

# Environnement
VITE_NODE_ENV=development
```

### Utilisation dans `frontend/vite.config.js`
```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      host: env.VITE_HOST || 'localhost',
    }
  }
})
```

### Utilisation dans `frontend/src/services/api.js`
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})
```

## 🔄 Changement de Ports

### Pour changer le port du Backend (ex: 4000)
1. Modifier `backend/.env` :
   ```env
   PORT=4000
   ```

2. Modifier `frontend/.env` :
   ```env
   VITE_API_URL=http://localhost:4000
   ```

### Pour changer le port du Frontend (ex: 3000)
1. Modifier `frontend/.env` :
   ```env
   VITE_PORT=3000
   ```

2. Modifier `backend/.env` :
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

## 🚀 Démarrage des Serveurs

### Backend
```bash
cd backend
npm run start:dev
# Affichera : 🚀 Backend API running on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm run dev
# Affichera : Local: http://localhost:5173/
```

## 📊 Logs de Configuration

### Backend
```
🚀 Backend API running on http://localhost:3001
📡 CORS configured for: http://localhost:5173
```

### Frontend
```
🔧 API Configuration: {
  baseURL: "http://localhost:3001",
  mode: "development",
  dev: true
}

🔧 Configuration Environment: {
  Frontend URL: "http://localhost:5173",
  Backend URL: "http://localhost:3001",
  API URL: "http://localhost:3001",
  Mode: "development"
}
```

## 🔒 Sécurité

- Les fichiers `.env` sont dans `.gitignore`
- Les fichiers `.env.example` servent de templates
- Les variables sensibles (JWT_SECRET, DB_PASSWORD) ne sont jamais commitées

## 🎯 Avantages de cette Configuration

✅ **Centralisée** : Tous les ports dans des fichiers `.env`
✅ **Flexible** : Changement facile des ports
✅ **Professionnelle** : Structure standard
✅ **Cohérente** : Synchronisation automatique frontend ↔ backend
✅ **Documentée** : Templates et guides inclus
✅ **Sécurisée** : Variables sensibles protégées

## 🔧 Variables d'Environnement Disponibles

### Backend
- `PORT` : Port du serveur backend
- `CORS_ORIGIN` : URL autorisée pour CORS
- `FRONTEND_URL` : URL du frontend
- `DB_*` : Configuration base de données
- `JWT_SECRET` : Clé secrète JWT

### Frontend
- `VITE_PORT` : Port du serveur de développement
- `VITE_HOST` : Host du serveur
- `VITE_API_URL` : URL de l'API backend
- `VITE_NODE_ENV` : Environnement de développement

Cette configuration élimine toute confusion sur les ports et permet une gestion professionnelle de l'environnement de développement.