import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [translations, setTranslations] = useState({});
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Charger les langues disponibles
  const loadAvailableLanguages = async () => {
    try {
      const response = await api.get('/api/i18n/languages');
      if (response.data.success) {
        setAvailableLanguages(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement langues:', error);
      // Langues par défaut en cas d'erreur
      setAvailableLanguages([
        { code: 'fr', name: 'Français', flag: '🇫🇷', default: true },
        { code: 'en', name: 'English', flag: '🇺🇸', default: false }
      ]);
    }
  };

  // Charger les traductions pour une langue
  const loadTranslations = async (lang) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/i18n/translations/${lang}`);
      if (response.data.success) {
        setTranslations(response.data.data);
        setCurrentLanguage(lang);
        // Sauvegarder dans localStorage
        localStorage.setItem('app_language', lang);
        console.log(`🌍 Langue changée vers: ${lang}`);
        console.log(`📦 Traductions chargées:`, Object.keys(response.data.data).length, 'clés');
      }
    } catch (error) {
      console.error('Erreur chargement traductions:', error);
      // Traductions par défaut en cas d'erreur
      setTranslations(getDefaultTranslations(lang));
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  };

  // Changer de langue
  const changeLanguage = async (lang) => {
    if (lang === currentLanguage) return;
    
    console.log(`🔄 Changement de langue: ${currentLanguage} → ${lang}`);
    await loadTranslations(lang);
    
    // Optionnel: sauvegarder la préférence utilisateur sur le serveur
    try {
      await api.post('/api/i18n/user-preference', { language: lang });
    } catch (error) {
      console.warn('Impossible de sauvegarder la préférence de langue:', error);
    }
  };

  // Fonction de traduction avec support des paramètres
  const t = (key, defaultValue = key, params = {}) => {
    let translation = translations[key] || defaultValue;
    
    // Remplacer les paramètres dans la traduction
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  };

  // Fonction pour traduire les mois
  const translateMonth = (monthIndex) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return t(months[monthIndex], months[monthIndex]);
  };

  // Fonction pour traduire les jours
  const translateDay = (dayIndex) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(days[dayIndex], days[dayIndex]);
  };

  // Fonction pour formater les dates selon la langue
  const formatDate = (date, options = {}) => {
    const dateObj = new Date(date);
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', defaultOptions);
  };

  // Traductions par défaut (fallback)
  const getDefaultTranslations = (lang) => {
    const defaultTranslations = {
      fr: {
        dashboard: 'Tableau de Bord',
        clients: 'Clients',
        products: 'Produits',
        settings: 'Paramètres',
        loading: 'Chargement...',
        save: 'Enregistrer',
        cancel: 'Annuler',
        search: 'Rechercher',
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer'
      },
      en: {
        dashboard: 'Dashboard',
        clients: 'Clients',
        products: 'Products',
        settings: 'Settings',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        search: 'Search',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete'
      }
    };
    return defaultTranslations[lang] || defaultTranslations.fr;
  };

  // Initialisation
  useEffect(() => {
    const initializeLanguage = async () => {
      // Récupérer la langue sauvegardée ou utiliser français par défaut
      const savedLanguage = localStorage.getItem('app_language') || 'fr';
      
      await loadAvailableLanguages();
      await loadTranslations(savedLanguage);
    };

    initializeLanguage();
  }, []);

  const value = {
    currentLanguage,
    translations,
    availableLanguages,
    loading,
    isReady,
    changeLanguage,
    t,
    translateMonth,
    translateDay,
    formatDate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};