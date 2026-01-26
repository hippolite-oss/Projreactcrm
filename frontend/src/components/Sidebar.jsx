import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Contact2,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  FolderTree,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage(); // Hook pour les traductions
  const [openSubmenus, setOpenSubmenus] = useState({
    clients: location.pathname.includes('/clients'),
    contacts: location.pathname.includes('/contacts'),
    products: location.pathname.includes('/products'),
    quotes: location.pathname.includes('/quotes'),
    invoices: location.pathname.includes('/invoices'),
  });

  const toggleSubmenu = (menu) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return 'Utilisateur';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  const menuItems = [
    {
      type: 'link',
      path: '/dashboard',
      label: t('dashboard', 'Dashboard'),
      icon: LayoutDashboard,
    },
    {
      type: 'link',
      path: '/dashboard/clients',
      label: t('clients', 'Clients'),
      icon: Contact2,
    },
    {
      type: 'link',
      path: '/dashboard/prospects',
      label: t('contacts', 'Contacts'),
      icon: Users,
    },
    {
      type: 'submenu',
      label: t('products', 'Produits'),
      icon: Package,
      key: 'products',
      items: [
        { path: '/dashboard/products', label: t('newProduct', 'Nouveau produit'), icon: Package },
        { path: '/dashboard/categories', label: t('categories', 'Catégories'), icon: FolderTree },
      ]
    },
    {
      type: 'link',
      path: '/dashboard/CommandesOnline',
      label: t('onlineOrders', 'Commandes en ligne'),
      icon: ShoppingCart,
    },
    {
      type: 'link',
      path: '/dashboard/reports',
      label: t('reports', 'Rapports'),
      icon: BarChart3,
    },
    {
      type: 'link',
      path: '/dashboard/settings',
      label: t('settings', 'Paramètres'),
      icon: Settings,
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">CRM</div>
          {isOpen && <span className="logo-text">Business CRM</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          if (item.type === 'link') {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <div className="nav-item-content">
                  <Icon size={20} className="nav-icon" />
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </div>
              </NavLink>
            );
          }

          if (item.type === 'submenu') {
            const Icon = item.icon;
            const isOpenSubmenu = openSubmenus[item.key] && isOpen;
            const hasActiveChild = item.items.some(subItem => 
              location.pathname === subItem.path || 
              location.pathname.startsWith(subItem.path + '/')
            );

            return (
              <div key={item.key} className="submenu-container">
                <button
                  className={`submenu-header ${hasActiveChild ? 'active' : ''}`}
                  onClick={() => toggleSubmenu(item.key)}
                >
                  <div className="nav-item-content">
                    <Icon size={20} className="nav-icon" />
                    {isOpen && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {isOpenSubmenu ? (
                          <ChevronDown size={16} className="chevron-icon" />
                        ) : (
                          <ChevronRight size={16} className="chevron-icon" />
                        )}
                      </>
                    )}
                  </div>
                </button>

                {isOpen && isOpenSubmenu && (
                  <div className="submenu-items">
                    {item.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `submenu-item ${isActive ? 'active' : ''}`
                          }
                        >
                          <div className="submenu-item-content">
                            <SubIcon size={16} className="submenu-icon" />
                            <span className="submenu-label">{subItem.label}</span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </nav>

      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-details">
              <span className="user-name">{getUserDisplayName()}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;