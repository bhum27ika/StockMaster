"use client"

import { useState } from "react"
import "./RoleSelector.css"

const RoleSelector = ({ onRoleSelect }) => {
  const [email, setEmail] = useState("")

  const handleSelectRole = (role) => {
    const userData = {
      id: "1",
      email: email || `user@${role}.com`,
      role: role,
      warehouse: role === "staff" ? "Warehouse A" : "All",
      name: role === "manager" ? "John Manager" : "Jane Warehouse",
    }
    onRoleSelect(role, userData)
  }

  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <h1>StockMaster IMS</h1>
        <p className="subtitle">Select Your Role</p>

        <div className="role-input-section">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="role-input"
          />
        </div>

        <div className="role-buttons">
          <button className="role-btn manager-btn" onClick={() => handleSelectRole("manager")}>
            <div className="role-icon">👔</div>
            <h2>Inventory Manager</h2>
            <p>Full access to all features, analytics, and user management</p>
          </button>

          <button className="role-btn staff-btn" onClick={() => handleSelectRole("staff")}>
            <div className="role-icon">👷</div>
            <h2>Warehouse Staff</h2>
            <p>Simple interface for daily operations and status updates</p>
          </button>
        </div>

        <div className="demo-credentials">
          <h3>Demo Credentials</h3>
          <p>Manager: manager@stockmaster.com</p>
          <p>Staff: staff@warehouse.com</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
