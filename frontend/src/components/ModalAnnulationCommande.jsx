import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, XCircle, Mail, AlertTriangle, User, Calendar } from 'lucide-react';

const ModalAnnulationCommande = ({ commande, onClose, onAnnuler, loading }) => {
  const [raisonAnnulation, setRaisonAnnulation] = useState('');
  const [envoyerEmail, setEnvoyerEmail] = useState(true);

  const raisonsPredefines = [
    'Produit non disponible',
    'Demande du client',
    'Problème de livraison',
    'Prix non confirmé',
    'Erreur de commande',
    'Autre raison'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!raisonAnnulation.trim()) {
      alert('Veuillez indiquer une raison d\'annulation');
      return;
    }
    
    onAnnuler(commande.id || commande._id, {
      raison_annulation: raisonAnnulation.trim(),
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
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        {/* En-tête compact */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h3 className="text-lg sm:text-2xl font-bold">Annuler la Commande</h3>
                <p className="text-red-100 text-sm hidden sm:block">Indiquez la raison de l'annulation</p>
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
          {/* Informations commande compactes */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              {commande.nom}
            </h4>
            
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{commande.createdAt ? formatDate(commande.createdAt) : '—'}</span>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Commande</p>
              <div className="bg-white p-3 rounded-lg border text-sm max-h-16 overflow-y-auto">
                {commande.commande}
              </div>
            </div>
          </div>

          {/* Avertissement compact */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-orange-900">Attention</h4>
              <p className="text-xs text-orange-800">Action irréversible. Le client sera notifié.</p>
            </div>
          </div>

          {/* Formulaire compact */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison de l'annulation *
              </label>
              
              {/* Raisons prédéfinies en grille compacte */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {raisonsPredefines.map((raison) => (
                  <button
                    key={raison}
                    type="button"
                    onClick={() => setRaisonAnnulation(raison)}
                    className={`p-2 text-xs sm:text-sm rounded-lg border transition-all ${
                      raisonAnnulation === raison
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {raison}
                  </button>
                ))}
              </div>

              {/* Champ texte personnalisé */}
              <textarea
                value={raisonAnnulation}
                onChange={(e) => setRaisonAnnulation(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Ou saisissez une raison personnalisée..."
                required
              />
            </div>

            {/* Option email compacte */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="envoyerEmailAnnulation"
                  checked={envoyerEmail}
                  onChange={(e) => setEnvoyerEmail(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="envoyerEmailAnnulation" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Notifier le client par email
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
                className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Annulation...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Confirmer l'annulation</span>
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

export default ModalAnnulationCommande;