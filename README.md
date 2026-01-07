# Système CRM - Gestion de la Relation Client

Application CRM complète développée avec React (frontend) et NestJS (backend), utilisant PostgreSQL comme base de données.

## Architecture

- **Frontend**: React avec Vite, React Router, Axios
- **Backend**: NestJS avec TypeORM
- **Base de données**: PostgreSQL
- **Authentification**: JWT (JSON Web Tokens)

## Structure du projet

```
Projreactcrm/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/   # Composants réutilisables (Topbar, Sidebar, Layout)
│   │   ├── pages/        # Pages de l'application
│   │   ├── contexts/     # Contextes React (AuthContext)
│   │   └── App.jsx       # Point d'entrée de l'application
│   └── package.json
│
└── backend/           # API NestJS
    ├── src/
    │   ├── auth/         # Module d'authentification
    │   ├── users/        # Module utilisateurs
    │   ├── clients/      # Module clients
    │   ├── contacts/     # Module contacts
    │   ├── products/     # Module produits/services
    │   ├── quotes/       # Module devis
    │   ├── invoices/     # Module factures
    │   └── dashboard/    # Module tableau de bord
    └── package.json
```

## Installation et démarrage

### Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

### Configuration de la base de données

1. Créer une base de données PostgreSQL nommée `crm`:
```sql
CREATE DATABASE crm;
```

2. Configurer les variables d'environnement dans `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=crm
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Démarrage de l'application

#### Backend (port 3001)
```bash
cd backend
npm run start:dev
```

#### Frontend (port 3000)
```bash
cd frontend
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

### Authentification
- Page de connexion sécurisée (email + mot de passe)
- Authentification JWT
- Protection des routes avec guards

### Interface utilisateur

#### Topbar
- Logo/nom du CRM
- Menu hamburger (mobile)
- Zone de notifications
- Menu utilisateur (profil, paramètres, déconnexion)

#### Sidebar
Navigation vers les modules suivants:
- **Dashboard**: Vue d'ensemble et statistiques
- **Clients**: Gestion des clients
- **Contacts**: Gestion des contacts
- **Produits / Services**: Catalogue
- **Devis**: Création et suivi
- **Factures**: Gestion des factures et paiements
- **Rapports**: Statistiques et indicateurs
- **Paramètres**: Configuration du système

### Modules backend

Chaque module expose une API REST complète (CRUD):
- `GET /api/{resource}` - Liste
- `GET /api/{resource}/:id` - Détails
- `POST /api/{resource}` - Création
- `PATCH /api/{resource}/:id` - Modification
- `DELETE /api/{resource}/:id` - Suppression

## Développement

### Création d'un utilisateur de test

Pour créer un utilisateur de test, vous pouvez utiliser un script ou directement via l'API après avoir créé un endpoint d'inscription.

### Base de données

TypeORM synchronise automatiquement le schéma en mode développement. En production, utilisez les migrations.

## Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Validation des données avec class-validator
- Protection CORS configurée
- Guards sur toutes les routes protégées

## Technologies utilisées

- **Frontend**: React 18, React Router 6, Axios, Lucide React
- **Backend**: NestJS 10, TypeORM, Passport, JWT
- **Base de données**: PostgreSQL
- **Outils**: Vite, TypeScript, ESLint

## Licence

MIT

