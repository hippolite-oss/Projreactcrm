# Système de Logging CRM Backend

## Vue d'ensemble

Le système de logging a été implémenté pour tracer toutes les requêtes HTTP, actions utilisateurs, erreurs et performances de l'application CRM.

## Architecture

```
backend/src/common/
├── services/
│   └── logger.service.ts      # Service de logging centralisé
├── interceptors/
│   └── logging.interceptor.ts # Interceptor pour les requêtes HTTP
├── filters/
│   └── http-exception.filter.ts # Filtre d'exceptions (existant)
└── common.module.ts           # Module global
```

## Fonctionnalités

### 1. Logging des Requêtes HTTP
- **URL, méthode, status code, temps de réponse**
- **IP client et User-Agent**
- **Informations utilisateur** (si connecté)
- **ID unique par requête** pour le traçage

### 2. Logging des Actions Utilisateur
- **Connexions/déconnexions**
- **Création, modification, suppression** de ressources
- **Exports de rapports**
- **Accès au dashboard**

### 3. Logging des Erreurs
- **Stack trace complète**
- **Contexte de l'erreur** (utilisateur, requête)
- **Métadonnées additionnelles**

### 4. Logging des Performances
- **Temps d'exécution** des opérations
- **Opérations lentes** (> 500ms)
- **Métriques de base de données**

## Formats de Log

### Développement
```
✅ GET /api/clients 200 - 45ms | User: admin@test.com | IP: 127.0.0.1
👤 admin@test.com CREATE CLIENT
⚡ create_client completed in 120ms
❌ Erreur de validation: Email requis
```

### Production (JSON structuré)
```json
{
  "type": "http_request",
  "method": "POST",
  "url": "/api/clients",
  "statusCode": 201,
  "responseTime": 156,
  "timestamp": "2024-01-27T10:30:00.000Z",
  "userId": 1,
  "userEmail": "admin@test.com",
  "ip": "192.168.1.100",
  "requestId": "req_1706356200000_abc123def"
}
```

## Utilisation dans les Services

### Import du Service
```typescript
import { AppLoggerService } from '../common/services/logger.service';

@Injectable()
export class MonService {
  constructor(private logger: AppLoggerService) {}
}
```

### Méthodes Disponibles

#### Logs Simples
```typescript
this.logger.info('Information générale');
this.logger.success('Opération réussie');
this.logger.warning('Attention requise');
```

#### Logs avec Contexte
```typescript
this.logger.logUserAction('CREATE', 'CLIENT', {
  userId: 1,
  userEmail: 'admin@test.com',
  ip: '127.0.0.1'
});
```

#### Logs d'Erreur
```typescript
this.logger.logError(error, {
  userId: 1,
  userEmail: 'admin@test.com'
}, {
  operation: 'create_client',
  clientData: { nom: 'Test' }
});
```

#### Logs de Performance
```typescript
const startTime = Date.now();
// ... opération ...
const duration = Date.now() - startTime;

this.logger.logPerformance('database_query', duration, {
  userId: 1
}, {
  query: 'SELECT * FROM clients',
  resultCount: 150
});
```

## Configuration

### Variables d'Environnement
- `NODE_ENV=development` : Logs colorés avec emojis
- `NODE_ENV=production` : Logs JSON structurés

### Niveaux de Log
- **INFO** : Informations générales
- **SUCCESS** : Opérations réussies
- **WARNING** : Situations à surveiller
- **ERROR** : Erreurs et exceptions

## Actions Loggées Automatiquement

### Requêtes HTTP
- ✅ Toutes les requêtes avec temps de réponse
- ✅ Erreurs HTTP avec contexte
- ✅ Requêtes lentes (> 500ms)

### Actions Utilisateur Importantes
- 🔐 Connexions/déconnexions
- 📝 CRUD sur clients, produits, devis, factures
- 📊 Exports de rapports
- 🎯 Accès au dashboard
- 📧 Envois d'emails

### Erreurs
- ❌ Exceptions non gérées
- ⚠️ Erreurs de validation
- 🚫 Erreurs d'autorisation
- 💾 Erreurs de base de données

## Exemples de Logs

### Connexion Utilisateur
```
✅ POST /api/auth/login 200 - 234ms | User: admin@test.com | IP: 192.168.1.100
👤 admin@test.com LOGIN AUTH
```

### Création de Client
```
✅ POST /api/clients 201 - 156ms | User: admin@test.com | IP: 192.168.1.100
👤 admin@test.com CREATE CLIENT
⚡ create_client completed in 120ms
```

### Erreur de Validation
```
⚠️ POST /api/clients 400 - 12ms | User: admin@test.com | IP: 192.168.1.100
❌ Erreur de validation: Email requis
```

### Export de Rapport
```
✅ GET /api/reports/export/pdf 200 - 2340ms | User: admin@test.com | IP: 192.168.1.100
👤 admin@test.com EXPORT_REPORT REPORT
🐌 generate_pdf_report completed in 2340ms
```

## Avantages

1. **Traçabilité complète** des actions utilisateur
2. **Debugging facilité** avec contexte riche
3. **Monitoring des performances** en temps réel
4. **Audit trail** pour la sécurité
5. **Logs structurés** pour l'analyse automatisée
6. **Différenciation dev/prod** pour l'expérience développeur

## Maintenance

- Les logs sont automatiquement générés
- Pas de configuration manuelle requise
- Service global disponible partout
- Compatible avec les outils de monitoring externes