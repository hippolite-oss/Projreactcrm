# Guide de Test - Synchronisation des Commandes

## 🎯 Objectif
Vérifier que les commandes créées dans "Nouvelle commande" apparaissent bien dans "Mes commandes" et que les notifications se mettent à jour correctement.

## 🔧 Prérequis
1. Backend démarré sur `http://localhost:3001`
2. Frontend démarré sur `http://localhost:5173` (ou autre port Vite)
3. Utilisateur connecté avec les identifiants : `admin@test.com` / `admin123`

## 🧪 Tests Manuels

### Test 1 : Flux Complet Utilisateur
1. **Connexion** : Connectez-vous avec `admin@test.com` / `admin123`
2. **Nouvelle commande** : 
   - Allez sur "Nouvelle commande" (depuis le menu ou `/nouvelle-commande`)
   - Remplissez le formulaire avec des données de test
   - Cliquez sur "Envoyer la commande"
   - Vérifiez le message de succès
3. **Vérification liste** :
   - Allez sur "Mes commandes" (depuis le sidebar ou `/dashboard/commandes`)
   - Vérifiez que votre nouvelle commande apparaît en haut de la liste
   - Vérifiez que le statut est "Nouveau"
4. **Vérification notifications** :
   - Regardez le badge de notification dans le Topbar (en haut à droite)
   - Le nombre devrait avoir augmenté
   - Cliquez sur la notification → vous devriez être redirigé vers "Mes commandes"

### Test 2 : Auto-refresh
1. Laissez la page "Mes commandes" ouverte
2. Dans un autre onglet, créez une nouvelle commande
3. Revenez sur "Mes commandes"
4. Attendez maximum 30 secondes → la nouvelle commande devrait apparaître automatiquement

## 🤖 Tests Automatiques

### Via Console du Navigateur
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Exécutez les commandes suivantes :

```javascript
// Test complet automatique
verificationSynchronisation.verifierFluxComplet()

// Ou test simple
testCommandes.testCreationEtAffichage()

// Vérifier juste les connexions
verificationSynchronisation.verifierConnexions()
```

## 📊 Résultats Attendus

### ✅ Succès
- La commande apparaît immédiatement dans "Mes commandes"
- Le badge de notification se met à jour (+1)
- Cliquer sur la notification redirige vers "Mes commandes"
- L'auto-refresh fonctionne (30 secondes)
- Les logs de la console montrent "✅ TEST RÉUSSI"

### ❌ Problèmes Possibles
- **Commande n'apparaît pas** : Problème de synchronisation API
- **Badge ne se met pas à jour** : Problème NotificationContext
- **Redirection ne fonctionne pas** : Problème Topbar
- **Auto-refresh ne fonctionne pas** : Problème useCommandes hook

## 🔍 Debug

### Logs à Surveiller
Dans la console, vous devriez voir :
```
🔄 useCommandes - Récupération des commandes
📡 Paramètres API (Hook): {page: 1, limit: 10}
📦 Réponse API (Hook): {success: true, data: [...]}
✅ Commandes récupérées (Hook): X commandes
🔔 Topbar - Notifications: {commandesNonLues: X, totalCommandes: Y}
```

### Vérifications API Manuelles
```javascript
// Vérifier l'endpoint des commandes
fetch('http://localhost:3001/api/commande-online', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log)

// Vérifier l'endpoint des stats
fetch('http://localhost:3001/api/commande-online/stats', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log)
```

## 🚀 Fonctionnalités Implémentées

1. **Hook useCommandes** : Gestion centralisée des commandes avec auto-refresh
2. **NotificationContext** : Gestion des notifications et badges
3. **Synchronisation temps réel** : Auto-refresh toutes les 30 secondes
4. **Redirection notifications** : Clic sur badge → "Mes commandes"
5. **Logging détaillé** : Pour debug et monitoring
6. **Tests automatiques** : Scripts de vérification intégrés

## 📝 Notes Techniques

- **Backend** : NestJS avec TypeORM, endpoints REST complets
- **Frontend** : React avec hooks personnalisés, Context API
- **Synchronisation** : Polling toutes les 30 secondes + refresh manuel
- **État global** : NotificationContext pour les badges
- **Routing** : React Router avec redirections automatiques

Le système est conçu pour être robuste, avec gestion d'erreurs et fallbacks appropriés.