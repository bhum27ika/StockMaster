"use client"

import { useState, useEffect } from "react"
import { getStoredData } from "../../../../utils/dataStore"
import "./Dashboard.css"

import { Package, BarChart3, AlertTriangle, Layers, ArrowUp } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    warehouses: 0,
  })

  useEffect(() => {
    loadStats()
    const handleStorageUpdate = () => loadStats()
    window.addEventListener("storageUpdate", handleStorageUpdate)
    return () => window.removeEventListener("storageUpdate", handleStorageUpdate)
  }, [])

  const loadStats = () => {
    const data = getStoredData()
    const totalValue = data.products.reduce((sum, p) => sum + p.onHand * p.costPerUnit, 0)
    const lowStockItems = data.products.filter((p) => p.freeToUse < 10).length
    setStats({
      totalProducts: data.products.length,
      totalValue: totalValue.toLocaleString(),
      lowStockItems,
      warehouses: data.warehouses.length,
    })
  }

  const [kpis] = useState([
    { label: "Total Products", value: "1,245", icon: Package, colorClass: "total-products", trend: "+12%" },
    { label: "Total Stock Value", value: "$847,500", icon: BarChart3, colorClass: "total-value", trend: "+8%" },
    { label: "Low Stock Items", value: "34", icon: AlertTriangle, colorClass: "low-stock", trend: "-5%" },
    { label: "Warehouses", value: "5", icon: Layers, colorClass: "warehouses", trend: "Active" },
  ])

  const [recentActivity] = useState([
    { id: 1, action: "Stock Receipt", product: "Laptop Pro", quantity: 50, time: "2 hours ago", status: "completed" },
    { id: 2, action: "Delivery Order", product: "USB-C Cable", quantity: 200, time: "4 hours ago", status: "completed" },
    { id: 3, action: "Internal Transfer", product: 'Monitor 27"', quantity: 15, time: "6 hours ago", status: "pending" },
    { id: 4, action: "Stock Adjustment", product: "Keyboard", quantity: 8, time: "1 day ago", status: "completed" },
  ])

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* KPI Cards */}
    {/* KPI Cards */}
<div className="kpi-grid">
  {kpis.map((kpi, idx) => (
    <div key={idx} className="kpi-card">
      <div className={`kpi-icon ${kpi.colorClass}`}>
        <kpi.icon size={36} />
      </div>
      <div className="kpi-content">
        <p className="kpi-label">{kpi.label}</p>
        <h3 className="kpi-value">
          {kpi.value}{" "}
          <span className="kpi-trend">
            <ArrowUp size={16} className="trend-icon" /> {kpi.trend}
          </span>
        </h3>
      </div>
    </div>
  ))}
</div>


      {/* Recent Activity Table */}
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-table">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.action}</td>
                  <td>{activity.product}</td>
                  <td>{activity.quantity}</td>
                  <td>{activity.time}</td>
                  <td>
                    <span className={`status-badge ${activity.status}`}>{activity.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Performance & Stock Levels */}
      <div className="dashboard-grid">
        {/* Warehouse Performance */}
        <div className="dashboard-card">
          <h3>Warehouse Performance</h3>
          <div className="performance-list">
            {["A","B","C"].map((name, i) => {
              const widths = [85, 72, 90]
              return (
                <div key={i} className="performance-item">
                  <div className="performance-name">Warehouse {name}</div>
                  <div className="performance-bar">
                    <div className="performance-fill" style={{ width: `${widths[i]}%` }}></div>
                  </div>
                  <div className="performance-percent">{widths[i]}%</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stock Levels */}
        <div className="dashboard-card">
          <h3>Stock Levels</h3>
          <div className="stock-summary">
            <div className="stock-item">
              <div className="stock-label">In Stock</div>
              <div className="stock-value">8,450</div>
            </div>
            <div className="stock-item">
              <div className="stock-label">Low Stock</div>
              <div className="stock-value warning">{stats.lowStockItems}</div>
            </div>
            <div className="stock-item">
              <div className="stock-label">Out of Stock</div>
              <div className="stock-value danger">12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
