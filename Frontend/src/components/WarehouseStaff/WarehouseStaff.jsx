"use client"

import { useState } from "react"
import Sidebar from "./Sidebar/Sidebar"
import ReceiptsView from "./ReceiptsView/ReceiptsView"
import DeliveriesView from "./DeliveriesView/DeliveriesView"
import TransfersView from "./TransfersView/TransfersView"
import AdjustmentsView from "./AdjustmentsView/AdjustmentsView"
import InventoryView from "./InventoryView/InventoryView"
import "./WarehouseStaff.css"

const WarehouseStaff = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState("receipts")

  const renderContent = () => {
    switch (activeView) {
      case "receipts":
        return <ReceiptsView />
      case "deliveries":
        return <DeliveriesView />
      case "transfers":
        return <TransfersView />
      case "adjustments":
        return <AdjustmentsView />
      case "inventory":
        return <InventoryView />
      default:
        return <ReceiptsView />
    }
  }

  return (
    <div className="staff-container">
      <Sidebar activeView={activeView} onViewChange={setActiveView} user={user} onLogout={onLogout} />
      <div className="staff-content">{renderContent()}</div>
    </div>
  )
}

export default WarehouseStaff
