# Tasks : Gestion des Prospects depuis la Page Home

## 📋 Vue d'ensemble des Tâches

Ce document détaille toutes les tâches nécessaires pour implémenter le système de gestion des prospects depuis la page Home.

## 🏗️ Phase 1 : Backend - Entité et Services (3-4h)

### 1. Création de l'Entité Prospect
- [ ] 1.1 Créer l'entité Prospect avec tous les champs requis
  - [ ] 1.1.1 Définir les colonnes (nom, entreprise, email, téléphone, message, statut, etc.)
  - [ ] 1.1.2 Ajouter les index pour performance (email unique, statut, createdAt)
  - [ ] 1.1.3 Définir l'enum ProspectStatus
  - [ ] 1.1.4 Ajouter les timestamps (createdAt, updatedAt)

### 2. DTOs et Validation
- [ ] 2.1 Créer CreateProspectDto pour la soumission publique
  - [ ] 2.1.1 Validation des champs requis (nom, email)
  - [ ] 2.1.2 Validation format email
  - [ ] 2.1.3 Validation longueur des champs
- [ ] 2.2 Créer UpdateProspectDto pour les modifications admin
- [ ] 2.3 Créer SendEmailProspectDto pour l'envoi d'emails

### 3. Service ProspectsService
- [ ] 3.1 Implémenter la méthode create() pour la soumission publique
  - [ ] 3.1.1 Vérification unicité email
  - [ ] 3.1.2 Création et sauvegarde du prospect
  - [ ] 3.1.3 Gestion des erreurs (email existant, validation)
- [ ] 3.2 Implémenter findAll() avec pagination et filtres
  - [ ] 3.2.1 Recherche par nom, entreprise, email
  - [ ] 3.2.2 Filtrage par statut
  - [ ] 3.2.3 Tri par date, nom, etc.
  - [ ] 3.2.4 Pagination
- [ ] 3.3 Implémenter getStats() pour les statistiques
  - [ ] 3.3.1 Compteurs par statut
  - [ ] 3.3.2 Nouveaux prospects des 7 derniers jours
- [ ] 3.4 Implémenter marquerContacte() pour changer le statut
- [ ] 3.5 Implémenter sendEmail() pour l'envoi d'emails
- [ ] 3.6 Implémenter les méthodes CRUD standard (findOne, update, remove)

### 4. Contrôleur ProspectsController
- [ ] 4.1 Endpoint POST /api/prospects (public, sans auth)
- [ ] 4.2 Endpoint GET /api/prospects (admin, avec auth)
- [ ] 4.3 Endpoint GET /api/prospects/stats (admin, avec auth)
- [ ] 4.4 Endpoint GET /api/prospects/:id (admin, avec auth)
- [ ] 4.5 Endpoint PUT /api/prospects/:id (admin, avec auth)
- [ ] 4.6 Endpoint PUT /api/prospects/:id/contact (admin, avec auth)
- [ ] 4.7 Endpoint POST /api/prospects/:id/email (admin, avec auth)
- [ ] 4.8 Endpoint DELETE /api/prospects/:id (admin, avec auth)

### 5. Module et Intégration
- [ ] 5.1 Créer ProspectsModule
- [ ] 5.2 Intégrer dans AppModule
- [ ] 5.3 Configurer TypeORM pour l'entité Prospect
- [ ] 5.4 Tester la création des tables en base

## 🎨 Phase 2 : Frontend - Formulaire Home (2h)

### 6. Modification du Formulaire Home
- [ ] 6.1 Créer le composant ContactForm fonctionnel
  - [ ] 6.1.1 État pour les données du formulaire
  - [ ] 6.1.2 Gestion des états loading, success, error
  - [ ] 6.1.3 Validation côté client
- [ ] 6.2 Implémenter la soumission vers l'API
  - [ ] 6.2.1 Appel POST /api/prospects
  - [ ] 6.2.2 Gestion des réponses (succès, erreur, doublon)
  - [ ] 6.2.3 Messages utilisateur appropriés
- [ ] 6.3 Interface utilisateur
  - [ ] 6.3.1 Formulaire avec tous les champs requis
  - [ ] 6.3.2 Validation visuelle (champs requis, format email)
  - [ ] 6.3.3 États de chargement et messages de confirmation
  - [ ] 6.3.4 Gestion des erreurs utilisateur-friendly

### 7. Tests du Formulaire
- [ ] 7.1 Tester la soumission avec données valides
- [ ] 7.2 Tester la validation des champs requis
- [ ] 7.3 Tester la gestion des doublons
- [ ] 7.4 Tester les messages d'erreur

## 🖥️ Phase 3 : Interface Admin - Page Prospects (4-5h)

### 8. Page Prospects (Adaptation de Contacts.jsx)
- [ ] 8.1 Créer la page Prospects.jsx
  - [ ] 8.1.1 Structure de base avec header et navigation
  - [ ] 8.1.2 États pour prospects, pagination, filtres
  - [ ] 8.1.3 Fonction fetchProspects() avec paramètres
- [ ] 8.2 Interface de liste
  - [ ] 8.2.1 Tableau avec colonnes (date, nom, entreprise, email, statut, actions)
  - [ ] 8.2.2 Badges de statut avec couleurs appropriées
  - [ ] 8.2.3 Boutons d'action (voir, email, marquer contacté)
- [ ] 8.3 Système de filtres
  - [ ] 8.3.1 Barre de recherche (nom, entreprise, email)
  - [ ] 8.3.2 Filtre par statut
  - [ ] 8.3.3 Bouton réinitialiser
- [ ] 8.4 Pagination
  - [ ] 8.4.1 Navigation entre pages
  - [ ] 8.4.2 Informations de pagination
  - [ ] 8.4.3 Gestion des états vides

### 9. Modal Détails Prospect
- [ ] 9.1 Créer ProspectDetailModal.jsx
  - [ ] 9.1.1 Affichage de toutes les informations du prospect
  - [ ] 9.1.2 Formulaire d'édition des informations
  - [ ] 9.1.3 Changement de statut avec dropdown
  - [ ] 9.1.4 Zone de notes admin
- [ ] 9.2 Actions dans le modal
  - [ ] 9.2.1 Sauvegarder les modifications
  - [ ] 9.2.2 Marquer comme contacté
  - [ ] 9.2.3 Bouton d'envoi d'email
- [ ] 9.3 Historique et métadonnées
  - [ ] 9.3.1 Affichage date de création
  - [ ] 9.3.2 Informations de contact (qui, quand)
  - [ ] 9.3.3 Historique des emails envoyés

### 10. Modal Envoi d'Email
- [ ] 10.1 Créer ProspectEmailModal.jsx
  - [ ] 10.1.1 Sélection de template (welcome, qualification, proposal)
  - [ ] 10.1.2 Personnalisation du sujet
  - [ ] 10.1.3 Zone de message personnalisé
  - [ ] 10.1.4 Prévisualisation du contenu
- [ ] 10.2 Intégration EmailJS
  - [ ] 10.2.1 Utiliser le service EmailJS existant
  - [ ] 10.2.2 Templates spécifiques aux prospects
  - [ ] 10.2.3 Variables dynamiques (nom, entreprise, etc.)
- [ ] 10.3 Gestion de l'envoi
  - [ ] 10.3.1 Validation avant envoi
  - [ ] 10.3.2 Appel API pour marquer l'email comme envoyé
  - [ ] 10.3.3 Messages de confirmation/erreur

## 🔔 Phase 4 : Notifications et Intégration (2h)

### 11. Intégration Système de Notifications
- [ ] 11.1 Modifier NotificationContext
  - [ ] 11.1.1 Ajouter prospects aux notifications existantes
  - [ ] 11.1.2 Appel API /api/prospects/stats
  - [ ] 11.1.3 Calcul du total avec commandes + prospects
- [ ] 11.2 Mise à jour Topbar
  - [ ] 11.2.1 Affichage du badge avec total notifications
  - [ ] 11.2.2 Dropdown avec détail commandes/prospects
  - [ ] 11.2.3 Liens vers les pages respectives

### 12. Navigation Sidebar
- [ ] 12.1 Ajouter l'entrée "Prospects" dans la sidebar
  - [ ] 12.1.1 Icône Users avec badge si nouveaux prospects
  - [ ] 12.1.2 Lien vers /dashboard/prospects
  - [ ] 12.1.3 Mise à jour du badge en temps réel
- [ ] 12.2 Routing
  - [ ] 12.2.1 Ajouter la route dans App.jsx
  - [ ] 12.2.2 Protection par authentification
  - [ ] 12.2.3 Tests de navigation

### 13. Widget Dashboard
- [ ] 13.1 Créer ProspectsWidget.jsx
  - [ ] 13.1.1 Statistiques prospects (nouveaux, convertis)
  - [ ] 13.1.2 Graphique ou indicateurs visuels
  - [ ] 13.1.3 Lien vers la page complète
- [ ] 13.2 Intégrer au dashboard principal
  - [ ] 13.2.1 Ajouter à la grille de widgets
  - [ ] 13.2.2 Responsive design
  - [ ] 13.2.3 Chargement des données

## 📧 Phase 5 : Templates et Communication (2h)

### 14. Extension EmailService
- [ ] 14.1 Ajouter sendProspectEmail() au service existant
  - [ ] 14.1.1 Support des templates prospects
  - [ ] 14.1.2 Variables dynamiques (nom, entreprise, message initial)
  - [ ] 14.1.3 Gestion des erreurs d'envoi
- [ ] 14.2 Templates EmailJS pour prospects
  - [ ] 14.2.1 Template "welcome" - Confirmation de réception
  - [ ] 14.2.2 Template "qualification" - Questions de qualification
  - [ ] 14.2.3 Template "proposal" - Proposition commerciale
- [ ] 14.3 Configuration EmailJS
  - [ ] 14.3.1 Nouveaux templates dans le compte EmailJS
  - [ ] 14.3.2 Variables et formatage HTML
  - [ ] 14.3.3 Tests d'envoi

### 15. Historique des Communications
- [ ] 15.1 Tracking des emails envoyés
  - [ ] 15.1.1 Mise à jour des champs email_envoye, date_email
  - [ ] 15.1.2 Changement automatique de statut si premier contact
  - [ ] 15.1.3 Logs pour debugging
- [ ] 15.2 Affichage dans l'interface
  - [ ] 15.2.1 Indicateurs visuels (email envoyé/non envoyé)
  - [ ] 15.2.2 Dates des dernières communications
  - [ ] 15.2.3 Historique dans le modal détails

## 🧪 Phase 6 : Tests et Validation (2h)

### 16. Tests Backend
- [ ] 16.1 Tests unitaires ProspectsService
  - [ ] 16.1.1 Test création prospect valide
  - [ ] 16.1.2 Test validation des données
  - [ ] 16.1.3 Test unicité email
  - [ ] 16.1.4 Test changements de statut
- [ ] 16.2 Tests d'intégration API
  - [ ] 16.2.1 Test endpoints publics (création)
  - [ ] 16.2.2 Test endpoints admin (liste, modification)
  - [ ] 16.2.3 Test authentification et permissions
- [ ] 16.3 Tests de performance
  - [ ] 16.3.1 Test avec grand nombre de prospects
  - [ ] 16.3.2 Test pagination et filtres
  - [ ] 16.3.3 Test requêtes de recherche

### 17. Tests Frontend
- [ ] 17.1 Tests formulaire Home
  - [ ] 17.1.1 Test soumission valide
  - [ ] 17.1.2 Test validation champs requis
  - [ ] 17.1.3 Test gestion erreurs
- [ ] 17.2 Tests interface admin
  - [ ] 17.2.1 Test chargement liste prospects
  - [ ] 17.2.2 Test filtres et recherche
  - [ ] 17.2.3 Test modales et actions
- [ ] 17.3 Tests d'intégration
  - [ ] 17.3.1 Test notifications temps réel
  - [ ] 17.3.2 Test navigation entre pages
  - [ ] 17.3.3 Test envoi emails

### 18. Tests Utilisateur
- [ ] 18.1 Parcours complet visiteur
  - [ ] 18.1.1 Remplissage et soumission formulaire
  - [ ] 18.1.2 Vérification messages de confirmation
  - [ ] 18.1.3 Test cas d'erreur (email existant)
- [ ] 18.2 Parcours complet admin
  - [ ] 18.2.1 Réception notification nouveau prospect
  - [ ] 18.2.2 Consultation et modification prospect
  - [ ] 18.2.3 Envoi email et suivi
- [ ] 18.3 Tests de performance utilisateur
  - [ ] 18.3.1 Temps de chargement pages
  - [ ] 18.3.2 Réactivité interface
  - [ ] 18.3.3 Tests sur mobile

## 🚀 Phase 7 : Déploiement et Documentation (1h)

### 19. Documentation
- [ ] 19.1 Documentation API
  - [ ] 19.1.1 Endpoints prospects avec exemples
  - [ ] 19.1.2 Schémas de données
  - [ ] 19.1.3 Codes d'erreur
- [ ] 19.2 Guide utilisateur
  - [ ] 19.2.1 Guide soumission formulaire (visiteurs)
  - [ ] 19.2.2 Guide gestion prospects (admins)
  - [ ] 19.2.3 Configuration EmailJS
- [ ] 19.3 Documentation technique
  - [ ] 19.3.1 Architecture du système
  - [ ] 19.3.2 Modèle de données
  - [ ] 19.3.3 Flux de données

### 20. Déploiement et Vérification
- [ ] 20.1 Migration base de données
  - [ ] 20.1.1 Création table prospects
  - [ ] 20.1.2 Vérification index et contraintes
  - [ ] 20.1.3 Tests de performance
- [ ] 20.2 Tests en environnement de production
  - [ ] 20.2.1 Test formulaire public
  - [ ] 20.2.2 Test interface admin
  - [ ] 20.2.3 Test envoi emails réels
- [ ] 20.3 Monitoring et métriques
  - [ ] 20.3.1 Logs d'activité
  - [ ] 20.3.2 Métriques de conversion
  - [ ] 20.3.3 Alertes en cas d'erreur

## 📊 Critères de Validation

### Fonctionnels
- ✅ Le formulaire Home fonctionne et sauvegarde les prospects
- ✅ Les admins peuvent voir, filtrer et gérer tous les prospects
- ✅ Les admins peuvent envoyer des emails personnalisés aux prospects
- ✅ Les notifications fonctionnent pour les nouveaux prospects
- ✅ Les changements de statut sont correctement trackés

### Techniques
- ✅ API REST complète avec validation et sécurité
- ✅ Interface responsive et intuitive
- ✅ Performance acceptable (< 2s pour charger la liste)
- ✅ Intégration harmonieuse avec l'existant
- ✅ Tests couvrant les cas principaux

### Business
- ✅ Capture efficace des leads depuis le site
- ✅ Suivi complet du pipeline prospects
- ✅ Communication facilitée avec les prospects
- ✅ Métriques exploitables pour le commercial

## 🎯 Estimation Totale

**Temps estimé : 16-20 heures**

- Phase 1 (Backend) : 3-4h
- Phase 2 (Formulaire) : 2h  
- Phase 3 (Interface Admin) : 4-5h
- Phase 4 (Notifications) : 2h
- Phase 5 (Communication) : 2h
- Phase 6 (Tests) : 2h
- Phase 7 (Documentation) : 1h

**Priorité des phases :**
1. **Critique** : Phases 1, 2 (Backend + Formulaire)
2. **Important** : Phases 3, 4 (Interface Admin + Notifications)  
3. **Utile** : Phases 5, 6, 7 (Communication + Tests + Doc)

Cette approche permet de livrer une première version fonctionnelle rapidement (Phases 1-2), puis d'enrichir progressivement les fonctionnalités.