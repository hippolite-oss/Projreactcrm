import React, { useState, useRef } from 'react';
import api from '../services/api';
import './Products.css';

const Products = ({ onProductsAjoute }) => {
  const [formData, setFormData] = useState({
    nom: '',
    image: null,
    marque: '',
    categorie: '',
    quantite: '',
  });
  
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Catégories prédéfinies
  const categories = [
    'Électronique',
    'Vêtements',
    'Alimentation',
    'Maison & Jardin',
    'Sport',
    'Beauté & Santé',
    'Livres',
    'Jouets',
    'Automobile',
    'Autre'
  ];
  
  // Marques suggérées (pour l'autocomplétion)
  const marquesSuggerees = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Microsoft', 
    'LG', 'HP', 'Dell', 'Lenovo', 'Canon', 'Philips', 'Bosch'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper
    if (erreurs[name]) {
      setErreurs({
        ...erreurs,
        [name]: ''
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du type de fichier
      const typesAutorises = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!typesAutorises.includes(file.type)) {
        setErreurs({
          ...erreurs,
          image: 'Veuillez sélectionner une image (JPEG, PNG, GIF ou WebP)'
        });
        return;
      }
      
      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErreurs({
          ...erreurs,
          image: 'L\'image ne doit pas dépasser 5MB'
        });
        return;
      }
      
      setFormData({
        ...formData,
        image: file
      });
      
      if (erreurs.image) {
        setErreurs({
          ...erreurs,
          image: ''
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErreurs = {};
    
    if (!formData.nom.trim()) {
      newErreurs.nom = 'Le nom du Products est requis';
    } else if (formData.nom.length > 100) {
      newErreurs.nom = 'Le nom ne doit pas dépasser 100 caractères';
    }
    
    if (!formData.image) {
      newErreurs.image = 'L\'image du Products est requise';
    }
    
    if (!formData.marque.trim()) {
      newErreurs.marque = 'La marque du Products est requise';
    }
    
    if (!formData.categorie) {
      newErreurs.categorie = 'La catégorie du Products est requise';
    }
    
    if (!formData.quantite.trim()) {
      newErreurs.quantite = 'La quantité est requise';
    } else if (isNaN(formData.quantite) || parseInt(formData.quantite) <= 0) {
      newErreurs.quantite = 'La quantité doit être un nombre positif';
    }
    
    setErreurs(newErreurs);
    return Object.keys(newErreurs).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    // Création de FormData pour envoyer les données (y compris l'image)
    const formDataToSend = new FormData();
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('image', formData.image);
    formDataToSend.append('marque', formData.marque);
    formDataToSend.append('categorie', formData.categorie);
    formDataToSend.append('quantite', formData.quantite);
    formDataToSend.append('dateAjout', new Date().toISOString());
    
    try {
      const response = await api.post('/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 201) {
        setMessage('Products ajouté avec succès!');
        
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          image: null,
          marque: '',
          categorie: '',
          quantite: '',
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Appeler la fonction de rappel pour mettre à jour la liste des Productss
        if (onProductsAjoute) {
          onProductsAjoute(response.data);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de l\'ajout du Products');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMarqueSuggestion = (marque) => {
    setFormData({
      ...formData,
      marque
    });
  };
  
  return (
    <div className="Products-container">
      <h2 className="Products-title">Ajouter un nouveau Products</h2>
      
      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="Products-form">
        <div className="form-group">
          <label htmlFor="nom" className="form-label">
            Nom du Products <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className={`form-input ${erreurs.nom ? 'error' : ''}`}
            placeholder="Entrez le nom du Products"
          />
          {erreurs.nom && <div className="error-message">{erreurs.nom}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Image du Products <span className="required">*</span>
          </label>
          <div className="file-upload-container">
            <input
              type="file"
              id="image"
              name="image"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            <label htmlFor="image" className="file-label">
              <span className="file-button">Choisir une image</span>
              <span className="file-name">
                {formData.image ? formData.image.name : 'Aucun fichier sélectionné'}
              </span>
            </label>
          </div>
          {erreurs.image && <div className="error-message">{erreurs.image}</div>}
          {formData.image && (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(formData.image)} 
                alt="Aperçu" 
                className="preview-image"
              />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="marque" className="form-label">
            Marque du Products <span className="required">*</span>
          </label>
          <input
            type="text"
            id="marque"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            className={`form-input ${erreurs.marque ? 'error' : ''}`}
            placeholder="Entrez la marque du Products"
            list="marques-suggestions"
          />
          <datalist id="marques-suggestions">
            {marquesSuggerees.map((marque, index) => (
              <option key={index} value={marque} />
            ))}
          </datalist>
          
          <div className="marque-suggestions">
            <span className="suggestion-label">Suggestions: </span>
            {marquesSuggerees.map((marque, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-chip"
                onClick={() => handleMarqueSuggestion(marque)}
              >
                {marque}
              </button>
            ))}
          </div>
          
          {erreurs.marque && <div className="error-message">{erreurs.marque}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="categorie" className="form-label">
            Catégorie <span className="required">*</span>
          </label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className={`form-select ${erreurs.categorie ? 'error' : ''}`}
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((categorie, index) => (
              <option key={index} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
          {erreurs.categorie && <div className="error-message">{erreurs.categorie}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantite" className="form-label">
            Quantité / Nombre d'unités <span className="required">*</span>
          </label>
          <input
            type="number"
            id="quantite"
            name="quantite"
            value={formData.quantite}
            onChange={handleChange}
            min="1"
            step="1"
            className={`form-input ${erreurs.quantite ? 'error' : ''}`}
            placeholder="Entrez la quantité"
          />
          {erreurs.quantite && <div className="error-message">{erreurs.quantite}</div>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter le Products'}
        </button>
      </form>
    </div>
  );
};

export default Products;