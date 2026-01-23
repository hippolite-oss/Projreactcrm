# Guide de l'Interface Administrateur - Gestion des Commandes

## 🎯 Vue d'ensemble

L'interface administrateur permet de gérer efficacement toutes les commandes en ligne avec un système complet de traitement, notifications par email et suivi des statuts.

## 📋 Fonctionnalités Principales

### 1. **Tableau de Bord des Commandes**
- **Localisation** : `/dashboard/commandes-online`
- **Accès** : Authentification requise (admin@test.com / admin123)
- **Affichage** : Liste paginée avec filtres et recherche

### 2. **Statuts des Commandes**
- 🟠 **Nouveau** : Commande fraîchement reçue
- 🔵 **Lu** : Commande consultée par l'admin
- 🟣 **En cours** : Commande en cours de traitement
- 🟢 **Traité** : Commande finalisée avec confirmation
- 🔴 **Annulé** : Commande annulée avec raison

### 3. **Actions Disponibles**

#### 👁️ **Voir les Détails**
- Affiche toutes les informations de la commande
- Historique des emails envoyés
- Notes administrateur et client
- Dates de création et traitement

#### ✅ **Marquer comme Lu**
- Disponible pour les commandes "Nouveau"
- Change le statut vers "Lu"
- Enregistre l'administrateur responsable

#### ⚙️ **Traiter la Commande**
- Disponible pour les statuts "Nouveau" et "Lu"
- **Fonctionnalités** :
  - Ajout de notes administrateur
  - Envoi automatique d'email de confirmation
  - Changement de statut vers "Traité"
  - Enregistrement de la date de traitement

#### ❌ **Annuler la Commande**
- Disponible pour toutes les commandes non annulées
- **Fonctionnalités** :
  - Sélection de raison prédéfinie ou personnalisée
  - Envoi automatique d'email d'annulation
  - Changement de statut vers "Annulé"
  - Enregistrement de la date d'annulation

#### 📧 **Renvoyer Email**
- Disponible pour les commandes traitées avec email
- Indicateurs visuels :
  - ✅ Vert : Email déjà envoyé
  - ⚠️ Orange : Email non envoyé

## 🔧 Configuration Technique

### Backend (NestJS)
```typescript
// Endpoints principaux
GET    /api/commande-online          // Liste avec filtres
GET    /api/commande-online/stats    // Statistiques
PUT    /api/commande-online/:id/mark-as-read     // Marquer lu
PUT    /api/commande-online/:id/traiter          // Traiter
PUT    /api/commande-online/:id/annuler          // Annuler
PUT    /api/commande-online/:id/renvoyer-email   // Renvoyer email
```

### Frontend (React)
```javascript
// Composants principaux
- CommandesOnline.jsx           // Page principale
- ModalTraitementCommande.jsx   // Modal de traitement
- ModalAnnulationCommande.jsx   // Modal d'annulation
```

## 📧 Système d'Emails

### 1. **Email de Réception**
- **Déclencheur** : Création automatique d'une commande
- **Template** : `confirmation-reception.hbs`
- **Contenu** : Confirmation de réception de la demande

### 2. **Email de Traitement**
- **Déclencheur** : Action "Traiter la commande"
- **Template** : `confirmation-traitement.hbs`
- **Contenu** : Confirmation du traitement + notes admin

### 3. **Email d'Annulation**
- **Déclencheur** : Action "Annuler la commande"
- **Template** : `notification-annulation.hbs`
- **Contenu** : Notification d'annulation + raison

### Configuration Gmail
```env
# Backend .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
EMAIL_FROM=votre-email@gmail.com
```

## 🎨 Interface Utilisateur

### Filtres et Recherche
- **Recherche** : Nom, téléphone, email, ville
- **Filtre par statut** : Tous, Nouveau, Lu, En cours, Traité, Annulé
- **Pagination** : 15 commandes par page
- **Tri** : Par date de création (plus récent en premier)

### Indicateurs Visuels
- **Badges de statut** : Couleurs distinctives pour chaque statut
- **Icônes d'actions** : Boutons intuitifs avec tooltips
- **Indicateurs d'email** : État d'envoi des notifications
- **Animations** : Transitions fluides avec Framer Motion

## 🧪 Tests et Validation

### Script de Test Automatique
```javascript
// Utilisation du script de test
import { lancerTestsAdmin } from './src/utils/testInterfaceAdmin.js';
lancerTestsAdmin();
```

### Tests Manuels Recommandés
1. **Création de commande** (depuis la page Home)
2. **Vérification de réception** dans l'interface admin
3. **Test de marquage comme lu**
4. **Test de traitement avec email**
5. **Test d'annulation avec raison**
6. **Vérification des notifications dans Topbar**

## 🔄 Workflow Complet

### Scénario Type
1. **Client** : Soumet une commande via la page Home
2. **Système** : Envoie automatiquement un email de réception
3. **Admin** : Reçoit notification dans Topbar (badge rouge)
4. **Admin** : Consulte la commande (statut → "Lu")
5. **Admin** : Traite la commande avec notes
6. **Système** : Envoie email de confirmation au client
7. **Admin** : Peut renvoyer l'email si nécessaire

### Gestion des Erreurs
- **Email indisponible** : Interface s'adapte automatiquement
- **Erreurs réseau** : Messages d'erreur explicites
- **Validation** : Contrôles côté client et serveur
- **Logs** : Traçabilité complète des actions

## 📊 Statistiques et Monitoring

### Données Disponibles
- Nombre total de commandes
- Répartition par statut
- Nombre d'emails envoyés
- Taux de traitement

### Notifications Temps Réel
- Badge dans Topbar avec nombre de nouvelles commandes
- Mise à jour automatique toutes les 30 secondes
- Synchronisation après chaque action

## 🚀 Déploiement et Maintenance

### Prérequis
- Backend NestJS fonctionnel sur port 3001
- Frontend React sur port 5174
- Configuration Gmail avec mot de passe d'application
- Base de données PostgreSQL configurée

### Commandes de Démarrage
```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

### Surveillance
- Logs backend pour traçabilité des emails
- Console navigateur pour erreurs frontend
- Monitoring des performances API

## 🔐 Sécurité

### Authentification
- JWT tokens pour toutes les actions admin
- Middleware de protection sur les endpoints sensibles
- Validation des permissions utilisateur

### Données Sensibles
- Chiffrement des mots de passe
- Protection des données client
- Logs sécurisés sans informations sensibles

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs backend et frontend
2. Testez la configuration email
3. Validez l'authentification
4. Utilisez le script de test automatique

**Interface admin complètement fonctionnelle et prête pour la production !** 🎉