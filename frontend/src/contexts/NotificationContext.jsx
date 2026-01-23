import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    commandesNonLues: 0,
    totalCommandes: 0,
    derniereCommande: null,
    prospectsNouveaux: 0,
    totalProspects: 0,
    dernierProspect: null,
    loading: false
  });

  // Fonction pour récupérer les statistiques des commandes ET prospects
  const fetchStats = async () => {
    if (!user) {
      console.log('👤 Utilisateur non connecté, pas de chargement des notifications');
      return;
    }

    try {
      setNotifications(prev => ({ ...prev, loading: true }));
      
      // Récupérer les stats des commandes et prospects en parallèle
      const [commandesResponse, prospectsResponse] = await Promise.all([
        api.get('/api/commande-online/stats'),
        api.get('/api/prospects/stats')
      ]);
      
      const commandesStats = commandesResponse.data;
      const prospectsStats = prospectsResponse.data;
      
      // Récupérer la dernière commande et le dernier prospect
      const [derniereCommandeResponse, dernierProspectResponse] = await Promise.all([
        api.get('/api/commande-online', {
          params: { page: 1, limit: 1, statut: 'nouveau' }
        }),
        api.get('/api/prospects', {
          params: { page: 1, limit: 1, statut: 'nouveau' }
        })
      ]);
      
      const derniereCommande = derniereCommandeResponse.data?.data?.[0] || null;
      const dernierProspect = dernierProspectResponse.data?.data?.[0] || null;
      
      setNotifications({
        commandesNonLues: commandesStats.nouveau || 0,
        totalCommandes: commandesStats.total || 0,
        derniereCommande,
        prospectsNouveaux: prospectsStats.nouveau || 0,
        totalProspects: prospectsStats.total || 0,
        dernierProspect,
        loading: false
      });
      
      console.log('📊 Stats mises à jour:', {
        commandes: { nouveau: commandesStats.nouveau, total: commandesStats.total },
        prospects: { nouveau: prospectsStats.nouveau, total: prospectsStats.total }
      });
      
    } catch (error) {
      if (error.message && error.message.includes('chrome-extension://')) {
        console.log('🔌 Erreur d\'extension Chrome ignorée');
        return;
      }
      
      console.error('❌ Erreur lors du chargement des notifications:', error);
      setNotifications(prev => ({ ...prev, loading: false }));
    }
  };

  // Fonction pour marquer une commande comme lue
  const marquerCommandeLue = async (commandeId) => {
    try {
      await api.put(`/api/commande-online/${commandeId}/mark-as-read`);
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage commande:', error);
      return false;
    }
  };

  // Fonction pour marquer un prospect comme contacté
  const marquerProspectContacte = async (prospectId) => {
    try {
      await api.put(`/api/prospects/${prospectId}/contact`);
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage prospect:', error);
      return false;
    }
  };

  // Fonction pour ajouter une nouvelle commande
  const ajouterNouvelleCommande = (nouvelleCommande) => {
    console.log('✅ Nouvelle commande ajoutée:', nouvelleCommande);
    setNotifications(prev => ({
      ...prev,
      commandesNonLues: prev.commandesNonLues + 1,
      totalCommandes: prev.totalCommandes + 1,
      derniereCommande: nouvelleCommande
    }));
    
    setTimeout(() => fetchStats(), 1000);
  };

  // Fonction pour ajouter un nouveau prospect
  const ajouterNouveauProspect = (nouveauProspect) => {
    console.log('✅ Nouveau prospect ajouté:', nouveauProspect);
    setNotifications(prev => ({
      ...prev,
      prospectsNouveaux: prev.prospectsNouveaux + 1,
      totalProspects: prev.totalProspects + 1,
      dernierProspect: nouveauProspect
    }));
    
    setTimeout(() => fetchStats(), 1000);
  };

  // Fonction pour rafraîchir les notifications
  const rafraichirNotifications = () => {
    fetchStats();
  };

  // Charger les notifications au démarrage
  useEffect(() => {
    if (user) {
      console.log('👤 Utilisateur connecté, chargement des notifications...');
      fetchStats();
      
      const interval = setInterval(() => {
        if (user) {
          fetchStats();
        }
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      console.log('👤 Utilisateur déconnecté, réinitialisation des notifications');
      setNotifications({
        commandesNonLues: 0,
        totalCommandes: 0,
        derniereCommande: null,
        prospectsNouveaux: 0,
        totalProspects: 0,
        dernierProspect: null,
        loading: false
      });
    }
  }, [user]);

  const value = {
    notifications,
    fetchStats,
    marquerCommandeLue,
    marquerProspectContacte,
    ajouterNouvelleCommande,
    ajouterNouveauProspect,
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