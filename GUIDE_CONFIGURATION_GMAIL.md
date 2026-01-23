# 📧 Guide Complet : Configuration Gmail pour Emails CRM

## 🎯 Objectif
Configurer votre compte Gmail pour envoyer des emails automatiques depuis votre CRM de manière sécurisée.

## 📋 Prérequis
- Un compte Gmail actif
- Accès aux paramètres de sécurité Google

## 🔐 Étape 1 : Activer l'Authentification à 2 Facteurs

### 1.1 Accéder aux Paramètres de Sécurité
1. **Ouvrez votre navigateur** et allez sur : https://myaccount.google.com/
2. **Connectez-vous** avec votre compte Gmail
3. Dans le menu de gauche, cliquez sur **"Sécurité"**

### 1.2 Activer la Validation en 2 Étapes
1. Cherchez la section **"Connexion à Google"**
2. Cliquez sur **"Validation en 2 étapes"**
3. Cliquez sur **"Commencer"**
4. **Suivez les instructions** :
   - Confirmez votre mot de passe
   - Ajoutez votre numéro de téléphone
   - Choisissez SMS ou appel vocal
   - Entrez le code reçu
   - Cliquez sur **"Activer"**

### 1.3 Vérification
✅ Vous devriez voir : **"Validation en 2 étapes : Activée"**

## 🔑 Étape 2 : Créer un Mot de Passe d'Application

### 2.1 Accéder aux Mots de Passe d'Application
1. **Restez dans "Sécurité"** → **"Validation en 2 étapes"**
2. Faites défiler vers le bas
3. Cliquez sur **"Mots de passe des applications"**
4. **Confirmez votre mot de passe** si demandé

### 2.2 Générer le Mot de Passe
1. Dans **"Sélectionner l'application"** → Choisissez **"Autre (nom personnalisé)"**
2. **Tapez** : `CRM System` ou `Mon CRM`
3. Cliquez sur **"Générer"**

### 2.3 Copier le Mot de Passe
1. **Google affiche un mot de passe** de 16 caractères (ex: `abcd efgh ijkl mnop`)
2. **COPIEZ-LE IMMÉDIATEMENT** (vous ne pourrez plus le voir)
3. **Notez-le** dans un endroit sûr
4. Cliquez sur **"Terminé"**

## ⚙️ Étape 3 : Configuration du CRM

### 3.1 Modifier le Fichier .env
Ouvrez le fichier `backend/.env` et modifiez ces lignes :

```env
# Configuration Email Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=votre-email@gmail.com
EMAIL_FROM_NAME=Votre Nom ou Entreprise
```

### 3.2 Remplacer les Valeurs
- **SMTP_USER** : Votre adresse Gmail complète
- **SMTP_PASS** : Le mot de passe d'application (16 caractères)
- **EMAIL_FROM** : Votre adresse Gmail (même que SMTP_USER)
- **EMAIL_FROM_NAME** : Le nom qui apparaîtra comme expéditeur

### 3.3 Exemple Concret
```env
# Configuration Email Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=moncrm@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=moncrm@gmail.com
EMAIL_FROM_NAME=Mon CRM System
```

## 🧪 Étape 4 : Tester la Configuration

### 4.1 Redémarrer le Backend
```bash
# Arrêter le backend (Ctrl+C)
# Puis redémarrer
cd backend
npm run start:dev
```

### 4.2 Tester via API
```bash
# 1. Se connecter pour obtenir un token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}'

# 2. Tester la configuration email (remplacez YOUR_TOKEN)
curl -X GET http://localhost:3001/api/email/test-config \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Envoyer un email de test (remplacez YOUR_TOKEN et EMAIL)
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"destinataire": "votre-email@gmail.com"}'
```

### 4.3 Vérifier les Logs
Dans la console du backend, vous devriez voir :
```
✅ Configuration email vérifiée avec succès
📧 Envoi email de test à votre-email@gmail.com
✅ Email de test envoyé avec succès
```

## ❌ Résolution des Problèmes Courants

### Problème 1 : "Invalid login"
**Cause** : Mot de passe d'application incorrect
**Solution** :
1. Vérifiez que vous avez copié le bon mot de passe (16 caractères)
2. Régénérez un nouveau mot de passe d'application
3. Vérifiez qu'il n'y a pas d'espaces dans le .env

### Problème 2 : "Authentication failed"
**Cause** : Authentification 2 facteurs pas activée
**Solution** :
1. Vérifiez que la validation en 2 étapes est bien activée
2. Attendez quelques minutes après l'activation
3. Essayez de régénérer le mot de passe d'application

### Problème 3 : "Connection timeout"
**Cause** : Problème de réseau ou port bloqué
**Solution** :
1. Vérifiez votre connexion internet
2. Essayez avec `SMTP_PORT=465` et `SMTP_SECURE=true`
3. Vérifiez que votre firewall n'bloque pas le port 587

### Problème 4 : "App password not available"
**Cause** : Compte Google Workspace ou restrictions
**Solution** :
1. Utilisez un compte Gmail personnel (pas professionnel)
2. Vérifiez que votre compte n'a pas de restrictions administrateur

## 🔒 Sécurité et Bonnes Pratiques

### ✅ À Faire
- ✅ Utilisez toujours des mots de passe d'application
- ✅ Gardez le mot de passe secret et sécurisé
- ✅ Régénérez le mot de passe si compromis
- ✅ Utilisez un nom descriptif pour l'application

### ❌ À Éviter
- ❌ Ne jamais utiliser votre mot de passe Gmail principal
- ❌ Ne pas partager le mot de passe d'application
- ❌ Ne pas stocker le mot de passe en clair dans le code
- ❌ Ne pas utiliser la même configuration en production

## 📧 Types d'Emails Envoyés

Une fois configuré, votre CRM enverra automatiquement :

1. **Email de Réception** 📨
   - Envoyé dès qu'un client passe commande
   - Confirme la réception de la demande

2. **Email de Traitement** ✅
   - Envoyé quand l'admin traite la commande
   - Inclut les notes de traitement

3. **Email d'Annulation** ❌
   - Envoyé si la commande est annulée
   - Inclut la raison d'annulation

## 🎯 Résultat Attendu

Après configuration réussie :
- ✅ Les clients recevront des emails automatiques
- ✅ Les emails auront un design professionnel
- ✅ Traçabilité complète des envois
- ✅ Logs détaillés pour monitoring

## 📞 Support

Si vous rencontrez des difficultés :
1. Vérifiez chaque étape de ce guide
2. Consultez les logs du backend
3. Testez avec un autre compte Gmail si nécessaire
4. Utilisez les endpoints de test pour diagnostiquer

**Configuration terminée avec succès ?** Passons à l'étape 3 : Interface admin améliorée ! 🚀