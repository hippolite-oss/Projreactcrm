import { useState } from 'react'
import { Menu, Bell, User, LogOut, Settings, ShoppingCart, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import './Topbar.css'

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { notifications } = useNotifications()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)

  // Calculer le total des notifications
  const totalNotifications = (notifications.commandesNonLues || 0) + (notifications.prospectsNouveaux || 0)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNotificationClick = () => {
    setNotificationMenuOpen(!notificationMenuOpen)
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
        <div className="notification-container">
          <button 
            className="notification-button" 
            onClick={handleNotificationClick}
            title={`${totalNotifications} notification(s)`}
          >
            <Bell size={20} />
            {totalNotifications > 0 && (
              <span className="notification-badge">
                {totalNotifications > 99 ? '99+' : totalNotifications}
              </span>
            )}
          </button>

          {/* Dropdown des notifications */}
          {notificationMenuOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span className="notification-count">{totalNotifications}</span>
              </div>
              
              <div className="notification-items">
                {/* Notifications Commandes */}
                {notifications.commandesNonLues > 0 && (
                  <div 
                    className="notification-item"
                    onClick={() => {
                      navigate("/dashboard/CommandesOnline")
                      setNotificationMenuOpen(false)
                    }}
                  >
                    <div className="notification-icon commandes">
                      <ShoppingCart size={16} />
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        {notifications.commandesNonLues} nouvelle(s) commande(s)
                      </div>
                      {notifications.derniereCommande && (
                        <div className="notification-subtitle">
                          Dernière: {notifications.derniereCommande.nom}
                        </div>
                      )}
                    </div>
                    <div className="notification-badge-small">
                      {notifications.commandesNonLues}
                    </div>
                  </div>
                )}

                {/* Notifications Prospects */}
                {notifications.prospectsNouveaux > 0 && (
                  <div 
                    className="notification-item"
                    onClick={() => {
                      navigate("/dashboard/prospects")
                      setNotificationMenuOpen(false)
                    }}
                  >
                    <div className="notification-icon prospects">
                      <Users size={16} />
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        {notifications.prospectsNouveaux} nouveau(x) prospect(s)
                      </div>
                      {notifications.dernierProspect && (
                        <div className="notification-subtitle">
                          Dernier: {notifications.dernierProspect.nom}
                        </div>
                      )}
                    </div>
                    <div className="notification-badge-small">
                      {notifications.prospectsNouveaux}
                    </div>
                  </div>
                )}

                {/* Aucune notification */}
                {totalNotifications === 0 && (
                  <div className="notification-empty">
                    <Bell size={24} />
                    <p>Aucune nouvelle notification</p>
                  </div>
                )}
              </div>

              {totalNotifications > 0 && (
                <div className="notification-footer">
                  <button 
                    onClick={() => {
                      navigate("/dashboard")
                      setNotificationMenuOpen(false)
                    }}
                    className="view-all-btn"
                  >
                    Voir le dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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

