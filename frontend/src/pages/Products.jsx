import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProductModal from '../components/ProductModal';
import { 
  Package, Plus, Search, Filter, Edit3, Trash2, Eye, 
  Star, Tag, ShoppingCart, AlertTriangle, CheckCircle,
  X, Save, Upload, Image, DollarSign, Hash, Calendar,
  TrendingUp, TrendingDown, Zap, Award, Smartphone,
  Monitor, Headphones, Gamepad2, Home, Cpu, Cable,
  Tv, Grid3X3, List, SortAsc, SortDesc
} from 'lucide-react';

const Products = () => {
  const { t } = useLanguage(); // Hook pour les traductions
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Données pour les filtres
  const categories = [
    { value: 'Smartphones & Tablettes', icon: Smartphone, color: 'blue' },
    { value: 'Ordinateurs & Laptops', icon: Monitor, color: 'purple' },
    { value: 'Audio & Accessoires', icon: Headphones, color: 'green' },
    { value: 'TV & Écrans', icon: Tv, color: 'red' },
    { value: 'Électroménager', icon: Home, color: 'orange' },
    { value: 'Composants & Pièces', icon: Cpu, color: 'yellow' },
    { value: 'Câbles & Chargeurs', icon: Cable, color: 'gray' },
    { value: 'Gaming & Consoles', icon: Gamepad2, color: 'pink' }
  ];

  const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'NVIDIA', 'AMD', 'Dyson', 'Nespresso', 'Anker', 'Razer'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, categoryFilter, brandFilter, statusFilter, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products');
      console.log('📦 Produits récupérés:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Erreur chargement produits:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filtrage par marque
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }

    // Filtrage par statut
    if (statusFilter) {
      filtered = filtered.filter(product => {
        switch (statusFilter) {
          case 'new': return product.isNew;
          case 'promotion': return product.isPromotion;
          case 'low_stock': return product.stockQuantity <= (product.minStockLevel || 5);
          case 'active': return product.active;
          case 'inactive': return !product.active;
          default: return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'price':
          aValue = parseFloat(a.price) || 0;
          bValue = parseFloat(b.price) || 0;
          break;
        case 'stock':
          aValue = a.stockQuantity || 0;
          bValue = b.stockQuantity || 0;
          break;
        case 'brand':
          aValue = a.brand?.toLowerCase() || '';
          bValue = b.brand?.toLowerCase() || '';
          break;
        case 'created':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    fetchProducts();
    handleModalClose();
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Package;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getStockStatus = (product) => {
    const stock = product.stockQuantity || 0;
    const minLevel = product.minStockLevel || 5;
    
    if (stock === 0) return { status: 'out', color: 'red', text: 'Rupture' };
    if (stock <= minLevel) return { status: 'low', color: 'orange', text: 'Stock faible' };
    return { status: 'ok', color: 'green', text: 'En stock' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-purple-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-2xl ring-4 ring-purple-200/50">
              <Package className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Produits Électroniques
              </h1>
              <p className="text-lg text-purple-700 dark:text-purple-300 mt-2">
                Gestion du catalogue produits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Statistiques rapides */}
            <div className="flex gap-4">
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{products.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{products.filter(p => p.active).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Actifs</div>
              </div>
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.isPromotion).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Promos</div>
              </div>
            </div>

            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nouveau Produit
            </button>
          </div>
        </motion.div>

        {/* Filtres et contrôles */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Recherche */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Filtre catégorie */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Toutes catégories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.value}</option>
              ))}
            </select>

            {/* Filtre marque */}
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Toutes marques</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Tous statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="new">Nouveaux</option>
              <option value="promotion">En promotion</option>
              <option value="low_stock">Stock faible</option>
            </select>

            {/* Tri */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="stock">Stock</option>
                <option value="brand">Marque</option>
                <option value="created">Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Contrôles d'affichage */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500 mt-2">
              Essayez de modifier vos filtres ou ajoutez un nouveau produit
            </p>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts}
            viewMode={viewMode}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            getCategoryIcon={getCategoryIcon}
            getCategoryColor={getCategoryColor}
            formatPrice={formatPrice}
            getStockStatus={getStockStatus}
          />
        )}

        {/* Modal d'ajout/édition */}
        <AnimatePresence>
          {showModal && (
            <ProductModal
              product={editingProduct}
              onClose={handleModalClose}
              onSave={handleProductSaved}
              categories={categories}
              brands={brands}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Composant grille de produits
const ProductGrid = ({ products, viewMode, onEdit, onDelete, getCategoryIcon, getCategoryColor, formatPrice, getStockStatus }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Produit</th>
                <th className="px-6 py-4 text-left">Catégorie</th>
                <th className="px-6 py-4 text-left">Prix</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/50">
              {products.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  getCategoryIcon={getCategoryIcon}
                  getCategoryColor={getCategoryColor}
                  formatPrice={formatPrice}
                  getStockStatus={getStockStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          getCategoryIcon={getCategoryIcon}
          getCategoryColor={getCategoryColor}
          formatPrice={formatPrice}
          getStockStatus={getStockStatus}
        />
      ))}
    </div>
  );
};

// Composant carte produit
const ProductCard = ({ product, onEdit, onDelete, getCategoryIcon, getCategoryColor, formatPrice, getStockStatus }) => {
  const CategoryIcon = getCategoryIcon(product.category);
  const stockStatus = getStockStatus(product);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
    >
      {/* Image et badges */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CategoryIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              NOUVEAU
            </span>
          )}
          {product.isPromotion && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              PROMO
            </span>
          )}
        </div>

        {/* Statut stock */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            stockStatus.color === 'green' ? 'bg-green-100 text-green-800' :
            stockStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {stockStatus.text}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {product.brand} {product.model && `• ${product.model}`}
            </p>
          </div>
          <div className={`p-2 rounded-xl bg-${getCategoryColor(product.category)}-100 dark:bg-${getCategoryColor(product.category)}-900/30`}>
            <CategoryIcon className={`w-5 h-5 text-${getCategoryColor(product.category)}-600`} />
          </div>
        </div>

        {/* Prix */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            {product.isPromotion && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.isPromotion && product.originalPrice && (
            <span className="text-sm text-green-600 font-medium">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Stock:</span>
            <span className="font-medium">{product.stockQuantity} unités</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition"
          >
            <Edit3 className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Composant ligne de liste
const ProductListItem = ({ product, onEdit, onDelete, getCategoryIcon, getCategoryColor, formatPrice, getStockStatus }) => {
  const CategoryIcon = getCategoryIcon(product.category);
  const stockStatus = getStockStatus(product);
  
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
            <CategoryIcon className={`w-6 h-6 text-${getCategoryColor(product.category)}-600`} />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
            <div className="text-sm text-gray-500">{product.brand} {product.model}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(product.category)}-100 text-${getCategoryColor(product.category)}-800`}>
          <CategoryIcon className="w-3 h-3" />
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-600">{formatPrice(product.price)}</span>
          {product.isPromotion && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
              PROMO
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{product.stockQuantity}</span>
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            stockStatus.color === 'green' ? 'bg-green-100 text-green-800' :
            stockStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {stockStatus.text}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
              NOUVEAU
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {product.active ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default Products;