# Guide de Test - Emails Prospects

## 🎯 Objectif
Vérifier que les emails aux prospects sont bien envoyés avec la même configuration SMTP que les commandes.

## ✅ Prérequis
- Backend démarré sur le port 3001
- Frontend démarré sur le port 5173
- Connexion admin avec `admin@test.com` / `admin123`
- Configuration SMTP Gmail fonctionnelle (déjà testée avec les commandes)

## 🧪 Procédure de Test

### Étape 1: Créer un prospect depuis la page Home
1. Ouvrez `http://localhost:5173` (page d'accueil)
2. Remplissez le formulaire de contact :
   - **Nom**: Test Prospect
   - **Email**: votre-email@gmail.com (utilisez votre vraie adresse)
   - **Entreprise**: Test Company
   - **Téléphone**: 0123456789
   - **Message**: Test d'envoi d'email prospect
3. Cliquez sur "Envoyer"
4. Vérifiez le message de succès

### Étape 2: Accéder à l'interface admin
1. Connectez-vous avec `admin@test.com` / `admin123`
2. Allez dans le menu "Prospects" (sidebar)
3. Vous devriez voir le prospect créé à l'étape 1

### Étape 3: Envoyer un email au prospect
1. Dans la liste des prospects, trouvez le prospect de test
2. Cliquez sur l'icône email (✉️) dans la colonne Actions
3. Confirmez l'envoi dans la popup
4. Vérifiez le message "Email envoyé avec succès !"

### Étape 4: Vérifier la réception
1. Consultez votre boîte email (celle utilisée à l'étape 1)
2. Cherchez un email avec le sujet : "🎯 Merci pour votre intérêt - Démonstration CRM"
3. L'email devrait contenir :
   - Vos informations de prospect
   - Un message de bienvenue
   - Les détails de votre demande

## 🔧 Configuration Technique

### Backend (déjà configuré)
- **Service**: `ProspectsService.sendEmail()`
- **Template**: Réutilise le template de confirmation des commandes
- **SMTP**: Même configuration Gmail que les commandes

### Frontend (déjà configuré)
- **Page**: `Prospects.jsx`
- **Action**: Bouton email dans la liste
- **API**: `POST /api/prospects/{id}/email`

## 🐛 Dépannage

### Si l'email n'arrive pas :
1. **Vérifiez les logs backend** :
   ```bash
   # Dans le terminal backend
   # Cherchez les messages avec 📧 et ✅/❌
   ```

2. **Vérifiez la configuration SMTP** :
   - Les emails de commandes fonctionnent-ils toujours ?
   - Le fichier `backend/.env` contient-il les bonnes informations Gmail ?

3. **Vérifiez les spams** :
   - L'email peut arriver dans les spams
   - Ajoutez `hippoliteagbodamakou@gmail.com` à vos contacts

### Si le message "succès" apparaît mais pas d'email :
- C'est exactement le problème qu'on vient de corriger
- Le backend utilisait une simulation au lieu du vrai service SMTP
- Maintenant il utilise la même configuration que les commandes

## 📊 Différences avec les Commandes

| Aspect | Commandes | Prospects |
|--------|-----------|-----------|
| **Service SMTP** | ✅ EmailService | ✅ EmailService (même) |
| **Template** | confirmation-reception.hbs | confirmation-reception.hbs (réutilisé) |
| **Configuration** | Gmail SMTP | Gmail SMTP (même) |
| **Contenu** | Détails commande | Détails prospect + message bienvenue |

## ✅ Résultat Attendu
- Email reçu dans les 30 secondes
- Contenu personnalisé avec les informations du prospect
- Même qualité et fiabilité que les emails de commandes
- Statut "Email envoyé" mis à jour dans l'interface admin

## 🎉 Confirmation
Si vous recevez l'email, le système fonctionne parfaitement ! 
Les prospects utilisent maintenant la même configuration EmailJS/SMTP que les commandes.