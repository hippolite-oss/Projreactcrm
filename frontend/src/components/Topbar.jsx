import { useState } from 'react'
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import './Topbar.css'

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { notifications } = useNotifications()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Debug: Log des notifications
  console.log('🔔 Topbar - Notifications:', notifications);

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNotificationClick = () => {
    console.log('🔔 Topbar - Clic sur notifications - Redirection vers Mes commandes');
    navigate("/dashboard/commandes")
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-button" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="logo" onClick={() => navigate('/')}>
          <h1>CRM</h1>
        </div>
      </div>
      <div className="topbar-right">
        <button 
          className="notification-button" 
          onClick={handleNotificationClick}
          title={`${notifications.commandesNonLues} nouvelle(s) commande(s)`}
        >
          <Bell size={20} />
          {notifications.commandesNonLues > 0 && (
            <span className="notification-badge">
              {notifications.commandesNonLues > 99 ? '99+' : notifications.commandesNonLues}
            </span>
          )}
        </button>
        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User size={20} />
            <span>{user?.email}</span>
          </button>
          {userMenuOpen && (
            <div className="user-menu-dropdown">
              <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}>
                <Settings size={16} />
                Paramètres
              </button>
              <button onClick={handleLogout}>
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar

