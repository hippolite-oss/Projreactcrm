// src/pages/Home.jsx
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Package,
  ShoppingBag,
  Mail,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import axios from "axios";

const Home = () => {
  console.log('🏠 Home component is rendering');
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Slides pour le hero
  const slides = [
    {
      image: "/b8.jpg",
      title: "Gérez vos relations client efficacement",
      subtitle: "Augmentez vos ventes de 45% avec notre CRM intelligent",
      cta: "Essai gratuit 30 jours",
    },
    {
      image: "/b6.jpg",
      title: "Automatisez vos processus commerciaux",
      subtitle: "Réduisez le temps administratif de 70%",
      cta: "Voir les fonctionnalités",
    },
    {
      image: "/b9.jpg",
      title: "Suivez vos performances en temps réel",
      subtitle: "Tableaux de bord personnalisés pour une meilleure prise de décision",
      cta: "Découvrir les rapports",
    },
  ];

  // Fonctionnalités principales
  const features = [
    {
      id: 1,
      title: "Gestion des Clients",
      description: "Centralisez toutes les informations clients, historiques et interactions",
      icon: Users,
      stats: "500+ entreprises",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Pipeline des Ventes",
      description: "Suivez chaque opportunité de la prospection à la facturation",
      icon: TrendingUp,
      stats: "Conversion +35%",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      title: "Automatisation",
      description: "Automatisez vos emails, rappels et tâches répétitives",
      icon: BarChart3,
      stats: "70% de temps gagné",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      title: "Analytics & Rapports",
      description: "Tableaux de bord personnalisables avec indicateurs clés",
      icon: BarChart3,
      stats: "50+ rapports disponibles",
      color: "from-orange-500 to-red-500",
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Fonction pour charger les produits depuis l'API publique
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      console.log('🔄 Chargement des produits depuis l\'API publique...');
      
      const response = await axios.get('http://localhost:3001/api/products/public/featured');
      console.log('📦 Produits reçus:', response.data);
      
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des produits:', error);
      setProductsError('Impossible de charger les produits');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const formatPrice = (price) => {
    try {
      return `${price || 0} F`;
    } catch (e) {
      return '0 F';
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
        <Header />

        {/* Hero Section */}
        <section id="accueil" className="pt-16 md:pt-0">
          <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.1,
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {/* Image de fond */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="max-w-xl md:max-w-2xl text-white"
                    >
                      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl lg:text-2xl mb-6 text-white drop-shadow-lg">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 mb-2">
                        <Link
                          to="/login"
                          className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden text-center"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {slide.cta}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </div>
                      <div className="flex items-center gap-6 mt-8">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                          <span className="text-sm text-white drop-shadow">
                            Sans engagement
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                          <span className="text-sm text-white drop-shadow">
                            Configuration gratuite
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                          <span className="text-sm text-white drop-shadow">
                            Support 24/7
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Contrôles du slider */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all duration-300 group"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all duration-300 group"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Indicateurs de slide */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white w-8"
                      : "bg-white/30 w-3 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 md:-mt-12 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  icon: <Users className="h-7 w-7" />,
                  title: "Clients actifs",
                  value: "15,000+",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: <TrendingUp className="h-7 w-7" />,
                  title: "Ventes augmentées",
                  value: "+45%",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: <DollarSign className="h-7 w-7" />,
                  title: "ROI moyen",
                  value: "300%",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: <BarChart3 className="h-7 w-7" />,
                  title: "Temps gagné",
                  value: "70%",
                  color: "from-orange-500 to-red-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-5 md:p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color} mb-4`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="font-bold text-2xl md:text-3xl mb-2">
                    {item.value}
                  </h3>
                  <p className="text-gray-600 text-base">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4">
                Pourquoi choisir notre CRM
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Transformez votre gestion commerciale
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Un CRM complet conçu pour simplifier vos processus et booster vos résultats
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.color}`}
                  ></div>
                  <div className="p-6 md:p-8">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-600">
                        {feature.stats}
                      </span>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Produits - Données de la base de données */}
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

            {/* État de chargement */}
            {productsLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des produits...</p>
              </div>
            )}

            {/* État d'erreur */}
            {productsError && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-red-300" />
                <h3 className="text-xl font-medium mb-2 text-red-600">
                  {productsError}
                </h3>
                <button
                  onClick={loadProducts}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Aucun produit */}
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2 text-gray-600">
                  Aucun produit disponible
                </h3>
                <p className="text-gray-500">
                  Les produits seront affichés ici une fois ajoutés.
                </p>
              </div>
            )}

            {/* Grille de produits */}
            {!productsLoading && !productsError && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => {
                  if (!product || !product.id) return null;
                  
                  return (
                    <div
                      key={product.id}
                      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name || 'Produit'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback si image non trouvée */}
                        <div 
                          className="w-full h-full flex items-center justify-center bg-gray-100"
                          style={{ display: product.imageUrl ? 'none' : 'flex' }}
                        >
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>

                        {/* Prix superposé */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <span className="text-white text-lg font-bold">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        {/* Badge de stock si faible */}
                        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                            Stock faible
                          </div>
                        )}

                        {/* Badge rupture de stock */}
                        {product.stockQuantity <= 0 && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            Rupture
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Section Contact */}
        <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4">
                Contactez-nous
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Prêt à booster vos ventes ?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Obtenez une démonstration personnalisée et découvrez comment notre CRM peut transformer votre business
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;