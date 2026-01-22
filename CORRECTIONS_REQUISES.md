# Corrections Requises - Code Détaillé

## 1. CORRECTIONS CRITIQUES

### 1.1 Products.jsx - Corriger l'URL et l'import

**Fichier**: `frontend/src/pages/Products.jsx`

**Problème**:
```javascript
// ❌ INCORRECT
const response = await fetch('http://localhost:5000/api/Productss', {
  method: 'POST',
  body: formDataToSend,
});
```

**Solution**:
```javascript
// ✅ CORRECT
import api from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    setMessage('Veuillez corriger les erreurs dans le formulaire');
    return;
  }
  
  setIsLoading(true);
  setMessage('');
  
  const formDataToSend = new FormData();
  formDataToSend.append('name', formData.nom);
  formDataToSend.append('image', formData.image);
  formDataToSend.append('brand', formData.marque);
  formDataToSend.append('category', formData.categorie);
  formDataToSend.append('quantity', formData.quantite);
  
  try {
    const response = await api.post('/api/products', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.status === 201) {
      setMessage('Produit ajouté avec succès!');
      
      setFormData({
        nom: '',
        image: null,
        marque: '',
        categorie: '',
        quantite: '',
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onProductsAjoute) {
        onProductsAjoute(response.data);
      }
    }
  } catch (error) {
    setMessage(error.response?.data?.message || 'Erreur lors de l\'ajout du produit');
    console.error('Erreur:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

### 1.2 Listproduits.jsx - Corriger l'URL et l'import

**Fichier**: `frontend/src/pages/Listproduits.jsx`

**Problème**:
```javascript
// ❌ INCORRECT
const response = await fetch('http://localhost:5000/api/produits');
```

**Solution**:
```javascript
// ✅ CORRECT
import api from '../services/api';

const chargerProduits = async () => {
  setIsLoading(true);
  try {
    const response = await api.get('/api/products');
    
    if (response.status === 200) {
      setProduits(response.data || []);
      setErreur('');
    }
  } catch (error) {
    console.error('Erreur:', error);
    setErreur('Erreur de connexion au serveur');
    // Données de démonstration pour le développement
    setProduits(produitsDemonstration);
  } finally {
    setIsLoading(false);
  }
};
```

---

### 1.3 CommandesOnline.jsx - Corriger l'import

**Fichier**: `frontend/src/pages/CommandesOnline.jsx`

**Problème**:
```javascript
// ❌ INCORRECT - Axios n'est pas importé
const res = await Axios.get('/api/commande-online', { params });
```

**Solution**:
```javascript
// ✅ CORRECT
import api from '../services/api';

const fetchCommandes = async (page = 1) => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 15);
    if (search) params.append('search', search);
    if (statutFilter) params.append('statut', statutFilter);

    const res = await api.get('/api/commande-online', { params });
    if (res.data.success) {
      setCommandes(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
    }
  } catch (error) {
    console.error('Erreur chargement commandes:', error);
  } finally {
    setLoading(false);
  }
};

const handleMarquerLu = async (id) => {
  if (!window.confirm('Marquer cette commande comme lue ?')) return;
  try {
    await api.put(`/api/commande-online/${id}/mark-as-read`);
    fetchCommandes(pagination.page);
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur lors du marquage');
  }
};

const handleAnnuler = async (id) => {
  if (!window.confirm('Annuler cette commande ?')) return;
  try {
    await api.put(`/api/commande-online/${id}/cancel`);
    fetchCommandes(pagination.page);
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur annulation');
  }
};
```

---

### 1.4 Commande.jsx - Corriger l'import

**Fichier**: `frontend/src/pages/Commande.jsx`

**Problème**:
```javascript
// ❌ INCORRECT - Axios n'est pas importé
const response = await Axios.post('/api/commande-online', formData);
```

**Solution**:
```javascript
// ✅ CORRECT
import api from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const response = await api.post('/api/commande-online', formData);

    if (response.data.success) {
      setIsSubmitted(true);
    } else {
      throw new Error(response.data.message || 'Erreur inconnue');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 2. CORRECTIONS IMPORTANTES

### 2.1 Dashboard.jsx - Ajouter les appels API

**Fichier**: `frontend/src/pages/Dashboard.jsx`

**Problème**: Pas d'appel API, données simulées uniquement

**Solution**:
```javascript
import api from '../services/api';

const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // Appel API pour les statistiques
    const statsResponse = await api.get('/api/dashboard/stats');
    
    if (statsResponse.data) {
      setStats({
        clients: statsResponse.data.clients || 0,
        products: statsResponse.data.products || 0,
        quotes: statsResponse.data.quotes || 0,
        invoices: statsResponse.data.invoices || 0,
        revenue: statsResponse.data.revenue || 0,
        growth: statsResponse.data.growth || 0,
        newClients: statsResponse.data.newClients || 0,
        conversionRate: statsResponse.data.conversionRate || 0
      });
    }
    
    // Appels API pour les graphiques
    const clientsResponse = await api.get('/api/dashboard/clients-growth');
    if (clientsResponse.data) {
      setClientData(clientsResponse.data);
    }
    
    const revenueResponse = await api.get('/api/dashboard/revenue');
    if (revenueResponse.data) {
      setRevenueData(revenueResponse.data);
    }
    
    const statusResponse = await api.get('/api/dashboard/client-status');
    if (statusResponse.data) {
      setStatusData(statusResponse.data);
    }
    
    setLoading(false);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    setLoading(false);
  }
};

useEffect(() => {
  fetchDashboardData();
}, [timeRange]);
```

---

### 2.2 Contacts.jsx - Ajouter les appels API

**Fichier**: `frontend/src/pages/Contacts.jsx`

**Problème**: Pas d'appel API, données simulées uniquement

**Solution**:
```javascript
import api from '../services/api';

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
```

---

### 2.3 Quotes.jsx - Ajouter les appels API

**Fichier**: `frontend/src/pages/Quotes.jsx`

**Problème**: Pas d'appel API, données simulées uniquement

**Solution**:
```javascript
import api from '../services/api';

const loadQuotes = async () => {
  setIsLoading(true);
  try {
    const response = await api.get('/api/quotes');
    setQuotes(response.data || []);
    setFilteredQuotes(response.data || []);
    setIsLoading(false);
  } catch (error) {
    console.error('Erreur:', error);
    // Fallback sur données de démonstration
    setQuotes(demoQuotes);
    setFilteredQuotes(demoQuotes);
    setIsLoading(false);
  }
};

useEffect(() => {
  loadQuotes();
}, []);

const handleCreateQuote = async () => {
  try {
    const response = await api.post('/api/quotes', newQuote);
    setQuotes([response.data, ...quotes]);
    setShowCreateModal(false);
    resetNewQuoteForm();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la création du devis');
  }
};

const deleteQuote = async () => {
  if (quoteToDelete) {
    try {
      await api.delete(`/api/quotes/${quoteToDelete}`);
      const updatedQuotes = quotes.filter(quote => quote.id !== quoteToDelete);
      setQuotes(updatedQuotes);
      setShowDeleteModal(false);
      setQuoteToDelete(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du devis');
    }
  }
};

const confirmSendQuote = async () => {
  try {
    await api.put(`/api/quotes/${currentQuote.id}/send`);
    const updatedQuotes = quotes.map(q => 
      q.id === currentQuote.id 
        ? { ...q, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
        : q
    );
    setQuotes(updatedQuotes);
    setShowSendModal(false);
    setCurrentQuote(null);
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'envoi du devis');
  }
};
```

---

### 2.4 Invoices.jsx - Ajouter les appels API

**Fichier**: `frontend/src/pages/Invoices.jsx`

**Problème**: Pas d'appel API, données simulées uniquement

**Solution**:
```javascript
import api from '../services/api';

const loadInvoices = async () => {
  setIsLoading(true);
  try {
    const response = await api.get('/api/invoices');
    const invoices = response.data || [];
    
    // Calculer les jours de retard pour les factures échues
    const today = new Date();
    const updatedInvoices = invoices.map(invoice => {
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
  } catch (error) {
    console.error('Erreur:', error);
    // Fallback sur données de démonstration
    setInvoices(demoInvoices);
    setFilteredInvoices(demoInvoices);
    setIsLoading(false);
  }
};

useEffect(() => {
  loadInvoices();
}, []);

const handleCreateInvoice = async () => {
  try {
    const response = await api.post('/api/invoices', newInvoice);
    setInvoices([response.data, ...invoices]);
    setShowCreateModal(false);
    resetNewInvoiceForm();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la création de la facture');
  }
};

const confirmPayment = async (paymentData) => {
  try {
    await api.put(`/api/invoices/${currentInvoice.id}/payment`, paymentData);
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
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'enregistrement du paiement');
  }
};
```

---

### 2.5 Nouveaucontact.jsx - Ajouter l'appel API

**Fichier**: `frontend/src/pages/Nouveaucontact.jsx`

**Problème**: Pas d'appel API pour créer un contact

**Solution**:
```javascript
import api from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    const response = await api.post('/api/contacts', formData);
    
    if (response.status === 201) {
      console.log('Contact créé:', response.data);
      setIsSubmitted(true);
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        status: 'active',
        notes: ''
      });
      
      // Masquer le message de confirmation après 5 secondes
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  } catch (error) {
    console.error('Erreur:', error);
    setErrors(prev => ({
      ...prev,
      submit: error.response?.data?.message || 'Erreur lors de la création du contact. Veuillez réessayer.'
    }));
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### 2.6 Listeinvoices.jsx - Ajouter l'appel API

**Fichier**: `frontend/src/pages/Listeinvoices.jsx`

**Problème**: Pas d'appel API pour créer une facture

**Solution**:
```javascript
import api from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await api.post('/api/invoices', invoiceData);
    
    if (response.status === 201) {
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
      
      // Notification de succès
      alert(`✅ Facture #${response.data.invoiceNumber} créée avec succès!`);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert(`❌ Erreur: ${error.response?.data?.message || 'Erreur lors de la création de la facture'}`);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 3. CORRECTIONS SOUHAITABLES

### 3.1 Créer un service d'authentification

**Fichier**: `frontend/src/services/auth.js`

```javascript
import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
```

---

### 3.2 Améliorer le service API

**Fichier**: `frontend/src/services/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 4. VÉRIFICATION DES ENDPOINTS BACKEND

### 4.1 Endpoints à Vérifier/Implémenter

```
GET    /api/dashboard/stats              ✅ Existe
GET    /api/dashboard/clients-growth     ❓ À vérifier
GET    /api/dashboard/revenue            ❓ À vérifier
GET    /api/dashboard/client-status      ❓ À vérifier

GET    /api/clients                      ✅ Existe
POST   /api/clients                      ✅ Existe
DELETE /api/clients/:id                  ✅ Existe

GET    /api/contacts                     ✅ Existe
POST   /api/contacts                     ✅ Existe
DELETE /api/contacts/:id                 ✅ Existe

GET    /api/products                     ✅ Existe (vérifier endpoint)
POST   /api/products                     ✅ Existe (vérifier endpoint)

GET    /api/quotes                       ✅ Existe
POST   /api/quotes                       ✅ Existe
PUT    /api/quotes/:id/send              ❓ À implémenter
DELETE /api/quotes/:id                   ✅ Existe

GET    /api/invoices                     ✅ Existe
POST   /api/invoices                     ✅ Existe
PUT    /api/invoices/:id/payment         ❓ À implémenter
DELETE /api/invoices/:id                 ✅ Existe

GET    /api/commande-online              ✅ Existe
POST   /api/commande-online              ✅ Existe
PUT    /api/commande-online/:id/mark-as-read  ❓ À implémenter
PUT    /api/commande-online/:id/cancel   ❓ À implémenter
```

---

## 5. CHECKLIST DE CORRECTION

- [ ] Corriger Products.jsx - URL et import
- [ ] Corriger Listproduits.jsx - URL et import
- [ ] Corriger CommandesOnline.jsx - import
- [ ] Corriger Commande.jsx - import
- [ ] Ajouter API à Dashboard.jsx
- [ ] Ajouter API à Contacts.jsx
- [ ] Ajouter API à Quotes.jsx
- [ ] Ajouter API à Invoices.jsx
- [ ] Ajouter API à Nouveaucontact.jsx
- [ ] Ajouter API à Listeinvoices.jsx
- [ ] Vérifier les endpoints backend
- [ ] Implémenter les endpoints manquants
- [ ] Améliorer le service API
- [ ] Ajouter la gestion d'authentification
- [ ] Tester tous les appels API

