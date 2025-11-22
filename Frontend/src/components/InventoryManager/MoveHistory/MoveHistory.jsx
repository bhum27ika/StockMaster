"use client"

import { useState } from "react"
import "./MoveHistory.css"

const MoveHistory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [moveHistory] = useState([
    {
      id: "WH/IN/0001",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "vendor",
      to: "WH/Stock1",
      quantity: 50,
      status: "in",
    },
    {
      id: "WH/OUT/0002",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "WH/Stock1",
      to: "vendor",
      quantity: 25,
      status: "out",
    },
    {
      id: "WH/OUT/0002",
      date: "12/2/2001",
      contact: "Azure Interior",
      from: "WH/Stock2",
      to: "vendor",
      quantity: 15,
      status: "out",
    },
  ])

  const filteredHistory = moveHistory.filter(
    (h) =>
      h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="move-history">
      <div className="history-header">
        <h1>Move History</h1>
        <input
          type="text"
          placeholder="Search Delivery based on reference & contacts..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="history-toolbar">
        <button className="new-btn">NEW</button>
        <div className="view-toggles">
          <button className="toggle-btn active">≡</button>
          <button className="toggle-btn">☒</button>
        </div>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Date</th>
            <th>Contact</th>
            <th>From</th>
            <th>To</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.map((item, idx) => (
            <tr key={idx}>
              <td>{item.id}</td>
              <td>{item.date}</td>
              <td>{item.contact}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.quantity}</td>
              <td>
                <span className={`status-badge ${item.status}`}>{item.status === "in" ? "IN" : "OUT"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="history-note">
        <p>Populate all moves done between the from - To location in inventory</p>
        <p>If single reference has multiple product display it in multiple rows.</p>
        <p>In event should be display in green</p>
        <p>Out moves should be display in red</p>
      </div>
    </div>
  )
}

export default MoveHistory
