import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Search, 
  Filter, 
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Eye
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './Inventory.css'

function Inventory() {
  const { formatCurrency, currency } = useCurrency()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    reorderPoint: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    try {
      const orgId = getOrgId()
      const response = await fetch('http://localhost:3000/api/inventory', {
        headers: {
          'X-Organization-ID': orgId,
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error loading inventory:', error)
      // Mock data for demo
      setItems([
        { id: 1, name: 'Widget Pro', sku: 'SKU-001', category: 'Electronics', quantity: 45, reorderPoint: 10, price: 299.99, status: 'in-stock' },
        { id: 2, name: 'Gadget X', sku: 'SKU-002', category: 'Accessories', quantity: 120, reorderPoint: 20, price: 49.99, status: 'in-stock' },
        { id: 3, name: 'Tool Master', sku: 'SKU-003', category: 'Tools', quantity: 8, reorderPoint: 15, price: 149.99, status: 'low-stock' },
        { id: 4, name: 'Smart Hub', sku: 'SKU-004', category: 'Electronics', quantity: 32, reorderPoint: 10, price: 89.99, status: 'in-stock' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getOrgId = () => {
    const orgData = localStorage.getItem('organizationData')
    if (orgData) {
      try {
        const org = JSON.parse(orgData)
        return org.id
      } catch (e) {
        return null
      }
    }
    return null
  }

  const getStatusConfig = (status) => {
    const configs = {
      'in-stock': { label: 'In Stock', icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
      'low-stock': { label: 'Low Stock', icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
      'out-of-stock': { label: 'Out of Stock', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' }
    }
    return configs[status] || configs['in-stock']
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id ? { ...item, ...formData, quantity: parseInt(formData.quantity), reorderPoint: parseInt(formData.reorderPoint), price: parseFloat(formData.price) } : item
      ))
    } else {
      setItems([...items, {
        ...formData,
        id: Date.now(),
        quantity: parseInt(formData.quantity),
        reorderPoint: parseInt(formData.reorderPoint),
        price: parseFloat(formData.price),
        status: parseInt(formData.quantity) > parseInt(formData.reorderPoint) ? 'in-stock' : 'low-stock'
      }])
    }
    setShowModal(false)
    setEditingItem(null)
    setFormData({ name: '', sku: '', category: '', quantity: '', reorderPoint: '', price: '', description: '' })
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity.toString(),
      reorderPoint: item.reorderPoint.toString(),
      price: item.price.toString(),
      description: item.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="inventory-loading-spinner"></div>
        <p className="inventory-loading-text">Loading inventory...</p>
      </div>
    )
  }

  return (
    <div className="inventory">
      {/* Header */}
      <div className="inventory-header">
        <div>
          <div className="inventory-badge">
            <div className="inventory-badge-icon">
              <Package size={16} color="white" />
            </div>
            <span className="inventory-badge-text">INVENTORY</span>
          </div>
          <h1 className="inventory-title">Inventory</h1>
          <p className="inventory-subtitle">Track and manage your stock levels. Currency: {currency}</p>
        </div>
        <button className="inventory-add-btn" onClick={() => { setEditingItem(null); setFormData({ name: '', sku: '', category: '', quantity: '', reorderPoint: '', price: '', description: '' }); setShowModal(true) }}>
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Summary Stats */}
      <div className="inventory-summary">
        <div className="inv-stat">
          <span className="inv-stat-value">{items.length}</span>
          <span className="inv-stat-label">Total Items</span>
        </div>
        <div className="inv-stat in-stock">
          <span className="inv-stat-value">{items.filter(i => i.status === 'in-stock').length}</span>
          <span className="inv-stat-label">In Stock</span>
        </div>
        <div className="inv-stat low-stock">
          <span className="inv-stat-value">{items.filter(i => i.status === 'low-stock').length}</span>
          <span className="inv-stat-label">Low Stock</span>
        </div>
        <div className="inv-stat out-of-stock">
          <span className="inv-stat-value">{items.filter(i => i.status === 'out-of-stock').length}</span>
          <span className="inv-stat-label">Out of Stock</span>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <div className="inventory-search">
          <Search size={18} className="inventory-search-icon" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="inventory-search-input"
          />
        </div>
        <div className="inventory-filter-group">
          <button className="inventory-filter-btn">
            <Filter size={16} />
            Category
            <ChevronDown size={14} />
          </button>
          <button className="inventory-filter-btn" onClick={loadInventory}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Reorder Point</th>
              <th>Price</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const statusConfig = getStatusConfig(item.status)
              const StatusIcon = statusConfig.icon
              return (
                <tr key={item.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-avatar">
                        <Package size={16} />
                      </div>
                      <span className="product-name">{item.name}</span>
                    </div>
                  </td>
                  <td className="item-sku">{item.sku}</td>
                  <td className="item-category">{item.category}</td>
                  <td className={`item-quantity ${item.quantity < item.reorderPoint ? 'low' : ''}`}>
                    {item.quantity}
                  </td>
                  <td className="item-reorder">{item.reorderPoint}</td>
                  <td className="item-price">{formatCurrency(item.price)}</td>
                  <td>
                    <span className="item-status" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                      <StatusIcon size={12} />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="action-btn edit" onClick={() => handleEdit(item)}>
                      <Edit size={14} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="inventory-stats">
        <span className="inventory-stats-text">
          Showing {filteredItems.length} of {items.length} items · Currency: {currency}
        </span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Edit Inventory Item' : 'Add New Item'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ({currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reorder Point</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({...formData, reorderPoint: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="inventory-footer">
        <div className="inventory-footer-content">
          <span className="inventory-footer-text">© 2026 Fezher Supreme · Inventory Management</span>
          <span className="inventory-footer-currency">Currency: {currency}</span>
          <div className="inventory-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Inventory