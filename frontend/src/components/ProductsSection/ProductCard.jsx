import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import OrderForm from './OrderForm';
import { Package, Tag, Warehouse, AlertTriangle } from 'lucide-react';

const ProductCard = ({ product, onOrderSubmit }) => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('€', 'F');
  };

  // Déterminer le statut de stock
  const getStockStatus = () => {
    if (product.stock <= 0) {
      return { status: 'out', label: t('outOfStock', 'Rupture de stock'), color: 'text-red-600 bg-red-100' };
    } else if (product.stock <= 5) {
      return { status: 'low', label: t('lowStock', 'Stock faible'), color: 'text-orange-600 bg-orange-100' };
    } else {
      return { status: 'available', label: t('available', 'Disponible'), color: 'text-green-600 bg-green-100' };
    }
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image du produit */}
      <div className="relative h-48 bg-gray-100">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Badge de statut de stock */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
          {stockStatus.label}
        </div>

        {/* Badge de catégorie */}
        {product.category && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {product.category}
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        {/* Nom et description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {product.description}
            </p>
          )}
        </div>

        {/* Informations produit */}
        <div className="space-y-3 mb-6">
          {/* Prix */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-2xl font-bold text-gray-800">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {product.stock} {t('unitsInStock', 'unité(s) en stock')}
            </span>
          </div>

          {/* Spécifications techniques (pour les produits électroniques) */}
          {(product.brand || product.model || product.specifications) && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                {product.brand && (
                  <div>
                    <span className="font-medium">{t('brand', 'Marque')}:</span> {product.brand}
                  </div>
                )}
                {product.model && (
                  <div>
                    <span className="font-medium">{t('model', 'Modèle')}:</span> {product.model}
                  </div>
                )}
                {product.specifications && (
                  <div>
                    <span className="font-medium">{t('specs', 'Spéc.')}:</span> {product.specifications}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Formulaire de commande */}
        {isOutOfStock ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-red-700 font-medium">
              {t('productOutOfStock', 'Produit en rupture de stock')}
            </p>
            <p className="text-red-600 text-sm mt-1">
              {t('contactUsForAvailability', 'Contactez-nous pour la disponibilité')}
            </p>
          </div>
        ) : (
          <OrderForm
            product={product}
            onSubmit={onOrderSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;