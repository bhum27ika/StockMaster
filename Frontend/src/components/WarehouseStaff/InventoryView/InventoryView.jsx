"use client"

import { useState } from "react"
import "./InventoryView.css"

const InventoryView = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory] = useState([
    {
      id: 1,
      product: "Laptop Pro",
      sku: "LP-001",
      quantity: 45,
      minStock: 10,
      location: "Rack A1",
      status: "in-stock",
    },
    {
      id: 2,
      product: "USB-C Cable",
      sku: "USB-002",
      quantity: 500,
      minStock: 100,
      location: "Bin B2",
      status: "in-stock",
    },
    {
      id: 3,
      product: 'Monitor 27"',
      sku: "MON-003",
      quantity: 22,
      minStock: 5,
      location: "Rack C3",
      status: "in-stock",
    },
    { id: 4, product: "Keyboard", sku: "KEY-004", quantity: 8, minStock: 20, location: "Bin A5", status: "low-stock" },
    { id: 5, product: "Mouse Pad", sku: "MP-005", quantity: 0, minStock: 15, location: "N/A", status: "out-of-stock" },
  ])

  const filteredInventory = inventory.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="inventory-view">
      <div className="view-header">
        <h1>📋 Inventory View</h1>
        <p>Current warehouse stock levels</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Min. Stock</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className={`row-${item.status}`}>
                <td className="product-name">{item.product}</td>
                <td className="sku">{item.sku}</td>
                <td className="quantity">{item.quantity}</td>
                <td className="min-stock">{item.minStock}</td>
                <td className="location">{item.location}</td>
                <td>
                  <span className={`inv-status ${item.status}`}>
                    {item.status === "in-stock" && "✅ In Stock"}
                    {item.status === "low-stock" && "⚠️ Low Stock"}
                    {item.status === "out-of-stock" && "❌ Out"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Total Items</p>
            <p className="stat-value">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚠️</span>
          <div>
            <p className="stat-label">Low Stock</p>
            <p className="stat-value">{inventory.filter((i) => i.status === "low-stock").length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❌</span>
          <div>
            <p className="stat-label">Out of Stock</p>
            <p className="stat-value">{inventory.filter((i) => i.status === "out-of-stock").length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryView
