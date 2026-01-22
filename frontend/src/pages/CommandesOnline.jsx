import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Search, Filter, Loader2, Eye, CheckCircle, XCircle, AlertCircle,
  Clock, Calendar, User, Phone, Mail, MapPin, MessageSquare, ArrowRight , ShoppingBag, X} from 'lucide-react';

const CommandesOnline = () => {
  const { marquerCommandeLue, rafraichirNotifications } = useNotifications();
  const [commandes, setCommandes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchCommandes(1);
  }, [search, statutFilter, pagination.page]);

  const fetchCommandes = async (page = 1) => {
    console.log('📡 CommandesOnline - Récupération des commandes, page:', page);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (search) params.append('search', search);
      if (statutFilter) params.append('statut', statutFilter);

      console.log('📡 Paramètres API (Admin):', Object.fromEntries(params));

      const res = await api.get('/api/commande-online', { params });
      console.log('📦 Réponse API (Admin):', res.data);
      
      if (res.data.success) {
        const commandesData = res.data.data || [];
        console.log('✅ Commandes récupérées (Admin):', commandesData.length, 'commandes');
        setCommandes(commandesData);
        setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
      } else {
        console.warn('⚠️ Réponse API sans succès (Admin):', res.data);
        setCommandes([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes (Admin):', error);
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerLu = async (id) => {
    if (!window.confirm('Marquer cette commande comme lue ?')) return;
    
    const success = await marquerCommandeLue(id);
    if (success) {
      // Recharger la liste des commandes
      fetchCommandes(pagination.page);
    } else {
      alert('Erreur lors du marquage');
    }
  };

  const handleAnnuler = async (id) => {
    if (!window.confirm('Annuler cette commande ?')) return;
    try {
      await api.put(`/api/commande-online/${id}/cancel`);
      fetchCommandes(pagination.page);
      // Rafraîchir les notifications après annulation
      rafraichirNotifications();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur annulation');
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      lu: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      en_cours: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      traite: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      annule: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${styles[statut] || 'bg-gray-100 text-gray-800'}`}>
        {statut.charAt(0).toUpperCase() + statut.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

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
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Commandes en ligne
              </h1>
              <p className="text-lg text-purple-700 dark:text-purple-300 mt-2">
                Gestion des demandes clients personnalisées
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher nom / téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Tous statuts</option>
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
                fetchCommandes(1);
              }}
              className="px-6 py-3 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                Aucune commande trouvée
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left">Date</th>
                    <th className="px-8 py-5 text-left">Client</th>
                    <th className="px-8 py-5 text-left">Téléphone</th>
                    <th className="px-8 py-5 text-left">Ville</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-purple-900/50">
                  {commandes.map(cmd => (
                    <motion.tr
                      key={cmd._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors"
                    >
                      <td className="px-8 py-5 font-medium">
                        {new Date(cmd.date_creation).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-8 py-5 font-medium">{cmd.nom}</td>
                      <td className="px-8 py-5">{cmd.telephone}</td>
                      <td className="px-8 py-5">{cmd.ville}</td>
                      <td className="px-8 py-5 text-center">
                        {getStatutBadge(cmd.statut)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedCommande(cmd);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {cmd.statut === 'nouveau' && (
                            <button
                              onClick={() => handleMarquerLu(cmd._id)}
                              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}

                          {cmd.statut !== 'annule' && (
                            <button
                              onClick={() => handleAnnuler(cmd._id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-8 py-5 border-t border-purple-200/50 dark:border-purple-800/50 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Affichage {(pagination.page - 1) * pagination.limit + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
              </p>
              <div className="flex gap-3">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchCommandes(Math.max(1, pagination.page - 1))}
                  className="px-5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/50 disabled:opacity-50 transition"
                >
                  Précédent
                </button>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchCommandes(pagination.page + 1)}
                  className="px-5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/50 disabled:opacity-50 transition"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Détails */}
        {showDetailModal && selectedCommande && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-2xl w-full p-10 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-4">
                  <ShoppingBag className="w-10 h-10" />
                  Détails de la commande
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition"
                >
                  <X className="w-8 h-8 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                    <p className="text-xl font-semibold">{selectedCommande.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                    <p className="text-xl font-semibold">{selectedCommande.telephone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-lg">{selectedCommande.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ville</p>
                    <p className="text-lg">{selectedCommande.ville}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
                  <p className="text-lg">{selectedCommande.adresse}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Commande</p>
                  <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl mt-2 whitespace-pre-line text-lg leading-relaxed">
                    {selectedCommande.commande}
                  </div>
                </div>

                {selectedCommande.notes && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                    <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl mt-2 whitespace-pre-line text-lg leading-relaxed">
                      {selectedCommande.notes}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                  <div className="mt-2">
                    {getStatutBadge(selectedCommande.statut)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Créée le {formatDate(selectedCommande.date_creation)}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-5 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 rounded-2xl font-bold text-xl transition"
                >
                  Fermer
                </button>

                {selectedCommande.statut === 'nouveau' && (
                  <button
                    onClick={() => {
                      handleMarquerLu(selectedCommande._id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 py-5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-bold text-xl shadow-xl transition flex items-center justify-center gap-3"
                  >
                    <CheckCircle className="w-7 h-7" />
                    Marquer comme lu
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandesOnline;