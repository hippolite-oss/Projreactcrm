import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Nouveauclient.css';

const Nouveauclient = ({ onClientAdded, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (formData.phone && !/^[\d\s+\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/clients', formData);
      const newClient = response.data;
      
      if (onClientAdded) {
        onClientAdded(newClient);
      }
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      });
      
      // Fermer le formulaire si onClose est fourni, sinon rediriger
      if (onClose) {
        onClose();
      } else {
        navigate('/dashboard/clients');
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Erreur lors de l\'ajout du client. Veuillez réessayer.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    });
    setErrors({});
  };

  return (
    <div className="nouveau-client-container">
      <div className="nouveau-client-card">
        <div className="nouveau-client-header">
          <h2>Nouveau Client</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose} aria-label="Fermer">
              ×
            </button>
          )}
        </div>
        
        {errors.submit && (
          <div className="error-message submit-error">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="nouveau-client-form">
          <div className="form-group">
            <label htmlFor="name">
              Nom <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Entrez le nom du client"
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="exemple@email.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="+33 1 23 45 67 89"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Numéro et rue"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="postalCode">Code postal</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="75000"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Pays</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Sélectionnez un pays</option>
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Canada">Canada</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Ajout en cours...
                </>
              ) : (
                'Ajouter le client'
              )}
            </button>
          </div>
        </form>
        
        <div className="form-footer">
          <p className="note">
            <span className="required">*</span> Champs obligatoires
          </p>
        </div>
      </div>
    </div>
  );
};

export default Nouveauclient;