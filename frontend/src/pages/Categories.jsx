import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Tag,
  MoreVertical,
  Move,
  Settings,
  BarChart3
} from 'lucide-react';
import api from '../services/api';
import './Categories.css';

// Import du script de test pour debug
import { testAuthAndCategories } from '../utils/testAuth';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [stats, setStats] = useState({});
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'list'

  // Formulaire
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: null,
    icon: '',
    color: '',
    active: true,
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  const colors = [
    'blue', 'purple', 'green', 'red', 'orange', 'yellow', 'pink', 'gray', 'indigo', 'teal'
  ];

  const icons = [
    'Smartphone', 'Monitor', 'Headphones', 'Tv', 'Home', 'Cpu', 'Cable', 'Gamepad2',
    'Laptop', 'Tablet', 'Speaker', 'Camera', 'Printer', 'HardDrive', 'Keyboard',
    'Mouse', 'Wifi', 'Battery', 'Zap', 'Settings'
  ];

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm, showInactive]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/categories/tree?includeInactive=${showInactive}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/api/categories/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  const filterCategories = () => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }

    const filterRecursive = (cats) => {
      return cats.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const hasMatchingChildren = category.children && category.children.length > 0 && 
                                  filterRecursive(category.children).length > 0;

        if (matchesSearch || hasMatchingChildren) {
          return {
            ...category,
            children: category.children ? filterRecursive(category.children) : []
          };
        }
        return false;
      }).filter(Boolean);
    };

    setFilteredCategories(filterRecursive(categories));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/api/categories', formData);
      } else if (modalMode === 'edit') {
        await api.patch(`/api/categories/${selectedCategory.id}`, formData);
      }
      
      setShowModal(false);
      resetForm();
      loadCategories();
      loadStats();
    } catch (error) {
      console.error('Erreur sauvegarde catégorie:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      await api.delete(`/api/categories/${categoryId}`);
      loadCategories();
      loadStats();
    } catch (error) {
      console.error('Erreur suppression catégorie:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    
    if (mode === 'create') {
      resetForm();
    } else if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        parentId: category.parentId || null,
        icon: category.icon || '',
        color: category.color || '',
        active: category.active ?? true,
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        keywords: category.keywords || ''
      });
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: null,
      icon: '',
      color: '',
      active: true,
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const renderCategoryTree = (cats, level = 0) => {
    return cats.map(category => (
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg mb-2 ${level > 0 ? 'ml-6' : ''}`}
      >
        <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            {category.children && category.children.length > 0 && (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {expandedCategories.has(category.id) ? 
                  <ChevronDown size={16} /> : 
                  <ChevronRight size={16} />
                }
              </button>
            )}
            
            <div className={`p-2 rounded-lg bg-${category.color || 'gray'}-100`}>
              {category.children && category.children.length > 0 ? (
                expandedCategories.has(category.id) ? 
                  <FolderOpen size={20} className={`text-${category.color || 'gray'}-600`} /> :
                  <Folder size={20} className={`text-${category.color || 'gray'}-600`} />
              ) : (
                <Tag size={20} className={`text-${category.color || 'gray'}-600`} />
              )}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {!category.active && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    Inactif
                  </span>
                )}
                {category.children && category.children.length > 0 && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {category.children.length} sous-catégories
                  </span>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openModal('view', category)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Voir détails"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => openModal('edit', category)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {expandedCategories.has(category.id) && category.children && category.children.length > 0 && (
          <div className="border-t bg-gray-50 p-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </motion.div>
    ));
  };

  const getAllCategories = (cats, result = []) => {
    cats.forEach(category => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        getAllCategories(category.children, result);
      }
    });
    return result;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">Organisez vos produits par catégories hiérarchiques</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={testAuthAndCategories}
            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            🔧 Debug Auth
          </button>
          <button
            onClick={() => openModal('create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nouvelle Catégorie</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Principales</p>
              <p className="text-2xl font-bold text-green-600">{stats.parents || 0}</p>
            </div>
            <Folder className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sous-catégories</p>
              <p className="text-2xl font-bold text-purple-600">{stats.children || 0}</p>
            </div>
            <Tag className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-orange-600">{stats.active || 0}</p>
            </div>
            <Eye className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Afficher inactives</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-2 rounded-lg ${viewMode === 'tree' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Arbre
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Liste des catégories */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune catégorie</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Aucune catégorie ne correspond à votre recherche.' : 'Commencez par créer une nouvelle catégorie.'}
            </p>
          </div>
        ) : (
          renderCategoryTree(filteredCategories)
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {modalMode === 'create' && 'Nouvelle Catégorie'}
                    {modalMode === 'edit' && 'Modifier Catégorie'}
                    {modalMode === 'view' && 'Détails Catégorie'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={modalMode === 'view'}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  {/* Catégorie parent */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie Parent
                    </label>
                    <select
                      value={formData.parentId || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
                      disabled={modalMode === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Aucune (Catégorie principale)</option>
                      {getAllCategories(categories).map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Apparence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icône
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Sélectionner une icône</option>
                        {icons.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        disabled={modalMode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Sélectionner une couleur</option>
                        {colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Statut */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                        disabled={modalMode === 'view'}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Catégorie active</span>
                    </label>
                  </div>

                  {/* SEO */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titre Meta
                        </label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                          disabled={modalMode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description Meta
                        </label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                          disabled={modalMode === 'view'}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mots-clés (séparés par des virgules)
                        </label>
                        <input
                          type="text"
                          value={formData.keywords}
                          onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                          disabled={modalMode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {modalMode !== 'view' && (
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {modalMode === 'create' ? 'Créer' : 'Sauvegarder'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;