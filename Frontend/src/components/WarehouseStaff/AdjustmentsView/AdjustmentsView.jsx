"use client"

import { useState } from "react"
import "./AdjustmentsView.css"

const AdjustmentsView = () => {
  const [adjustments, setAdjustments] = useState([
    {
      id: 1,
      product: "Laptop Pro",
      quantity: -5,
      reason: "Damaged in transit",
      reportedBy: "Jane Smith",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      product: 'Monitor 27"',
      quantity: -2,
      reason: "Missing during count",
      reportedBy: "John Doe",
      date: "2024-01-14",
      status: "approved",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ product: "", quantity: "", reason: "" })

  const handleAddAdjustment = (e) => {
    e.preventDefault()
    const newAdjustment = {
      id: adjustments.length + 1,
      ...formData,
      quantity: Number.parseInt(formData.quantity),
      reportedBy: "Current User",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }
    setAdjustments([...adjustments, newAdjustment])
    setFormData({ product: "", quantity: "", reason: "" })
    setShowForm(false)
  }

  return (
    <div className="adjustments-view">
      <div className="view-header">
        <h1>⚖️ Stock Adjustments</h1>
        <p>Report damaged, lost, or missing items</p>
      </div>

      {!showForm ? (
        <button className="btn-add-adjustment" onClick={() => setShowForm(true)}>
          + Report Adjustment
        </button>
      ) : (
        <div className="adjustment-form">
          <h3>Report Stock Adjustment</h3>
          <form onSubmit={handleAddAdjustment}>
            <div className="form-fields">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantity (use - for loss)"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
              <textarea
                placeholder="Reason for adjustment"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                rows="3"
              ></textarea>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                Submit
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="adjustments-list">
        {adjustments.map((adjustment) => (
          <div key={adjustment.id} className="adjustment-item">
            <div className="adjustment-left">
              <h4>{adjustment.product}</h4>
              <p className="reason">{adjustment.reason}</p>
            </div>
            <div className="adjustment-middle">
              <div className="qty-badge">
                {adjustment.quantity > 0 ? "+" : ""}
                {adjustment.quantity}
              </div>
              <p className="reporter">{adjustment.reportedBy}</p>
            </div>
            <div className="adjustment-right">
              <span className={`adj-status ${adjustment.status}`}>{adjustment.status}</span>
              <p className="date">{adjustment.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdjustmentsView
