import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState({
    commandesNonLues: 0,
    totalCommandes: 0,
    derniereCommande: null,
    loading: false
  });

  // Fonction pour récupérer les statistiques des commandes
  const fetchCommandeStats = async () => {
    try {
      setNotifications(prev => ({ ...prev, loading: true }));
      
      const response = await api.get('/api/commande-online/stats');
      const stats = response.data;
      
      // Récupérer la dernière commande non lue
      const commandesResponse = await api.get('/api/commande-online', {
        params: { page: 1, limit: 1, statut: 'nouveau' }
      });
      
      const derniereCommande = commandesResponse.data?.data?.[0] || null;
      
      setNotifications({
        commandesNonLues: stats.nouveau || 0,
        totalCommandes: stats.total || 0,
        derniereCommande,
        loading: false
      });
      
      console.log('📊 Stats commandes mises à jour:', {
        nouveau: stats.nouveau,
        total: stats.total,
        derniereCommande: derniereCommande?.nom
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications:', error);
      setNotifications(prev => ({ ...prev, loading: false }));
    }
  };

  // Fonction pour marquer une commande comme lue (met à jour les notifications)
  const marquerCommandeLue = async (commandeId) => {
    try {
      await api.put(`/api/commande-online/${commandeId}/mark-as-read`);
      // Recharger les stats après marquage
      await fetchCommandeStats();
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
      return false;
    }
  };

  // Fonction pour ajouter une nouvelle commande (simulation temps réel)
  const ajouterNouvelleCommande = (nouvelleCommande) => {
    console.log('✅ Nouvelle commande ajoutée:', nouvelleCommande);
    setNotifications(prev => ({
      ...prev,
      commandesNonLues: prev.commandesNonLues + 1,
      totalCommandes: prev.totalCommandes + 1,
      derniereCommande: nouvelleCommande
    }));
    
    // Recharger les stats depuis le serveur pour être sûr
    setTimeout(() => {
      fetchCommandeStats();
    }, 1000);
  };

  // Fonction pour rafraîchir les notifications
  const rafraichirNotifications = () => {
    fetchCommandeStats();
  };

  // Charger les notifications au démarrage
  useEffect(() => {
    fetchCommandeStats();
    
    // Rafraîchir toutes les 30 secondes (optionnel)
    const interval = setInterval(fetchCommandeStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    fetchCommandeStats,
    marquerCommandeLue,
    ajouterNouvelleCommande,
    rafraichirNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}