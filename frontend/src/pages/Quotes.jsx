import React, { useState, useEffect } from 'react';
import './Quotes.css';

const Quotes = () => {
  // États pour les devis
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  
  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // États pour la gestion des devis
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  
  // État pour le nouveau devis
  const [newQuote, setNewQuote] = useState({
    clientId: '',
    clientName: '',
    title: '',
    description: '',
    items: [
      { id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
    ],
    subtotal: 0,
    taxRate: 20,
    taxAmount: 0,
    total: 0,
    validUntil: '',
    notes: '',
    terms: 'Paiement à 30 jours. Retard de paiement: pénalités selon taux légal.'
  });

  // Données de démonstration
  const demoClients = [
    { id: 1, name: 'TechCorp', email: 'contact@techcorp.com', phone: '+33 1 23 45 67 89' },
    { id: 2, name: 'InnovateCo', email: 'info@innovateco.com', phone: '+33 1 34 56 78 90' },
    { id: 3, name: 'GlobalSolutions', email: 'contact@globalsolutions.com', phone: '+33 1 45 67 89 01' },
    { id: 4, name: 'StartupXYZ', email: 'contact@startupxyz.com', phone: '+33 1 56 78 90 12' },
    { id: 5, name: 'EnterprisePlus', email: 'devis@enterpriseplus.com', phone: '+33 1 67 89 01 23' }
  ];

  const demoQuotes = [
    { 
      id: 1001, 
      quoteNumber: 'DEV-2023-1001',
      clientId: 1, 
      clientName: 'TechCorp',
      title: 'Développement application mobile',
      description: 'Développement d\'une application mobile iOS et Android avec backend',
      status: 'sent',
      subtotal: 12500,
      taxRate: 20,
      taxAmount: 2500,
      total: 15000,
      createdDate: '2023-10-01',
      validUntil: '2023-11-01',
      sentDate: '2023-10-02',
      items: [
        { id: 1, description: 'Développement application iOS', quantity: 80, unitPrice: 100, total: 8000 },
        { id: 2, description: 'Développement application Android', quantity: 70, unitPrice: 100, total: 7000 },
        { id: 3, description: 'Design UI/UX', quantity: 20, unitPrice: 150, total: 3000 }
      ]
    },
    { 
      id: 1002, 
      quoteNumber: 'DEV-2023-1002',
      clientId: 2, 
      clientName: 'InnovateCo',
      title: 'Refonte site web corporate',
      description: 'Refonte complète du site web avec nouveau design et CMS',
      status: 'accepted',
      subtotal: 8000,
      taxRate: 20,
      taxAmount: 1600,
      total: 9600,
      createdDate: '2023-10-05',
      validUntil: '2023-11-05',
      sentDate: '2023-10-06',
      acceptedDate: '2023-10-10',
      items: [
        { id: 1, description: 'Design site web', quantity: 40, unitPrice: 100, total: 4000 },
        { id: 2, description: 'Développement frontend', quantity: 60, unitPrice: 50, total: 3000 },
        { id: 3, description: 'Intégration CMS', quantity: 20, unitPrice: 50, total: 1000 }
      ]
    },
    { 
      id: 1003, 
      quoteNumber: 'DEV-2023-1003',
      clientId: 3, 
      clientName: 'GlobalSolutions',
      title: 'Consulting stratégie digitale',
      description: 'Audit et stratégie digitale pour amélioration présence en ligne',
      status: 'draft',
      subtotal: 5000,
      taxRate: 20,
      taxAmount: 1000,
      total: 6000,
      createdDate: '2023-10-10',
      validUntil: '2023-11-10',
      items: [
        { id: 1, description: 'Audit complet', quantity: 20, unitPrice: 150, total: 3000 },
        { id: 2, description: 'Stratégie digitale', quantity: 20, unitPrice: 100, total: 2000 }
      ]
    },
    { 
      id: 1004, 
      quoteNumber: 'DEV-2023-1004',
      clientId: 4, 
      clientName: 'StartupXYZ',
      title: 'Maintenance serveurs cloud',
      description: 'Maintenance et monitoring des serveurs cloud 24/7',
      status: 'expired',
      subtotal: 3000,
      taxRate: 20,
      taxAmount: 600,
      total: 3600,
      createdDate: '2023-09-15',
      validUntil: '2023-10-15',
      sentDate: '2023-09-16',
      items: [
        { id: 1, description: 'Monitoring 24/7', quantity: 1, unitPrice: 2000, total: 2000 },
        { id: 2, description: 'Maintenance corrective', quantity: 10, unitPrice: 100, total: 1000 }
      ]
    },
    { 
      id: 1005, 
      quoteNumber: 'DEV-2023-1005',
      clientId: 5, 
      clientName: 'EnterprisePlus',
      title: 'Formation équipe développement',
      description: 'Formation React et Node.js pour équipe de développement',
      status: 'rejected',
      subtotal: 4500,
      taxRate: 20,
      taxAmount: 900,
      total: 5400,
      createdDate: '2023-10-03',
      validUntil: '2023-11-03',
      sentDate: '2023-10-04',
      rejectedDate: '2023-10-08',
      items: [
        { id: 1, description: 'Formation React avancé', quantity: 30, unitPrice: 100, total: 3000 },
        { id: 2, description: 'Formation Node.js', quantity: 15, unitPrice: 100, total: 1500 }
      ]
    },
    { 
      id: 1006, 
      quoteNumber: 'DEV-2023-1006',
      clientId: 1, 
      clientName: 'TechCorp',
      title: 'Développement API sécurisée',
      description: 'Développement d\'une API REST sécurisée avec documentation',
      status: 'invoiced',
      subtotal: 6000,
      taxRate: 20,
      taxAmount: 1200,
      total: 7200,
      createdDate: '2023-09-20',
      validUntil: '2023-10-20',
      sentDate: '2023-09-21',
      acceptedDate: '2023-09-25',
      invoicedDate: '2023-09-28',
      invoiceNumber: 'FAC-2023-045',
      items: [
        { id: 1, description: 'Développement API', quantity: 50, unitPrice: 100, total: 5000 },
        { id: 2, description: 'Documentation technique', quantity: 10, unitPrice: 100, total: 1000 }
      ]
    }
  ];

  // Options pour les filtres
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'sent', label: 'Envoyé' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'rejected', label: 'Refusé' },
    { value: 'expired', label: 'Expiré' },
    { value: 'invoiced', label: 'Facturé' }
  ];

  const clientOptions = [
    { value: 'all', label: 'Tous les clients' },
    ...demoClients.map(client => ({ value: client.id, label: client.name }))
  ];

  const dateOptions = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'lastMonth', label: 'Le mois dernier' },
    { value: 'expiring', label: 'Expirant bientôt' }
  ];

  // Charger les devis (simulation API)
  useEffect(() => {
    const loadQuotes = () => {
      setIsLoading(true);
      setTimeout(() => {
        setQuotes(demoQuotes);
        setFilteredQuotes(demoQuotes);
        setIsLoading(false);
      }, 800);
    };

    loadQuotes();
  }, []);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let results = [...quotes];
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(quote => 
        quote.quoteNumber.toLowerCase().includes(term) ||
        quote.clientName.toLowerCase().includes(term) ||
        quote.title.toLowerCase().includes(term) ||
        quote.description.toLowerCase().includes(term)
      );
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(quote => quote.status === statusFilter);
    }
    
    // Filtre par client
    if (clientFilter !== 'all') {
      results = results.filter(quote => quote.clientId === parseInt(clientFilter));
    }
    
    // Filtre par date
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      
      results = results.filter(quote => {
        const quoteDate = new Date(quote.createdDate);
        const validUntilDate = new Date(quote.validUntil);
        
        switch(dateFilter) {
          case 'today':
            return quoteDate.toDateString() === today.toDateString();
          case 'week':
            return quoteDate >= startOfWeek;
          case 'month':
            return quoteDate >= startOfMonth;
          case 'lastMonth':
            return quoteDate >= startOfLastMonth && quoteDate <= endOfLastMonth;
          case 'expiring':
            const daysUntilExpiry = Math.ceil((validUntilDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
          default:
            return true;
        }
      });
    }
    
    // Tri
    results.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Pour les dates
      if (sortField.includes('Date')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Pour les montants
      if (sortField === 'total' || sortField === 'subtotal') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredQuotes(results);
  }, [quotes, searchTerm, statusFilter, clientFilter, dateFilter, sortField, sortDirection]);

  // Gestion de la sélection de devis
  const toggleSelectQuote = (id) => {
    if (selectedQuotes.includes(id)) {
      setSelectedQuotes(selectedQuotes.filter(quoteId => quoteId !== id));
    } else {
      setSelectedQuotes([...selectedQuotes, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedQuotes.length === filteredQuotes.length) {
      setSelectedQuotes([]);
    } else {
      setSelectedQuotes(filteredQuotes.map(quote => quote.id));
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
  const confirmDeleteQuote = (id) => {
    setQuoteToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteQuote = () => {
    if (quoteToDelete) {
      const updatedQuotes = quotes.filter(quote => quote.id !== quoteToDelete);
      setQuotes(updatedQuotes);
      setShowDeleteModal(false);
      setQuoteToDelete(null);
    }
  };

  // Gestion de la création de devis
  const handleCreateQuote = () => {
    const newId = Math.max(...quotes.map(q => q.id)) + 1;
    const quoteNumber = `DEV-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
    
    const client = demoClients.find(c => c.id === parseInt(newQuote.clientId));
    
    // Calculer les totaux
    const subtotal = newQuote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (newQuote.taxRate / 100);
    const total = subtotal + taxAmount;
    
    const quoteToAdd = {
      ...newQuote,
      id: newId,
      quoteNumber,
      clientName: client ? client.name : '',
      subtotal,
      taxAmount,
      total,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: newQuote.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setQuotes([quoteToAdd, ...quotes]);
    setShowCreateModal(false);
    resetNewQuoteForm();
  };

  const resetNewQuoteForm = () => {
    setNewQuote({
      clientId: '',
      clientName: '',
      title: '',
      description: '',
      items: [
        { id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
      ],
      subtotal: 0,
      taxRate: 20,
      taxAmount: 0,
      total: 0,
      validUntil: '',
      notes: '',
      terms: 'Paiement à 30 jours. Retard de paiement: pénalités selon taux légal.'
    });
  };

  // Gérer les changements dans les lignes du devis
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newQuote.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    };
    
    // Recalculer le total pour cette ligne
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setNewQuote({
      ...newQuote,
      items: updatedItems
    });
  };

  // Ajouter une ligne au devis
  const addItem = () => {
    const newId = newQuote.items.length > 0 ? Math.max(...newQuote.items.map(item => item.id)) + 1 : 1;
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, { id: newId, description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  // Supprimer une ligne du devis
  const removeItem = (index) => {
    if (newQuote.items.length > 1) {
      const updatedItems = [...newQuote.items];
      updatedItems.splice(index, 1);
      setNewQuote({
        ...newQuote,
        items: updatedItems
      });
    }
  };

  // Voir un devis
  const viewQuote = (quote) => {
    setCurrentQuote(quote);
    setShowViewModal(true);
  };

  // Envoyer un devis
  const sendQuote = (quote) => {
    setCurrentQuote(quote);
    setShowSendModal(true);
  };

  const confirmSendQuote = () => {
    const updatedQuotes = quotes.map(q => 
      q.id === currentQuote.id 
        ? { ...q, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
        : q
    );
    
    setQuotes(updatedQuotes);
    setShowSendModal(false);
    setCurrentQuote(null);
  };

  // Accepter un devis
  const acceptQuote = (id) => {
    const updatedQuotes = quotes.map(q => 
      q.id === id 
        ? { ...q, status: 'accepted', acceptedDate: new Date().toISOString().split('T')[0] }
        : q
    );
    
    setQuotes(updatedQuotes);
  };

  // Refuser un devis
  const rejectQuote = (id) => {
    const updatedQuotes = quotes.map(q => 
      q.id === id 
        ? { ...q, status: 'rejected', rejectedDate: new Date().toISOString().split('T')[0] }
        : q
    );
    
    setQuotes(updatedQuotes);
  };

  // Convertir en facture
  const convertToInvoice = (id) => {
    const quote = quotes.find(q => q.id === id);
    if (quote) {
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const updatedQuotes = quotes.map(q => 
        q.id === id 
          ? { 
              ...q, 
              status: 'invoiced', 
              invoicedDate: new Date().toISOString().split('T')[0],
              invoiceNumber 
            }
          : q
      );
      
      setQuotes(updatedQuotes);
      
      // Dans une application réelle, on créerait une nouvelle facture ici
      alert(`Devis ${quote.quoteNumber} converti en facture ${invoiceNumber}`);
    }
  };

  // Dupliquer un devis
  const duplicateQuote = (id) => {
    const quoteToDuplicate = quotes.find(q => q.id === id);
    if (quoteToDuplicate) {
      const newId = Math.max(...quotes.map(q => q.id)) + 1;
      const quoteNumber = `DEV-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const duplicatedQuote = {
        ...quoteToDuplicate,
        id: newId,
        quoteNumber,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        sentDate: null,
        acceptedDate: null,
        rejectedDate: null,
        invoicedDate: null,
        invoiceNumber: null
      };
      
      setQuotes([duplicatedQuote, ...quotes]);
    }
  };

  // Exporter les devis
  const exportQuotes = () => {
    const dataStr = JSON.stringify(filteredQuotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `devis_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formater le montant
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status) => {
    switch(status) {
      case 'draft': return 'status-draft';
      case 'sent': return 'status-sent';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'expired': return 'status-expired';
      case 'invoiced': return 'status-invoiced';
      default: return '';
    }
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    switch(status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Refusé';
      case 'expired': return 'Expiré';
      case 'invoiced': return 'Facturé';
      default: return status;
    }
  };

  return (
    <div className="quotes-page">
      <header className="quotes-header">
        <div className="header-title">
          <h1>Gestion des devis</h1>
          <p>{filteredQuotes.length} devis trouvé{filteredQuotes.length !== 1 ? 's' : ''} | Total: {formatCurrency(filteredQuotes.reduce((sum, quote) => sum + quote.total, 0))}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Nouveau devis
          </button>
          <button 
            className="btn btn-secondary"
            onClick={exportQuotes}
            disabled={filteredQuotes.length === 0}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Exporter
          </button>
        </div>
      </header>

      {/* Modal de création de devis */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal create-quote-modal">
            <div className="modal-header">
              <h2>Créer un nouveau devis</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-section">
                <h3>Informations du devis</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Client *</label>
                    <select
                      value={newQuote.clientId}
                      onChange={(e) => setNewQuote({...newQuote, clientId: e.target.value})}
                    >
                      <option value="">Sélectionnez un client</option>
                      {demoClients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date de validité *</label>
                    <input
                      type="date"
                      value={newQuote.validUntil}
                      onChange={(e) => setNewQuote({...newQuote, validUntil: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Titre du devis *</label>
                  <input
                    type="text"
                    value={newQuote.title}
                    onChange={(e) => setNewQuote({...newQuote, title: e.target.value})}
                    placeholder="Ex: Développement application mobile"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newQuote.description}
                    onChange={(e) => setNewQuote({...newQuote, description: e.target.value})}
                    rows="3"
                    placeholder="Description détaillée du devis..."
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Lignes du devis</h3>
                <div className="quote-items-table">
                  <div className="items-header">
                    <div className="item-col description">Description</div>
                    <div className="item-col quantity">Quantité</div>
                    <div className="item-col price">Prix unitaire</div>
                    <div className="item-col total">Total</div>
                    <div className="item-col actions">Actions</div>
                  </div>
                  {newQuote.items.map((item, index) => (
                    <div key={item.id} className="item-row">
                      <div className="item-col description">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Description de l'article"
                        />
                      </div>
                      <div className="item-col quantity">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="item-col price">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        />
                      </div>
                      <div className="item-col total">
                        {formatCurrency(item.total)}
                      </div>
                      <div className="item-col actions">
                        {newQuote.items.length > 1 && (
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => removeItem(index)}
                            type="button"
                          >
                            <svg viewBox="0 0 24 24">
                              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="items-footer">
                    <button className="btn btn-secondary" onClick={addItem} type="button">
                      <svg className="icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                      </svg>
                      Ajouter une ligne
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="totals-row">
                  <div className="totals-col">
                    <div className="form-group">
                      <label>Taux de TVA (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newQuote.taxRate}
                        onChange={(e) => setNewQuote({...newQuote, taxRate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="totals-col">
                    <div className="quote-totals">
                      <div className="total-row">
                        <span>Sous-total</span>
                        <span>{formatCurrency(newQuote.items.reduce((sum, item) => sum + item.total, 0))}</span>
                      </div>
                      <div className="total-row">
                        <span>TVA ({newQuote.taxRate}%)</span>
                        <span>{formatCurrency(newQuote.items.reduce((sum, item) => sum + item.total, 0) * (newQuote.taxRate / 100))}</span>
                      </div>
                      <div className="total-row grand-total">
                        <span>Total TTC</span>
                        <span>{formatCurrency(newQuote.items.reduce((sum, item) => sum + item.total, 0) * (1 + newQuote.taxRate / 100))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Conditions de paiement</label>
                    <textarea
                      value={newQuote.terms}
                      onChange={(e) => setNewQuote({...newQuote, terms: e.target.value})}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Notes internes</label>
                    <textarea
                      value={newQuote.notes}
                      onChange={(e) => setNewQuote({...newQuote, notes: e.target.value})}
                      rows="3"
                      placeholder="Notes internes..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleCreateQuote}>
                Créer le devis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation de devis */}
      {showViewModal && currentQuote && (
        <div className="modal-overlay">
          <div className="modal view-quote-modal">
            <div className="modal-header">
              <div className="quote-header-info">
                <h2>Devis {currentQuote.quoteNumber}</h2>
                <div className={`quote-status ${getStatusClass(currentQuote.status)}`}>
                  {getStatusLabel(currentQuote.status)}
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="quote-details">
                <div className="detail-row">
                  <div className="detail-label">Client:</div>
                  <div className="detail-value">{currentQuote.clientName}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Titre:</div>
                  <div className="detail-value">{currentQuote.title}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date de création:</div>
                  <div className="detail-value">{formatDate(currentQuote.createdDate)}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Valide jusqu'au:</div>
                  <div className="detail-value">{formatDate(currentQuote.validUntil)}</div>
                </div>
                {currentQuote.sentDate && (
                  <div className="detail-row">
                    <div className="detail-label">Date d'envoi:</div>
                    <div className="detail-value">{formatDate(currentQuote.sentDate)}</div>
                  </div>
                )}
              </div>

              <div className="quote-items-preview">
                <h3>Détails du devis</h3>
                <div className="items-table">
                  <div className="items-header">
                    <div className="item-col description">Description</div>
                    <div className="item-col quantity">Quantité</div>
                    <div className="item-col price">Prix unitaire</div>
                    <div className="item-col total">Total</div>
                  </div>
                  {currentQuote.items.map(item => (
                    <div key={item.id} className="item-row">
                      <div className="item-col description">{item.description}</div>
                      <div className="item-col quantity">{item.quantity}</div>
                      <div className="item-col price">{formatCurrency(item.unitPrice)}</div>
                      <div className="item-col total">{formatCurrency(item.total)}</div>
                    </div>
                  ))}
                  <div className="items-footer">
                    <div className="total-row">
                      <span>Sous-total:</span>
                      <span>{formatCurrency(currentQuote.subtotal)}</span>
                    </div>
                    <div className="total-row">
                      <span>TVA ({currentQuote.taxRate}%):</span>
                      <span>{formatCurrency(currentQuote.taxAmount)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total TTC:</span>
                      <span>{formatCurrency(currentQuote.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Fermer
              </button>
              {currentQuote.status === 'draft' && (
                <button className="btn btn-primary" onClick={() => sendQuote(currentQuote)}>
                  Envoyer le devis
                </button>
              )}
              {currentQuote.status === 'sent' && (
                <>
                  <button className="btn btn-success" onClick={() => acceptQuote(currentQuote.id)}>
                    Accepter
                  </button>
                  <button className="btn btn-danger" onClick={() => rejectQuote(currentQuote.id)}>
                    Refuser
                  </button>
                </>
              )}
              {currentQuote.status === 'accepted' && !currentQuote.invoicedDate && (
                <button className="btn btn-primary" onClick={() => convertToInvoice(currentQuote.id)}>
                  Créer la facture
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'envoi de devis */}
      {showSendModal && currentQuote && (
        <div className="modal-overlay">
          <div className="modal send-quote-modal">
            <div className="modal-header">
              <h2>Envoyer le devis</h2>
              <button className="close-btn" onClick={() => setShowSendModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="send-quote-info">
                <p>Vous êtes sur le point d'envoyer le devis <strong>{currentQuote.quoteNumber}</strong> à <strong>{currentQuote.clientName}</strong>.</p>
                <p>Montant total: <strong>{formatCurrency(currentQuote.total)}</strong></p>
              </div>
              <div className="form-group">
                <label>Email du destinataire</label>
                <input
                  type="email"
                  defaultValue={demoClients.find(c => c.id === currentQuote.clientId)?.email || ''}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="form-group">
                <label>Message personnalisé (optionnel)</label>
                <textarea
                  rows="4"
                  defaultValue={`Bonjour,

Veuillez trouver ci-joint notre devis ${currentQuote.quoteNumber} pour "${currentQuote.title}".

N'hésitez pas à nous contacter pour toute question.

Cordialement,
L'équipe commerciale`}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSendModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={confirmSendQuote}>
                Envoyer le devis
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
              <p>Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={deleteQuote}>
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
            placeholder="Rechercher un devis..."
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
            <label htmlFor="clientFilter">Client</label>
            <select
              id="clientFilter"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              {clientOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dateFilter">Date</label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setClientFilter('all');
              setDateFilter('all');
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Actions groupées */}
      {selectedQuotes.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            {selectedQuotes.length} devis sélectionné{selectedQuotes.length !== 1 ? 's' : ''}
          </div>
          <div className="bulk-buttons">
            <button className="btn btn-secondary">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M20,18H4V8H20M16,12L12,16V13H8V11H12V8L16,12Z" />
              </svg>
              Envoyer
            </button>
            <button className="btn btn-secondary">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
              </svg>
              Exporter
            </button>
            <button className="btn btn-danger">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
              Supprimer
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedQuotes([])}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Tableau des devis */}
      <div className="quotes-table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des devis...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H15V15L13,19H10" />
            </svg>
            <h3>Aucun devis trouvé</h3>
            <p>{searchTerm || statusFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all' 
              ? "Essayez de modifier vos critères de recherche ou de filtrage." 
              : "Commencez par créer un nouveau devis."}</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Créer un devis
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="quotes-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                      onChange={toggleSelectAll}
                      disabled={filteredQuotes.length === 0}
                    />
                  </th>
                  <th 
                    className={`sortable ${sortField === 'quoteNumber' ? 'sorted' : ''}`}
                    onClick={() => handleSort('quoteNumber')}
                  >
                    <span>N° Devis</span>
                    {sortField === 'quoteNumber' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'clientName' ? 'sorted' : ''}`}
                    onClick={() => handleSort('clientName')}
                  >
                    <span>Client</span>
                    {sortField === 'clientName' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th>Titre</th>
                  <th 
                    className={`sortable ${sortField === 'createdDate' ? 'sorted' : ''}`}
                    onClick={() => handleSort('createdDate')}
                  >
                    <span>Date création</span>
                    {sortField === 'createdDate' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'validUntil' ? 'sorted' : ''}`}
                    onClick={() => handleSort('validUntil')}
                  >
                    <span>Validité</span>
                    {sortField === 'validUntil' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'total' ? 'sorted' : ''}`}
                    onClick={() => handleSort('total')}
                  >
                    <span>Montant</span>
                    {sortField === 'total' && (
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
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map(quote => (
                  <tr key={quote.id} className={selectedQuotes.includes(quote.id) ? 'selected' : ''}>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={selectedQuotes.includes(quote.id)}
                        onChange={() => toggleSelectQuote(quote.id)}
                      />
                    </td>
                    <td>
                      <div className="quote-number">{quote.quoteNumber}</div>
                    </td>
                    <td>
                      <div className="client-info">
                        <div className="client-name">{quote.clientName}</div>
                      </div>
                    </td>
                    <td>
                      <div className="quote-title">{quote.title}</div>
                      <div className="quote-description">{quote.description.substring(0, 50)}...</div>
                    </td>
                    <td>{formatDate(quote.createdDate)}</td>
                    <td>
                      <div className="validity-date">{formatDate(quote.validUntil)}</div>
                      {new Date(quote.validUntil) < new Date() && quote.status !== 'accepted' && quote.status !== 'invoiced' && (
                        <div className="expiry-warning">Expiré</div>
                      )}
                    </td>
                    <td>
                      <div className="quote-amount">{formatCurrency(quote.total)}</div>
                      <div className="quote-subtotal">HT: {formatCurrency(quote.subtotal)}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          title="Voir"
                          onClick={() => viewQuote(quote)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                          </svg>
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          title="Modifier"
                          onClick={() => setShowCreateModal(true)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                          </svg>
                        </button>
                        {quote.status === 'draft' && (
                          <button 
                            className="action-btn send-btn"
                            title="Envoyer"
                            onClick={() => sendQuote(quote)}
                          >
                            <svg viewBox="0 0 24 24">
                              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                            </svg>
                          </button>
                        )}
                        <button 
                          className="action-btn duplicate-btn"
                          title="Dupliquer"
                          onClick={() => duplicateQuote(quote.id)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11,17H4C2.89,17 2,16.1 2,15V3C2,1.89 2.89,1 4,1H16C17.1,1 18,1.9 18,3V9H16V3H4V15H11V17M20,5H16C14.89,5 14,5.9 14,7V21C14,22.1 14.89,23 16,23H20C21.1,23 22,22.1 22,21V7C22,5.9 21.1,5 20,5M20,21H16V7H20V21Z" />
                          </svg>
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          title="Supprimer"
                          onClick={() => confirmDeleteQuote(quote.id)}
                        >
                          <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
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
        {filteredQuotes.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Affichage de 1 à {filteredQuotes.length} sur {filteredQuotes.length} devis
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
        <h3>Statistiques des devis</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(quotes.reduce((sum, quote) => sum + quote.total, 0))}</div>
            <div className="stat-label">Chiffre d'affaires total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{quotes.filter(q => q.status === 'accepted' || q.status === 'invoiced').length}</div>
            <div className="stat-label">Devis acceptés</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{quotes.filter(q => q.status === 'sent').length}</div>
            <div className="stat-label">Devis en attente</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{quotes.filter(q => q.status === 'draft').length}</div>
            <div className="stat-label">Brouillons</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(quotes.filter(q => new Date(q.validUntil) < new Date() && q.status === 'sent').reduce((sum, quote) => sum + quote.total, 0))}</div>
            <div className="stat-label">Devis expirés</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{((quotes.filter(q => q.status === 'accepted' || q.status === 'invoiced').length / quotes.filter(q => q.status !== 'draft').length) * 100).toFixed(1)}%</div>
            <div className="stat-label">Taux d'acceptation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;