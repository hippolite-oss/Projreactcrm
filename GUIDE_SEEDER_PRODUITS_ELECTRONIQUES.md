# 🌱 Guide du Seeder Produits Électroniques

## 🎯 **Objectif**
Peupler automatiquement la base de données avec **20+ produits électroniques réalistes** organisés par catégories.

## 📦 **Contenu du Seeder**

### 🗂️ **8 Catégories Principales** :

1. **📱 Smartphones & Tablettes** (3 produits)
   - iPhone 15 Pro Max (Nouveau)
   - Samsung Galaxy S24 Ultra (Promotion)
   - iPad Pro 12.9" M2

2. **💻 Ordinateurs & Laptops** (3 produits)
   - MacBook Pro 14" M3 Pro (Nouveau)
   - Dell XPS 13 Plus (Promotion)
   - Gaming PC RTX 4080 Custom (Nouveau)

3. **🎧 Audio & Accessoires** (2 produits)
   - AirPods Pro 2ème génération
   - Sony WH-1000XM5 (Promotion)

4. **📺 TV & Écrans** (2 produits)
   - Samsung Neo QLED 65" QN95C (Promotion)
   - LG UltraWide 34" 5K2K

5. **🏠 Électroménager** (2 produits)
   - Dyson V15 Detect Absolute (Promotion)
   - Nespresso Vertuo Next (Promotion)

6. **⚡ Composants & Pièces** (2 produits)
   - NVIDIA GeForce RTX 4070 Ti (Nouveau)
   - AMD Ryzen 7 7700X (Promotion)

7. **🔌 Câbles & Chargeurs** (2 produits)
   - Chargeur USB-C 100W GaN
   - Câble Thunderbolt 4 - 2m

8. **🎮 Gaming & Consoles** (2 produits)
   - PlayStation 5 Slim (Nouveau)
   - Razer DeathAdder V3 Pro

## ✨ **Nouvelles Fonctionnalités Ajoutées**

### 🔧 **Champs Étendus** :
- **Marque & Modèle** : Identification précise
- **Sous-catégorie** : Classification fine
- **Prix original** : Pour gérer les promotions
- **Statuts** : Nouveau, Promotion, Actif
- **Spécifications** : Détails techniques en JSON
- **Garantie** : Durée en mois
- **Images** : URLs des photos produits

### 📊 **Données Réalistes** :
- **Prix cohérents** avec le marché
- **Stocks variés** (5-45 unités)
- **Seuils d'alerte** configurés
- **Promotions** sur certains produits
- **Spécifications détaillées** pour chaque produit

## 🚀 **Utilisation**

### **Étape 1 : Exécuter le Seeder**
```bash
# Dans le dossier backend
npm run seed:products
```

### **Étape 2 : Vérifier les Résultats**
Le seeder affiche :
- ✅ Chaque produit créé
- 📊 Statistiques par catégorie
- 🏷️ Nombre de promotions
- 🆕 Nombre de nouveaux produits
- 💰 Valeur totale du stock

### **Exemple de Sortie** :
```
🌱 Initialisation de la connexion à la base de données...
🗑️ Suppression des produits existants...
📦 Insertion des nouveaux produits électroniques...
✅ Produit créé: iPhone 15 Pro Max (Apple)
✅ Produit créé: Samsung Galaxy S24 Ultra (Samsung)
...
🎉 Seeder terminé avec succès ! 18 produits électroniques ajoutés.

📊 Répartition par catégorie:
   Smartphones & Tablettes: 3 produits
   Ordinateurs & Laptops: 3 produits
   Audio & Accessoires: 2 produits
   ...

🏷️ Produits en promotion: 7
🆕 Nouveaux produits: 4
💰 Valeur totale du stock: 45 678,00 €
```

## 🎨 **Exemples de Produits**

### **📱 iPhone 15 Pro Max**
- **Prix** : 1 479,00 €
- **Stock** : 25 unités
- **Spécifications** : A17 Pro, 256GB, 48MP
- **Statut** : Nouveau produit

### **🎮 PlayStation 5 Slim**
- **Prix** : 549,00 €
- **Stock** : 8 unités
- **Spécifications** : AMD Zen 2, SSD 1TB, 4K@120Hz
- **Statut** : Nouveau produit

### **💻 Dell XPS 13 Plus**
- **Prix** : 1 899,00 € (au lieu de 2 099,00 €)
- **Stock** : 15 unités
- **Spécifications** : Intel i7, 16GB RAM, OLED 3.5K
- **Statut** : En promotion (-9%)

## 🔄 **Réexécution**
- Le seeder **supprime** tous les produits existants
- Puis **recrée** la liste complète
- Idéal pour **réinitialiser** le catalogue

## 🎯 **Prochaines Étapes**
1. ✅ **Seeder créé** (Étape 1 terminée)
2. 🔄 **Interface admin** améliorée (Étape 2)
3. 🎨 **Système de catégories** (Étape 3)

Exécute maintenant le seeder pour voir ton catalogue électronique prendre vie ! 🚀