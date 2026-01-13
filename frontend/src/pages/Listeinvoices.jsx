import React, { useState, useEffect } from 'react';
import './Listeinvoices.css';

const Listeinvoices = () => {
  // États pour les champs du formulaire
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000) + 1000}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [
      { id: 1, description: 'Service de consultation professionnelle', quantity: 2, unitPrice: 75, total: 150 },
      { id: 2, description: 'Développement de site web', quantity: 1, unitPrice: 1200, total: 1200 }
    ],
    taxRate: 20,
    notes: 'Merci pour votre confiance. Le paiement est attendu sous 30 jours. Des frais de retard de 2% seront appliqués après la date d\'échéance.',
    status: 'pending'
  });

  // État pour les animations
  const [isLoading, setIsLoading] = useState(false);

  // Calcul du sous-total, taxe et total
  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxAmount = (subtotal * invoiceData.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  // Gestion des changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value
    });
  };

  // Gestion des changements dans les lignes d'articles
  const handleItemChange = (id, field, value) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calcul du total si quantité ou prix unitaire change
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = parseFloat(updatedItem.quantity) || 0;
          const price = parseFloat(updatedItem.unitPrice) || 0;
          updatedItem.total = qty * price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems
    });
  };

  // Ajout d'une nouvelle ligne d'article
  const addItem = () => {
    const newId = invoiceData.items.length > 0 
      ? Math.max(...invoiceData.items.map(item => item.id)) + 1 
      : 1;
    
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { id: newId, description: '', quantity: 1, unitPrice: 0, total: 0 }
      ]
    });
  };

  // Suppression d'une ligne d'article
  const removeItem = (id) => {
    if (invoiceData.items.length > 1) {
      const updatedItems = invoiceData.items.filter(item => item.id !== id);
      setInvoiceData({
        ...invoiceData,
        items: updatedItems
      });
    }
  };

  // Soumission du formulaire avec animation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'un délai pour l'animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Ici, vous pourriez envoyer les données à une API
    console.log('Facture soumise:', invoiceData);
    
    // Réinitialiser le formulaire
    setInvoiceData({
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      items: [
        { id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
      ],
      taxRate: 20,
      notes: '',
      status: 'pending'
    });
    
    setIsLoading(false);
    
    // Notification de succès
    alert(`✅ Facture #${invoiceData.invoiceNumber} créée avec succès!`);
  };

  // Génération d'un numéro de facture aléatoire
  const generateInvoiceNumber = () => {
    const newNumber = `INV-${Math.floor(Math.random() * 10000) + 1000}`;
    setInvoiceData({
      ...invoiceData,
      invoiceNumber: newNumber
    });
  };

  // Calcul de la date d'échéance (30 jours à partir d'aujourd'hui)
  const setDueDate30Days = () => {
    const dueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];
    setInvoiceData({
      ...invoiceData,
      dueDate: dueDate
    });
  };

  // Badge de statut
  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="status-badge pending">⏳ En attente</span>,
      paid: <span className="status-badge paid">✅ Payée</span>,
      overdue: <span className="status-badge overdue">⚠️ En retard</span>,
      cancelled: <span className="status-badge cancelled">❌ Annulée</span>
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="add-invoice-page">
      <header className="invoice-header">
        <h1><i className="fas fa-file-invoice-dollar"></i> Créer une nouvelle facture</h1>
        <p>Remplissez les informations ci-dessous pour générer une facture professionnelle et élégante pour vos clients</p>
      </header>

      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Section Informations de la facture */}
          <div className="form-section card">
            <div className="section-title">
              <h2><i className="fas fa-info-circle"></i> Informations de la facture</h2>
              {getStatusBadge(invoiceData.status)}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="invoiceNumber">
                  <i className="fas fa-hashtag"></i> Numéro de facture *
                </label>
                <div className="input-with-button">
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={handleInputChange}
                    placeholder="INV-0001"
                    required
                    className="form-control"
                  />
                  <button 
                    type="button" 
                    className="btn generate-btn"
                    onClick={generateInvoiceNumber}
                    title="Générer un nouveau numéro"
                  >
                    <i className="fas fa-sync-alt"></i> Générer
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="date"><i className="fas fa-calendar-alt"></i> Date d'émission *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={invoiceData.date}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dueDate"><i className="fas fa-calendar-check"></i> Date d'échéance *</label>
                <div className="input-with-button">
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={invoiceData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                  <button 
                    type="button" 
                    className="btn due-date-btn"
                    onClick={setDueDate30Days}
                    title="Définir à 30 jours"
                  >
                    <i className="fas fa-clock"></i> 30j
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="status"><i className="fas fa-tag"></i> Statut</label>
                <select
                  id="status"
                  name="status"
                  value={invoiceData.status}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="pending">⏳ En attente</option>
                  <option value="paid">✅ Payée</option>
                  <option value="overdue">⚠️ En retard</option>
                  <option value="cancelled">❌ Annulée</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Informations du client */}
          <div className="form-section card">
            <div className="section-title">
              <h2><i className="fas fa-user-tie"></i> Informations du client</h2>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientName"><i className="fas fa-user-circle"></i> Nom du client *</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={invoiceData.clientName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="clientEmail"><i className="fas fa-envelope"></i> Email du client *</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={invoiceData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  required
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="clientAddress"><i className="fas fa-map-marker-alt"></i> Adresse du client</label>
              <textarea
                id="clientAddress"
                name="clientAddress"
                value={invoiceData.clientAddress}
                onChange={handleInputChange}
                placeholder="123 Rue Principale, 75001 Paris, France"
                rows="2"
                className="form-control"
              />
            </div>
          </div>

          {/* Section Articles */}
          <div className="form-section card">
            <div className="section-header">
              <div className="section-title">
                <h2><i className="fas fa-list-check"></i> Articles facturés</h2>
                <div className="subtitle">Total: <span className="total-amount">€{totalAmount.toFixed(2)}</span></div>
              </div>
              <button type="button" className="btn add-item-btn" onClick={addItem}>
                <i className="fas fa-plus-circle"></i> Ajouter un article
              </button>
            </div>
            
            <div className="items-table-container">
              <div className="items-table">
                <div className="table-header">
                  <div className="table-col description">Description</div>
                  <div className="table-col quantity">Quantité</div>
                  <div className="table-col price">Prix unitaire</div>
                  <div className="table-col total">Total</div>
                  <div className="table-col actions">Actions</div>
                </div>
                
                <div className="table-body">
                  {invoiceData.items.map(item => (
                    <div className="table-row" key={item.id}>
                      <div className="table-col description">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Description de l'article ou service"
                          className="table-input"
                        />
                      </div>
                      <div className="table-col quantity">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="table-input"
                        />
                      </div>
                      <div className="table-col price">
                        <div className="price-input-wrapper">
                          <span className="currency">€</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="table-input"
                          />
                        </div>
                      </div>
                      <div className="table-col total">
                        <span className="amount-display">€{item.total.toFixed(2)}</span>
                      </div>
                      <div className="table-col actions">
                        <button 
                          type="button" 
                          className="btn remove-btn"
                          onClick={() => removeItem(item.id)}
                          disabled={invoiceData.items.length <= 1}
                          title="Supprimer cet article"
                        >
                          <i className="fas fa-trash-alt"></i> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="totals-section">
              <div className="total-row">
                <span>Sous-total:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="total-row tax-row">
                <div className="tax-rate-input">
                  <label htmlFor="taxRate">Taux de TVA:</label>
                  <div className="tax-input-wrapper">
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      min="0"
                      max="100"
                      value={invoiceData.taxRate}
                      onChange={handleInputChange}
                      className="tax-input"
                    />
                    <span className="percent">%</span>
                  </div>
                </div>
                <span className="tax-amount">€{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="total-row grand-total">
                <span>TOTAL À PAYER:</span>
                <span>€{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Section Notes */}
          <div className="form-section card">
            <div className="section-title">
              <h2><i className="fas fa-sticky-note"></i> Notes & Conditions</h2>
            </div>
            <div className="form-group full-width">
              <textarea
                id="notes"
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                placeholder="Ajoutez des notes, conditions de paiement, informations supplémentaires..."
                rows="3"
                className="form-control"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button type="button" className="btn cancel-btn">
              <i className="fas fa-times"></i> Annuler
            </button>
            <button type="button" className="btn preview-btn">
              <i className="fas fa-eye"></i> Aperçu PDF
            </button>
            <button type="submit" className="btn submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Création en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Créer la facture
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Listeinvoices;