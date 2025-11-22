"use client"

import { useState } from "react"
import InventoryManager from "./components/InventoryManager/InventoryManager"
import WarehouseStaff from "./components/WarehouseStaff/WarehouseStaff"
import RoleSelector from "./components/RoleSelector/RoleSelector"
import "./App.css"

function App() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [user, setUser] = useState(null)

  const handleRoleSelect = (role, userData) => {
    setSelectedRole(role)
    setUser(userData)
  }

  const handleLogout = () => {
    setSelectedRole(null)
    setUser(null)
  }

  return (
    <div className="app">
      {!selectedRole ? (
        <RoleSelector onRoleSelect={handleRoleSelect} />
      ) : selectedRole === "manager" ? (
        <InventoryManager user={user} onLogout={handleLogout} />
      ) : (
        <WarehouseStaff user={user} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
