  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
  import { AuthProvider, useAuth } from './contexts/AuthContext'
  import Login from './pages/Login'
  import Dashboard from './pages/Dashboard'
  import Clients from './pages/Clients'
  import Contacts from './pages/Contacts'
  import Products from './pages/Products'
  import Quotes from './pages/Quotes'
  import Invoices from './pages/Invoices'
  import Reports from './pages/Reports'
  import Settings from './pages/Settings'
  import Layout from './components/Layout'
  import Nouveauclient from './pages/Nouveauclient'
  import Commande from './pages/Commande'
  import Home from './pages/Home'
import Nouveaucontact from './pages/Nouveaucontact'
import Listeinvoices from './pages/Listeinvoices'
import Listproduits from './pages/Listproduits'

  function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</div>
    }

    return user ? children : <Navigate to="/login" replace />
  }

  function AppRoutes() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/commande" element={<Commande />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="nouveauclient" element={<Nouveauclient />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="products" element={<Products />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="nouveaucontact"element={<Nouveaucontact/>}/>
          <Route path="Listeinvoices" element={<Listeinvoices/>}/>
          <Route path="Listproduits" element={<Listproduits/>}/>
          
        </Route>
        {/* Redirection pour les utilisateurs connectés qui visitent la page d'accueil */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />
      </Routes>
    )
  }

  function App() {
    return (
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    )
  }

  export default App