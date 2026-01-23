import { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    entreprise: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation côté client
    if (!formData.nom.trim()) {
      setError('Le nom est requis');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('L\'email est requis');
      setLoading(false);
      return;
    }

    // Validation format email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Envoi données prospect:', formData);
      
      const response = await api.post('/api/prospects', {
        nom: formData.nom.trim(),
        entreprise: formData.entreprise.trim() || undefined,
        email: formData.email.trim(),
        telephone: formData.telephone.trim() || undefined,
        message: formData.message.trim() || undefined,
        source: 'website'
      });

      console.log('✅ Réponse API:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          nom: '',
          entreprise: '',
          email: '',
          telephone: '',
          message: ''
        });
        
        // Optionnel : Scroll vers le message de succès
        setTimeout(() => {
          const element = document.getElementById('contact-form-success');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ Erreur soumission prospect:', error);
      
      if (error.response?.status === 409) {
        setError('Un prospect avec cet email existe déjà. Notre équipe vous contactera bientôt.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setFormData({
      nom: '',
      entreprise: '',
      email: '',
      telephone: '',
      message: ''
    });
  };

  if (success) {
    return (
      <div 
        id="contact-form-success"
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-200"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Demande envoyée avec succès !
        </h3>
        <p className="text-green-700 mb-4">
          Merci pour votre intérêt. Notre équipe vous contactera dans les plus brefs délais pour organiser votre démonstration personnalisée.
        </p>
        <div className="bg-green-100 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>Prochaines étapes :</strong>
          </p>
          <ul className="text-green-700 text-sm mt-2 space-y-1">
            <li>• Un expert vous contactera sous 24h</li>
            <li>• Démonstration personnalisée de 30 minutes</li>
            <li>• Proposition adaptée à vos besoins</li>
          </ul>
        </div>
        <button 
          onClick={resetForm}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Envoyer une nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-2xl p-8">
      <h3 className="text-2xl font-bold mb-2">
        Demandez une démo gratuite
      </h3>
      <p className="text-gray-300 mb-6">
        Découvrez comment notre CRM peut transformer votre gestion commerciale
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Entreprise
            </label>
            <input
              type="text"
              name="entreprise"
              value={formData.entreprise}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Nom de votre entreprise"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="votre@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="+33 1 23 45 67 89"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            placeholder="Parlez-nous de vos besoins, du nombre d'utilisateurs, de vos objectifs..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </div>
          ) : (
            'Demander ma démo gratuite'
          )}
        </button>
        
        <p className="text-xs text-gray-400 text-center">
          En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe commerciale.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;