import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SimpleLanguageButton = ({ className = '', size = 'md' }) => {
  const { currentLanguage, availableLanguages, changeLanguage, loading } = useLanguage();

  const handleToggle = async () => {
    const otherLang = availableLanguages.find(lang => lang.code !== currentLanguage);
    if (otherLang) {
      await changeLanguage(otherLang.code);
    }
  };

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
  const nextLang = availableLanguages.find(lang => lang.code !== currentLanguage);

  // Tailles disponibles
  const sizes = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl'
  };

  if (loading) {
    return (
      <div className={`${sizes[size]} rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizes[size]} rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group relative ${className}`}
      title={`${currentLang?.name} → ${nextLang?.name}`}
    >
      {/* Drapeau actuel */}
      <span className="transition-transform group-hover:scale-110">
        {currentLang?.flag}
      </span>
      
      {/* Petit indicateur de changement au hover */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <span className="text-xs text-white">↔</span>
      </div>
    </button>
  );
};

export default SimpleLanguageButton;