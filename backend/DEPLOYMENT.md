# Guide de Déploiement sur Render

## Prérequis
- Compte Render.com
- Base de données PostgreSQL créée sur Render
- Code source sur GitHub

## Étapes de déploiement

### 1. Configuration de la base de données
Votre base de données est déjà configurée avec l'URL :
```
DATABASE_URL=postgresql://firstbackend_47rd_user:nYx2o4lwU2B3yKWzeWGIonBD0n5d6rN9@dpg-d60hkavgi27c73c9na5g-a.oregon-postgres.render.com/firstbackend_47rd
```

### 2. Créer un nouveau Web Service sur Render

1. Connectez-vous à [Render.com](https://render.com)
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub
4. Sélectionnez le dossier `backend`

### 3. Configuration du service

**Build & Deploy:**
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

**Environment Variables à ajouter:**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://firstbackend_47rd_user:nYx2o4lwU2B3yKWzeWGIonBD0n5d6rN9@dpg-d60hkavgi27c73c9na5g-a.oregon-postgres.render.com/firstbackend_47rd
JWT_SECRET=votre-secret-jwt-super-securise
CORS_ORIGIN=https://votre-frontend-url.vercel.app
FRONTEND_URL=https://votre-frontend-url.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=hippoliteagbodamakou@gmail.com
SMTP_PASS=mbzu elda pplk ejsm
EMAIL_FROM=hippoliteagbodamakou@gmail.com
EMAIL_FROM_NAME=CRM System
```

### 4. Variables d'environnement importantes

- **NODE_ENV:** `production`
- **PORT:** `10000` (port par défaut de Render)
- **DATABASE_URL:** Votre URL de base de données PostgreSQL
- **JWT_SECRET:** Générez une clé secrète forte
- **CORS_ORIGIN:** URL de votre frontend déployé

### 5. Après le déploiement

1. Vérifiez les logs de déploiement
2. Testez l'endpoint de santé : `https://votre-app.onrender.com/api`
3. Vérifiez que l'admin est créé automatiquement

### 6. Synchronisation de la base de données

Si vous avez des migrations à exécuter :
```bash
# Depuis votre machine locale, connectez-vous à la DB de production
npm run migration:run
```

## URLs importantes

- **Backend déployé:** `https://votre-app.onrender.com`
- **API Base URL:** `https://votre-app.onrender.com/api`
- **Admin par défaut:** `admin@test.com` / `admin123`

## Dépannage

### Erreurs communes :
1. **Port binding error:** Vérifiez que PORT=10000
2. **Database connection:** Vérifiez DATABASE_URL
3. **CORS errors:** Vérifiez CORS_ORIGIN

### Logs :
```bash
# Voir les logs en temps réel sur Render Dashboard
# Ou via CLI si installé
render logs -s votre-service-id
```