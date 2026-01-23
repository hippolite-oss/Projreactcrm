# Guide de Configuration EmailJS

## 🎯 Objectif
Configurer EmailJS pour envoyer des emails de confirmation de réception des commandes directement depuis le frontend.

## 📋 Étapes de Configuration

### 1. Créer un compte EmailJS
1. Allez sur https://www.emailjs.com/
2. Créez un compte gratuit
3. Confirmez votre email

### 2. Configurer un Service Email
1. Dans le dashboard EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez **"Gmail"** (recommandé)
4. Suivez les instructions pour connecter votre compte Gmail
5. Notez le **SERVICE_ID** généré (ex: `service_gmail`)

### 3. Créer un Template Email
1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Configurez le template avec :

#### **Sujet :**
```
{{subject}}
```

#### **Corps du message :**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de Commande</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c5aa0;">✅ Confirmation de Réception</h2>
        
        <p>Bonjour <strong>{{to_name}}</strong>,</p>
        
        <p>Nous avons bien reçu votre commande et nous vous remercions de votre confiance.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Détails de votre commande :</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Nom :</strong> {{client_nom}}</li>
                <li><strong>Téléphone :</strong> {{client_telephone}}</li>
                <li><strong>Ville :</strong> {{client_ville}}</li>
                <li><strong>Adresse :</strong> {{client_adresse}}</li>
                <li><strong>Commande :</strong> {{commande_details}}</li>
                <li><strong>Notes :</strong> {{commande_notes}}</li>
                <li><strong>Date :</strong> {{date_commande}}</li>
            </ul>
        </div>
        
        <p>Nous traiterons votre demande dans les plus brefs délais et vous recontacterons pour confirmer les détails.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0;">Cordialement,<br>
            <strong>L'équipe {{from_name}}</strong></p>
        </div>
    </div>
</body>
</html>
```

4. **Sauvegardez** et notez le **TEMPLATE_ID** (ex: `template_commande`)

### 4. Récupérer la Clé Publique
1. Allez dans **"Account"** → **"General"**
2. Copiez votre **Public Key** (ex: `user_abc123def456`)

### 5. Configurer l'Application
Modifiez le fichier `frontend/src/services/emailService.js` :

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_gmail',        // Remplacez par votre SERVICE_ID
  TEMPLATE_ID: 'template_shelu2v',   // Remplacez par votre TEMPLATE_ID
  PUBLIC_KEY: 'user_abc123def456'     // Remplacez par votre PUBLIC_KEY
};
```

## 🧪 Test de Configuration

### Test depuis la Console
```javascript
// Dans la console du navigateur (F12)
import emailService from './src/services/emailService.js';
emailService.testerConfiguration();
```

### Test depuis l'Interface
1. Connectez-vous à l'interface admin
2. Allez dans "Commandes en ligne"
3. Cliquez sur le bouton 📧 d'une commande avec email
4. Vérifiez que l'email arrive dans la boîte de réception

## 🔧 Dépannage

### Erreur "Invalid template ID"
- Vérifiez que le TEMPLATE_ID correspond exactement à celui dans EmailJS
- Assurez-vous que le template est publié (pas en brouillon)

### Erreur "Invalid service ID"
- Vérifiez que le SERVICE_ID est correct
- Assurez-vous que le service Gmail est bien configuré

### Erreur "Invalid public key"
- Vérifiez que la PUBLIC_KEY est correcte
- Assurez-vous qu'elle commence par "user_"

### Emails non reçus
- Vérifiez les spams/courriers indésirables
- Testez avec une autre adresse email
- Vérifiez les quotas EmailJS (100 emails/mois gratuit)

## 📊 Limites du Plan Gratuit
- **100 emails/mois**
- **2 services email**
- **3