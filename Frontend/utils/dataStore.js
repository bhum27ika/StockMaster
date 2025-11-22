const STORAGE_KEY = "inventory_data"

const defaultData = {
  receipts: [
    {
      id: "WH/IN/0001",
      from: "vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "2024-01-15",
      status: "ready",
      products: [{ id: "DESK001", name: "Desk", quantity: 6 }],
    },
    {
      id: "WH/IN/0002",
      from: "vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "2024-01-16",
      status: "ready",
      products: [{ id: "DESK001", name: "Desk", quantity: 4 }],
    },
  ],
  deliveries: [
    {
      id: "WH/OUT/0001",
      from: "WH/Stock1",
      to: "vendor",
      contact: "Azure Interior",
      scheduleDate: "2024-01-20",
      status: "draft",
      products: [{ id: "DESK001", name: "Desk", quantity: 6 }],
    },
    {
      id: "WH/OUT/0002",
      from: "WH/Stock1",
      to: "vendor",
      contact: "Azure Interior",
      scheduleDate: "2024-01-21",
      status: "ready",
      products: [{ id: "DESK001", name: "Desk", quantity: 6 }],
    },
  ],
  transfers: [
    {
      id: "WH/TRF/0001",
      from: "WH/Stock1",
      to: "WH/Stock2",
      status: "draft",
      products: [{ id: "DESK001", name: "Desk", quantity: 5 }],
    },
  ],
  products: [
    { id: "DESK001", name: "Desk", costPerUnit: 3000, onHand: 50, freeToUse: 45 },
    { id: "TABLE001", name: "Table", costPerUnit: 3000, onHand: 50, freeToUse: 50 },
  ],
  moveHistory: [
    {
      id: "MH001",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "vendor",
      to: "WH/Stock1",
      quantity: 10,
      status: "in",
    },
    {
      id: "MH002",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "WH/Stock1",
      to: "vendor",
      quantity: 6,
      status: "out",
    },
  ],
  warehouses: [{ id: "WH001", name: "Main Warehouse", shortCode: "WH", address: "123 Industrial Ave" }],
  locations: [{ id: "LOC001", name: "Rack A1", shortCode: "A1", warehouse: "WH" }],
}

export const getStoredData = () => {
  try {
    if (typeof window === "undefined") return defaultData
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultData
  } catch (e) {
    return defaultData
  }
}

export const saveStoredData = (data) => {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new Event("storageUpdate"))
  } catch (e) {
    console.error("Error saving data:", e)
  }
}

export const updateReceipt = (id, updates) => {
  const data = getStoredData()
  const index = data.receipts.findIndex((r) => r.id === id)
  if (index !== -1) {
    data.receipts[index] = { ...data.receipts[index], ...updates }
    saveStoredData(data)
  }
  return data
}

export const updateDelivery = (id, updates) => {
  const data = getStoredData()
  const index = data.deliveries.findIndex((d) => d.id === id)
  if (index !== -1) {
    data.deliveries[index] = { ...data.deliveries[index], ...updates }
    saveStoredData(data)
  }
  return data
}

export const updateProduct = (id, updates) => {
  const data = getStoredData()
  const index = data.products.findIndex((p) => p.id === id)
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...updates }
    saveStoredData(data)
  }
  return data
}
