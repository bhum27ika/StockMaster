"use client"

import { useState, useEffect } from "react"
import { getStoredData, saveStoredData } from "../../../../utils/dataStore"
import "./Operations.css"

const Operations = () => {
  const [operationType, setOperationType] = useState("dashboard")
  const [viewMode, setViewMode] = useState("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [receipts, setReceipts] = useState([])
  const [deliveries, setDeliveries] = useState([])

  useEffect(() => {
    loadData()
    const handleStorageUpdate = () => loadData()
    window.addEventListener("storageUpdate", handleStorageUpdate)
    return () => window.removeEventListener("storageUpdate", handleStorageUpdate)
  }, [])

  const loadData = () => {
    const data = getStoredData()
    setReceipts(data.receipts)
    setDeliveries(data.deliveries)
  }

  const handleStatusChange = (id, newStatus, type) => {
    const data = getStoredData()
    if (type === "receipt") {
      const index = data.receipts.findIndex((r) => r.id === id)
      if (index !== -1) {
        data.receipts[index].status = newStatus
        saveStoredData(data)
        setReceipts([...data.receipts])
      }
    } else {
      const index = data.deliveries.findIndex((d) => d.id === id)
      if (index !== -1) {
        data.deliveries[index].status = newStatus
        saveStoredData(data)
        setDeliveries([...data.deliveries])
      }
    }
  }

  const filteredReceipts = receipts.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupByStatus = (items) => {
    const grouped = {}
    items.forEach((item) => {
      if (!grouped[item.status]) grouped[item.status] = []
      grouped[item.status].push(item)
    })
    return grouped
  }

  return (
    <div className="operations">
      {operationType === "dashboard" && (
        <div className="ops-dashboard">
          <div className="ops-header">
            <h1>Operations</h1>
          </div>

          <div className="ops-cards-grid">
            <div className="ops-card receipt-card">
              <h3>Receipt</h3>
              <div className="ops-stats">
                <div className="ops-stat">
                  <span className="ops-number">4 to receive</span>
                </div>
                <div className="ops-stat">
                  <span className="ops-label">Late</span>
                  <span className="ops-value">1</span>
                </div>
                <div className="ops-stat">
                  <span className="ops-label">6 operations</span>
                </div>
              </div>
              <button className="ops-btn" onClick={() => setOperationType("receipts")}>
                View Receipts
              </button>
            </div>

            <div className="ops-card delivery-card">
              <h3>Delivery</h3>
              <div className="ops-stats">
                <div className="ops-stat">
                  <span className="ops-number">4 to Deliver</span>
                </div>
                <div className="ops-stat">
                  <span className="ops-label">Waiting</span>
                  <span className="ops-value">1</span>
                </div>
                <div className="ops-stat">
                  <span className="ops-label">6 operations</span>
                </div>
              </div>
              <button className="ops-btn" onClick={() => setOperationType("deliveries")}>
                View Deliveries
              </button>
            </div>
          </div>
        </div>
      )}

      {operationType === "receipts" && (
        <div className="ops-list-view">
          <div className="ops-header">
            <h1>Receipts</h1>
            <button className="new-btn">NEW</button>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              placeholder="Search by reference..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="view-toggles">
              <button
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                ≡ List
              </button>
              <button
                className={`toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
                onClick={() => setViewMode("kanban")}
              >
                ☒ Kanban
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Contact</th>
                  <th>Schedule date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td>{receipt.id}</td>
                    <td>{receipt.from}</td>
                    <td>{receipt.to}</td>
                    <td>{receipt.contact}</td>
                    <td>{receipt.scheduleDate}</td>
                    <td>
                      <span className={`status-badge ${receipt.status}`}>{receipt.status}</span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={receipt.status}
                        onChange={(e) => handleStatusChange(receipt.id, e.target.value, "receipt")}
                      >
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="kanban-board">
              {["draft", "ready", "done"].map((status) => (
                <div key={status} className="kanban-column">
                  <h3 className="kanban-title">{status.toUpperCase()}</h3>
                  <div className="kanban-cards">
                    {filteredReceipts
                      .filter((r) => r.status === status)
                      .map((receipt) => (
                        <div key={receipt.id} className="kanban-card">
                          <div className="card-header">{receipt.id}</div>
                          <div className="card-body">
                            <p>
                              <strong>From:</strong> {receipt.from}
                            </p>
                            <p>
                              <strong>To:</strong> {receipt.to}
                            </p>
                            <p>
                              <strong>Contact:</strong> {receipt.contact}
                            </p>
                            <p>
                              <strong>Date:</strong> {receipt.scheduleDate}
                            </p>
                          </div>
                          <select
                            className="card-status-select"
                            value={receipt.status}
                            onChange={(e) => handleStatusChange(receipt.id, e.target.value, "receipt")}
                          >
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="back-btn" onClick={() => setOperationType("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      )}

      {operationType === "deliveries" && (
        <div className="ops-list-view">
          <div className="ops-header">
            <h1>Delivery</h1>
            <button className="new-btn">NEW</button>
          </div>

          <div className="ops-toolbar">
            <input
              type="text"
              placeholder="Search by reference & contacts..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="view-toggles">
              <button
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                ≡ List
              </button>
              <button
                className={`toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
                onClick={() => setViewMode("kanban")}
              >
                ☒ Kanban
              </button>
            </div>
          </div>

          {viewMode === "list" ? (
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Contact</th>
                  <th>Schedule date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>{delivery.id}</td>
                    <td>{delivery.from}</td>
                    <td>{delivery.to}</td>
                    <td>{delivery.contact}</td>
                    <td>{delivery.scheduleDate}</td>
                    <td>
                      <span className={`status-badge ${delivery.status}`}>{delivery.status}</span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={delivery.status}
                        onChange={(e) => handleStatusChange(delivery.id, e.target.value, "delivery")}
                      >
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="kanban-board">
              {["draft", "ready", "done"].map((status) => (
                <div key={status} className="kanban-column">
                  <h3 className="kanban-title">{status.toUpperCase()}</h3>
                  <div className="kanban-cards">
                    {filteredDeliveries
                      .filter((d) => d.status === status)
                      .map((delivery) => (
                        <div key={delivery.id} className="kanban-card">
                          <div className="card-header">{delivery.id}</div>
                          <div className="card-body">
                            <p>
                              <strong>From:</strong> {delivery.from}
                            </p>
                            <p>
                              <strong>To:</strong> {delivery.to}
                            </p>
                            <p>
                              <strong>Contact:</strong> {delivery.contact}
                            </p>
                            <p>
                              <strong>Date:</strong> {delivery.scheduleDate}
                            </p>
                          </div>
                          <select
                            className="card-status-select"
                            value={delivery.status}
                            onChange={(e) => handleStatusChange(delivery.id, e.target.value, "delivery")}
                          >
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="back-btn" onClick={() => setOperationType("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}

export default Operations
