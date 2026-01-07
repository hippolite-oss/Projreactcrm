import { useState } from 'react'
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Topbar.css'

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
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
        <button className="notification-button">
          <Bell size={20} />
          <span className="notification-badge">3</span>
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

