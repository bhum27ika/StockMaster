"use client"

import { useState } from "react"
import "./Settings.css"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("warehouse")
  const [warehouses, setWarehouses] = useState([{ id: 1, name: "Main Warehouse", code: "WH", address: "123 Main St" }])
  const [locations, setLocations] = useState([
    { id: 1, name: "Rack A1", code: "A1", warehouse: "WH" },
    { id: 2, name: "Rack B2", code: "B2", warehouse: "WH" },
  ])

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddWarehouse = (e) => {
    e.preventDefault()
    if (formData.name && formData.code) {
      setWarehouses([...warehouses, { id: Date.now(), ...formData }])
      setFormData({ name: "", code: "", address: "" })
    }
  }

  const handleAddLocation = (e) => {
    e.preventDefault()
    if (formData.name && formData.code) {
      setLocations([...locations, { id: Date.now(), ...formData }])
      setFormData({ name: "", code: "", address: "" })
    }
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure system preferences and warehouse management</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === "warehouse" ? "active" : ""}`}
          onClick={() => setActiveTab("warehouse")}
        >
          Warehouse
        </button>
        <button
          className={`tab-btn ${activeTab === "location" ? "active" : ""}`}
          onClick={() => setActiveTab("location")}
        >
          Location
        </button>
        <button className={`tab-btn ${activeTab === "stock" ? "active" : ""}`} onClick={() => setActiveTab("stock")}>
          Stock
        </button>
      </div>

      {activeTab === "warehouse" && (
        <div className="settings-form">
          <h2>Warehouse Management</h2>
          <form onSubmit={handleAddWarehouse}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter warehouse name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Short Code:</label>
              <input
                type="text"
                name="code"
                placeholder="Enter short code"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="save-btn">
              Add Warehouse
            </button>
          </form>

          <div className="settings-view">
            <h3>Existing Warehouses</h3>
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((wh) => (
                  <tr key={wh.id}>
                    <td>{wh.name}</td>
                    <td>{wh.code}</td>
                    <td>{wh.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "location" && (
        <div className="settings-form">
          <h2>Location Management</h2>
          <p className="form-description">This holds the multiple locations of warehouse, such as Rack A1, B2, etc.</p>
          <form onSubmit={handleAddLocation}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter location name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Short Code:</label>
              <input
                type="text"
                name="code"
                placeholder="Enter short code"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Warehouse:</label>
              <select name="address" value={formData.address} onChange={handleInputChange} defaultValue="WH">
                <option value="">Select Warehouse</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.code}>
                    {wh.name} ({wh.code})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="save-btn">
              Add Location
            </button>
          </form>

          <div className="settings-view">
            <h3>Existing Locations</h3>
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Warehouse</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.name}</td>
                    <td>{loc.code}</td>
                    <td>{loc.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "stock" && (
        <div className="settings-view">
          <h2>Stock Inventory</h2>
          <table className="settings-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>per unit cost</th>
                <th>On hand</th>
                <th>free to Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="product-id">[DESK001]</span> Desk
                </td>
                <td>3000 Rs</td>
                <td>50</td>
                <td>45</td>
              </tr>
              <tr>
                <td>
                  <span className="product-id">[TABLE001]</span> Table
                </td>
                <td>3000 Rs</td>
                <td>50</td>
                <td>50</td>
              </tr>
            </tbody>
          </table>
          <p className="form-description">User must be able to update the stock from here.</p>
        </div>
      )}
    </div>
  )
}

export default Settings
