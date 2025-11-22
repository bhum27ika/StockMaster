"use client"

import { useState, useEffect } from "react"
import { getStoredData, updateReceipt } from "../../../../utils/dataStore"
import "./ReceiptsView.css"

const ReceiptsView = () => {
  const [receipts, setReceipts] = useState([])

  useEffect(() => {
    loadReceipts()
    const handleStorageUpdate = () => loadReceipts()
    window.addEventListener("storageUpdate", handleStorageUpdate)
    return () => window.removeEventListener("storageUpdate", handleStorageUpdate)
  }, [])

  const loadReceipts = () => {
    const data = getStoredData()
    setReceipts(data.receipts)
  }

  const handleStatusUpdate = (id, newStatus) => {
    updateReceipt(id, { status: newStatus })
    loadReceipts()
  }

  return (
    <div className="receipts-view">
      <div className="view-header">
        <h1>📥 Incoming Receipts</h1>
        <p>Process incoming stock shipments</p>
      </div>

      <div className="receipts-container">
        {receipts.map((receipt) => (
          <div key={receipt.id} className={`receipt-card status-${receipt.status}`}>
            <div className="receipt-top">
              <div>
                <h3>{receipt.id}</h3>
                <p className="receipt-supplier">{receipt.contact}</p>
              </div>
              <span className={`receipt-status ${receipt.status}`}>{receipt.status}</span>
            </div>

            <div className="receipt-info">
              <div className="info-item">
                <span className="label">From:</span>
                <span className="value">{receipt.from}</span>
              </div>
              <div className="info-item">
                <span className="label">To:</span>
                <span className="value">{receipt.to}</span>
              </div>
              <div className="info-item">
                <span className="label">Schedule Date:</span>
                <span className="value">{receipt.scheduleDate}</span>
              </div>
            </div>

            <div className="receipt-actions">
              {receipt.status === "draft" && (
                <button className="action-btn mark-arrived" onClick={() => handleStatusUpdate(receipt.id, "ready")}>
                  📍 Mark Ready
                </button>
              )}
              {receipt.status === "ready" && (
                <button className="action-btn mark-received" onClick={() => handleStatusUpdate(receipt.id, "done")}>
                  ✅ Mark Done
                </button>
              )}
              {receipt.status === "done" && <span className="status-complete">✓ Completed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReceiptsView
