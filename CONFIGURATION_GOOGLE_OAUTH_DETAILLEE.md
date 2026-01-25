# Configuration Google OAuth - Guide Détaillé

## 🎯 Résolution de l'erreur "OAuth client was not found"

Cette erreur indique que les clés Google OAuth ne sont pas configurées. Suivez ce guide étape par étape.

## 📋 Étapes de Configuration

### 1. Accéder à Google Cloud Console
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google (`hippoliteagbodamakou@gmail.com`)

### 2. Créer ou Sélectionner un Projet
1. Cliquez sur le sélecteur de projet en haut
2. Cliquez sur "NEW PROJECT" (Nouveau Projet)
3. Nom du projet : `CRM-DIGIDEV`
4. Cliquez sur "CREATE" (Créer)

### 3. Activer l'API Google Identity
1. Dans le menu de gauche, allez à "APIs & Services" > "Library"
2. Recherchez "Google Identity"
3. Cliquez sur "Google Identity Services API"
4. Cliquez sur "ENABLE" (Activer)

### 4. Configurer l'Écran de Consentement OAuth
1. Allez à "APIs & Services" > "OAuth consent screen"
2. Choisissez "External" (Externe)
3. Remplissez les informations requises :
   - **App name** : `CRM DIGIDEV`
   - **User support email** : `hippoliteagbodamakou@gmail.com`
   - **Developer contact information** : `hippoliteagbodamakou@gmail.com`
4. Cliquez sur "SAVE AND CONTINUE"
5. Dans "Scopes", cliquez sur "SAVE AND CONTINUE" (pas besoin d'ajouter de scopes)
6. Dans "Test users", ajoutez votre email : `hippoliteagbodamakou@gmail.com`
7. Cliquez sur "SAVE AND CONTINUE"

### 5. Créer les Identifiants OAuth 2.0
1. Allez à "APIs & Services" > "Credentials"
2. Cliquez sur "CREATE CREDENTIALS" > "OAuth 2.0 Client IDs"
3. Type d'application : "Web application"
4. Nom : `CRM DIGIDEV Web Client`
5. **Origines JavaScript autorisées** :
   ```
   http://localhost:3001
   http://localhost:5174
   ```
6. **URI de redirection autorisés** :
   ```
   http://localhost:3001/api/auth/google/callback
   ```
7. Cliquez sur "CREATE"

### 6. Récupérer les Clés
1. Une popup s'affiche avec vos clés
2. Copiez le **Client ID** (commence par quelque chose comme `123456789-abc...googleusercontent.com`)
3. Copiez le **Client Secret** (chaîne aléatoire)

### 7. Configurer le Backend
Mettez à jour votre fichier `backend/.env` :

```env
# Configuration OAuth Google
GOOGLE_CLIENT_ID=VOTRE_CLIENT_ID_ICI
GOOGLE_CLIENT_SECRET=VOTRE_CLIENT_SECRET_ICI
```

## ⚠️ Points Importants

1. **Mode Test** : Votre app est en mode "Testing", seuls les utilisateurs test peuvent se connecter
2. **Domaines** : Assurez-vous que les URLs correspondent exactement
3. **Redémarrage** : Redémarrez le backend après avoir modifié le .env

## 🧪 Test de Configuration

Après configuration :
1. Redémarrez le backend : `npm run start:dev`
2. Allez sur `http://localhost:5174/login`
3. Cliquez sur "Google"
4. Vous devriez voir l'écran de consentement Google

## 🔍 Vérification des URLs

Vérifiez que ces URLs sont bien configurées dans Google Cloud :

**Origines JavaScript autorisées :**
- `http://localhost:3001`
- `http://localhost:5174`

**URI de redirection autorisés :**
- `http://localhost:3001/api/auth/google/callback`

## 📞 Support

Si vous avez des difficultés :
1. Vérifiez que le projet Google Cloud est bien sélectionné
2. Assurez-vous que l'API Google Identity est activée
3. Vérifiez que votre email est dans les utilisateurs test
4. Redémarrez le backend après modification du .env