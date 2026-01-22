# CRM Backend

Backend NestJS pour l'application CRM avec TypeORM et PostgreSQL.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données :
```bash
# Copier le fichier d'environnement
cp env.example .env

# Modifier les variables d'environnement dans .env
```

3. Créer la base de données PostgreSQL :
```sql
CREATE DATABASE crm;
```

## Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Clients
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `GET /api/clients/:id` - Détails d'un client
- `PATCH /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Contacts
- `GET /api/contacts` - Liste des contacts
- `GET /api/contacts?clientId=:id` - Contacts d'un client
- `POST /api/contacts` - Créer un contact
- `GET /api/contacts/:id` - Détails d'un contact
- `PATCH /api/contacts/:id` - Modifier un contact
- `DELETE /api/contacts/:id` - Supprimer un contact

### Products
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `GET /api/products/:id` - Détails d'un produit
- `PATCH /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Quotes
- `GET /api/quotes` - Liste des devis
- `POST /api/quotes` - Créer un devis
- `GET /api/quotes/:id` - Détails d'un devis
- `PATCH /api/quotes/:id` - Modifier un devis
- `PATCH /api/quotes/:id/status` - Changer le statut d'un devis
- `DELETE /api/quotes/:id` - Supprimer un devis

### Invoices
- `GET /api/invoices` - Liste des factures
- `POST /api/invoices` - Créer une facture
- `GET /api/invoices/:id` - Détails d'une facture
- `PATCH /api/invoices/:id` - Modifier une facture
- `PATCH /api/invoices/:id/status` - Changer le statut d'une facture
- `POST /api/invoices/:id/payment` - Enregistrer un paiement
- `DELETE /api/invoices/:id` - Supprimer une facture

### Dashboard
- `GET /api/dashboard/stats` - Statistiques du tableau de bord

## Utilisateur par défaut

Un utilisateur admin est créé automatiquement au démarrage :
- Email: `admin@test.com`
- Mot de passe: `admin123`

## Structure des Données

### Client
```json
{
  "name": "string (required)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "city": "string (optional)",
  "postalCode": "string (optional)",
  "country": "string (optional)"
}
```

### Contact
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "position": "string (optional)",
  "clientId": "number (required)"
}
```

### Product
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "brand": "string (optional)",
  "image": "string (optional, URL)",
  "price": "number (required)",
  "stockQuantity": "number (optional)",
  "category": "string (optional)",
  "unit": "enum (piece, hour, day, meter, kilogram, liter)"
}
```

### Quote
```json
{
  "clientId": "number (required)",
  "title": "string (optional)",
  "description": "string (optional)",
  "items": [
    {
      "description": "string (required)",
      "quantity": "number (required)",
      "unitPrice": "number (required)",
      "productId": "number (optional)"
    }
  ],
  "discountAmount": "number (optional)",
  "validUntil": "date (optional)",
  "notes": "string (optional)",
  "terms": "string (optional)"
}
```

### Invoice
```json
{
  "clientId": "number (required)",
  "title": "string (optional)",
  "description": "string (optional)",
  "items": [
    {
      "description": "string (required)",
      "quantity": "number (required)",
      "unitPrice": "number (required)",
      "productId": "number (optional)"
    }
  ],
  "discountAmount": "number (optional)",
  "issueDate": "date (optional)",
  "dueDate": "date (optional)",
  "paymentMethod": "string (optional)",
  "notes": "string (optional)",
  "terms": "string (optional)"
}
```

## Fonctionnalités Implémentées

✅ **Authentification JWT**
✅ **Gestion des clients** avec validation
✅ **Gestion des contacts** liés aux clients
✅ **Gestion des produits** avec stock et prix
✅ **Gestion des devis** avec calculs automatiques
✅ **Gestion des factures** avec suivi des paiements
✅ **Validation des données** avec class-validator
✅ **Gestion d'erreurs** globale
✅ **Relations TypeORM** entre entités
✅ **Calculs automatiques** des montants (TVA, totaux)
✅ **Numérotation automatique** des devis et factures

## Base de données

L'application utilise TypeORM avec synchronisation automatique en mode développement.

### Entités
- **User** (utilisateurs avec rôles)
- **Client** (clients avec relations)
- **Contact** (contacts liés aux clients)
- **Product** (produits avec stock et prix)
- **Quote** (devis) + **QuoteItem** (lignes de devis)
- **Invoice** (factures) + **InvoiceItem** (lignes de factures)

### Relations
- Client → Contacts (OneToMany)
- Client → Quotes (OneToMany)
- Client → Invoices (OneToMany)
- Quote → QuoteItems (OneToMany)
- Invoice → InvoiceItems (OneToMany)
- Product → QuoteItems (OneToMany)
- Product → InvoiceItems (OneToMany)