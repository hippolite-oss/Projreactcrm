# Spécification : Gestion des Prospects depuis la Page Home

## 🎯 Vue d'ensemble

Transformer le formulaire de contact de la page Home en un système complet de gestion de prospects, permettant aux visiteurs de soumettre leurs informations et aux administrateurs de les gérer efficacement.

## 📋 Contexte Actuel

### État Existant
- **Page Home** : Contient un formulaire de contact dans la section "Demandez une démo gratuite"
- **Entité Contact** : Existe mais est liée aux clients (B2B), pas aux prospects (leads)
- **Page Contacts** : Interface admin pour gérer les contacts clients existants
- **Sidebar** : Contient déjà un lien "Contacts" vers la gestion des contacts clients

### Problématique
Le formulaire de la page Home n'est pas fonctionnel et les informations soumises ne sont pas sauvegardées ni accessibles aux administrateurs.

## 🎯 Objectifs

1. **Fonctionnaliser le formulaire Home** pour capturer les prospects
2. **Créer une entité Prospect** distincte des contacts clients
3. **Adapter l'interface Contacts** pour gérer les prospects
4. **Implémenter un système de communication** admin → prospect

## 📝 User Stories

### US1 : Soumission de Prospect (Visiteur)
**En tant que** visiteur du site  
**Je veux** remplir le formulaire de contact sur la page Home  
**Afin de** demander une démonstration ou obtenir des informations  

**Critères d'acceptation :**
- ✅ Le formulaire capture : nom, entreprise, email, téléphone, message
- ✅ Validation côté client (champs requis, format email)
- ✅ Validation côté serveur
- ✅ Message de confirmation après soumission
- ✅ Données sauvegardées en base de données
- ✅ Gestion des erreurs (email déjà existant, etc.)

### US2 : Visualisation des Prospects (Admin)
**En tant qu'** administrateur  
**Je veux** voir la liste de tous les prospects  
**Afin de** suivre les demandes de démonstration  

**Critères d'acceptation :**
- ✅ Liste paginée des prospects dans l'interface admin
- ✅ Filtres par statut (nouveau, contacté, qualifié, converti, perdu)
- ✅ Recherche par nom, entreprise, email
- ✅ Tri par date, nom, entreprise
- ✅ Indicateurs visuels pour les nouveaux prospects
- ✅ Compteur de prospects non traités dans la sidebar

### US3 : Gestion des Prospects (Admin)
**En tant qu'** administrateur  
**Je veux** gérer les informations des prospects  
**Afin de** suivre leur progression dans le pipeline  

**Critères d'acceptation :**
- ✅ Voir les détails complets d'un prospect
- ✅ Modifier les informations du prospect
- ✅ Changer le statut du prospect
- ✅ Ajouter des notes de suivi
- ✅ Marquer comme contacté avec date/heure
- ✅ Convertir un prospect en client
- ✅ Supprimer un prospect

### US4 : Communication avec les Prospects (Admin)
**En tant qu'** administrateur  
**Je veux** contacter directement un prospect  
**Afin de** répondre à sa demande ou le qualifier  

**Critères d'acceptation :**
- ✅ Envoyer un email personnalisé au prospect
- ✅ Templates d'emails prédéfinis (réponse automatique, qualification, proposition)
- ✅ Historique des communications
- ✅ Planifier des rappels
- ✅ Intégration avec le système EmailJS existant

### US5 : Notifications et Alertes (Admin)
**En tant qu'** administrateur  
**Je veux** être notifié des nouveaux prospects  
**Afin de** réagir rapidement aux demandes  

**Critères d'acceptation :**
- ✅ Badge de notification dans la topbar
- ✅ Compteur de nouveaux prospects
- ✅ Notification en temps réel (optionnel)
- ✅ Email de notification pour nouveaux prospects (optionnel)

## 🏗️ Architecture Technique

### 1. Nouvelle Entité Prospect

```typescript
@Entity('prospects')
export class Prospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100, nullable: true })
  entreprise: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: ['nouveau', 'contacte', 'qualifie', 'converti', 'perdu'],
    default: 'nouveau'
  })
  statut: string;

  @Column({ type: 'text', nullable: true })
  notes_admin: string;

  @Column({ nullable: true })
  date_contact: Date;

  @Column({ nullable: true, length: 100 })
  contacte_par: string;

  @Column({ default: false })
  email_envoye: boolean;

  @Column({ nullable: true })
  date_email: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Endpoints API

```typescript
// Prospects Controller
POST   /api/prospects              // Créer un prospect (public)
GET    /api/prospects              // Lister les prospects (admin)
GET    /api/prospects/stats        // Statistiques prospects (admin)
GET    /api/prospects/:id          // Détails d'un prospect (admin)
PUT    /api/prospects/:id          // Modifier un prospect (admin)
PUT    /api/prospects/:id/contact  // Marquer comme contacté (admin)
PUT    /api/prospects/:id/email    // Envoyer un email (admin)
DELETE /api/prospects/:id          // Supprimer un prospect (admin)
```

### 3. Modifications Frontend

#### Page Home
- Connecter le formulaire existant à l'API
- Ajouter la validation et la gestion d'erreurs
- Message de confirmation après soumission

#### Page Contacts (Renommée en Prospects)
- Adapter l'interface existante pour les prospects
- Ajouter les nouveaux champs (statut, notes admin, etc.)
- Intégrer les fonctionnalités de communication

#### Sidebar
- Renommer "Contacts" en "Prospects" ou ajouter une nouvelle entrée
- Ajouter un badge avec le nombre de nouveaux prospects

#### Topbar
- Intégrer les notifications de prospects dans le système existant

## 🎨 Interface Utilisateur

### 1. Formulaire Home (Public)
```
┌─────────────────────────────────────┐
│ Demandez une démo gratuite          │
├─────────────────────────────────────┤
│ Nom *           [____________]      │
│ Entreprise      [____________]      │
│ Email *         [____________]      │
│ Téléphone       [____________]      │
│ Message         [____________]      │
│                 [____________]      │
│                 [____________]      │
│                                     │
│ [Demander ma démo gratuite]         │
└─────────────────────────────────────┘
```

### 2. Liste des Prospects (Admin)
```
┌─────────────────────────────────────────────────────────────┐
│ Prospects (12 nouveaux)                                     │
├─────────────────────────────────────────────────────────────┤
│ [Recherche...] [Statut ▼] [Trier ▼]                       │
├─────────────────────────────────────────────────────────────┤
│ Nom          Entreprise    Email           Statut    Actions│
│ Marie Dupont TechCorp     marie@tech.com  🟡 Nouveau  👁️📧  │
│ Jean Martin  StartupXYZ   jean@startup.fr 🟢 Contacté  👁️📧  │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

### 3. Détails Prospect (Modal)
```
┌─────────────────────────────────────────────────────────────┐
│ Détails du Prospect - Marie Dupont                         │
├─────────────────────────────────────────────────────────────┤
│ Informations Générales                                      │
│ Nom: Marie Dupont        Entreprise: TechCorp              │
│ Email: marie@tech.com    Téléphone: +33 1 23 45 67 89      │
│                                                             │
│ Message Initial:                                            │
│ "Nous cherchons une solution CRM pour notre équipe..."     │
│                                                             │
│ Statut: [Nouveau ▼]     Contacté le: [Date/Heure]         │
│                                                             │
│ Notes Admin:                                                │
│ [_________________________________________________]         │
│                                                             │
│ Actions:                                                    │
│ [📧 Envoyer Email] [📞 Marquer Contacté] [💾 Sauvegarder] │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### 1. Soumission Prospect
```
Visiteur → Formulaire Home → Validation → API POST /prospects → Base de données
                                                    ↓
                                            Notification Admin
```

### 2. Gestion Admin
```
Admin → Liste Prospects → Détails → Actions (Email/Contact/Notes) → Mise à jour
```

### 3. Communication
```
Admin → Sélection Template → Personnalisation → EmailJS → Prospect
                                                    ↓
                                            Historique sauvegardé
```

## 📊 Indicateurs de Performance

### Métriques à Suivre
- Nombre de prospects par jour/semaine/mois
- Taux de conversion prospect → client
- Temps moyen de réponse aux prospects
- Taux d'ouverture des emails envoyés
- Répartition par statut des prospects

### Tableaux de Bord
- Widget "Nouveaux Prospects" sur le dashboard
- Graphique d'évolution des prospects
- Statistiques de conversion

## 🔒 Sécurité et Validation

### Validation Côté Client
- Champs requis : nom, email
- Format email valide
- Longueur maximale des champs
- Protection contre le spam (captcha optionnel)

### Validation Côté Serveur
- Sanitisation des données
- Validation des formats
- Vérification unicité email
- Rate limiting pour éviter le spam

### Permissions
- Création de prospects : Public (sans authentification)
- Gestion des prospects : Admin uniquement (JWT requis)

## 🧪 Tests et Validation

### Tests Fonctionnels
1. Soumission formulaire avec données valides
2. Soumission avec données invalides
3. Gestion des doublons (même email)
4. Filtrage et recherche dans la liste
5. Modification des informations prospect
6. Envoi d'emails aux prospects
7. Changement de statut
8. Notifications admin

### Tests d'Intégration
1. Synchronisation avec le système de notifications
2. Intégration EmailJS pour l'envoi d'emails
3. Performance avec un grand nombre de prospects

## 📅 Plan de Développement

### Phase 1 : Backend (2-3h)
1. Créer l'entité Prospect
2. Implémenter le service ProspectsService
3. Créer le contrôleur ProspectsController
4. Ajouter les endpoints API
5. Tests unitaires

### Phase 2 : Frontend Formulaire (1-2h)
1. Connecter le formulaire Home à l'API
2. Ajouter validation et gestion d'erreurs
3. Message de confirmation
4. Tests d'intégration

### Phase 3 : Interface Admin (3-4h)
1. Adapter la page Contacts pour les prospects
2. Ajouter les nouveaux champs et filtres
3. Implémenter les modales de détails/édition
4. Intégrer les actions (email, contact, notes)

### Phase 4 : Notifications (1h)
1. Intégrer dans le système de notifications existant
2. Ajouter badge dans la sidebar
3. Mise à jour temps réel

### Phase 5 : Communication (2h)
1. Templates d'emails
2. Intégration EmailJS
3. Historique des communications

## 🎯 Critères de Succès

### Fonctionnels
- ✅ Le formulaire Home fonctionne et sauvegarde les données
- ✅ Les admins peuvent voir et gérer tous les prospects
- ✅ Les admins peuvent communiquer avec les prospects
- ✅ Les notifications fonctionnent correctement

### Techniques
- ✅ API REST complète et documentée
- ✅ Interface utilisateur intuitive et responsive
- ✅ Performance acceptable (< 2s pour charger la liste)
- ✅ Sécurité : validation et permissions correctes

### Business
- ✅ Augmentation du taux de capture de leads
- ✅ Amélioration du temps de réponse aux prospects
- ✅ Meilleur suivi du pipeline commercial
- ✅ Données exploitables pour le marketing

## 🔄 Évolutions Futures

### Court Terme
- Scoring automatique des prospects
- Intégration calendrier pour RDV
- Notifications push en temps réel

### Moyen Terme
- Automatisation des emails de suivi
- Intégration avec outils marketing (Google Analytics, Facebook Pixel)
- Rapports avancés et analytics

### Long Terme
- Intelligence artificielle pour qualification automatique
- Intégration CRM externe (Salesforce, HubSpot)
- API publique pour intégrations tierces