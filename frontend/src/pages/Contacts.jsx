import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Contacts.css';

const Contact = () => {
  // État pour les contacts
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // États pour la gestion des contacts
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // État pour le nouveau contact (pour le modal d'ajout)
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    status: 'active',
    notes: ''
  });

  // Options pour les filtres
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'lead', label: 'Lead' },
    { value: 'customer', label: 'Client' }
  ];

  const companyOptions = [
    { value: 'all', label: 'Toutes les entreprises' },
    { value: 'TechCorp', label: 'TechCorp' },
    { value: 'InnovateCo', label: 'InnovateCo' },
    { value: 'GlobalSolutions', label: 'GlobalSolutions' },
    { value: 'StartupXYZ', label: 'StartupXYZ' },
    { value: 'EnterprisePlus', label: 'EnterprisePlus' }
  ];

  // Données de démonstration (remplacer par appel API en production)
  const demoContacts = [
    { id: 1, firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@example.com', phone: '+33 1 23 45 67 89', company: 'TechCorp', jobTitle: 'Directrice Marketing', status: 'active', lastContact: '2023-10-15' },
    { id: 2, firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@example.com', phone: '+33 1 34 56 78 90', company: 'InnovateCo', jobTitle: 'Responsable Commercial', status: 'lead', lastContact: '2023-10-10' },
    { id: 3, firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@example.com', phone: '+33 1 45 67 89 01', company: 'GlobalSolutions', jobTitle: 'CEO', status: 'customer', lastContact: '2023-10-12' },
    { id: 4, firstName: 'Pierre', lastName: 'Petit', email: 'pierre.petit@example.com', phone: '+33 1 56 78 90 12', company: 'StartupXYZ', jobTitle: 'CTO', status: 'active', lastContact: '2023-10-08' },
    { id: 5, firstName: 'Isabelle', lastName: 'Robert', email: 'isabelle.robert@example.com', phone: '+33 1 67 89 01 23', company: 'EnterprisePlus', jobTitle: 'Directrice des Ventes', status: 'inactive', lastContact: '2023-09-28' },
    { id: 6, firstName: 'Thomas', lastName: 'Richard', email: 'thomas.richard@example.com', phone: '+33 1 78 90 12 34', company: 'TechCorp', jobTitle: 'Développeur', status: 'active', lastContact: '2023-10-05' },
    { id: 7, firstName: 'Camille', lastName: 'Durand', email: 'camille.durand@example.com', phone: '+33 1 89 01 23 45', company: 'InnovateCo', jobTitle: 'Designer UX', status: 'lead', lastContact: '2023-10-01' },
    { id: 8, firstName: 'Nicolas', lastName: 'Dubois', email: 'nicolas.dubois@example.com', phone: '+33 1 90 12 34 56', company: 'GlobalSolutions', jobTitle: 'Analyste Data', status: 'customer', lastContact: '2023-09-30' }
  ];

  // Charger les contacts depuis l'API
  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/contacts');
      setContacts(response.data || []);
      setFilteredContacts(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      // Fallback sur données de démonstration
      setContacts(demoContacts);
      setFilteredContacts(demoContacts);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let results = [...contacts];
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(contact => 
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term) ||
        contact.jobTitle.toLowerCase().includes(term)
      );
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(contact => contact.status === statusFilter);
    }
    
    // Filtre par entreprise
    if (companyFilter !== 'all') {
      results = results.filter(contact => contact.company === companyFilter);
    }
    
    // Tri
    results.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Pour les noms complets
      if (sortField === 'fullName') {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredContacts(results);
  }, [contacts, searchTerm, statusFilter, companyFilter, sortField, sortDirection]);

  // Gestion de la sélection de contacts
  const toggleSelectContact = (id) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  // Gestion du tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Gestion de la suppression
  const confirmDeleteContact = (id) => {
    setContactToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteContact = async () => {
    if (contactToDelete) {
      try {
        await api.delete(`/api/contacts/${contactToDelete}`);
        const updatedContacts = contacts.filter(contact => contact.id !== contactToDelete);
        setContacts(updatedContacts);
        setShowDeleteModal(false);
        setContactToDelete(null);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du contact');
      }
    }
  };

  // Gestion de l'ajout
  const handleAddContact = async () => {
    try {
      const response = await api.post('/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setShowAddModal(false);
      resetNewContactForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout du contact');
    }
  };

  const resetNewContactForm = () => {
    setNewContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      status: 'active',
      notes: ''
    });
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'lead': return 'status-lead';
      case 'customer': return 'status-customer';
      default: return '';
    }
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'lead': return 'Lead';
      case 'customer': return 'Client';
      default: return status;
    }
  };

  // Exporter les contacts
  const exportContacts = () => {
    const dataStr = JSON.stringify(filteredContacts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `contacts_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="contact-list-page">
      <header className="list-header">
        <div className="header-title">
          <h1>Liste des contacts</h1>
          <p>{filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} trouvé{filteredContacts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Nouveau contact
          </button>
          <button 
            className="btn btn-secondary"
            onClick={exportContacts}
            disabled={filteredContacts.length === 0}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Exporter
          </button>
        </div>
      </header>

      {/* Modal d'ajout de contact */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal add-contact-modal">
            <div className="modal-header">
              <h2>Ajouter un nouveau contact</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={newContact.firstName}
                    onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                    placeholder="Prénom"
                  />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={newContact.lastName}
                    onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                    placeholder="Nom"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Entreprise</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                    placeholder="Entreprise"
                  />
                </div>
                <div className="form-group">
                  <label>Poste</label>
                  <input
                    type="text"
                    value={newContact.jobTitle}
                    onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
                    placeholder="Poste"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  value={newContact.status}
                  onChange={(e) => setNewContact({...newContact, status: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="lead">Lead</option>
                  <option value="customer">Client</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newContact.notes}
                  onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                  rows="3"
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleAddContact}>
                Ajouter le contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h2>Confirmer la suppression</h2>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={deleteContact}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="controls-bar">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          )}
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="statusFilter">Statut</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="companyFilter">Entreprise</label>
            <select
              id="companyFilter"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              {companyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCompanyFilter('all');
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Actions groupées */}
      {selectedContacts.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} sélectionné{selectedContacts.length !== 1 ? 's' : ''}
          </div>
          <div className="bulk-buttons">
            <button className="btn btn-secondary">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
              </svg>
              Exporter
            </button>
            <button className="btn btn-secondary">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" />
              </svg>
              Modifier le statut
            </button>
            <button className="btn btn-danger">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
              Supprimer
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedContacts([])}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Tableau des contacts */}
      <div className="contacts-table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
            </svg>
            <h3>Aucun contact trouvé</h3>
            <p>{searchTerm || statusFilter !== 'all' || companyFilter !== 'all' 
              ? "Essayez de modifier vos critères de recherche ou de filtrage." 
              : "Commencez par ajouter un nouveau contact."}</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              Ajouter un contact
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={toggleSelectAll}
                      disabled={filteredContacts.length === 0}
                    />
                  </th>
                  <th 
                    className={`sortable ${sortField === 'lastName' ? 'sorted' : ''}`}
                    onClick={() => handleSort('lastName')}
                  >
                    <span>Nom</span>
                    {sortField === 'lastName' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'email' ? 'sorted' : ''}`}
                    onClick={() => handleSort('email')}
                  >
                    <span>Email</span>
                    {sortField === 'email' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th>Téléphone</th>
                  <th 
                    className={`sortable ${sortField === 'company' ? 'sorted' : ''}`}
                    onClick={() => handleSort('company')}
                  >
                    <span>Entreprise</span>
                    {sortField === 'company' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'jobTitle' ? 'sorted' : ''}`}
                    onClick={() => handleSort('jobTitle')}
                  >
                    <span>Poste</span>
                    {sortField === 'jobTitle' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'status' ? 'sorted' : ''}`}
                    onClick={() => handleSort('status')}
                  >
                    <span>Statut</span>
                    {sortField === 'status' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'lastContact' ? 'sorted' : ''}`}
                    onClick={() => handleSort('lastContact')}
                  >
                    <span>Dernier contact</span>
                    {sortField === 'lastContact' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className={selectedContacts.includes(contact.id) ? 'selected' : ''}>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelectContact(contact.id)}
                      />
                    </td>
                    <td>
                      <div className="contact-name">
                        <div className="avatar">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="full-name">{contact.firstName} {contact.lastName}</div>
                          <div className="contact-id">ID: {contact.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${contact.email}`} className="email-link">
                        {contact.email}
                      </a>
                    </td>
                    <td>
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="phone-link">
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="empty-field">Non renseigné</span>
                      )}
                    </td>
                    <td>{contact.company}</td>
                    <td>{contact.jobTitle}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(contact.status)}`}>
                        {getStatusLabel(contact.status)}
                      </span>
                    </td>
                    <td>{formatDate(contact.lastContact)}</td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit-btn"
                          title="Modifier"
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                          </svg>
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          title="Supprimer"
                          onClick={() => confirmDeleteContact(contact.id)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                          </svg>
                        </button>
                        <button 
                          className="action-btn view-btn"
                          title="Voir détails"
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredContacts.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Affichage de 1 à {filteredContacts.length} sur {filteredContacts.length} contacts
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn" disabled>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                </svg>
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn" disabled>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="stats-section">
        <h3>Statistiques des contacts</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{contacts.filter(c => c.status === 'active').length}</div>
            <div className="stat-label">Contacts actifs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{contacts.filter(c => c.status === 'lead').length}</div>
            <div className="stat-label">Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{contacts.filter(c => c.status === 'customer').length}</div>
            <div className="stat-label">Clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{contacts.length}</div>
            <div className="stat-label">Total contacts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;