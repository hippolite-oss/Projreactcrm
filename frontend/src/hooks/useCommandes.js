import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useCommandes = (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    statut = '',
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const [commandes, setCommandes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommandes = useCallback(async (pageToFetch = page) => {
    console.log('🔄 useCommandes - Récupération des commandes');
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('page', pageToFetch);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (statut) params.append('statut', statut);

      console.log('📡 Paramètres API (Hook):', Object.fromEntries(params));

      const response = await api.get('/api/commande-online', { params });
      console.log('📦 Réponse API (Hook):', response.data);

      if (response.data.success) {
        const commandesData = response.data.data || [];
        console.log('✅ Commandes récupérées (Hook):', commandesData.length, 'commandes');
        
        setCommandes(commandesData);
        setPagination(response.data.pagination || { page: pageToFetch, limit, total: 0, pages: 1 });
      } else {
        console.warn('⚠️ Réponse API sans succès (Hook):', response.data);
        setCommandes([]);
        setPagination({ page: pageToFetch, limit, total: 0, pages: 1 });
      }
    } catch (err) {
      console.error('❌ Erreur récupération commandes (Hook):', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des commandes');
      setCommandes([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statut]);

  const refreshCommandes = useCallback(() => {
    console.log('🔄 useCommandes - Rafraîchissement manuel');
    fetchCommandes(pagination.page);
  }, [fetchCommandes, pagination.page]);

  const createCommande = useCallback(async (commandeData) => {
    console.log('📤 useCommandes - Création de commande:', commandeData);
    try {
      const response = await api.post('/api/commande-online', commandeData);
      console.log('✅ Commande créée (Hook):', response.data);
      
      // Rafraîchir la liste après création
      await fetchCommandes(1);
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('❌ Erreur création commande (Hook):', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erreur lors de la création de la commande' 
      };
    }
  }, [fetchCommandes]);

  const updateCommandeStatut = useCallback(async (commandeId, action) => {
    console.log(`🔄 useCommandes - Mise à jour statut commande ${commandeId}:`, action);
    try {
      let endpoint;
      switch (action) {
        case 'mark-as-read':
          endpoint = `/api/commande-online/${commandeId}/mark-as-read`;
          break;
        case 'cancel':
          endpoint = `/api/commande-online/${commandeId}/cancel`;
          break;
        default:
          throw new Error('Action non supportée');
      }

      await api.put(endpoint);
      console.log('✅ Statut mis à jour (Hook)');
      
      // Rafraîchir la liste après mise à jour
      await fetchCommandes(pagination.page);
      
      return { success: true };
    } catch (err) {
      console.error('❌ Erreur mise à jour statut (Hook):', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erreur lors de la mise à jour' 
      };
    }
  }, [fetchCommandes, pagination.page]);

  // Chargement initial
  useEffect(() => {
    console.log('🚀 useCommandes - Chargement initial');
    fetchCommandes(page);
  }, [fetchCommandes, page]);

  // Auto-refresh optionnel
  useEffect(() => {
    if (!autoRefresh) return;

    console.log('⏰ useCommandes - Activation auto-refresh');
    const interval = setInterval(() => {
      console.log('🔄 useCommandes - Auto-refresh');
      fetchCommandes(pagination.page);
    }, refreshInterval);

    return () => {
      console.log('⏹️ useCommandes - Arrêt auto-refresh');
      clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchCommandes, pagination.page]);

  return {
    commandes,
    pagination,
    loading,
    error,
    fetchCommandes,
    refreshCommandes,
    createCommande,
    updateCommandeStatut
  };
};