import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Mail, AlertCircle, User, Calendar, Phone, MapPin } from 'lucide-react';

const ModalTraitementCommande = ({ commande, onClose, onTraiter, loading }) => {
  const [notesAdmin, setNotesAdmin] = useState('');
  const [envoyerEmail, setEnvoyerEmail] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onTraiter(commande.id || commande._id, {
      notes_admin: notesAdmin.trim() || undefined,
      envoyer_email: envoyerEmail
    });
  };

  const formatDate = (date) => new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        {/* En-tête compact */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h3 className="text-lg sm:text-2xl font-bold">Traiter la Commande</h3>
                <p className="text-green-100 text-sm hidden sm:block">Finaliser le traitement et notifier le client</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Informations client compactes */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              {commande.nom}
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{commande.telephone}</span>
              </div>
              
              {commande.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{commande.email}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{commande.ville}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(commande.createdAt || commande.date_creation)}</span>
              </div>
            </div>

            {/* Commande en version compacte */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Commande</p>
              <div className="bg-white p-3 rounded-lg border text-sm max-h-20 overflow-y-auto">
                {commande.commande}
              </div>
            </div>

            {commande.notes && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Notes client</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm max-h-16 overflow-y-auto">
                  {commande.notes}
                </div>
              </div>
            )}
          </div>

          {/* Formulaire compact */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes de traitement
              </label>
              <textarea
                value={notesAdmin}
                onChange={(e) => setNotesAdmin(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Notes sur le traitement (optionnel)..."
              />
            </div>

            {/* Option email compacte */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="envoyerEmail"
                  checked={envoyerEmail}
                  onChange={(e) => setEnvoyerEmail(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="envoyerEmail" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Envoyer email de confirmation
                  </label>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {commande.email 
                      ? `Vers ${commande.email}`
                      : 'Aucune adresse email disponible'
                    }
                  </p>
                </div>
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              </div>
            </div>

            {!commande.email && envoyerEmail && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Aucune adresse email</p>
                  <p className="text-xs text-orange-700">L'option d'envoi sera ignorée.</p>
                </div>
              </div>
            )}

            {/* Actions compactes */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Traitement...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Marquer traité</span>
                    {envoyerEmail && commande.email && (
                      <span className="text-green-200 hidden sm:inline">+ Email</span>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalTraitementCommande;