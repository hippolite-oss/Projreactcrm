import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShoppingCart, Plus, Minus, User, Mail, Phone } from 'lucide-react';

const OrderForm = ({ product, onSubmit, disabled = false }) => {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('€', 'F');
  };

  // Calculer le prix total
  const totalPrice = product.price * quantity;

  // Gérer le changement de quantité
  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, product.stock));
    setQuantity(validQuantity);
  };

  // Valider les données du formulaire
  const validateForm = () => {
    if (quantity < 1 || quantity > product.stock) {
      return { valid: false, message: t('invalidQuantity', 'Quantité invalide') };
    }

    if (showCustomerForm) {
      if (!customerInfo.name.trim()) {
        return { valid: false, message: t('nameRequired', 'Le nom est requis') };
      }
      if (!customerInfo.email.trim()) {
        return { valid: false, message: t('emailRequired', 'L\'email est requis') };
      }
      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        return { valid: false, message: t('invalidEmail', 'Email invalide') };
      }
    }

    return { valid: true };
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        productId: product.id,
        quantity: quantity,
        totalPrice: totalPrice,
        customerInfo: showCustomerForm ? customerInfo : null
      };

      const result = await onSubmit(orderData);
      
      if (result.success) {
        // Réinitialiser le formulaire après succès
        setQuantity(1);
        setCustomerInfo({ name: '', email: '', phone: '' });
        setShowCustomerForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sélecteur de quantité */}
        <div className="quantity-selector">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('quantity', 'Quantité')}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || disabled}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={disabled}
              className="w-20 text-center py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:opacity-50"
            />
            
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock || disabled}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            {t('maxAvailable', 'Maximum disponible')}: {product.stock}
          </div>
        </div>

        {/* Prix total */}
        <div className="total-price bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {t('totalPrice', 'Prix total')}:
            </span>
            <span className="text-xl font-bold text-gray-800">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(product.price)} × {quantity}
          </div>
        </div>

        {/* Option informations client */}
        <div className="customer-info-toggle">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomerForm}
              onChange={(e) => setShowCustomerForm(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              {t('addCustomerInfo', 'Ajouter mes informations')}
            </span>
          </label>
        </div>

        {/* Formulaire informations client */}
        {showCustomerForm && (
          <div className="customer-form space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                {t('fullName', 'Nom complet')} *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('enterYourName', 'Entrez votre nom')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                {t('email', 'Email')} *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('enterYourEmail', 'Entrez votre email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                {t('phone', 'Téléphone')} ({t('optional', 'optionnel')})
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('enterYourPhone', 'Entrez votre téléphone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Bouton de commande */}
        <button
          type="submit"
          disabled={disabled || submitting || quantity < 1 || quantity > product.stock}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {t('processing', 'Traitement...')}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {t('addToCart', 'Commander maintenant')}
            </>
          )}
        </button>

        {/* Message d'aide */}
        <div className="text-xs text-gray-500 text-center">
          {t('orderHelpText', 'Votre commande sera traitée rapidement par notre équipe')}
        </div>
      </form>
    </div>
  );
};

export default OrderForm;