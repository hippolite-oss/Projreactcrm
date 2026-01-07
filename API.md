# Documentation de l'API

Toutes les routes sont préfixées par `/api`.

## Authentification

### POST /api/auth/login
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "admin@crm.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "admin@crm.com",
    "firstName": "Admin",
    "lastName": "CRM",
    "role": "admin"
  }
}
```

### GET /api/auth/me
Récupère les informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@crm.com",
  "firstName": "Admin",
  "lastName": "CRM",
  "role": "admin"
}
```

## Clients

Toutes les routes nécessitent une authentification JWT.

### GET /api/clients
Liste tous les clients.

### GET /api/clients/:id
Récupère un client par son ID.

### POST /api/clients
Crée un nouveau client.

**Body:**
```json
{
  "name": "Entreprise ABC",
  "email": "contact@abc.com",
  "phone": "+33123456789",
  "address": "123 Rue Example",
  "city": "Paris",
  "postalCode": "75001",
  "country": "France"
}
```

### PATCH /api/clients/:id
Met à jour un client.

### DELETE /api/clients/:id
Supprime un client.

## Contacts

### GET /api/contacts
Liste tous les contacts.

### GET /api/contacts/:id
Récupère un contact par son ID.

### POST /api/contacts
Crée un nouveau contact.

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33123456789",
  "position": "Directeur",
  "clientId": 1
}
```

### PATCH /api/contacts/:id
Met à jour un contact.

### DELETE /api/contacts/:id
Supprime un contact.

## Produits / Services

### GET /api/products
Liste tous les produits.

### GET /api/products/:id
Récupère un produit par son ID.

### POST /api/products
Crée un nouveau produit.

**Body:**
```json
{
  "name": "Service de consultation",
  "description": "Description du service",
  "price": 150.00,
  "unit": "heure",
  "active": true
}
```

### PATCH /api/products/:id
Met à jour un produit.

### DELETE /api/products/:id
Supprime un produit.

## Devis

### GET /api/quotes
Liste tous les devis.

### GET /api/quotes/:id
Récupère un devis par son ID.

### POST /api/quotes
Crée un nouveau devis.

**Body:**
```json
{
  "quoteNumber": "DEV-2024-001",
  "clientId": 1,
  "totalAmount": 1500.00,
  "status": "draft",
  "validUntil": "2024-12-31"
}
```

### PATCH /api/quotes/:id
Met à jour un devis.

### DELETE /api/quotes/:id
Supprime un devis.

## Factures

### GET /api/invoices
Liste toutes les factures.

### GET /api/invoices/:id
Récupère une facture par son ID.

### POST /api/invoices
Crée une nouvelle facture.

**Body:**
```json
{
  "invoiceNumber": "FAC-2024-001",
  "clientId": 1,
  "totalAmount": 1500.00,
  "paidAmount": 0,
  "status": "pending",
  "dueDate": "2024-12-31"
}
```

### PATCH /api/invoices/:id
Met à jour une facture.

### DELETE /api/invoices/:id
Supprime une facture.

## Dashboard

### GET /api/dashboard/stats
Récupère les statistiques du tableau de bord.

**Response:**
```json
{
  "clients": 25,
  "products": 12,
  "quotes": 45,
  "invoices": 30,
  "revenue": 50000.00,
  "growth": 12.5
}
```

## Codes de statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non autorisé (token manquant ou invalide)
- `404` - Ressource non trouvée
- `500` - Erreur serveur

