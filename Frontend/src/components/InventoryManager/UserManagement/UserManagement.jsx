"use client"

import { useState } from "react"
import "./UserManagement.css"

const UserManagement = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Jane Smith",
      email: "jane@warehouse.com",
      role: "Warehouse Staff",
      warehouse: "Warehouse A",
      status: "active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@warehouse.com",
      role: "Warehouse Staff",
      warehouse: "Warehouse B",
      status: "active",
    },
    {
      id: 3,
      name: "Sarah Lee",
      email: "sarah@warehouse.com",
      role: "Warehouse Supervisor",
      warehouse: "Warehouse A",
      status: "active",
    },
    {
      id: 4,
      name: "Mike Johnson",
      email: "mike@warehouse.com",
      role: "Warehouse Staff",
      warehouse: "Warehouse C",
      status: "inactive",
    },
  ])

  return (
    <div className="user-management">
      <div className="um-header">
        <div>
          <h1>User Management</h1>
          <p>Manage warehouse staff and permissions</p>
        </div>
        <button className="btn btn-primary">+ Add User</button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.warehouse}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>{user.status}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
