import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import api from '../services/api';
import './Clients.css';
import Nouveauclient from './Nouveauclient';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const itemsPerPage = 10;

  // Fonction pour charger les clients depuis l'API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/clients');
      setClients(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les clients. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrer et trier les clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = 
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = !filters.country || client.country === filters.country;
      const matchesCity = !filters.city || client.city === filters.city;
      
      return matchesSearch && matchesCountry && matchesCity;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'name':
          return order * (a.name?.localeCompare(b.name) || 0);
        case 'email':
          return order * (a.email?.localeCompare(b.email) || 0);
        case 'city':
          return order * (a.city?.localeCompare(b.city) || 0);
        case 'createdAt':
          return order * (new Date(a.createdAt) - new Date(b.createdAt));
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Gérer l'ajout d'un nouveau client
  const handleClientAdded = (newClient) => {
    setClients(prev => [newClient, ...prev]);
    setShowAddModal(false);
  };

  // Gérer la suppression d'un client
  const handleDeleteClient = async () => {
    try {
      await api.delete(`/api/clients/${selectedClient.id}`);
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setShowDeleteModal(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression du client');
    }
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      country: '',
      city: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Récupérer les pays et villes uniques pour les filtres
  const countries = [...new Set(clients.map(client => client.country).filter(Boolean))];
  const cities = [...new Set(clients.map(client => client.city).filter(Boolean))];

  return (
    <div className="client-container">
      {/* En-tête */}
      <div className="client-header">
        <div className="header-left">
          <h1>Clients</h1>
          <p className="client-count">
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="header-right">
          <button 
            className="btn-add-client"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Nouveau client
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="client-controls">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="country-filter">
              <Filter size={16} />
              Pays
            </label>
            <select
              id="country-filter"
              value={filters.country}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, country: e.target.value }));
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">Tous les pays</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="city-filter">Ville</label>
            <select
              id="city-filter"
              value={filters.city}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, city: e.target.value }));
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Trier par</label>
            <select
              id="sort-by"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="filter-select"
            >
              <option value="name">Nom</option>
              <option value="email">Email</option>
              <option value="city">Ville</option>
              <option value="createdAt">Date d'ajout</option>
            </select>
          </div>

          <button
            className="btn-sort-order"
            onClick={() => setFilters(prev => ({
              ...prev,
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {filters.sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
          </button>

          <button
            className="btn-reset-filters"
            onClick={resetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="clients-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des clients...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchClients} className="btn-retry">
              Réessayer
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="empty-state">
            <p>Aucun client trouvé</p>
            {searchTerm || filters.country || filters.city ? (
              <button onClick={resetFilters} className="btn-clear-search">
                Réinitialiser la recherche
              </button>
            ) : (
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-add-first-client"
              >
                Ajouter votre premier client
              </button>
            )}
          </div>
        ) : (
          <>
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Ville</th>
                  <th>Code postal</th>
                  <th>Pays</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map(client => (
                  <tr key={client.id}>
                    <td className="client-name">
                      <div className="avatar">
                        {client.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      {client.name}
                    </td>
                    <td>{client.email || '-'}</td>
                    <td>{client.phone || '-'}</td>
                    <td>{client.address || '-'}</td>
                    <td>{client.city || '-'}</td>
                    <td>{client.postalCode || '-'}</td>
                    <td>
                      <span className="country-badge">
                        {client.country || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn-action btn-view"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-action btn-edit"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-action btn-delete"
                          title="Supprimer"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn-pagination"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                  Précédent
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 5) return true;
                      return Math.abs(page - currentPage) <= 1 || 
                             page === 1 || 
                             page === totalPages;
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index < array.length - 1 && array[index + 1] - page > 1;
                      return (
                        <React.Fragment key={page}>
                          <button
                            className={`page-number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                          {showEllipsis && <span className="ellipsis">...</span>}
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  className="btn-pagination"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modale d'ajout */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Nouveauclient
              onClientAdded={handleClientAdded}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && selectedClient && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="delete-modal-header">
              <h3>Supprimer le client</h3>
            </div>
            <div className="delete-modal-body">
              <p>
                Êtes-vous sûr de vouloir supprimer le client <strong>{selectedClient.name}</strong> ?
                Cette action est irréversible.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedClient(null);
                }}
              >
                Annuler
              </button>
              <button
                className="btn-delete-confirm"
                onClick={handleDeleteClient}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;