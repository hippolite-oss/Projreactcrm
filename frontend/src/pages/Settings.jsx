import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { 
  Settings as SettingsIcon, User, Building, Users, Mail, Bell, Shield, 
  Eye, Save, RefreshCw, Key, Globe, Palette, Database,
  Server, Smartphone, Monitor, Lock, UserCheck, Crown,
  Edit3, Trash2, Plus, Check, X, AlertTriangle, Upload,
  Download, Copy, TestTube, Zap, HardDrive, Wifi
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // États pour chaque section
  const [profileData, setProfileData] = useState({
    nom: 'Administrateur',
    email: 'admin@test.com',
    telephone: '',
    poste: 'Administrateur système',
    avatar: ''
  });

  const [companyData, setCompanyData] = useState({
    nom_societe: 'Quincaillerie Pro',
    adresse: '123 Rue de l\'Industrie',
    ville: 'Paris',
    code_postal: '75001',
    telephone: '01 23 45 67 89',
    email: 'contact@quincaillerie-pro.fr',
    siret: '12345678901234',
    tva: 'FR12345678901',
    logo: '',
    site_web: 'https://quincaillerie-pro.fr'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: 'hippoliteagbodamakou@gmail.com',
    smtp_pass: '••••••••••••••••',
    email_from: 'hippoliteagbodamakou@gmail.com',
    email_from_name: 'CRM System',
    emailjs_service_id: 'service_lb6z5zo',
    emailjs_template_id: 'template_nnb9b1m',
    emailjs_public_key: 'ps-aYVc3Kclusv86y',
    auto_email_commandes: true,
    auto_email_prospects: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_nouvelles_commandes: true,
    email_nouveaux_prospects: true,
    email_commandes_traitees: false,
    notifications_desktop: true,
    notifications_mobile: true,
    frequence_rapports: 'hebdomadaire'
  });

  const [users, setUsers] = useState([
    { id: 1, nom: 'Admin Principal', email: 'admin@test.com', role: 'admin', actif: true, derniere_connexion: '2025-01-23' },
    { id: 2, nom: 'Commercial 1', email: 'commercial@test.com', role: 'commercial', actif: true, derniere_connexion: '2025-01-22' }
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    duree_session: '8',
    force_2fa: false,
    complexite_mdp: 'moyenne',
    tentatives_max: '5',
    logs_actifs: true
  });

  const [systemSettings, setSystemSettings] = useState({
    auto_backup: true,
    frequence_backup: 'quotidien',
    retention_logs: '30',
    maintenance_mode: false,
    debug_mode: false
  });

  // Charger les données au montage
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Charger les paramètres depuis l'API
      const response = await api.get('/api/parametres');
      if (response.data.success) {
        const data = response.data.data;
        
        // Mettre à jour tous les états avec les données du backend
        setCompanyData(prev => ({ ...prev, ...data }));
        setEmailSettings(prev => ({ ...prev, ...data }));
        setNotificationSettings(prev => ({ ...prev, ...data }));
        setSecuritySettings(prev => ({ ...prev, ...data }));
        setSystemSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section, data) => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      // Sauvegarder via l'API
      const response = await api.put(`/api/parametres/${section}`, data);
      
      if (response.data.success) {
        setSaveStatus('success');
        // Mettre à jour les données locales
        switch (section) {
          case 'profile':
            setProfileData(prev => ({ ...prev, ...data }));
            break;
          case 'company':
            setCompanyData(prev => ({ ...prev, ...data }));
            break;
          case 'email':
            setEmailSettings(prev => ({ ...prev, ...data }));
            break;
          case 'notifications':
            setNotificationSettings(prev => ({ ...prev, ...data }));
            break;
          case 'security':
            setSecuritySettings(prev => ({ ...prev, ...data }));
            break;
          case 'system':
            setSystemSettings(prev => ({ ...prev, ...data }));
            break;
        }
      } else {
        setSaveStatus('error');
      }
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const testEmailConfig = async () => {
    try {
      setLoading(true);
      
      // Tester la configuration via l'API backend
      const response = await api.post('/api/parametres/test-email', emailSettings);
      
      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erreur test email:', error);
      alert(`❌ Erreur test email: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Mon Profil', icon: User, color: 'blue' },
    { id: 'company', label: 'Entreprise', icon: Building, color: 'purple' },
    { id: 'users', label: 'Utilisateurs', icon: Users, color: 'green' },
    { id: 'email', label: 'Configuration Email', icon: Mail, color: 'orange' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
    { id: 'appearance', label: 'Apparence', icon: Palette, color: 'pink' },
    { id: 'security', label: 'Sécurité', icon: Shield, color: 'red' },
    { id: 'system', label: 'Système', icon: Server, color: 'gray' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-purple-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-2xl ring-4 ring-purple-200/50">
              <SettingsIcon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Paramètres
              </h1>
              <p className="text-lg text-purple-700 dark:text-purple-300 mt-2">
                Configuration et administration du CRM
              </p>
            </div>
          </div>

          {/* Statut de sauvegarde */}
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                saveStatus === 'saving' ? 'bg-blue-100 text-blue-700' :
                saveStatus === 'success' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}
            >
              {saveStatus === 'saving' && <RefreshCw className="w-5 h-5 animate-spin" />}
              {saveStatus === 'success' && <Check className="w-5 h-5" />}
              {saveStatus === 'error' && <X className="w-5 h-5" />}
              <span className="font-medium">
                {saveStatus === 'saving' && 'Sauvegarde...'}
                {saveStatus === 'success' && 'Sauvegardé !'}
                {saveStatus === 'error' && 'Erreur de sauvegarde'}
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Sections</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/30 text-${tab.color}-700 dark:text-${tab.color}-300 shadow-lg`
                          : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-left">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/50 p-8">
              
              {/* Onglet Profil */}
              {activeTab === 'profile' && (
                <ProfileSection 
                  data={profileData} 
                  setData={setProfileData}
                  onSave={(data) => saveSettings('profile', data)}
                  loading={loading}
                />
              )}

              {/* Onglet Entreprise */}
              {activeTab === 'company' && (
                <CompanySection 
                  data={companyData} 
                  setData={setCompanyData}
                  onSave={(data) => saveSettings('company', data)}
                  loading={loading}
                />
              )}

              {/* Onglet Utilisateurs */}
              {activeTab === 'users' && (
                <UsersSection 
                  users={users} 
                  setUsers={setUsers}
                  loading={loading}
                />
              )}

              {/* Onglet Email */}
              {activeTab === 'email' && (
                <EmailSection 
                  data={emailSettings} 
                  setData={setEmailSettings}
                  onSave={(data) => saveSettings('email', data)}
                  onTest={testEmailConfig}
                  loading={loading}
                />
              )}

              {/* Onglet Notifications */}
              {activeTab === 'notifications' && (
                <NotificationsSection 
                  data={notificationSettings} 
                  setData={setNotificationSettings}
                  onSave={(data) => saveSettings('notifications', data)}
                  loading={loading}
                />
              )}

              {/* Onglet Apparence */}
              {activeTab === 'appearance' && (
                <AppearanceSection loading={loading} />
              )}

              {/* Onglet Sécurité */}
              {activeTab === 'security' && (
                <SecuritySection 
                  data={securitySettings} 
                  setData={setSecuritySettings}
                  onSave={(data) => saveSettings('security', data)}
                  loading={loading}
                />
              )}

              {/* Onglet Système */}
              {activeTab === 'system' && (
                <SystemSection 
                  data={systemSettings} 
                  setData={setSystemSettings}
                  onSave={(data) => saveSettings('system', data)}
                  loading={loading}
                />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Section Profil
const ProfileSection = ({ data, setData, onSave, loading }) => (
  <div>
    <div className="flex items-center gap-4 mb-8">
      <User className="w-8 h-8 text-blue-600" />
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Mon Profil</h2>
        <p className="text-gray-600 dark:text-gray-400">Gérer vos informations personnelles</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom complet
        </label>
        <input
          type="text"
          value={data.nom}
          onChange={(e) => setData({...data, nom: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({...data, email: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={data.telephone}
          onChange={(e) => setData({...data, telephone: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Poste
        </label>
        <input
          type="text"
          value={data.poste}
          onChange={(e) => setData({...data, poste: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>

    <div className="mt-8 flex gap-4">
      <button
        onClick={() => onSave(data)}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        Sauvegarder
      </button>
    </div>
  </div>
);

// Composant Section Entreprise
const CompanySection = ({ data, setData, onSave, loading }) => (
  <div>
    <div className="flex items-center gap-4 mb-8">
      <Building className="w-8 h-8 text-purple-600" />
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Informations Entreprise</h2>
        <p className="text-gray-600 dark:text-gray-400">Configurer les données de votre société</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom de la société
        </label>
        <input
          type="text"
          value={data.nom_societe}
          onChange={(e) => setData({...data, nom_societe: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adresse
        </label>
        <input
          type="text"
          value={data.adresse}
          onChange={(e) => setData({...data, adresse: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ville
        </label>
        <input
          type="text"
          value={data.ville}
          onChange={(e) => setData({...data, ville: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Code postal
        </label>
        <input
          type="text"
          value={data.code_postal}
          onChange={(e) => setData({...data, code_postal: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={data.telephone}
          onChange={(e) => setData({...data, telephone: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({...data, email: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SIRET
        </label>
        <input
          type="text"
          value={data.siret}
          onChange={(e) => setData({...data, siret: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          N° TVA
        </label>
        <input
          type="text"
          value={data.tva}
          onChange={(e) => setData({...data, tva: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>
    </div>

    <div className="mt-8 flex gap-4">
      <button
        onClick={() => onSave(data)}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        Sauvegarder
      </button>
    </div>
  </div>
);

// Composant Section Utilisateurs
const UsersSection = ({ users, setUsers, loading }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  // Charger les utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/parametres/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      setActionLoading('add');
      const response = await api.post('/api/parametres/users', userData);
      
      if (response.data.success) {
        setUsers(prev => [...prev, response.data.data]);
        setShowAddModal(false);
        alert('✅ Utilisateur ajouté avec succès');
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erreur ajout utilisateur:', error);
      alert(`❌ Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading('');
    }
  };

  const handleEditUser = async (userData) => {
    try {
      setActionLoading('edit');
      const response = await api.put(`/api/parametres/users/${selectedUser.id}`, userData);
      
      if (response.data.success) {
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? response.data.data : u));
        setShowEditModal(false);
        setSelectedUser(null);
        alert('✅ Utilisateur modifié avec succès');
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erreur modification utilisateur:', error);
      alert(`❌ Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading('');
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading('delete');
      const response = await api.delete(`/api/parametres/users/${selectedUser.id}`);
      
      if (response.data.success) {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        alert('✅ Utilisateur supprimé avec succès');
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      alert(`❌ Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Users className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gestion des Utilisateurs</h2>
            <p className="text-gray-600 dark:text-gray-400">Administrer les comptes et les rôles</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Utilisateur</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Rôle</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Dernière connexion</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{user.nom}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'manager' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 
                     user.role === 'manager' ? 'Manager' : 'Commercial'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.derniere_connexion ? new Date(user.derniere_connexion).toLocaleDateString('fr-FR') : 'Jamais'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      disabled={user.role === 'admin' && user.id === 1}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Modal Ajout Utilisateur */}
      {showAddModal && (
        <UserModal
          title="Nouvel Utilisateur"
          onSave={handleAddUser}
          onClose={() => setShowAddModal(false)}
          loading={actionLoading === 'add'}
        />
      )}

      {/* Modal Modification Utilisateur */}
      {showEditModal && selectedUser && (
        <UserModal
          title="Modifier Utilisateur"
          user={selectedUser}
          onSave={handleEditUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          loading={actionLoading === 'edit'}
        />
      )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-2">
                  Supprimer l'utilisateur
                </h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                    <span className="font-semibold text-gray-900">{selectedUser.nom}</span> ?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Cette action est irréversible.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={actionLoading === 'delete'}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {actionLoading === 'delete' ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
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

// Composant Section Email
const EmailSection = ({ data, setData, onSave, onTest, loading }) => (
  <div>
    <div className="flex items-center gap-4 mb-8">
      <Mail className="w-8 h-8 text-orange-600" />
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Configuration Email</h2>
        <p className="text-gray-600 dark:text-gray-400">Paramètres SMTP et EmailJS</p>
      </div>
    </div>

    <div className="space-y-8">
      {/* Configuration EmailJS */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          EmailJS (Recommandé)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Service ID
            </label>
            <input
              type="text"
              value={data.emailjs_service_id}
              onChange={(e) => setData({...data, emailjs_service_id: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Template ID
            </label>
            <input
              type="text"
              value={data.emailjs_template_id}
              onChange={(e) => setData({...data, emailjs_template_id: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Public Key
            </label>
            <input
              type="text"
              value={data.emailjs_public_key}
              onChange={(e) => setData({...data, emailjs_public_key: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Configuration SMTP */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
          <Server className="w-6 h-6" />
          Configuration SMTP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Serveur SMTP
            </label>
            <input
              type="text"
              value={data.smtp_host}
              onChange={(e) => setData({...data, smtp_host: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Port
            </label>
            <input
              type="text"
              value={data.smtp_port}
              onChange={(e) => setData({...data, smtp_port: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Utilisateur
            </label>
            <input
              type="email"
              value={data.smtp_user}
              onChange={(e) => setData({...data, smtp_user: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={data.smtp_pass}
              onChange={(e) => setData({...data, smtp_pass: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 flex gap-4">
      <button
        onClick={() => onSave(data)}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        Sauvegarder
      </button>
      <button
        onClick={onTest}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        <TestTube className="w-5 h-5" />
        Tester la configuration
      </button>
    </div>
  </div>
);

// Composant Section Notifications
const NotificationsSection = ({ data, setData, onSave, loading }) => (
  <div>
    <div className="flex items-center gap-4 mb-8">
      <Bell className="w-8 h-8 text-yellow-600" />
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Notifications</h2>
        <p className="text-gray-600 dark:text-gray-400">Configurer les alertes et notifications</p>
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-4">Notifications Email</h3>
        <div className="space-y-4">
          {[
            { key: 'email_nouvelles_commandes', label: 'Nouvelles commandes' },
            { key: 'email_nouveaux_prospects', label: 'Nouveaux prospects' },
            { key: 'email_commandes_traitees', label: 'Commandes traitées' }
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data[item.key]}
                onChange={(e) => setData({...data, [item.key]: e.target.checked})}
                className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">Notifications Push</h3>
        <div className="space-y-4">
          {[
            { key: 'notifications_desktop', label: 'Notifications desktop' },
            { key: 'notifications_mobile', label: 'Notifications mobile' }
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data[item.key]}
                onChange={(e) => setData({...data, [item.key]: e.target.checked})}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-8 flex gap-4">
      <button
        onClick={() => onSave(data)}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        Sauvegarder
      </button>
    </div>
  </div>
);

// Composant Section Apparence
const AppearanceSection = ({ loading }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [theme, setTheme] = useState('Clair');

  const handleLogoUpload = () => {
    const url = prompt('Entrez l\'URL de votre logo:');
    if (url) {
      setLogoUrl(url);
      alert('✅ Logo mis à jour avec succès');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    alert(`✅ Thème "${newTheme}" appliqué`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Palette className="w-8 h-8 text-pink-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Apparence</h2>
          <p className="text-gray-600 dark:text-gray-400">Personnaliser l'interface du CRM</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-pink-800 dark:text-pink-300 mb-4">Thème</h3>
          <div className="grid grid-cols-3 gap-4">
            {['Clair', 'Sombre', 'Automatique'].map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => handleThemeChange(themeOption)}
                className={`p-4 border-2 rounded-xl hover:border-pink-500 transition ${
                  theme === themeOption ? 'border-pink-500 bg-pink-100' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-8 mx-auto mb-2 rounded ${
                    themeOption === 'Clair' ? 'bg-white border' :
                    themeOption === 'Sombre' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'
                  }`}></div>
                  <span className="text-sm font-medium">{themeOption}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4">Logo de l'entreprise</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <button 
                onClick={handleLogoUpload}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
              >
                <Upload className="w-5 h-5" />
                {logoUrl ? 'Changer le logo' : 'Télécharger un logo'}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Formats acceptés: JPG, PNG, SVG (max 2MB)
              </p>
            </div>
          </div>
          {logoUrl && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Logo configuré: {logoUrl}
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">Couleurs personnalisées</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Primaire', color: '#3B82F6' },
              { name: 'Secondaire', color: '#8B5CF6' },
              { name: 'Succès', color: '#10B981' },
              { name: 'Danger', color: '#EF4444' }
            ].map((colorOption) => (
              <div key={colorOption.name} className="text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-2 rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: colorOption.color }}
                  onClick={() => alert(`Couleur ${colorOption.name} sélectionnée`)}
                ></div>
                <span className="text-sm font-medium">{colorOption.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Section Sécurité
const SecuritySection = ({ data, setData, onSave, loading }) => (
  <div>
    <div className="flex items-center gap-4 mb-8">
      <Shield className="w-8 h-8 text-red-600" />
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Sécurité</h2>
        <p className="text-gray-600 dark:text-gray-400">Paramètres de sécurité et accès</p>
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4">Sessions et Accès</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durée de session (heures)
            </label>
            <select
              value={data.duree_session}
              onChange={(e) => setData({...data, duree_session: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="1">1 heure</option>
              <option value="4">4 heures</option>
              <option value="8">8 heures</option>
              <option value="24">24 heures</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tentatives de connexion max
            </label>
            <select
              value={data.tentatives_max}
              onChange={(e) => setData({...data, tentatives_max: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="3">3 tentatives</option>
              <option value="5">5 tentatives</option>
              <option value="10">10 tentatives</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-4">Options Avancées</h3>
        <div className="space-y-4">
          {[
            { key: 'force_2fa', label: 'Forcer l\'authentification à deux facteurs' },
            { key: 'logs_actifs', label: 'Activer les logs de sécurité' }
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data[item.key]}
                onChange={(e) => setData({...data, [item.key]: e.target.checked})}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-8 flex gap-4">
      <button
        onClick={() => onSave(data)}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        Sauvegarder
      </button>
    </div>
  </div>
);

// Composant Section Système
const SystemSection = ({ data, setData, onSave, loading }) => {
  const [actionLoading, setActionLoading] = useState('');

  const executeSystemAction = async (action) => {
    try {
      setActionLoading(action);
      
      const response = await api.post(`/api/parametres/system/${action}`);
      
      if (response.data.success) {
        alert(`✅ ${response.data.message}`);
        
        // Mettre à jour l'état local si nécessaire
        if (action === 'maintenance' && response.data.data?.maintenance_mode !== undefined) {
          setData(prev => ({ ...prev, maintenance_mode: response.data.data.maintenance_mode }));
        }
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error(`Erreur action ${action}:`, error);
      alert(`❌ Erreur lors de l'exécution de l'action: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Server className="w-8 h-8 text-gray-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Système</h2>
          <p className="text-gray-600 dark:text-gray-400">Maintenance et administration système</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300 mb-4">Sauvegarde</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.auto_backup}
                onChange={(e) => setData({...data, auto_backup: e.target.checked})}
                className="w-5 h-5 text-gray-600 rounded focus:ring-gray-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Sauvegarde automatique</span>
            </label>
            
            {data.auto_backup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fréquence
                </label>
                <select
                  value={data.frequence_backup}
                  onChange={(e) => setData({...data, frequence_backup: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-gray-500 outline-none"
                >
                  <option value="quotidien">Quotidien</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">Actions Système</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => executeSystemAction('backup')}
              disabled={actionLoading === 'backup'}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'backup' ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {actionLoading === 'backup' ? 'Création...' : 'Télécharger sauvegarde'}
            </button>
            
            <button 
              onClick={() => executeSystemAction('optimize')}
              disabled={actionLoading === 'optimize'}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'optimize' ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              {actionLoading === 'optimize' ? 'Optimisation...' : 'Optimiser la base'}
            </button>
            
            <button 
              onClick={() => executeSystemAction('clear-cache')}
              disabled={actionLoading === 'clear-cache'}
              className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'clear-cache' ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {actionLoading === 'clear-cache' ? 'Vidage...' : 'Vider le cache'}
            </button>
            
            <button 
              onClick={() => executeSystemAction('maintenance')}
              disabled={actionLoading === 'maintenance'}
              className={`flex items-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                data.maintenance_mode 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {actionLoading === 'maintenance' ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              {actionLoading === 'maintenance' 
                ? 'Changement...' 
                : data.maintenance_mode 
                  ? 'Désactiver maintenance' 
                  : 'Mode maintenance'
              }
            </button>
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4">Informations Système</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.4 GB</div>
              <div className="text-sm text-gray-600">Espace libre</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Utilisateurs actifs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => onSave(data)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

// Composant Modal Utilisateur
const UserModal = ({ title, user = null, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    role: user?.role || 'commercial',
    actif: user?.actif !== undefined ? user.actif : true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="commercial">Commercial</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Compte actif</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                {user ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;