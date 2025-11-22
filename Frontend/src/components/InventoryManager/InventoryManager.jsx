"use client"

import { useState } from "react"
import Sidebar from "./Sidebar/Sidebar.jsx"
import Dashboard from "./Dashboard/Dashboard.jsx"
import Operations from "./Operations/Operations"
import Products from "./Products/Products"
import MoveHistory from "./MoveHistory/MoveHistory"
import Settings from "./Settings/Settings"
import "./InventoryManager.css"
import UserManagement from "./UserManagement/UserManagement.jsx"

const InventoryManager = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [currentOperation, setCurrentOperation] = useState(null)

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Dashboard />
      case "operations":
        return <Operations setCurrentOperation={setCurrentOperation} />
      case "products":
        return <Products />
      case "history":
        return <MoveHistory />
      case "settings":
        return <Settings />
      case "users":
        return <UserManagement/>
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="manager-container">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} user={user} onLogout={onLogout} />
      <div className="manager-content">{renderContent()}</div>
    </div>
  )
}

export default InventoryManager
