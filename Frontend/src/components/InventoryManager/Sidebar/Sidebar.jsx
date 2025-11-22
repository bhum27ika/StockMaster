"use client"
import "./Sidebar.css"

import { Home, Package, TruckIcon,  Settings, User, LogOut, } from 'lucide-react';

const Sidebar = ({ activeMenu, onMenuChange, user, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "products", label: "Product Management", icon: Package },
    { id: "operations", label: "Operations", icon: TruckIcon },
    { id: "users", label: "User Management", icon: User },
    { id: "settings", label: "Settings", icon: Settings },

  ]

  return (

    
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo"> <
        Package style={{ width: "2rem", height: "2rem", color: "#60A5FA" }} />
        StockMaster
        </div>

         <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
          
    
          </div>
        </div>
      </div>
      

      <div className="user-info">
        <div className="user-avatar">JM</div>
        <div>
          <p className="user-name">{user?.name}</p>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => onMenuChange(item.id)}
            >
              <span className="nav-icon"><item.icon size={20} /></span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}

      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut /> Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
