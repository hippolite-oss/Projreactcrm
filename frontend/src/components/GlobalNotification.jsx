import React from 'react';
import { Sparkles, AlertCircle, Clock, CheckCircle, XCircle, Info } from 'lucide-react';

function GlobalNotification({ notification, onClose }) {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5 animate-spin" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-400 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-orange-400 text-orange-800';
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-800';
    }
  };

  return (
    <div 
      className={`fixed top-20 right-4 z-[9999] px-6 py-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform animate-slide-in-right ${getStyles()}`}
      style={{ 
        maxWidth: '400px',
        minWidth: '300px'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
          <div className="flex-1">
            {notification.title && (
              <p className="text-sm font-semibold mb-1">{notification.title}</p>
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-white/50"
          title="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Barre de progression pour l'auto-hide */}
      {notification.autoHide && (
        <div className="mt-3 w-full bg-white/30 rounded-full h-1">
          <div 
            className="bg-current h-1 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: '100%',
              animation: `shrink ${notification.duration || 3000}ms linear forwards`
            }}
          ></div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export default GlobalNotification;