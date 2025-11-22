"use client"

import { useState, useEffect } from "react"
import { getStoredData, updateDelivery } from "../../../../utils/dataStore"
import "./DeliveriesView.css"

const DeliveriesView = () => {
  const [deliveries, setDeliveries] = useState([])

  useEffect(() => {
    loadDeliveries()
    const handleStorageUpdate = () => loadDeliveries()
    window.addEventListener("storageUpdate", handleStorageUpdate)
    return () => window.removeEventListener("storageUpdate", handleStorageUpdate)
  }, [])

  const loadDeliveries = () => {
    const data = getStoredData()
    setDeliveries(data.deliveries)
  }

  const handleStatusUpdate = (id, newStatus) => {
    updateDelivery(id, { status: newStatus })
    loadDeliveries()
  }

  return (
    <div className="deliveries-view">
      <div className="view-header">
        <h1>📦 Delivery Orders</h1>
        <p>Manage outgoing deliveries</p>
      </div>

      <div className="deliveries-container">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className={`delivery-card status-${delivery.status}`}>
            <div className="delivery-header">
              <div>
                <h3>{delivery.id}</h3>
                <p className="customer">{delivery.contact}</p>
              </div>
              <span className={`status-badge ${delivery.status}`}>{delivery.status}</span>
            </div>

            <div className="delivery-details">
              <p>
                <strong>From:</strong> {delivery.from}
              </p>
              <p>
                <strong>To:</strong> {delivery.to}
              </p>
              <p>
                <strong>Due:</strong> {delivery.scheduleDate}
              </p>
            </div>

            <div className="delivery-timeline">
              <div className={`timeline-step ${["draft", "ready", "done"].includes(delivery.status) ? "active" : ""}`}>
                <div className="step-dot">✓</div>
                <span>Draft</span>
              </div>
              <div className={`timeline-step ${["ready", "done"].includes(delivery.status) ? "active" : ""}`}>
                <div className="step-dot">✓</div>
                <span>Ready</span>
              </div>
              <div className={`timeline-step ${delivery.status === "done" ? "active" : ""}`}>
                <div className="step-dot">✓</div>
                <span>Done</span>
              </div>
            </div>

            <div className="delivery-actions">
              {delivery.status === "draft" && (
                <button className="action-btn primary" onClick={() => handleStatusUpdate(delivery.id, "ready")}>
                  🔍 Mark Ready
                </button>
              )}
              {delivery.status === "ready" && (
                <button className="action-btn primary" onClick={() => handleStatusUpdate(delivery.id, "done")}>
                  🚚 Mark Done
                </button>
              )}
              {delivery.status === "done" && <span className="completed">✅ Completed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeliveriesView
