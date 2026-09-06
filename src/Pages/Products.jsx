 import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign,
  Filter,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import './Products.css'

function Products() {
  const { formatCurrency, currency } = useCurrency()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Widget Pro', category: 'Electronics', price: 299.99, stock: 45, description: 'High-performance widget' },
        { id: 2, name: 'Gadget X', category: 'Accessories', price: 49.99, stock: 120, description: 'Essential gadget' },
        { id: 3, name: 'Tool Master', category: 'Tools', price: 149.99, stock: 8, description: 'Professional tool set' },
        { id: 4, name: 'Smart Hub', category: 'Electronics', price: 89.99, stock: 32, description: 'Smart home hub' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) } : p
      ))
    } else {
      setProducts([...products, {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }])
    }
    setShowModal(false)
    setEditingProduct(null)
    setFormData({ name: '', category: '', price: '', stock: '', description: '' })
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="products-loading">
        <div className="products-loading-spinner"></div>
        <p className="products-loading-text">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="products">
      {/* Header */}
      <div className="products-header">
        <div>
          <div className="products-badge">
            <div className="products-badge-icon">
              <Package size={16} color="white" />
            </div>
            <span className="products-badge-text">PRODUCTS</span>
          </div>
          <h1 className="products-title">Products</h1>
          <p className="products-subtitle">Manage your product inventory and catalog.</p>
          <p className="products-currency-info">Currency: {currency}</p>
        </div>
        <button className="products-add-btn" onClick={() => { setEditingProduct(null); setFormData({ name: '', category: '', price: '', stock: '', description: '' }); setShowModal(true) }}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="products-filters">
        <div className="products-search">
          <Search size={18} className="products-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products-search-input"
          />
        </div>
        <div className="products-filter-group">
          <button className="products-filter-btn">
            <Filter size={16} />
            Category
            <ChevronDown size={14} />
          </button>
          <button className="products-filter-btn">
            Sort By
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <div className="product-avatar">
                      <Package size={18} />
                    </div>
                    <div>
                      <span className="product-name">{product.name}</span>
                      <span className="product-sku">SKU-{String(product.id).padStart(4, '0')}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="product-category">{product.category}</span>
                </td>
                <td className="product-price">{formatCurrency(product.price)}</td>
                <td>
                  <span className={`product-stock ${product.stock < 10 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`product-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(product)}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="products-stats">
        <span className="products-stats-text">
          Showing {filteredProducts.length} of {products.length} products
        </span>
        <div className="products-stats-details">
          <span>In Stock: {products.filter(p => p.stock > 0).length}</span>
          <span>Low Stock: {products.filter(p => p.stock > 0 && p.stock < 10).length}</span>
          <span>Currency: {currency}</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
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
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
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
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="products-footer">
        <div className="products-footer-content">
          <span className="products-footer-text">© 2026 Fezher Supreme · Product Management</span>
          <div className="products-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Products