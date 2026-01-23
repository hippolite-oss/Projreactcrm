# Guide des Templates Email Prospects

## 🎯 Templates Personnalisés
Maintenant tu peux envoyer 4 types d'emails différents selon l'étape du prospect !

## 📧 Types d'Emails Disponibles

### 1. 🎯 **Email de Bienvenue** (`welcome`)
**Quand l'utiliser** : Premier contact après soumission du formulaire
**Contenu** :
- Remerciement pour l'intérêt
- Récapitulatif de la demande
- Prochaines étapes (contact sous 24h)
- Ton professionnel et accueillant

### 2. 📅 **Démonstration Planifiée** (`demo_planifiee`)
**Quand l'utiliser** : Après avoir fixé un RDV de démonstration
**Contenu** :
- Confirmation du rendez-vous
- Détails pratiques (durée, format)
- Programme de la démonstration
- Contact pour finaliser les détails

### 3. 🎉 **Démonstration Réussie** (`demo_reussie`)
**Quand l'utiliser** : Après une démonstration réussie
**Contenu** :
- Remerciement pour la participation
- Récapitulatif des points abordés
- Prochaines étapes (proposition commerciale)
- Maintien de l'engagement

### 4. 📈 **Relance Commerciale** (`suivi_commercial`)
**Quand l'utiliser** : Suivi après envoi de proposition
**Contenu** :
- Point sur l'avancement du projet
- Rappel des bénéfices identifiés
- Questions pour débloquer la situation
- Disponibilité pour accompagner

## 🎨 Interface Utilisateur

### Menu Déroulant
Quand tu survoles l'icône email ✉️, tu vois un menu avec :
- **Description claire** de chaque template
- **Icônes visuelles** pour identifier rapidement
- **Sous-titres explicatifs** pour le contexte

### Sélection Intelligente
- **Hover** : Menu déroulant rapide
- **Descriptions** : Comprendre l'usage de chaque template
- **Confirmation** : Nom du template dans l'alerte de succès

## 🔧 Personnalisation Technique

### Variables Dynamiques
Chaque email utilise :
- `${prospect.nom}` : Nom personnalisé
- `${prospect.entreprise}` : Entreprise si renseignée
- `${prospect.message}` : Message original du prospect
- `${prospect.email}` et `${prospect.telephone}` : Coordonnées

### Adaptation du Contenu
- **Formatage professionnel** : Listes à puces, émojis discrets
- **Ton adapté** : Plus commercial pour les suivis, plus accueillant pour le welcome
- **Call-to-action clairs** : Prochaines étapes bien définies
- **Signature cohérente** : "L'équipe CRM System"

## 🎯 Utilisation Recommandée

### Parcours Client Type
1. **Formulaire soumis** → `welcome` (Email de bienvenue)
2. **RDV fixé** → `demo_planifiee` (Confirmation démonstration)
3. **Démo terminée** → `demo_reussie` (Suivi après démo)
4. **Proposition envoyée** → `suivi_commercial` (Relance)

### Bonnes Pratiques
- **Attendre 24-48h** entre chaque email
- **Adapter le template** à la situation réelle
- **Personnaliser** si besoin avec des infos spécifiques
- **Suivre les réponses** pour ajuster l'approche

## 🧪 Test des Templates

### Test Rapide
```javascript
// Dans la console (page Prospects)
const testProspect = {
  nom: 'Jean Dupont',
  email: 'ton-email@gmail.com',
  entreprise: 'Test Company',
  message: 'Intéressé par une démonstration',
  createdAt: new Date()
};

// Tester chaque template
['welcome', 'demo_planifiee', 'demo_reussie', 'suivi_commercial'].forEach(template => {
  import('../services/emailService.js').then(module => {
    module.default.envoyerEmailProspect(testProspect, template)
      .then(result => console.log(`✅ ${template}:`, result.success))
      .catch(error => console.error(`❌ ${template}:`, error));
  });
});
```

## ✅ Avantages
- **Professionnalisme** : Messages adaptés à chaque étape
- **Efficacité** : Templates prêts à l'emploi
- **Personnalisation** : Contenu dynamique et pertinent
- **Suivi** : Accompagnement tout au long du parcours
- **Cohérence** : Même qualité que les emails de commandes

Maintenant tes emails prospects sont aussi professionnels que tes emails de commandes ! 🚀