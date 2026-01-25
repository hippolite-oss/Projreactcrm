import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { 
  X, Save, Upload, Image, DollarSign, Hash, Package,
  Tag, Star, AlertTriangle, CheckCircle, Smartphone,
  Monitor, Headphones, Gamepad2, Home, Cpu, Cable, Tv
} from 'lucide-react';

const ProductModal = ({ product, onClose, onSave, categories, brands }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    model: '',
    sku: '',
    stockQuantity: '',
    minStockLevel: '',
    unit: 'piece',
    active: true,
    isNew: false,
    isPromotion: false,
    imageUrl: '',
    specifications: '',
    warrantyMonths: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Sous-catégories par catégorie
  const subcategoriesByCategory = {
    'Smartphones & Tablettes': ['Smartphones Premium', 'Smartphones Milieu de gamme', 'Tablettes', 'Accessoires Mobile'],
    'Ordinateurs & Laptops': ['Laptops Premium', 'Ultrabooks', 'PC Gaming', 'PC Bureau', 'Workstations'],
    'Audio & Accessoires': ['Écouteurs Sans Fil', 'Casques Audio', 'Enceintes', 'Accessoires Audio'],
    'TV & Écrans': ['TV QLED', 'TV OLED', 'Moniteurs Pro', 'Moniteurs Gaming', 'Projecteurs'],
    'Électroménager': ['Aspirateurs', 'Machines à Café', 'Petit Électroménager', 'Gros Électroménager'],
    'Composants & Pièces': ['Cartes Graphiques', 'Processeurs', 'Mémoire RAM', 'Stockage', 'Cartes Mères'],
    'Câbles & Chargeurs': ['Chargeurs', 'Câbles Data', 'Adaptateurs', 'Hubs USB'],
    'Gaming & Consoles': ['Consoles', 'Périphériques Gaming', 'Jeux', 'Accessoires Gaming']
  };

  const units = [
    { value: 'piece', label: 'Pièce' },
    { value: 'hour', label: 'Heure' },
    { value: 'day', label: 'Jour' },
    { value: 'meter', label: 'Mètre' },
    { value: 'kilogram', label: 'Kilogramme' },
    { value: 'liter', label: 'Litre' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        model: product.model || '',
        sku: product.sku || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        minStockLevel: product.minStockLevel?.toString() || '',
        unit: product.unit || 'piece',
        active: product.active !== undefined ? product.active : true,
        isNew: product.isNew || false,
        isPromotion: product.isPromotion || false,
        imageUrl: product.imageUrl || '',
        specifications: product.specifications || '',
        warrantyMonths: product.warrantyMonths?.toString() || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des champs requis
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marque est requise';
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'La quantité en stock doit être un nombre positif';
    }

    // Validation de l'URL de l'image
    if (formData.imageUrl && formData.imageUrl.trim()) {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(formData.imageUrl.trim())) {
        newErrors.imageUrl = 'L\'URL de l\'image doit être valide et pointer vers une image (jpg, png, gif, webp)';
      }
    }

    // Validation des prix en promotion
    if (formData.isPromotion && formData.originalPrice) {
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(formData.originalPrice);
      if (price >= originalPrice) {
        newErrors.price = 'Le prix promotionnel doit être inférieur au prix original';
      }
    }

    // Validation du SKU (optionnel mais unique)
    if (formData.sku && formData.sku.length < 3) {
      newErrors.sku = 'Le SKU doit contenir au moins 3 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Préparer les données pour l'API
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        minStockLevel: formData.minStockLevel ? parseInt(formData.minStockLevel) : null,
        warrantyMonths: formData.warrantyMonths ? parseInt(formData.warrantyMonths) : null
      };

      let response;
      if (product) {
        // Modification
        response = await api.patch(`/api/products/${product.id}`, dataToSend);
      } else {
        // Création
        response = await api.post('/api/products', dataToSend);
      }

      console.log('✅ Produit sauvegardé:', response.data);
      onSave();
    } catch (error) {
      console.error('❌ Erreur sauvegarde produit:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('SKU')) {
          setErrors({ sku: 'Ce SKU existe déjà' });
        } else {
          alert(`Erreur: ${error.response.data.message}`);
        }
      } else {
        alert('Erreur lors de la sauvegarde du produit');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSKU = () => {
    const brandCode = formData.brand.substring(0, 3).toUpperCase();
    const categoryCode = formData.category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const generatedSKU = `${brandCode}-${categoryCode}-${randomNum}`;
    
    setFormData(prev => ({
      ...prev,
      sku: generatedSKU
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Informations de base', icon: Package },
    { id: 'pricing', label: 'Prix et Stock', icon: DollarSign },
    { id: 'details', label: 'Détails et Specs', icon: Tag },
    { id: 'media', label: 'Images et Médias', icon: Image }
  ];

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Smartphones & Tablettes': Smartphone,
      'Ordinateurs & Laptops': Monitor,
      'Audio & Accessoires': Headphones,
      'TV & Écrans': Tv,
      'Électroménager': Home,
      'Composants & Pièces': Cpu,
      'Câbles & Chargeurs': Cable,
      'Gaming & Consoles': Gamepad2
    };
    return iconMap[category] || Package;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-purple-200 dark:border-purple-800"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {product ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation des onglets */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  isActive
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenu du formulaire */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Onglet Informations de base */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                      placeholder="Ex: iPhone 15 Pro Max"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Marque *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      list="brands-list"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                      placeholder="Ex: Apple"
                    />
                    <datalist id="brands-list">
                      {brands.map((brand) => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Modèle
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Ex: iPhone 15 Pro Max"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.value}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sous-catégorie
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      disabled={!formData.category}
                    >
                      <option value="">Sélectionner une sous-catégorie</option>
                      {formData.category && subcategoriesByCategory[formData.category]?.map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unité
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      {units.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    placeholder="Description détaillée du produit..."
                  />
                </div>
              </div>
            )}

            {/* Onglet Prix et Stock */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prix de vente (€) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prix original (€)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pour les promotions uniquement</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock disponible *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.stockQuantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                      placeholder="0"
                    />
                    {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Seuil d'alerte stock
                    </label>
                    <input
                      type="number"
                      name="minStockLevel"
                      value={formData.minStockLevel}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alerte quand le stock descend sous ce niveau</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SKU (Code produit)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className={`flex-1 px-4 py-3 rounded-xl border ${
                          errors.sku ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                        placeholder="Ex: APL-IPH-001"
                      />
                      <button
                        type="button"
                        onClick={generateSKU}
                        className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition"
                        disabled={!formData.brand || !formData.category}
                      >
                        Générer
                      </button>
                    </div>
                    {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Garantie (mois)
                    </label>
                    <input
                      type="number"
                      name="warrantyMonths"
                      value={formData.warrantyMonths}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="24"
                    />
                  </div>
                </div>

                {/* Statuts */}
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Statuts du produit</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Produit actif</span>
                        <p className="text-sm text-gray-500">Visible dans le catalogue</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Nouveau produit</span>
                        <p className="text-sm text-gray-500">Badge "Nouveau"</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPromotion"
                        checked={formData.isPromotion}
                        onChange={handleChange}
                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">En promotion</span>
                        <p className="text-sm text-gray-500">Badge "Promo"</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Détails et Specs */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spécifications techniques
                  </label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono text-sm"
                    placeholder={`Exemple de format JSON:
{
  "ecran": "6,7\\" Super Retina XDR",
  "processeur": "A17 Pro",
  "stockage": "256 GB",
  "ram": "8 GB",
  "appareil_photo": "48 MP + 12 MP + 12 MP",
  "batterie": "4441 mAh",
  "os": "iOS 17"
}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format JSON recommandé pour une meilleure structuration des données
                  </p>
                </div>

                {/* Aperçu des spécifications */}
                {formData.specifications && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
                      Aperçu des spécifications
                    </h4>
                    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 font-mono text-sm">
                      <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {formData.specifications}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Images et Médias */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL de l'image principale
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.imageUrl}
                    </p>
                  )}
                </div>

                {/* Aperçu de l'image */}
                {formData.imageUrl && (
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Aperçu de l'image
                    </h4>
                    <div className="flex justify-center">
                      <img
                        src={formData.imageUrl}
                        alt="Aperçu"
                        className="max-w-xs max-h-64 object-contain rounded-xl shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload d'image (fonctionnalité future) */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-6 h-6 text-yellow-600" />
                    <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                      Upload d'images (Bientôt disponible)
                    </h4>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-400">
                    La fonctionnalité d'upload direct d'images sera disponible dans une prochaine version. 
                    En attendant, utilisez une URL d'image hébergée.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition"
            >
              Annuler
            </button>

            <div className="flex items-center gap-4">
              {/* Indicateur de validation */}
              <div className="flex items-center gap-2 text-sm">
                {Object.keys(errors).length === 0 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Formulaire valide</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600">{Object.keys(errors).length} erreur(s)</span>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {product ? 'Modifier' : 'Créer'} le produit
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductModal;