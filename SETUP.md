# Guide d'installation et de configuration

## Installation

### 1. Installation des dépendances

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

### 2. Configuration de la base de données PostgreSQL

1. Installer PostgreSQL si ce n'est pas déjà fait
2. Créer une base de données nommée `crm`:
```sql
CREATE DATABASE crm;
```

3. Créer le fichier `backend/.env` à partir de `backend/.env.example`:
```bash
cd backend
cp .env.example .env
```

4. Modifier `backend/.env` avec vos paramètres de connexion PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=crm
JWT_SECRET=votre-clé-secrète-jwt-changez-en-production
NODE_ENV=development
```

### 3. Création du premier utilisateur

Après avoir démarré le backend une première fois (pour créer les tables), vous pouvez créer un utilisateur de test de deux façons:

#### Option 1: Via le script d'initialisation (recommandé)

```bash
cd backend
npx ts-node src/scripts/init-user.ts
```

Cela créera un utilisateur avec:
- Email: `admin@crm.com`
- Mot de passe: `admin123`

#### Option 2: Via l'API (après avoir créé un endpoint d'inscription)

Ou vous pouvez créer un utilisateur directement via SQL:

```sql
INSERT INTO users (email, password, "firstName", "lastName", role, "createdAt", "updatedAt")
VALUES (
  'admin@crm.com',
  '$2b$10$VotreHashBcrypt', -- Générer avec bcrypt pour 'admin123'
  'Admin',
  'CRM',
  'admin',
  NOW(),
  NOW()
);
```

### 4. Démarrage de l'application

#### Terminal 1 - Backend (port 3001)
```bash
cd backend
npm run start:dev
```

#### Terminal 2 - Frontend (port 3000)
```bash
cd frontend
npm run dev
```

### 5. Accès à l'application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Utilisation

1. Ouvrez votre navigateur sur http://localhost:3000
2. Connectez-vous avec:
   - Email: `admin@crm.com`
   - Mot de passe: `admin123`

## Notes importantes

- En mode développement, TypeORM synchronise automatiquement le schéma de la base de données
- En production, désactivez `synchronize` et utilisez les migrations
- Changez le `JWT_SECRET` en production
- Les mots de passe sont hashés avec bcrypt (10 rounds)

