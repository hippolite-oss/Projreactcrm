import React, { useState, useEffect } from 'react';

const Listeinvoices = () => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('invoice-info');

  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  const taxAmount = (subtotal * invoiceData.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value
    });
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
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

  const removeItem = (id) => {
    if (invoiceData.items.length > 1) {
      const updatedItems = invoiceData.items.filter(item => item.id !== id);
      setInvoiceData({
        ...invoiceData,
        items: updatedItems
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Facture soumise:', invoiceData);
    
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
    
    // Notification Toast
    showToast(`✅ Facture #${invoiceData.invoiceNumber} créée avec succès!`);
  };

  const generateInvoiceNumber = () => {
    const newNumber = `INV-${Math.floor(Math.random() * 10000) + 1000}`;
    setInvoiceData({
      ...invoiceData,
      invoiceNumber: newNumber
    });
  };

  const setDueDate30Days = () => {
    const dueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];
    setInvoiceData({
      ...invoiceData,
      dueDate: dueDate
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">⏳ En attente</span>,
      paid: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">✅ Payée</span>,
      overdue: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">⚠️ En retard</span>,
      cancelled: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">❌ Annulée</span>
    };
    return badges[status] || badges.pending;
  };

  const showToast = (message) => {
    // Créer un élément toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
      toast.classList.add('translate-x-0');
    }, 10);
    
    // Animation de sortie après 3 secondes
    setTimeout(() => {
      toast.classList.remove('translate-x-0');
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Navigation sections
  const sections = [
    { id: 'invoice-info', label: 'Facture', icon: '📄' },
    { id: 'client-info', label: 'Client', icon: '👤' },
    { id: 'items', label: 'Articles', icon: '📋' },
    { id: 'notes', label: 'Notes', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <span className="p-3 bg-blue-500 text-white rounded-xl">📄</span>
              Créer une nouvelle facture
            </h1>
            <p className="text-gray-600 mt-2">Générez une facture professionnelle et élégante pour vos clients</p>
          </div>
          <div className="hidden md:block p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Montant total</div>
            <div className="text-2xl font-bold text-gray-800">€{totalAmount.toFixed(2)}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de la facture */}
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 ${
              activeSection === 'invoice-info' ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-blue-500">📋</span>
                  Informations de la facture
                </h2>
                {getStatusBadge(invoiceData.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500">#</span>
                      Numéro de facture *
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateInvoiceNumber}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>🔄</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500">📅</span>
                      Date d'émission *
                    </span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={invoiceData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500">⏰</span>
                      Date d'échéance *
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceData.dueDate}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={setDueDate30Days}
                      className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    >
                      30j
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500">🏷️</span>
                      Statut
                    </span>
                  </label>
                  <select
                    name="status"
                    value={invoiceData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="pending">⏳ En attente</option>
                    <option value="paid">✅ Payée</option>
                    <option value="overdue">⚠️ En retard</option>
                    <option value="cancelled">❌ Annulée</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Informations du client */}
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 ${
              activeSection === 'client-info' ? 'ring-2 ring-blue-500' : ''
            }`}>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <span className="text-blue-500">👤</span>
                Informations du client
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={invoiceData.clientName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du client *
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={invoiceData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="client@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse du client
                </label>
                <textarea
                  name="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={handleInputChange}
                  placeholder="123 Rue Principale, 75001 Paris, France"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Articles facturés */}
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 ${
              activeSection === 'items' ? 'ring-2 ring-blue-500' : ''
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-blue-500">📋</span>
                  Articles facturés
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  Ajouter un article
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix unitaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceData.items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">€</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          €{item.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            disabled={invoiceData.items.length <= 1}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total:</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">TVA:</span>
                    <div className="relative">
                      <input
                        type="number"
                        name="taxRate"
                        min="0"
                        max="100"
                        value={invoiceData.taxRate}
                        onChange={handleInputChange}
                        className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>
                  <span className="font-medium">€{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                  <span>TOTAL:</span>
                  <span className="text-blue-600">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes & Conditions */}
            <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 ${
              activeSection === 'notes' ? 'ring-2 ring-blue-500' : ''
            }`}>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <span className="text-blue-500">📝</span>
                Notes & Conditions
              </h2>
              <textarea
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ajoutez des notes, conditions de paiement, informations supplémentaires..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Résumé */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Résumé de la facture</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro:</span>
                  <span className="font-medium">{invoiceData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(invoiceData.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Échéance:</span>
                  <span className="font-medium">{new Date(invoiceData.dueDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total:</span>
                    <span className="text-blue-600">€{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Enregistrer la facture
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>👁️</span>
                  Aperçu PDF
                </button>
                
                <button
                  type="button"
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>📧</span>
                  Envoyer par email
                </button>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Statut de paiement</h3>
              <div className="flex flex-col gap-2">
                {Object.entries({
                  pending: { label: '⏳ En attente', color: 'bg-yellow-500' },
                  paid: { label: '✅ Payée', color: 'bg-green-500' },
                  overdue: { label: '⚠️ En retard', color: 'bg-red-500' },
                  cancelled: { label: '❌ Annulée', color: 'bg-gray-500' }
                }).map(([value, { label, color }]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setInvoiceData({...invoiceData, status: value})}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      invoiceData.status === value 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Les champs marqués d'un * sont obligatoires</p>
      </div>
    </div>
  );
};

export default Listeinvoices;