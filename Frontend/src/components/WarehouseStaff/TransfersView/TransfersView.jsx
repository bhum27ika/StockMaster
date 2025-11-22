"use client"

import { useState } from "react"
import "./TransfersView.css"

const TransfersView = () => {
  const [transfers, setTransfers] = useState([
    {
      id: 1,
      from: "Warehouse A",
      to: "Warehouse B",
      items: "Laptops (20)",
      status: "pending",
      initiatedBy: "Manager John",
    },
    {
      id: 2,
      from: "Warehouse B",
      to: "Warehouse C",
      items: "Monitors (15)",
      status: "dispatched",
      initiatedBy: "Manager Sarah",
    },
  ])

  const handleStatusUpdate = (id, newStatus) => {
    setTransfers(transfers.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  return (
    <div className="transfers-view">
      <div className="view-header">
        <h1>🔄 Internal Transfers</h1>
        <p>Manage stock transfers between warehouses</p>
      </div>

      <div className="transfers-container">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="transfer-card">
            <div className="transfer-route">
              <div className="warehouse-from">
                <div className="warehouse-icon">📦</div>
                <p>{transfer.from}</p>
              </div>
              <div className="arrow">→</div>
              <div className="warehouse-to">
                <div className="warehouse-icon">📦</div>
                <p>{transfer.to}</p>
              </div>
            </div>

            <div className="transfer-details">
              <p>
                <strong>Items:</strong> {transfer.items}
              </p>
              <p>
                <strong>Initiated by:</strong> {transfer.initiatedBy}
              </p>
              <p>
                <strong>Status:</strong> <span className={`transfer-status ${transfer.status}`}>{transfer.status}</span>
              </p>
            </div>

            <div className="transfer-actions">
              {transfer.status === "pending" && (
                <button className="action-btn confirm" onClick={() => handleStatusUpdate(transfer.id, "dispatched")}>
                  📍 Confirm Dispatch
                </button>
              )}
              {transfer.status === "dispatched" && (
                <button className="action-btn confirm" onClick={() => handleStatusUpdate(transfer.id, "received")}>
                  ✅ Confirm Arrival
                </button>
              )}
              {transfer.status === "received" && <span className="transfer-complete">✓ Complete</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransfersView
