import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useCommandes } from '../hooks/useCommandes';
import './Commande.css';
import { 
  Search, Filter, Loader2, Eye, Plus, Calendar, 
  MapPin, ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle,
  RefreshCw, ArrowRight, Package, Phone
} from 'lucide-react';

const Commande = () => {
  const navigate = useNavigate();
  const { rafraichirNotifications } = useNotifications();
  
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Utiliser le hook personnalisé pour gérer les commandes
  const {
    commandes,
    pagination,
    loading,
    error,
    refreshCommandes
  } = useCommandes({
    page: 1,
    limit: 10,
    search,
    statut: statutFilter,
    autoRefresh: true, // Auto-refresh toutes les 30 secondes
    refreshInterval: 30000
  });

  const handleRefresh = () => {
    console.log('🔄 Commande.jsx - Rafraîchissement manuel');
    refreshCommandes();
    rafraichirNotifications();
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-orange-100 text-orange-800 border-orange-200',
      lu: 'bg-blue-100 text-blue-800 border-blue-200',
      en_cours: 'bg-purple-100 text-purple-800 border-purple-200',
      traite: 'bg-green-100 text-green-800 border-green-200',
      annule: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const icons = {
      nouveau: <AlertCircle className="w-3 h-3" />,
      lu: <Eye className="w-3 h-3" />,
      en_cours: <Clock className="w-3 h-3" />,
      traite: <CheckCircle className="w-3 h-3" />,
      annule: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[statut] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {icons[statut]}
        {statut.charAt(0).toUpperCase() + statut.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (date) => new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mes Commandes
              </h1>
              <p className="text-gray-600 mt-1">
                Suivez l'état de vos commandes en temps réel
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            <button
              onClick={() => navigate('/nouvelle-commande')}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Nouvelle commande
            </button>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="lu">Lu</option>
              <option value="en_cours">En cours</option>
              <option value="traite">Traité</option>
              <option value="annule">Annulé</option>
            </select>

            <button
              onClick={() => {
                setSearch('');
                setStatutFilter('');
                refreshCommandes(1);
              }}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        </motion.div>

        {/* Liste des commandes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {search || statutFilter ? 'Aucune commande trouvée' : 'Aucune commande'}
              </h3>
              <p className="text-gray-500 mb-6">
                {search || statutFilter 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Vous n\'avez pas encore passé de commande'
                }
              </p>
              {!search && !statutFilter && (
                <button
                  onClick={() => navigate('/nouvelle-commande')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Passer ma première commande
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Liste des commandes */}
              <div className="divide-y divide-gray-100">
                {commandes.map((commande, index) => (
                  <motion.div
                    key={commande.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedCommande(commande);
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{commande.nom}</h3>
                          {getStatutBadge(commande.statut)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {commande.telephone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {commande.ville}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(commande.createdAt)}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {commande.commande}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Affichage {(pagination.page - 1) * pagination.limit + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => refreshCommandes(Math.max(1, pagination.page - 1))}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Précédent
                    </button>
                    <button
                      disabled={pagination.page === pagination.pages}
                      onClick={() => refreshCommandes(pagination.page + 1)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Modal Détails */}
        {showDetailModal && selectedCommande && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  Détails de la commande
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-semibold">{selectedCommande.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-semibold">{selectedCommande.telephone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{selectedCommande.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ville</p>
                    <p className="font-semibold">{selectedCommande.ville}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-semibold">{selectedCommande.adresse}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Commande</p>
                  <div className="bg-gray-50 p-4 rounded-xl mt-2 whitespace-pre-line">
                    {selectedCommande.commande}
                  </div>
                </div>

                {selectedCommande.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <div className="bg-gray-50 p-4 rounded-xl mt-2 whitespace-pre-line">
                      {selectedCommande.notes}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <div className="mt-1">
                        {getStatutBadge(selectedCommande.statut)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Créée le</p>
                      <p className="font-semibold">{formatDate(selectedCommande.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => navigate('/nouvelle-commande')}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle commande
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Commande;