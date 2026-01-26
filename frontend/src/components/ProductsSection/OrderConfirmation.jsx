import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle, Package, User, Mail, Phone, Calendar, Hash, X } from 'lucide-react';

const OrderConfirmation = ({ order, onClose }) => {
  const { t } = useLanguage();

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('€', 'F');
  };

  // Fonction de formatage de date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t('orderConfirmed', 'Commande confirmée !')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('orderProcessedSuccessfully', 'Votre commande a été traitée avec succès')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Détails de la commande */}
          <div className="space-y-6">
            {/* Informations de base */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {t('orderDetails', 'Détails de la commande')}
              </h4>
              
              <div className="space-y-2 text-sm">
                {order.id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orderNumber', 'Numéro')}:</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('date', 'Date')}:</span>
                  <span className="font-medium">
                    {formatDate(order.createdAt || new Date())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('status', 'Statut')}:</span>
                  <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    {t('pending', 'En attente')}
                  </span>
                </div>
              </div>
            </div>

            {/* Produit commandé */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t('orderedProduct', 'Produit commandé')}
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('product', 'Produit')}:</span>
                  <span className="font-medium">{order.productName || 'Produit'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('quantity', 'Quantité')}:</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('unitPrice', 'Prix unitaire')}:</span>
                  <span className="font-medium">
                    {formatCurrency((order.totalPrice || 0) / (order.quantity || 1))}
                  </span>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="text-gray-800 font-semibold">{t('total', 'Total')}:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatCurrency(order.totalPrice || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations client */}
            {(order.customerName || order.customerEmail || order.customerPhone) && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('customerInfo', 'Informations client')}
                </h4>
                
                <div className="space-y-2 text-sm">
                  {order.customerName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{order.customerName}</span>
                    </div>
                  )}
                  
                  {order.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{order.customerEmail}</span>
                    </div>
                  )}
                  
                  {order.customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message de confirmation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">
                    {t('orderConfirmationMessage', 'Votre commande a été enregistrée avec succès !')}
                  </p>
                  <p>
                    {t('orderProcessingInfo', 'Notre équipe va traiter votre commande dans les plus brefs délais. Vous recevrez une notification dès que votre commande sera prête.')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              {t('close', 'Fermer')}
            </button>
            <button
              onClick={() => {
                // Ici on pourrait ajouter une fonction pour voir toutes les commandes
                onClose();
              }}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
            >
              {t('viewAllOrders', 'Voir mes commandes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;