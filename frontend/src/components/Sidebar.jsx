import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Contact,
  Contact2,
  Package,
  PackagePlus,
  FileText,
  FilePlus,
  Receipt,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  const location = useLocation();
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

  const menuItems = [
    {
      type: 'link',
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      type: 'submenu',
      label: 'Clients',
      icon: Users,
      key: 'clients',
      items: [
        { path: '/clients', label: 'Liste des clients', icon: Users },
        { path: '/nouveauclient', label: 'Nouveau client', icon: UserPlus },
      ]
    },
    {
      type: 'submenu',
      label: 'Contacts',
      icon: Contact,
      key: 'contacts',
      items: [
        { path: '/contacts', label: 'Liste des contacts', icon: Contact },
        { path: '/nouveaucontact', label: 'Nouveau contact', icon: Contact2 },
      ]
    },
    {
      type: 'submenu',
      label: 'Produits / Services',
      icon: Package,
      key: 'products',
      items: [
        { path: '/products', label: 'Liste des produits', icon: Package },
        { path: '/nouveauproduit', label: 'Nouveau produit', icon: PackagePlus },
      ]
    },
    {
      type: 'submenu',
      label: 'Devis',
      icon: FileText,
      key: 'quotes',
      items: [
        { path: '/quotes', label: 'Liste des devis', icon: FileText },
        { path: '/nouveaudevis', label: 'Nouveau devis', icon: FilePlus },
      ]
    },
    {
      type: 'submenu',
      label: 'Factures',
      icon: Receipt,
      key: 'invoices',
      items: [
        { path: '/invoices', label: 'Liste des factures', icon: Receipt },
        { path: '/nouveaufacture', label: 'Nouvelle facture', icon:Receipt},
      ]
    },
    {
      type: 'link',
      path: '/reports',
      label: 'Rapports',
      icon: BarChart3,
    },
    {
      type: 'link',
      path: '/settings',
      label: 'Paramètres',
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
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <span className="user-name">John Doe</span>
              <span className="user-role">Administrateur</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;