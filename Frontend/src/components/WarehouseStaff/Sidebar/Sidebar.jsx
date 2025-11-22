"use client"
import "./Sidebar.css"
import { Inbox, Package, Repeat, Sliders, Clipboard } from "lucide-react"

const Sidebar = ({ activeMenu, onViewChange, user, onLogout }) => {
  const operations = [
    { id: "receipts", label: "Incoming Receipts", icon: <Inbox size={20} /> },
    { id: "deliveries", label: "Delivery Orders", icon: <Package size={20} /> },
    { id: "transfers", label: "Internal Transfers", icon: <Repeat size={20} /> },
    { id: "adjustments", label: "Stock Adjustments", icon: <Sliders size={20} /> },
    { id: "inventory", label: "Inventory View", icon: <Clipboard size={20} /> },
  ]

  return (
    <div className="staff-sidebar">
      <div className="staff-header">
        <div className="staff-logo">📦</div>
        <div className="staff-role-info">
          <h2>Warehouse Staff</h2>
          <p className="warehouse-name">{user?.warehouse}</p>
        </div>
      </div>

      <div className="staff-user-card">
        <p className="staff-user-name">{user?.name}</p>
        <p className="staff-user-email">{user?.email}</p>
      </div>

      <nav className="staff-nav">
        {operations.map((op) => (
          <button
            key={op.id}
            className={`staff-nav-btn ${activeMenu === op.id ? "active" : ""}`}
            onClick={() => onViewChange(op.id)}
          >
            <span className="op-icon">{op.icon}</span>
            <span className="op-label">{op.label}</span>
          </button>
        ))}
      </nav>

      <div className="staff-sidebar-footer">
        <button className="staff-logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
