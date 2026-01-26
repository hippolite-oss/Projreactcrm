import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../services/api';
import ProductCard from './ProductCard';
import OrderConfirmation from './OrderConfirmation';
import { Package, AlertCircle, RefreshCw } from 'lucide-react';

const ProductsSection = ({ className = '' }) => {
  const { t } = useLanguage();
  const { showNotification } = useNotifications();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Charger les produits depuis l'API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/products');
      
      if (Array.isArray(response.data)) {
        // Filtrer seulement les produits actifs
        const activeProducts = response.data.filter(product => product.isActive !== false);
        setProducts(activeProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setError('Impossible de charger les produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);

  // Gérer la soumission d'une commande
  const handleOrderSubmit = async (orderData) => {
    try {
      const response = await api.post('/api/commande-online', {
        productId: orderData.productId,
        quantity: orderData.quantity,
        totalPrice: orderData.totalPrice,
        customerName: orderData.customerInfo?.name || 'Client Web',
        customerEmail: orderData.customerInfo?.email || 'client@web.com',
        customerPhone: orderData.customerInfo?.phone || '',
        status: 'pending'
      });

      if (response.data.success) {
        showNotification('Commande créée avec succès !', 'success');
        // Afficher la confirmation
        setConfirmedOrder(response.data.data);
        // Recharger les produits pour mettre à jour les stocks
        fetchProducts();
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la commande';
      showNotification(errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  };

  // Affichage du loading
  if (loading) {
    return (
      <div className={`products-section ${className}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-3" />
            <span className="text-lg text-gray-600">{t('loading', 'Chargement...')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className={`products-section ${className}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="w-8 h-8 mr-3" />
            <div className="text-center">
              <p className="text-lg font-medium">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                {t('retry', 'Réessayer')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`products-section ${className}`}>
      {/* En-tête de la section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {t('myProducts', 'Mes Produits')}
            </h2>
            <p className="text-gray-600">
              {t('browseAndOrderProducts', 'Parcourez et commandez nos produits')}
            </p>
          </div>
        </div>
        
        {/* Statistiques rapides */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>
            {products.length} {t('productsAvailable', 'produit(s) disponible(s)')}
          </span>
          <span>
            {products.filter(p => p.stock > 0).length} {t('inStock', 'en stock')}
          </span>
        </div>
      </div>

      {/* Liste des produits */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2">
              {t('noProductsAvailable', 'Aucun produit disponible')}
            </h3>
            <p>
              {t('noProductsMessage', 'Les produits seront affichés ici une fois ajoutés par l\'administrateur.')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrderSubmit={handleOrderSubmit}
            />
          ))}
        </div>
      )}

      {/* Bouton de rechargement */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh', 'Actualiser')}
        </button>
      </div>

      {/* Modal de confirmation de commande */}
      {confirmedOrder && (
        <OrderConfirmation
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
};

export default ProductsSection;