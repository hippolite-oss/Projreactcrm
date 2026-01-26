import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, Globe, Check } from 'lucide-react';

const LanguageSelector = ({ className = '', simple = false }) => {
  const { currentLanguage, availableLanguages, changeLanguage, loading, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (langCode) => {
    setIsOpen(false);
    if (langCode !== currentLanguage) {
      await changeLanguage(langCode);
    }
  };

  // Version simple : juste un bouton drapeau qui bascule
  const handleSimpleToggle = async () => {
    const otherLang = availableLanguages.find(lang => lang.code !== currentLanguage);
    if (otherLang) {
      await changeLanguage(otherLang.code);
    }
  };

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-gray-400 animate-spin" />
        {!simple && <span className="text-sm text-gray-500">{t('loading', 'Chargement...')}</span>}
      </div>
    );
  }

  // Version simple : bouton drapeau uniquement
  if (simple) {
    return (
      <button
        onClick={handleSimpleToggle}
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
        title={`${t('language', 'Langue')}: ${currentLang?.name} → ${availableLanguages.find(lang => lang.code !== currentLanguage)?.name}`}
      >
        <span className="text-xl">{currentLang?.flag}</span>
      </button>
    );
  }

  // Version complète avec menu déroulant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu déroulant */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {t('selectLanguage', 'Sélectionner la langue')}
              </div>
              
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    currentLanguage === language.code 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="flex-1 text-left">{language.name}</span>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;