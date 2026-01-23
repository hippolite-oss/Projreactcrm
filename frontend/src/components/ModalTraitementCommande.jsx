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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Traiter la Commande</h3>
                <p className="text-green-100">Finaliser le traitement et notifier le client</p>
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
              Informations Client
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-semibold text-lg">{commande.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {commande.telephone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {commande.email || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ville</p>
                <p className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {commande.ville}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-semibold">{commande.adresse}</p>
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
              <div className="bg-white p-4 rounded-lg border whitespace-pre-line">
                {commande.commande}
              </div>
            </div>

            {commande.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Notes du client</p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 whitespace-pre-line">
                  {commande.notes}
                </div>
              </div>
            )}
          </div>

          {/* Formulaire de traitement */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes de traitement (optionnel)
              </label>
              <textarea
                value={notesAdmin}
                onChange={(e) => setNotesAdmin(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Ajoutez des notes sur le traitement de cette commande...&#10;&#10;Exemples :&#10;- Produits disponibles en stock&#10;- Livraison prévue le [date]&#10;- Prix confirmé : [montant]&#10;- Contact commercial : [nom]"
              />
              <p className="text-sm text-gray-500 mt-2">
                Ces notes seront incluses dans l'email envoyé au client
              </p>
            </div>

            {/* Option d'envoi d'email */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="envoyerEmail"
                  checked={envoyerEmail}
                  onChange={(e) => setEnvoyerEmail(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="envoyerEmail" className="font-medium text-gray-900 cursor-pointer">
                    Envoyer un email de confirmation au client
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {commande.email 
                      ? `Un email sera envoyé à ${commande.email} pour confirmer le traitement`
                      : 'Aucune adresse email disponible pour cette commande'
                    }
                  </p>
                </div>
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
            </div>

            {!commande.email && envoyerEmail && (
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-900">Aucune adresse email</p>
                  <p className="text-sm text-orange-700">
                    Cette commande n'a pas d'adresse email. L'option d'envoi sera ignorée.
                  </p>
                </div>
              </div>
            )}

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
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Marquer comme traité
                    {envoyerEmail && commande.email && (
                      <span className="text-green-200">+ Envoyer email</span>
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