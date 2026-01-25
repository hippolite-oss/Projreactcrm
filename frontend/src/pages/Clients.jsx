import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, 
  Filter, Users, MapPin, Mail, Phone, Building, Calendar,
  ArrowUpDown, RotateCcw, Download, MoreHorizontal, Star,
  Globe, Hash, User
} from 'lucide-react';
import api from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';
import Nouveauclient from './Nouveauclient';

const Client = () => {
  const { showToast } = useNotifications();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'cards'
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const itemsPerPage = 12;

  // Fonction pour charger les clients depuis l'API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/clients');
      setClients(response.data);
      setError(null);
      showToast(`${response.data.length} clients chargés`, 'success');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les clients. Veuillez réessayer.');
      showToast('Erreur lors du chargement des clients', 'error');
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
    showToast('Client ajouté avec succès', 'success');
  };

  // Gérer la suppression d'un client
  const handleDeleteClient = async () => {
    try {
      await api.delete(`/api/clients/${selectedClient.id}`);
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setShowDeleteModal(false);
      setSelectedClient(null);
      showToast('Client supprimé avec succès', 'success');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression du client');
      showToast('Erreur lors de la suppression du client', 'error');
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

  // Fonction pour générer un avatar coloré
  const getAvatarColor = (name) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-emerald-500 to-emerald-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-red-500 to-red-600'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header moderne */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
              </div>
              <p className="text-gray-600">
                {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} 
                {searchTerm && ` trouvé${filteredClients.length !== 1 ? 's' : ''} pour "${searchTerm}"`}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Bouton Vue */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Tableau
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cartes
                </button>
              </div>

              {/* Bouton Export */}
              <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>

              {/* Bouton Ajouter */}
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau client
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres modernes */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone ou ville..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtres :</span>
            </div>

            <select
              value={filters.country}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, country: e.target.value }));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les pays</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filters.city}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, city: e.target.value }));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Trier par nom</option>
              <option value="email">Trier par email</option>
              <option value="city">Trier par ville</option>
              <option value="createdAt">Trier par date</option>
            </select>

            <button
              onClick={() => setFilters(prev => ({
                ...prev,
                sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
              }))}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {filters.sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
            </button>

            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Chargement des clients...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchClients}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Réessayer
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filters.country || filters.city ? 'Aucun client trouvé' : 'Aucun client'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.country || filters.city 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier client'
              }
            </p>
            {searchTerm || filters.country || filters.city ? (
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Réinitialiser les filtres
              </button>
            ) : (
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Ajouter votre premier client
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              /* Vue Tableau */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'ajout
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedClients.map(client => (
                      <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(client.name)}`}>
                              {client.name?.charAt(0).toUpperCase() || 'C'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{client.name || 'Sans nom'}</div>
                              <div className="text-sm text-gray-500">#{client.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {client.email && (
                              <div className="flex items-center text-sm text-gray-900">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                {client.email}
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {client.city && (
                              <div className="flex items-center text-sm text-gray-900">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                {client.city}
                              </div>
                            )}
                            {client.country && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Globe className="w-3 h-3 mr-1" />
                                {client.country}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {client.createdAt ? new Date(client.createdAt).toLocaleDateString('fr-FR') : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedClient(client);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Vue Cartes */
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedClients.map(client => (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200 group">
                      {/* Header de la carte */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(client.name)}`}>
                          {client.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedClient(client);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Informations principales */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {client.name || 'Sans nom'}
                          </h3>
                          <p className="text-sm text-gray-500">#{client.id}</p>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2">
                          {client.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Localisation */}
                        <div className="space-y-2">
                          {client.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{client.address}</span>
                            </div>
                          )}
                          {client.city && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span>{client.city}</span>
                              {client.postalCode && <span className="ml-1">({client.postalCode})</span>}
                            </div>
                          )}
                          {client.country && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Globe className="w-3 h-3 mr-1" />
                              {client.country}
                            </span>
                          )}
                        </div>

                        {/* Date d'ajout */}
                        {client.createdAt && (
                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              Ajouté le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination moderne */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredClients.length)} sur {filteredClients.length} clients
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Précédent
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          if (totalPages <= 7) return true;
                          return Math.abs(page - currentPage) <= 1 || 
                                 page === 1 || 
                                 page === totalPages;
                        })
                        .map((page, index, array) => {
                          const showEllipsis = index < array.length - 1 && array[index + 1] - page > 1;
                          return (
                            <React.Fragment key={page}>
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                              {showEllipsis && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modale d'ajout moderne */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <Nouveauclient
                onClientAdded={handleClientAdded}
                onClose={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modale de suppression moderne */}
      {showDeleteModal && selectedClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {/* Icône d'alerte */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              
              {/* Contenu */}
              <div className="text-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2">
                  Supprimer le client
                </h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer le client{' '}
                    <span className="font-semibold text-gray-900">{selectedClient.name}</span> ?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Cette action est irréversible et supprimera toutes les données associées.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedClient(null);
                  }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;