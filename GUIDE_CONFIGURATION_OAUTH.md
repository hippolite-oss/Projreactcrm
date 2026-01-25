# Guide de Configuration OAuth (Google & GitHub)

## 🎯 Objectif
Ce guide vous explique comment configurer l'authentification OAuth avec Google et GitHub pour votre application CRM.

## ✅ État Actuel
- ✅ Backend OAuth implémenté (Google + GitHub)
- ✅ Frontend OAuth intégré
- ✅ Page de callback créée
- ✅ Gestion des erreurs OAuth
- ⚠️ Configuration des clés OAuth requise

## 🔧 Configuration Requise

### 1. Configuration Google OAuth

#### Étape 1 : Créer un projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ ou Google Identity

#### Étape 2 : Configurer OAuth 2.0
1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choisissez "Web application"
4. Configurez les URLs autorisées :
   - **Authorized JavaScript origins** : `http://localhost:3001`
   - **Authorized redirect URIs** : `http://localhost:3001/api/auth/google/callback`

#### Étape 3 : Récupérer les clés
- Copiez le **Client ID** et **Client Secret**

### 2. Configuration GitHub OAuth

#### Étape 1 : Créer une OAuth App
1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Cliquez sur "New OAuth App"
3. Remplissez les informations :
   - **Application name** : CRM DIGIDEV
   - **Homepage URL** : `http://localhost:5173`
   - **Authorization callback URL** : `http://localhost:3001/api/auth/github/callback`

#### Étape 2 : Récupérer les clés
- Copiez le **Client ID** et générez un **Client Secret**

### 3. Configuration du fichier .env

Mettez à jour votre fichier `backend/.env` avec vos clés :

```env
# Configuration OAuth
# Google OAuth
GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=votre-github-client-id
GITHUB_CLIENT_SECRET=votre-github-client-secret
```

## 🚀 Test de l'Authentification OAuth

### 1. Démarrer l'application
```bash
# Backend
cd backend
npm run start:dev

# Frontend (nouveau terminal)
cd frontend
npm run dev
```

### 2. Tester la connexion
1. Allez sur `http://localhost:5173/login`
2. Cliquez sur "Google" ou "GitHub"
3. Autorisez l'application
4. Vous devriez être redirigé vers le dashboard

## 🔍 Fonctionnalités Implémentées

### Backend
- ✅ Stratégies OAuth (Google + GitHub)
- ✅ Guards d'authentification
- ✅ Endpoints OAuth (`/api/auth/google`, `/api/auth/github`)
- ✅ Callbacks OAuth avec redirection
- ✅ Gestion des utilisateurs OAuth
- ✅ Liaison comptes locaux/OAuth

### Frontend
- ✅ Boutons OAuth sur la page de connexion
- ✅ Gestion des redirections OAuth
- ✅ Page de callback OAuth
- ✅ Gestion des erreurs OAuth
- ✅ Stockage des tokens OAuth

### Base de Données
- ✅ Champs OAuth dans l'entité User :
  - `provider` (local, google, github)
  - `providerId` (ID du provider)
  - `avatar` (URL de l'avatar)
  - `emailVerified` (vérification email)

## 🛠️ Dépannage

### Erreur "Client ID invalide"
- Vérifiez que les URLs autorisées sont correctes
- Assurez-vous que les clés sont bien copiées dans le .env

### Erreur "Callback URL non autorisée"
- Vérifiez les URLs de callback dans les configurations OAuth
- Backend : `http://localhost:3001/api/auth/[provider]/callback`

### Erreur "Email non disponible"
- Pour GitHub, assurez-vous que votre email est public
- Ou configurez l'application pour demander l'accès aux emails privés

## 📝 Notes Importantes

1. **Sécurité** : Ne commitez jamais vos clés OAuth dans Git
2. **Production** : Changez les URLs pour votre domaine de production
3. **HTTPS** : En production, utilisez HTTPS pour OAuth
4. **Scopes** : Les scopes demandés sont minimaux (email + profil)

## 🎉 Prochaines Étapes

Une fois OAuth configuré, vous pourrez :
- Vous connecter avec Google ou GitHub
- Voir les informations utilisateur dans la sidebar
- Gérer les comptes liés (local + OAuth)
- Utiliser les avatars des providers OAuth

---

**Besoin d'aide ?** Vérifiez les logs du backend pour les erreurs détaillées.