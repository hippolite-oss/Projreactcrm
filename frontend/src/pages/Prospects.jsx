import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { 
  Search, Loader2, Eye, Phone, Mail, X, Users,
  Calendar, Building, MapPin, MessageSquare, Settings,
  CheckCircle, Clock, Target, Award, XCircle
} from 'lucide-react';

const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProspects(1);
  }, [search, statutFilter]);

  const fetchProspects = async (page = 1) => {
    console.log('📡 Prospects - Récupération des prospects, page:', page);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 15);
      if (search) params.append('search', search);
      if (statutFilter) params.append('statut', statutFilter);

      console.log('📡 Paramètres API (Prospects):', Object.fromEntries(params));

      const res = await api.get('/api/prospects', { params });
      console.log('📦 Réponse API (Prospects):', res.data);
      
      if (res.data.success) {
        const prospectsData = res.data.data || [];
        console.log('✅ Prospects récupérés:', prospectsData.length, 'prospects');
        setProspects(prospectsData);
        setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
      } else {
        console.warn('⚠️ Réponse API sans succès (Prospects):', res.data);
        setProspects([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement prospects:', error);
      setProspects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerContacte = async (id) => {
    if (!window.confirm('Marquer ce prospect comme contacté ?')) return;
    
    setActionLoading(true);
    try {
      const response = await api.put(`/api/prospects/${id}/contact`);
      console.log('✅ Prospect marqué comme contacté:', response.data);
      
      alert('Prospect marqué comme contacté avec succès');
      fetchProspects(pagination.page);
    } catch (error) {
      console.error('❌ Erreur marquage contacté:', error);
      alert('Erreur lors du marquage comme contacté');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async (id, template = 'welcome') => {
    // Demander quel type d'email envoyer
    const emailTypes = {
      'welcome': '🎯 Email de bienvenue (première prise de contact)',
      'demo_planifiee': '📅 Confirmation de démonstration planifiée',
      'demo_reussie': '🎉 Suivi après démonstration réussie',
      'suivi_commercial': '📈 Relance commerciale personnalisée'
    };

    const selectedTemplate = template === 'welcome' ? await new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-purple-200 dark:border-purple-800">
          <h3 class="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-6 text-center">
            📧 Choisir le type d'email
          </h3>
          <div class="space-y-3">
            ${Object.entries(emailTypes).map(([key, label]) => `
              <button 
                onclick="selectTemplate('${key}')" 
                class="w-full p-4 text-left rounded-xl border border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
              >
                <div class="font-medium">${label}</div>
              </button>
            `).join('')}
          </div>
          <button 
            onclick="selectTemplate('cancel')" 
            class="w-full mt-6 p-3 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-xl font-medium transition"
          >
            Annuler
          </button>
        </div>
      `;
      
      window.selectTemplate = (template) => {
        document.body.removeChild(modal);
        delete window.selectTemplate;
        resolve(template === 'cancel' ? null : template);
      };
      
      document.body.appendChild(modal);
    }) : template;

    if (!selectedTemplate) return;
    
    setActionLoading(true);
    try {
      // 1. Appeler l'API backend pour marquer l'email comme envoyé
      const response = await api.post(`/api/prospects/${id}/email`, {
        template: selectedTemplate,
        subject: emailTypes[selectedTemplate] || 'Email prospect',
        message: `Email ${selectedTemplate} envoyé au prospect`
      });
      
      if (response.data.success && response.data.prospectData) {
        console.log('📧 Données prospect reçues du backend:', response.data.prospectData);
        
        // 2. Utiliser EmailJS pour envoyer l'email avec le template choisi
        const { default: emailService } = await import('../services/emailService');
        const emailResult = await emailService.envoyerEmailProspect(
          response.data.prospectData, 
          selectedTemplate
        );
        
        if (emailResult.success) {
          alert(`Email "${emailTypes[selectedTemplate]}" envoyé avec succès !`);
          console.log('✅ Email prospect envoyé via EmailJS:', emailResult);
        } else {
          alert(`Erreur EmailJS: ${emailResult.message}`);
          console.error('❌ Erreur EmailJS:', emailResult);
        }
        
        // 3. Rafraîchir la liste dans tous les cas (le statut a été mis à jour)
        fetchProspects(pagination.page);
      } else {
        alert('Erreur lors de la préparation de l\'email');
      }
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      alert('Erreur lors de l\'envoi de l\'email');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      contacte: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      qualifie: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      converti: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      perdu: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
    
    const icons = {
      nouveau: <Clock className="w-3 h-3" />,
      contacte: <Phone className="w-3 h-3" />,
      qualifie: <Target className="w-3 h-3" />,
      converti: <Award className="w-3 h-3" />,
      perdu: <XCircle className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${styles[statut] || 'bg-gray-100 text-gray-800'}`}>
        {icons[statut]}
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
              <Users className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Contacts
              </h1>
              <p className="text-lg text-purple-700 dark:text-purple-300 mt-2">
                Gestion des demandes de démonstration
              </p>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="flex gap-4">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{prospects.filter(p => p.statut === 'nouveau').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Nouveaux</div>
            </div>
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{prospects.filter(p => p.statut === 'converti').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Convertis</div>
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
                placeholder="Rechercher nom / entreprise / email..."
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
              <option value="contacte">Contacté</option>
              <option value="qualifie">Qualifié</option>
              <option value="converti">Converti</option>
              <option value="perdu">Perdu</option>
            </select>

            <button
              onClick={() => {
                setSearch('');
                setStatutFilter('');
                fetchProspects(1);
              }}
              className="px-6 py-3 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste des prospects */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
          ) : prospects.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                Aucun prospect trouvé
              </h3>
              <p className="text-gray-500 mt-2">
                Les demandes de démonstration apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left">Date</th>
                    <th className="px-8 py-5 text-left">Nom</th>
                    <th className="px-8 py-5 text-left">Entreprise</th>
                    <th className="px-8 py-5 text-left">Email</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-purple-900/50">
                  {prospects.map(prospect => (
                    <motion.tr
                      key={prospect.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors"
                    >
                      <td className="px-8 py-5 font-medium">
                        {formatDate(prospect.createdAt)}
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-medium">{prospect.nom}</div>
                        {prospect.telephone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {prospect.telephone}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        {prospect.entreprise ? (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            {prospect.entreprise}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {prospect.email}
                        </div>
                        {prospect.email_envoye && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ Email envoyé
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        {getStatutBadge(prospect.statut)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Bouton Voir détails */}
                          <button
                            onClick={() => {
                              setSelectedProspect(prospect);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {/* Menu déroulant pour les emails */}
                          <div className="relative group">
                            <button
                              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition disabled:opacity-50"
                              title="Envoyer un email"
                              disabled={actionLoading}
                            >
                              <Mail className="w-5 h-5" />
                            </button>
                            
                            {/* Menu déroulant */}
                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-purple-200 dark:border-purple-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[280px]">
                              <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                                  Choisir le type d'email
                                </div>
                                
                                <button
                                  onClick={() => handleSendEmail(prospect.id, 'welcome')}
                                  className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition text-sm"
                                >
                                  <div className="font-medium">🎯 Email de bienvenue</div>
                                  <div className="text-xs text-gray-500">Première prise de contact</div>
                                </button>
                                
                                <button
                                  onClick={() => handleSendEmail(prospect.id, 'demo_planifiee')}
                                  className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition text-sm"
                                >
                                  <div className="font-medium">📅 Démonstration planifiée</div>
                                  <div className="text-xs text-gray-500">Confirmation de RDV</div>
                                </button>
                                
                                <button
                                  onClick={() => handleSendEmail(prospect.id, 'demo_reussie')}
                                  className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition text-sm"
                                >
                                  <div className="font-medium">🎉 Démonstration réussie</div>
                                  <div className="text-xs text-gray-500">Suivi après démo</div>
                                </button>
                                
                                <button
                                  onClick={() => handleSendEmail(prospect.id, 'suivi_commercial')}
                                  className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition text-sm"
                                >
                                  <div className="font-medium">📈 Relance commerciale</div>
                                  <div className="text-xs text-gray-500">Suivi personnalisé</div>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Bouton Marquer contacté */}
                          {prospect.statut === 'nouveau' && (
                            <button
                              onClick={() => handleMarquerContacte(prospect.id)}
                              disabled={actionLoading}
                              className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition disabled:opacity-50"
                              title="Marquer comme contacté"
                            >
                              <Phone className="w-5 h-5" />
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
                  onClick={() => fetchProspects(Math.max(1, pagination.page - 1))}
                  className="px-5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/50 disabled:opacity-50 transition"
                >
                  Précédent
                </button>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchProspects(pagination.page + 1)}
                  className="px-5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/50 disabled:opacity-50 transition"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Détails */}
        {showDetailModal && selectedProspect && (
          <ProspectDetailModal
            prospect={selectedProspect}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedProspect(null);
            }}
            onUpdate={() => {
              fetchProspects(pagination.page);
              setShowDetailModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Modal de détails du prospect
const ProspectDetailModal = ({ prospect, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: prospect.nom,
    entreprise: prospect.entreprise || '',
    email: prospect.email,
    telephone: prospect.telephone || '',
    message: prospect.message || '',
    statut: prospect.statut,
    notes_admin: prospect.notes_admin || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/api/prospects/${prospect.id}`, formData);
      console.log('✅ Prospect mis à jour:', response.data);
      
      alert('Prospect mis à jour avec succès');
      onUpdate();
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-4">
            <Users className="w-10 h-10" />
            Détails du Prospect
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-3 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition"
              title={editMode ? "Annuler" : "Modifier"}
            >
              {editMode ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
            </button>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations principales */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
              Informations du Prospect
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Nom *
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                ) : (
                  <p className="text-lg font-semibold">{prospect.nom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Entreprise
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                ) : (
                  <p className="text-lg">{prospect.entreprise || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                ) : (
                  <p className="text-lg">{prospect.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Téléphone
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                ) : (
                  <p className="text-lg">{prospect.telephone || '—'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Statut
                </label>
                {editMode ? (
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({...formData, statut: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="contacte">Contacté</option>
                    <option value="qualifie">Qualifié</option>
                    <option value="converti">Converti</option>
                    <option value="perdu">Perdu</option>
                  </select>
                ) : (
                  <div className="inline-block">
                    {getStatutBadge(prospect.statut)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message et notes */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
              Messages et Notes
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Message initial
              </label>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl">
                <p className="whitespace-pre-line">{prospect.message || 'Aucun message'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Notes administrateur
              </label>
              {editMode ? (
                <textarea
                  rows={6}
                  value={formData.notes_admin}
                  onChange={(e) => setFormData({...formData, notes_admin: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  placeholder="Ajouter des notes sur ce prospect..."
                />
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl min-h-[120px]">
                  <p className="whitespace-pre-line">{prospect.notes_admin || 'Aucune note'}</p>
                </div>
              )}
            </div>

            {/* Métadonnées */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="font-semibold mb-3">Informations de suivi</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Créé le {formatDate(prospect.createdAt)}</span>
                </div>
                {prospect.date_contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>Contacté le {formatDate(prospect.date_contact)}</span>
                    {prospect.contacte_par && <span>par {prospect.contacte_par}</span>}
                  </div>
                )}
                {prospect.email_envoye && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Email envoyé le {formatDate(prospect.date_email)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Source: {prospect.source || 'website'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-xl font-medium transition"
          >
            Fermer
          </button>

          {editMode && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-medium shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Sauvegarder
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Fonction utilitaire pour les badges (réutilisée)
const getStatutBadge = (statut) => {
  const styles = {
    nouveau: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    contacte: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    qualifie: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    converti: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    perdu: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
  };
  
  const icons = {
    nouveau: <Clock className="w-3 h-3" />,
    contacte: <Phone className="w-3 h-3" />,
    qualifie: <Target className="w-3 h-3" />,
    converti: <Award className="w-3 h-3" />,
    perdu: <XCircle className="w-3 h-3" />
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${styles[statut] || 'bg-gray-100 text-gray-800'}`}>
      {icons[statut]}
      {statut.charAt(0).toUpperCase() + statut.slice(1)}
    </span>
  );
};

export default Prospects;