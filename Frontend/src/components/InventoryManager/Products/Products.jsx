"use client"

import { useState, useEffect } from "react"
import { getStoredData, updateProduct } from "../../../../utils/dataStore"
import "./Products.css"

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    loadProducts()
    const handleStorageUpdate = () => loadProducts()
    window.addEventListener("storageUpdate", handleStorageUpdate)
    return () => window.removeEventListener("storageUpdate", handleStorageUpdate)
  }, [])

  const loadProducts = () => {
    const data = getStoredData()
    setProducts(data.products)
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditStock = (id, currentValue) => {
    setEditingId(id)
    setEditValue(currentValue.toString())
  }

  const handleSaveStock = (id) => {
    const newValue = parseInt(editValue)
    if (!isNaN(newValue)) {
      updateProduct(id, { freeToUse: newValue })
      loadProducts()
    }
    setEditingId(null)
  }

  return (
    <div className="products">
      {/* Header */}
      <div className="products-header">
        <h1>Stock Management</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Cost</th>
              <th>On Hand</th>
              <th>Free to Use</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="product-row"
                onClick={() => handleEditStock(product.id, product.freeToUse)}
              >
                <td>
                  <span className="product-id">[{product.id}]</span> {product.name}
                </td>
                <td>{product.costPerUnit}</td>
                <td>{product.onHand}</td>
                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSaveStock(product.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveStock(product.id)
                      }
                      autoFocus
                      className="edit-input"
                    />
                  ) : (
                    <span
                      className="editable-stock"
                      onClick={() => handleEditStock(product.id, product.freeToUse)}
                    >
                      {product.freeToUse}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products
