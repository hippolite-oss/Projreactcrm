import React, { useState } from 'react';
import './Nouveaucontact.css';

const Nouveaucontact = () => {
  // État pour les champs du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false
  });

  // États pour la validation et la confirmation
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options pour la liste déroulante du sujet
  const subjectOptions = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'Information', label: 'Information' },
    { value: 'Support', label: 'Support' },
    { value: 'Réclamation', label: 'Réclamation' },
    { value: 'Partenariat', label: 'Partenariat' }
  ];

  // Gestion des changements dans les champs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Effacer l'erreur du champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse e-mail est requise';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'adresse e-mail est invalide';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Veuillez sélectionner un sujet';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'Vous devez accepter le traitement des données';
    }
    
    return newErrors;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Simulation d'envoi (remplacer par appel API en production)
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Données du formulaire envoyées:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Réinitialiser le formulaire après succès
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consent: false
      });
      
      // Masquer le message de confirmation après 5 secondes
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      consent: false
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Notre équipe est à votre écoute pour répondre à vos questions et vous accompagner</p>
      </header>

      <div className="contact-container">
        {/* Message de confirmation */}
        {isSubmitted && (
          <div className="confirmation-message">
            <div className="confirmation-content">
              <svg className="confirmation-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
              <h3>Message envoyé avec succès !</h3>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
              <button onClick={() => setIsSubmitted(false)} className="close-confirmation">
                Fermer
              </button>
            </div>
          </div>
        )}

        <div className="contact-content">
          {/* Informations de contact */}
          

          {/* Formulaire de contact */}
          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-row">
                <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                  <label htmlFor="firstName">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                  <label htmlFor="lastName">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">Adresse e-mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="exemple@domaine.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Numéro de téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
              
              <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
                <label htmlFor="subject">Sujet *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                >
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>
              
              <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Décrivez votre demande en détails..."
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>
              
              <div className={`form-group consent-group ${errors.consent ? 'has-error' : ''}`}>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="consent">
                    J'accepte le traitement de mes données personnelles conformément à la politique de confidentialité *
                  </label>
                </div>
                {errors.consent && <span className="error-message">{errors.consent}</span>}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le message'
                  )}
                </button>
                <button 
                  type="button" 
                  className="reset-btn"
                  onClick={handleReset}
                >
                  Réinitialiser
                </button>
              </div>
              
              <div className="form-footer">
                <p>* Champs obligatoires</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nouveaucontact;