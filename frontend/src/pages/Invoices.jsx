import React, { useState, useEffect } from 'react';

const Invoices = () => {
  // États pour les factures
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  
  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('issueDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // États pour la gestion des factures
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  
  // État pour la nouvelle facture
  const [newInvoice, setNewInvoice] = useState({
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
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 30,
    notes: '',
    terms: 'Paiement à 30 jours. Retard de paiement: pénalités selon taux légal.',
    paymentMethod: 'bank_transfer'
  });

  // Données de démonstration
  const demoClients = [
    { id: 1, name: 'TechCorp', email: 'comptabilité@techcorp.com', phone: '+33 1 23 45 67 89', address: '123 Rue de Paris, 75001 Paris' },
    { id: 2, name: 'InnovateCo', email: 'factures@innovateco.com', phone: '+33 1 34 56 78 90', address: '456 Avenue des Champs, 69002 Lyon' },
    { id: 3, name: 'GlobalSolutions', email: 'compta@globalsolutions.com', phone: '+33 1 45 67 89 01', address: '789 Boulevard Maritime, 13008 Marseille' },
    { id: 4, name: 'StartupXYZ', email: 'finance@startupxyz.com', phone: '+33 1 56 78 90 12', address: '321 Rue Centrale, 31000 Toulouse' },
    { id: 5, name: 'EnterprisePlus', email: 'service.facturation@enterpriseplus.com', phone: '+33 1 67 89 01 23', address: '654 Place du Commerce, 44000 Nantes' }
  ];

  // Données de démonstration pour les factures
  const demoInvoices = [
    {
      id: 1,
      invoiceNumber: 'FAC-2024-0001',
      clientId: 1,
      clientName: 'TechCorp',
      title: 'Développement site web',
      description: 'Conception et développement site e-commerce',
      items: [
        { id: 1, description: 'Développement frontend', quantity: 40, unitPrice: 75, total: 3000 },
        { id: 2, description: 'Développement backend', quantity: 60, unitPrice: 85, total: 5100 }
      ],
      subtotal: 8100,
      taxRate: 20,
      taxAmount: 1620,
      total: 9720,
      amountPaid: 5000,
      amountDue: 4720,
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      paymentDate: null,
      status: 'partial',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 2,
      invoiceNumber: 'FAC-2024-0002',
      clientId: 2,
      clientName: 'InnovateCo',
      title: 'Consultation stratégique',
      description: 'Audit et conseil en transformation digitale',
      items: [
        { id: 1, description: 'Audit initial', quantity: 8, unitPrice: 150, total: 1200 },
        { id: 2, description: 'Ateliers stratégiques', quantity: 16, unitPrice: 125, total: 2000 }
      ],
      subtotal: 3200,
      taxRate: 20,
      taxAmount: 640,
      total: 3840,
      amountPaid: 3840,
      amountDue: 0,
      issueDate: '2024-01-10',
      dueDate: '2024-02-09',
      paymentDate: '2024-01-25',
      status: 'paid',
      paymentMethod: 'credit_card'
    },
    {
      id: 3,
      invoiceNumber: 'FAC-2024-0003',
      clientId: 3,
      clientName: 'GlobalSolutions',
      title: 'Maintenance mensuelle',
      description: 'Maintenance et support technique',
      items: [
        { id: 1, description: 'Support technique niveau 2', quantity: 20, unitPrice: 65, total: 1300 }
      ],
      subtotal: 1300,
      taxRate: 20,
      taxAmount: 260,
      total: 1560,
      amountPaid: 0,
      amountDue: 1560,
      issueDate: '2024-01-05',
      dueDate: '2024-01-20',
      paymentDate: null,
      status: 'overdue',
      daysOverdue: 15,
      paymentMethod: 'bank_transfer'
    },
    {
      id: 4,
      invoiceNumber: 'FAC-2024-0004',
      clientId: 4,
      clientName: 'StartupXYZ',
      title: 'Application mobile',
      description: 'Développement application iOS/Android',
      items: [
        { id: 1, description: 'Design UI/UX', quantity: 30, unitPrice: 90, total: 2700 },
        { id: 2, description: 'Développement mobile', quantity: 120, unitPrice: 95, total: 11400 },
        { id: 3, description: 'Tests et validation', quantity: 25, unitPrice: 70, total: 1750 }
      ],
      subtotal: 15850,
      taxRate: 20,
      taxAmount: 3170,
      total: 19020,
      amountPaid: 10000,
      amountDue: 9020,
      issueDate: '2024-01-20',
      dueDate: '2024-02-19',
      paymentDate: null,
      status: 'pending',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 5,
      invoiceNumber: 'FAC-2024-0005',
      clientId: 5,
      clientName: 'EnterprisePlus',
      title: 'Formation équipe',
      description: 'Formation React et bonnes pratiques',
      items: [
        { id: 1, description: 'Formation React avancé', quantity: 16, unitPrice: 180, total: 2880 },
        { id: 2, description: 'Support après formation', quantity: 8, unitPrice: 95, total: 760 }
      ],
      subtotal: 3640,
      taxRate: 20,
      taxAmount: 728,
      total: 4368,
      amountPaid: 0,
      amountDue: 4368,
      issueDate: '2024-01-25',
      dueDate: '2024-02-24',
      paymentDate: null,
      status: 'draft',
      paymentMethod: 'bank_transfer'
    }
  ];

  // Options pour les filtres
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'pending', label: 'En attente' },
    { value: 'partial', label: 'Partiellement payée' },
    { value: 'paid', label: 'Payée' },
    { value: 'overdue', label: 'En retard' },
    { value: 'cancelled', label: 'Annulée' }
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
    { value: 'overdue', label: 'En retard' },
    { value: 'dueSoon', label: 'Échéance proche' }
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Virement bancaire' },
    { value: 'credit_card', label: 'Carte de crédit' },
    { value: 'check', label: 'Chèque' },
    { value: 'cash', label: 'Espèces' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'other', label: 'Autre' }
  ];

  // Charger les factures (simulation API)
  useEffect(() => {
    const loadInvoices = () => {
      setIsLoading(true);
      setTimeout(() => {
        const today = new Date();
        const updatedInvoices = demoInvoices.map(invoice => {
          if (invoice.status === 'pending') {
            const dueDate = new Date(invoice.dueDate);
            if (dueDate < today) {
              const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
              return { ...invoice, status: 'overdue', daysOverdue };
            }
          }
          return invoice;
        });
        
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
        setIsLoading(false);
      }, 800);
    };

    loadInvoices();
  }, []);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let results = [...invoices];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.clientName.toLowerCase().includes(term) ||
        invoice.title.toLowerCase().includes(term) ||
        invoice.description.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(invoice => invoice.status === statusFilter);
    }
    
    if (clientFilter !== 'all') {
      results = results.filter(invoice => invoice.clientId === parseInt(clientFilter));
    }
    
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      
      results = results.filter(invoice => {
        const issueDate = new Date(invoice.issueDate);
        const dueDate = new Date(invoice.dueDate);
        
        switch(dateFilter) {
          case 'today':
            return issueDate.toDateString() === today.toDateString();
          case 'week':
            return issueDate >= startOfWeek;
          case 'month':
            return issueDate >= startOfMonth;
          case 'lastMonth':
            return issueDate >= startOfLastMonth && issueDate <= endOfLastMonth;
          case 'overdue':
            return invoice.status === 'overdue';
          case 'dueSoon':
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilDue >= 0 && daysUntilDue <= 7 && invoice.status !== 'paid' && invoice.status !== 'cancelled';
          default:
            return true;
        }
      });
    }
    
    results.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField.includes('Date')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortField === 'total' || sortField === 'amountDue' || sortField === 'subtotal') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredInvoices(results);
  }, [invoices, searchTerm, statusFilter, clientFilter, dateFilter, sortField, sortDirection]);

  // Gestion de la sélection de factures
  const toggleSelectInvoice = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter(invoiceId => invoiceId !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
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
  const confirmDeleteInvoice = (id) => {
    setInvoiceToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteInvoice = () => {
    if (invoiceToDelete) {
      const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceToDelete);
      setInvoices(updatedInvoices);
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
    }
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
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    switch(status) {
      case 'draft': return 'Brouillon';
      case 'pending': return 'En attente';
      case 'partial': return 'Partiellement payée';
      case 'paid': return 'Payée';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalDue = invoices.reduce((sum, inv) => sum + inv.amountDue, 0);
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
    const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amountDue, 0);
    
    return {
      totalInvoices,
      totalAmount,
      totalPaid,
      totalDue,
      overdueInvoices,
      overdueAmount
    };
  };

  const stats = calculateStats();

  // Voir une facture
  const viewInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setShowViewModal(true);
  };

  // Enregistrer un paiement
  const recordPayment = (invoice) => {
    setCurrentInvoice(invoice);
    setShowPaymentModal(true);
  };

  // Envoyer une facture
  const sendInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setShowSendModal(true);
  };

  // Envoyer un rappel
  const sendReminder = (invoice) => {
    setCurrentInvoice(invoice);
    setShowReminderModal(true);
  };

  // Dupliquer une facture
  const duplicateInvoice = (id) => {
    const invoiceToDuplicate = invoices.find(i => i.id === id);
    if (invoiceToDuplicate) {
      const newId = Math.max(...invoices.map(i => i.id)) + 1;
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const duplicatedInvoice = {
        ...invoiceToDuplicate,
        id: newId,
        invoiceNumber,
        status: 'draft',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentDate: null,
        amountPaid: 0,
        amountDue: invoiceToDuplicate.total,
        cancellationDate: null
      };
      
      setInvoices([duplicatedInvoice, ...invoices]);
    }
  };

  // Exporter les factures
  const exportInvoices = () => {
    const dataStr = JSON.stringify(filteredInvoices, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `factures_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Fonction pour afficher un toast
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
      toast.classList.add('translate-x-0');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-0');
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header avec statistiques */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des factures</h1>
            <p className="text-gray-600">
              {filteredInvoices.length} facture{filteredInvoices.length !== 1 ? 's' : ''} • 
              Encaissements: <span className="font-semibold">{formatCurrency(stats.totalPaid)}</span> / {formatCurrency(stats.totalAmount)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={exportInvoices}
              disabled={filteredInvoices.length === 0}
            >
              <span>📥</span>
              Exporter
            </button>
            <button 
              className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <span>➕</span>
              Nouvelle facture
            </button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="text-sm text-gray-500">Chiffre d'affaires</div>
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalAmount)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="text-sm text-gray-500">Encaissé</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaid)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="text-sm text-gray-500">En attente</div>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.totalDue)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="text-sm text-gray-500">En retard</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</div>
          </div>
        </div>
      </header>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {clientOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <button 
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
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
      </div>

      {/* Actions groupées */}
      {selectedInvoices.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-blue-700 font-medium">
              {selectedInvoices.length} facture{selectedInvoices.length !== 1 ? 's' : ''} sélectionnée{selectedInvoices.length !== 1 ? 's' : ''}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                <span>📧</span>
                Envoyer
              </button>
              <button className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                <span>📥</span>
                Exporter
              </button>
              <button className="px-4 py-2 bg-red-100 border border-red-300 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2">
                <span>🗑️</span>
                Supprimer
              </button>
              <button 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={() => setSelectedInvoices([])}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des factures */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Chargement des factures...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune facture trouvée</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all' 
                ? "Essayez de modifier vos critères de recherche" 
                : "Commencez par créer votre première facture"}
            </p>
            <button 
              className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              Créer une facture
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onChange={toggleSelectAll}
                        disabled={filteredInvoices.length === 0}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('invoiceNumber')}
                    >
                      <div className="flex items-center gap-1">
                        N° Facture
                        {sortField === 'invoiceNumber' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('clientName')}
                    >
                      <div className="flex items-center gap-1">
                        Client
                        {sortField === 'clientName' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Échéance
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center gap-1">
                        Total
                        {sortField === 'total' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('amountDue')}
                    >
                      <div className="flex items-center gap-1">
                        Solde dû
                        {sortField === 'amountDue' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map(invoice => {
                    const isOverdue = invoice.status === 'overdue';
                    const dueDate = new Date(invoice.dueDate);
                    const today = new Date();
                    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => toggleSelectInvoice(invoice.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{invoice.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{invoice.clientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(invoice.issueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`${isOverdue ? 'text-red-600 font-medium' : daysUntilDue <= 7 && invoice.status !== 'paid' && invoice.status !== 'cancelled' ? 'text-yellow-600' : ''}`}>
                            {formatDate(invoice.dueDate)}
                            {isOverdue && invoice.daysOverdue && (
                              <div className="text-xs text-red-500 mt-1">+{invoice.daysOverdue} jours</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${invoice.amountDue > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {formatCurrency(invoice.amountDue)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                            {getStatusLabel(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button 
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir"
                              onClick={() => viewInvoice(invoice)}
                            >
                              👁️
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Enregistrer paiement"
                              onClick={() => recordPayment(invoice)}
                            >
                              💰
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Dupliquer"
                              onClick={() => duplicateInvoice(invoice.id)}
                            >
                              📋
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                              onClick={() => confirmDeleteInvoice(invoice.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Affichage de 1 à {filteredInvoices.length} sur {filteredInvoices.length} factures
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  ← Précédent
                </button>
                <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg">1</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Suivant →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dashboard rapide */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Factures à envoyer</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-800">
              {invoices.filter(i => i.status === 'draft').length}
            </span>
            <button 
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              onClick={() => setStatusFilter('draft')}
            >
              Voir
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Factures en attente</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-800">
              {invoices.filter(i => i.status === 'pending').length}
            </span>
            <button 
              className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
              onClick={() => setStatusFilter('pending')}
            >
              Voir
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Factures en retard</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</span>
            <button 
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              onClick={() => setStatusFilter('overdue')}
            >
              Relancer
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Prochaines échéances</h3>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-800">
              {invoices.filter(i => {
                const dueDate = new Date(i.dueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                return daysUntilDue >= 0 && daysUntilDue <= 7 && i.status !== 'paid' && i.status !== 'cancelled';
              }).length}
            </span>
            <button 
              className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
              onClick={() => setDateFilter('dueSoon')}
            >
              Voir
            </button>
          </div>
        </div>
      </div>

      {/* Modal de visualisation de facture */}
      {showViewModal && currentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Facture {currentInvoice.invoiceNumber}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(currentInvoice.status)}`}>
                    {getStatusLabel(currentInvoice.status)}
                  </span>
                  <span className="text-gray-500">• Client: {currentInvoice.clientName}</span>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Émetteur</h4>
                  <p className="font-medium">Votre Entreprise SARL</p>
                  <p className="text-gray-600">123 Avenue des affaires</p>
                  <p className="text-gray-600">75008 Paris, France</p>
                  <p className="text-gray-600">SIRET: 123 456 789 00012</p>
                  <p className="text-gray-600">contact@votresociete.com</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Client</h4>
                  <p className="font-medium">{currentInvoice.clientName}</p>
                  <p className="text-gray-600">{demoClients.find(c => c.id === currentInvoice.clientId)?.address}</p>
                  <p className="text-gray-600">{demoClients.find(c => c.id === currentInvoice.clientId)?.email}</p>
                  <p className="text-gray-600">{demoClients.find(c => c.id === currentInvoice.clientId)?.phone}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Informations</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'émission:</span>
                      <span className="font-medium">{formatDate(currentInvoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'échéance:</span>
                      <span className="font-medium">{formatDate(currentInvoice.dueDate)}</span>
                    </div>
                    {currentInvoice.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de paiement:</span>
                        <span className="font-medium">{formatDate(currentInvoice.paymentDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 grid grid-cols-4 gap-4">
                  <div className="font-medium text-gray-700">Description</div>
                  <div className="font-medium text-gray-700">Quantité</div>
                  <div className="font-medium text-gray-700">Prix unitaire</div>
                  <div className="font-medium text-gray-700">Total</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {currentInvoice.items.map((item, index) => (
                    <div key={index} className="px-6 py-4 grid grid-cols-4 gap-4">
                      <div>{item.description}</div>
                      <div>{item.quantity}</div>
                      <div>{formatCurrency(item.unitPrice)}</div>
                      <div className="font-medium">{formatCurrency(item.total)}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-6 py-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-medium">{formatCurrency(currentInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA ({currentInvoice.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(currentInvoice.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                    <span>Total TTC:</span>
                    <span className="text-blue-600">{formatCurrency(currentInvoice.total)}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-gray-600">Montant payé:</span>
                    <span className="font-medium text-green-600">{formatCurrency(currentInvoice.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Solde dû:</span>
                    <span className={`font-medium ${currentInvoice.amountDue > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {formatCurrency(currentInvoice.amountDue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3">
              <button 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                Fermer
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                onClick={() => showToast('PDF généré avec succès!')}
              >
                📄 Télécharger PDF
              </button>
              {currentInvoice.status === 'draft' && (
                <button 
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  onClick={() => sendInvoice(currentInvoice)}
                >
                  Envoyer la facture
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Supprimer la facture</h3>
              <p className="text-gray-600">Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.</p>
            </div>
            <div className="flex justify-center gap-3">
              <button 
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button 
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                onClick={deleteInvoice}
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

export default Invoices;