import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, ShoppingBag, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

const HomeProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount).replace('€', 'F');
    } catch (e) {
      return `${amount} F`;
    }
  };

  // Charger les produits depuis l'API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des produits...');
      const response = await api.get('/api/products');
      console.log('📦 Réponse API produits:', response.data);
      
      if (Array.isArray(response.data)) {
        // Filtrer seulement les produits actifs et prendre les 8 premiers
        const activeProducts = response.data
          .filter(product => product && product.isActive !== false)
          .slice(0, 8);
        console.log('✅ Produits actifs:', activeProducts);
        setProducts(activeProducts);
      } else {
        console.log('⚠️ Réponse API non-array:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des produits:', error);
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

  console.log('🎯 État actuel:', { loading, error, productsCount: products.length });

  return (
    <section id="produits" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-sm mb-4">
            Nos Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Produits Phares
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos meilleures solutions depuis notre catalogue
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mr-3" />
            <span className="text-lg text-gray-600">Chargement des produits...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="w-8 h-8 mr-3" />
            <div className="text-center">
              <p className="text-lg font-medium">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2 text-gray-600">
              Aucun produit disponible
            </h3>
            <p className="text-gray-500">
              Les produits seront affichés ici une fois ajoutés par l'administrateur.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => {
              if (!product || !product.id) return null;
              
              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Image du produit */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || 'Produit'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback si pas d'image */}
                    <div 
                      className="w-full h-full flex items-center justify-center bg-gray-100"
                      style={{ display: product.image ? 'none' : 'flex' }}
                    >
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>

                    {/* Prix et nom superposés sur l'image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium truncate">
                          {product.name || 'Produit sans nom'}
                        </span>
                        <span className="text-white text-lg font-bold">
                          {formatCurrency(product.price || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Badge de stock si faible */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                        Stock faible
                      </div>
                    )}

                    {/* Badge rupture de stock */}
                    {product.stock <= 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Rupture
                      </div>
                    )}

                    {/* Badge catégorie si disponible */}
                    {product.category && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                        {product.category}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton Voir plus */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/dashboard/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              <ShoppingBag className="h-5 w-5" />
              Voir tous nos produits
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProductsSection;