import React, { useState, useEffect } from 'react';
import './Invoices.css';

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
        // Calculer les jours de retard pour les factures échues
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
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.clientName.toLowerCase().includes(term) ||
        invoice.title.toLowerCase().includes(term) ||
        invoice.description.toLowerCase().includes(term)
      );
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(invoice => invoice.status === statusFilter);
    }
    
    // Filtre par client
    if (clientFilter !== 'all') {
      results = results.filter(invoice => invoice.clientId === parseInt(clientFilter));
    }
    
    // Filtre par date
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

  // Gestion de la création de facture
  const handleCreateInvoice = () => {
    const newId = Math.max(...invoices.map(i => i.id)) + 1;
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
    
    const client = demoClients.find(c => c.id === parseInt(newInvoice.clientId));
    
    // Calculer les totaux
    const subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (newInvoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    // Calculer la date d'échéance
    const dueDate = newInvoice.dueDate || 
      new Date(new Date(newInvoice.issueDate).getTime() + newInvoice.paymentTerms * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const invoiceToAdd = {
      ...newInvoice,
      id: newId,
      invoiceNumber,
      clientName: client ? client.name : '',
      subtotal,
      taxAmount,
      total,
      amountPaid: 0,
      amountDue: total,
      status: 'draft',
      dueDate,
      issueDate: newInvoice.issueDate || new Date().toISOString().split('T')[0]
    };
    
    setInvoices([invoiceToAdd, ...invoices]);
    setShowCreateModal(false);
    resetNewInvoiceForm();
  };

  const resetNewInvoiceForm = () => {
    setNewInvoice({
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
  };

  // Gérer les changements dans les lignes de la facture
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    };
    
    // Recalculer le total pour cette ligne
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems
    });
  };

  // Ajouter une ligne à la facture
  const addItem = () => {
    const newId = newInvoice.items.length > 0 ? Math.max(...newInvoice.items.map(item => item.id)) + 1 : 1;
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { id: newId, description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  // Supprimer une ligne de la facture
  const removeItem = (index) => {
    if (newInvoice.items.length > 1) {
      const updatedItems = [...newInvoice.items];
      updatedItems.splice(index, 1);
      setNewInvoice({
        ...newInvoice,
        items: updatedItems
      });
    }
  };

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

  const confirmPayment = (paymentData) => {
    const updatedInvoices = invoices.map(i => {
      if (i.id === currentInvoice.id) {
        const amountPaid = i.amountPaid + paymentData.amount;
        const amountDue = i.total - amountPaid;
        const status = amountDue === 0 ? 'paid' : amountPaid > 0 ? 'partial' : i.status;
        
        return {
          ...i,
          amountPaid,
          amountDue,
          status,
          paymentDate: paymentData.date || new Date().toISOString().split('T')[0],
          paymentMethod: paymentData.method || i.paymentMethod
        };
      }
      return i;
    });
    
    setInvoices(updatedInvoices);
    setShowPaymentModal(false);
    setCurrentInvoice(null);
  };

  // Envoyer une facture
  const sendInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setShowSendModal(true);
  };

  const confirmSendInvoice = () => {
    const updatedInvoices = invoices.map(i => 
      i.id === currentInvoice.id && i.status === 'draft'
        ? { ...i, status: 'pending' }
        : i
    );
    
    setInvoices(updatedInvoices);
    setShowSendModal(false);
    setCurrentInvoice(null);
  };

  // Envoyer un rappel
  const sendReminder = (invoice) => {
    setCurrentInvoice(invoice);
    setShowReminderModal(true);
  };

  const confirmSendReminder = () => {
    // Dans une application réelle, on enverrait un email ici
    alert(`Rappel envoyé pour la facture ${currentInvoice.invoiceNumber}`);
    setShowReminderModal(false);
    setCurrentInvoice(null);
  };

  // Annuler une facture
  const cancelInvoice = (id) => {
    const updatedInvoices = invoices.map(i => 
      i.id === id 
        ? { 
            ...i, 
            status: 'cancelled', 
            cancellationDate: new Date().toISOString().split('T')[0],
            amountDue: 0
          }
        : i
    );
    
    setInvoices(updatedInvoices);
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

  // Exporter en PDF (simulation)
  const exportToPDF = (invoice) => {
    // Dans une application réelle, on générerait un PDF ici
    alert(`Génération du PDF pour la facture ${invoice.invoiceNumber}`);
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
      case 'pending': return 'status-pending';
      case 'partial': return 'status-partial';
      case 'paid': return 'status-paid';
      case 'overdue': return 'status-overdue';
      case 'cancelled': return 'status-cancelled';
      default: return '';
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

  return (
    <div className="invoices-page">
      <header className="invoices-header">
        <div className="header-title">
          <h1>Gestion des factures</h1>
          <p>{filteredInvoices.length} facture{filteredInvoices.length !== 1 ? 's' : ''} trouvée{filteredInvoices.length !== 1 ? 's' : ''} | Encaissements: {formatCurrency(stats.totalPaid)} / {formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Nouvelle facture
          </button>
          <button 
            className="btn btn-secondary"
            onClick={exportInvoices}
            disabled={filteredInvoices.length === 0}
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Exporter
          </button>
        </div>
      </header>

      {/* Modal de visualisation de facture */}
      {showViewModal && currentInvoice && (
        <div className="modal-overlay">
          <div className="modal view-invoice-modal">
            <div className="modal-header">
              <div className="invoice-header-info">
                <h2>Facture {currentInvoice.invoiceNumber}</h2>
                <div className={`invoice-status ${getStatusClass(currentInvoice.status)}`}>
                  {getStatusLabel(currentInvoice.status)}
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-details-grid">
                <div className="invoice-from">
                  <h4>Émetteur</h4>
                  <p><strong>Votre Entreprise SARL</strong></p>
                  <p>123 Avenue des affaires</p>
                  <p>75008 Paris, France</p>
                  <p>SIRET: 123 456 789 00012</p>
                  <p>contact@votresociete.com</p>
                </div>
                <div className="invoice-to">
                  <h4>Client</h4>
                  <p><strong>{currentInvoice.clientName}</strong></p>
                  <p>{demoClients.find(c => c.id === currentInvoice.clientId)?.address}</p>
                  <p>{demoClients.find(c => c.id === currentInvoice.clientId)?.email}</p>
                  <p>{demoClients.find(c => c.id === currentInvoice.clientId)?.phone}</p>
                </div>
                <div className="invoice-info">
                  <h4>Informations facture</h4>
                  <div className="info-row">
                    <span>Date d'émission:</span>
                    <span>{formatDate(currentInvoice.issueDate)}</span>
                  </div>
                  <div className="info-row">
                    <span>Date d'échéance:</span>
                    <span>{formatDate(currentInvoice.dueDate)}</span>
                  </div>
                  <div className="info-row">
                    <span>Statut:</span>
                    <span className={`status-badge ${getStatusClass(currentInvoice.status)}`}>
                      {getStatusLabel(currentInvoice.status)}
                    </span>
                  </div>
                  {currentInvoice.paymentDate && (
                    <div className="info-row">
                      <span>Date de paiement:</span>
                      <span>{formatDate(currentInvoice.paymentDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="invoice-items-preview">
                <h3>Détails de la facture</h3>
                <div className="items-table">
                  <div className="items-header">
                    <div className="item-col description">Description</div>
                    <div className="item-col quantity">Quantité</div>
                    <div className="item-col price">Prix unitaire</div>
                    <div className="item-col total">Total</div>
                  </div>
                  {currentInvoice.items.map(item => (
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
                      <span>{formatCurrency(currentInvoice.subtotal)}</span>
                    </div>
                    <div className="total-row">
                      <span>TVA ({currentInvoice.taxRate}%):</span>
                      <span>{formatCurrency(currentInvoice.taxAmount)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total TTC:</span>
                      <span>{formatCurrency(currentInvoice.total)}</span>
                    </div>
                    <div className="payment-summary">
                      <div className="payment-row">
                        <span>Montant payé:</span>
                        <span className="paid-amount">{formatCurrency(currentInvoice.amountPaid)}</span>
                      </div>
                      <div className="payment-row">
                        <span>Solde dû:</span>
                        <span className={`due-amount ${currentInvoice.amountDue > 0 ? 'amount-due' : 'amount-paid'}`}>
                          {formatCurrency(currentInvoice.amountDue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invoice-terms">
                <h4>Conditions de paiement</h4>
                <p>{currentInvoice.terms}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Fermer
              </button>
              <button className="btn btn-secondary" onClick={() => exportToPDF(currentInvoice)}>
                <svg className="icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M7,13H17V15H7V13M7,17H17V19H7V17M7,9H12V11H7V9Z" />
                </svg>
                Télécharger PDF
              </button>
              {currentInvoice.status === 'draft' && (
                <button className="btn btn-primary" onClick={() => sendInvoice(currentInvoice)}>
                  Envoyer la facture
                </button>
              )}
              {(currentInvoice.status === 'pending' || currentInvoice.status === 'overdue' || currentInvoice.status === 'partial') && (
                <button className="btn btn-success" onClick={() => recordPayment(currentInvoice)}>
                  Enregistrer un paiement
                </button>
              )}
              {(currentInvoice.status === 'pending' || currentInvoice.status === 'overdue') && (
                <button className="btn btn-warning" onClick={() => sendReminder(currentInvoice)}>
                  Envoyer un rappel
                </button>
              )}
              {currentInvoice.status !== 'paid' && currentInvoice.status !== 'cancelled' && (
                <button className="btn btn-danger" onClick={() => cancelInvoice(currentInvoice.id)}>
                  Annuler
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'enregistrement de paiement */}
      {showPaymentModal && currentInvoice && (
        <div className="modal-overlay">
          <div className="modal payment-modal">
            <div className="modal-header">
              <h2>Enregistrer un paiement</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <p>Facture: <strong>{currentInvoice.invoiceNumber}</strong></p>
                <p>Client: <strong>{currentInvoice.clientName}</strong></p>
                <p>Montant total: <strong>{formatCurrency(currentInvoice.total)}</strong></p>
                <p>Déjà payé: <strong>{formatCurrency(currentInvoice.amountPaid)}</strong></p>
                <p>Solde dû: <strong>{formatCurrency(currentInvoice.amountDue)}</strong></p>
              </div>
              <div className="form-group">
                <label>Montant du paiement *</label>
                <input
                  type="number"
                  min="0.01"
                  max={currentInvoice.amountDue}
                  step="0.01"
                  defaultValue={currentInvoice.amountDue}
                  placeholder="Montant"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date du paiement</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Mode de paiement</label>
                  <select defaultValue={currentInvoice.paymentMethod}>
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Référence (optionnel)</label>
                <input
                  type="text"
                  placeholder="Référence de virement, numéro de chèque..."
                />
              </div>
              <div className="form-group">
                <label>Notes (optionnel)</label>
                <textarea
                  rows="3"
                  placeholder="Notes sur ce paiement..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                Annuler
              </button>
              <button className="btn btn-success" onClick={() => confirmPayment({ amount: currentInvoice.amountDue, date: new Date().toISOString().split('T')[0], method: currentInvoice.paymentMethod })}>
                Enregistrer le paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'envoi de rappel */}
      {showReminderModal && currentInvoice && (
        <div className="modal-overlay">
          <div className="modal reminder-modal">
            <div className="modal-header">
              <h2>Envoyer un rappel</h2>
              <button className="close-btn" onClick={() => setShowReminderModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="reminder-info">
                <p>Vous êtes sur le point d'envoyer un rappel pour la facture <strong>{currentInvoice.invoiceNumber}</strong> à <strong>{currentInvoice.clientName}</strong>.</p>
                <p>Montant dû: <strong>{formatCurrency(currentInvoice.amountDue)}</strong></p>
                <p>Date d'échéance: <strong>{formatDate(currentInvoice.dueDate)}</strong></p>
                {currentInvoice.daysOverdue && (
                  <p className="overdue-alert">En retard de: <strong>{currentInvoice.daysOverdue} jours</strong></p>
                )}
              </div>
              <div className="form-group">
                <label>Email du destinataire</label>
                <input
                  type="email"
                  defaultValue={demoClients.find(c => c.id === currentInvoice.clientId)?.email || ''}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="form-group">
                <label>Message personnalisé</label>
                <textarea
                  rows="6"
                  defaultValue={`Bonjour,

Ceci est un rappel concernant la facture ${currentInvoice.invoiceNumber} d'un montant de ${formatCurrency(currentInvoice.amountDue)}.

Date d'échéance: ${formatDate(currentInvoice.dueDate)}
${currentInvoice.daysOverdue ? `Cette facture est en retard de ${currentInvoice.daysOverdue} jours.` : ''}

Veuillez régulariser votre situation au plus vite.

Cordialement,
Le service comptable`}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowReminderModal(false)}>
                Annuler
              </button>
              <button className="btn btn-warning" onClick={confirmSendReminder}>
                Envoyer le rappel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'envoi de facture */}
      {showSendModal && currentInvoice && (
        <div className="modal-overlay">
          <div className="modal send-invoice-modal">
            <div className="modal-header">
              <h2>Envoyer la facture</h2>
              <button className="close-btn" onClick={() => setShowSendModal(false)}>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="send-invoice-info">
                <p>Vous êtes sur le point d'envoyer la facture <strong>{currentInvoice.invoiceNumber}</strong> à <strong>{currentInvoice.clientName}</strong>.</p>
                <p>Montant: <strong>{formatCurrency(currentInvoice.total)}</strong></p>
              </div>
              <div className="form-group">
                <label>Email du destinataire</label>
                <input
                  type="email"
                  defaultValue={demoClients.find(c => c.id === currentInvoice.clientId)?.email || ''}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="form-group">
                <label>Message personnalisé (optionnel)</label>
                <textarea
                  rows="4"
                  defaultValue={`Bonjour,

Veuillez trouver ci-joint notre facture ${currentInvoice.invoiceNumber} d'un montant de ${formatCurrency(currentInvoice.total)}.

Date d'échéance: ${formatDate(currentInvoice.dueDate)}

N'hésitez pas à nous contacter pour toute question.

Cordialement,
Le service comptable`}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSendModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={confirmSendInvoice}>
                Envoyer la facture
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
              <p>Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={deleteInvoice}>
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
            placeholder="Rechercher une facture..."
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
      {selectedInvoices.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-count">
            {selectedInvoices.length} facture{selectedInvoices.length !== 1 ? 's' : ''} sélectionnée{selectedInvoices.length !== 1 ? 's' : ''}
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
              onClick={() => setSelectedInvoices([])}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Tableau des factures */}
      <div className="invoices-table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des factures...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H15V15L13,19H10Z" />
            </svg>
            <h3>Aucune facture trouvée</h3>
            <p>{searchTerm || statusFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all' 
              ? "Essayez de modifier vos critères de recherche ou de filtrage." 
              : "Commencez par créer une nouvelle facture."}</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Créer une facture
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onChange={toggleSelectAll}
                      disabled={filteredInvoices.length === 0}
                    />
                  </th>
                  <th 
                    className={`sortable ${sortField === 'invoiceNumber' ? 'sorted' : ''}`}
                    onClick={() => handleSort('invoiceNumber')}
                  >
                    <span>N° Facture</span>
                    {sortField === 'invoiceNumber' && (
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
                    className={`sortable ${sortField === 'issueDate' ? 'sorted' : ''}`}
                    onClick={() => handleSort('issueDate')}
                  >
                    <span>Date</span>
                    {sortField === 'issueDate' && (
                      <svg className="sort-icon" viewBox="0 0 24 24">
                        {sortDirection === 'asc' ? 
                          <path fill="currentColor" d="M7,15L12,10L17,15H7Z" /> :
                          <path fill="currentColor" d="M7,10L12,15L17,10H7Z" />
                        }
                      </svg>
                    )}
                  </th>
                  <th 
                    className={`sortable ${sortField === 'dueDate' ? 'sorted' : ''}`}
                    onClick={() => handleSort('dueDate')}
                  >
                    <span>Échéance</span>
                    {sortField === 'dueDate' && (
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
                    <span>Total</span>
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
                    className={`sortable ${sortField === 'amountDue' ? 'sorted' : ''}`}
                    onClick={() => handleSort('amountDue')}
                  >
                    <span>Solde dû</span>
                    {sortField === 'amountDue' && (
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
                {filteredInvoices.map(invoice => {
                  const isOverdue = invoice.status === 'overdue';
                  const dueDate = new Date(invoice.dueDate);
                  const today = new Date();
                  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={invoice.id} className={selectedInvoices.includes(invoice.id) ? 'selected' : ''}>
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleSelectInvoice(invoice.id)}
                        />
                      </td>
                      <td>
                        <div className="invoice-number">{invoice.invoiceNumber}</div>
                      </td>
                      <td>
                        <div className="client-info">
                          <div className="client-name">{invoice.clientName}</div>
                        </div>
                      </td>
                      <td>
                        <div className="invoice-title">{invoice.title}</div>
                        <div className="invoice-description">{invoice.description.substring(0, 40)}...</div>
                      </td>
                      <td>{formatDate(invoice.issueDate)}</td>
                      <td>
                        <div className={`due-date ${isOverdue ? 'overdue' : daysUntilDue <= 7 && invoice.status !== 'paid' && invoice.status !== 'cancelled' ? 'due-soon' : ''}`}>
                          {formatDate(invoice.dueDate)}
                          {isOverdue && invoice.daysOverdue && (
                            <div className="overdue-badge">{invoice.daysOverdue} jours</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="invoice-total">{formatCurrency(invoice.total)}</div>
                      </td>
                      <td>
                        <div className={`amount-due ${invoice.amountDue > 0 ? 'has-balance' : 'paid'}`}>
                          {formatCurrency(invoice.amountDue)}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="actions-column">
                        <div className="action-buttons">
                          <button 
                            className="action-btn view-btn"
                            title="Voir"
                            onClick={() => viewInvoice(invoice)}
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
                          {invoice.status === 'draft' && (
                            <button 
                              className="action-btn send-btn"
                              title="Envoyer"
                              onClick={() => sendInvoice(invoice)}
                            >
                              <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                              </svg>
                            </button>
                          )}
                          {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'partial') && (
                            <button 
                              className="action-btn payment-btn"
                              title="Enregistrer paiement"
                              onClick={() => recordPayment(invoice)}
                            >
                              <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20,8H22V10H20M20,12H22V14H20M20,16H22V18H20M18,8H16V6H14V8H12V10H14V12H12V14H14V16H16V14H18V16H16V12H18V10H16V8M2,12C2,9.21 3.64,6.8 6,5.68V3.5C2.5,4.76 0,8.09 0,12C0,15.91 2.5,19.24 6,20.5V18.32C3.64,17.2 2,14.79 2,12M15,3C10.04,3 6,7.04 6,12C6,16.96 10.04,21 15,21C19.96,21 24,16.96 24,12C24,7.04 19.96,3 15,3M15,19C11.14,19 8,15.86 8,12C8,8.14 11.14,5 15,5C18.86,5 22,8.14 22,12C22,15.86 18.86,19 15,19Z" />
                              </svg>
                            </button>
                          )}
                          {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                            <button 
                              className="action-btn reminder-btn"
                              title="Envoyer rappel"
                              onClick={() => sendReminder(invoice)}
                            >
                              <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z" />
                              </svg>
                            </button>
                          )}
                          <button 
                            className="action-btn duplicate-btn"
                            title="Dupliquer"
                            onClick={() => duplicateInvoice(invoice.id)}
                          >
                            <svg viewBox="0 0 24 24">
                              <path fill="currentColor" d="M11,17H4C2.89,17 2,16.1 2,15V3C2,1.89 2.89,1 4,1H16C17.1,1 18,1.9 18,3V9H16V3H4V15H11V17M20,5H16C14.89,5 14,5.9 14,7V21C14,22.1 14.89,23 16,23H20C21.1,23 22,22.1 22,21V7C22,5.9 21.1,5 20,5M20,21H16V7H20V21Z" />
                            </svg>
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            title="Supprimer"
                            onClick={() => confirmDeleteInvoice(invoice.id)}
                          >
                            <svg viewBox="0 0 24 24">
                              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Affichage de 1 à {filteredInvoices.length} sur {filteredInvoices.length} factures
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
        <h3>Statistiques financières</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
            <div className="stat-label">Chiffre d'affaires total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalPaid)}</div>
            <div className="stat-label">Montant encaissé</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalDue)}</div>
            <div className="stat-label">En attente de paiement</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.overdueAmount)}</div>
            <div className="stat-label">En retard ({stats.overdueInvoices})</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{invoices.filter(i => i.status === 'draft').length}</div>
            <div className="stat-label">Factures brouillons</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{((stats.totalPaid / stats.totalAmount) * 100).toFixed(1)}%</div>
            <div className="stat-label">Taux d'encaissement</div>
          </div>
        </div>
      </div>

      {/* Tableau de bord rapide */}
      <div className="dashboard-section">
        <h3>Tableau de bord facturation</h3>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h4>Factures à envoyer</h4>
            <div className="card-content">
              <div className="card-value">{invoices.filter(i => i.status === 'draft').length}</div>
              <button className="btn btn-small" onClick={() => setStatusFilter('draft')}>Voir</button>
            </div>
          </div>
          <div className="dashboard-card">
            <h4>Factures en attente</h4>
            <div className="card-content">
              <div className="card-value">{invoices.filter(i => i.status === 'pending').length}</div>
              <button className="btn btn-small" onClick={() => setStatusFilter('pending')}>Voir</button>
            </div>
          </div>
          <div className="dashboard-card">
            <h4>Factures en retard</h4>
            <div className="card-content">
              <div className="card-value">{stats.overdueInvoices}</div>
              <button className="btn btn-small btn-warning" onClick={() => setStatusFilter('overdue')}>Relancer</button>
            </div>
          </div>
          <div className="dashboard-card">
            <h4>Prochaines échéances</h4>
            <div className="card-content">
              <div className="card-value">
                {invoices.filter(i => {
                  const dueDate = new Date(i.dueDate);
                  const today = new Date();
                  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                  return daysUntilDue >= 0 && daysUntilDue <= 7 && i.status !== 'paid' && i.status !== 'cancelled';
                }).length}
              </div>
              <button className="btn btn-small" onClick={() => setDateFilter('dueSoon')}>Voir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;