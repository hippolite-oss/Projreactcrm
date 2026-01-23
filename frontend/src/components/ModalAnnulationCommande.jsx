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
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Annuler la Commande</h3>
                <p className="text-red-100">Indiquez la raison de l'annulation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Informations de la commande */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Commande à Annuler
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-semibold text-lg">{commande.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-semibold">{commande.telephone}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date de commande
              </p>
              <p className="font-semibold">{formatDate(commande.createdAt || commande.date_creation)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Détails de la commande</p>
              <div className="bg-white p-4 rounded-lg border whitespace-pre-line text-sm">
                {commande.commande}
              </div>
            </div>
          </div>

          {/* Avertissement */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-1">Attention</h4>
              <p className="text-orange-800 text-sm">
                Cette action est irréversible. La commande sera définitivement annulée et le client sera notifié.
              </p>
            </div>
          </div>

          {/* Formulaire d'annulation */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Raison de l'annulation *
              </label>
              
              {/* Raisons prédéfinies */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {raisonsPredefines.map((raison) => (
                  <button
                    key={raison}
                    type="button"
                    onClick={() => setRaisonAnnulation(raison)}
                    className={`p-3 text-sm rounded-lg border transition-all ${
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
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Ou saisissez une raison personnalisée..."
                required
              />
            </div>

            {/* Option d'envoi d'email */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="envoyerEmailAnnulation"
                  checked={envoyerEmail}
                  onChange={(e) => setEnvoyerEmail(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="envoyerEmailAnnulation" className="font-medium text-gray-900 cursor-pointer">
                    Notifier le client par email
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {commande.email 
                      ? `Un email d'annulation sera envoyé à ${commande.email}`
                      : 'Aucune adresse email disponible pour cette commande'
                    }
                  </p>
                </div>
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Annulation en cours...
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Confirmer l'annulation
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