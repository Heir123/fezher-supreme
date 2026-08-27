 import React, { useState, useEffect } from 'react'
import Button from '../common/Button'
import * as productService from '../../services/productService'

const SaleModal = ({ isOpen, onClose, onSave, sale }) => {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    status: 'pending',
    payment_method: 'cash',
    items: []
  })
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadProducts()
      
      if (sale) {
        // Edit mode - pre-fill form with sale data
        setIsEditMode(true)
        setFormData({
          customer_name: sale.customer_name || '',
          customer_email: sale.customer_email || '',
          customer_phone: sale.customer_phone || '',
          status: sale.status || 'pending',
          payment_method: sale.payment_method || 'cash',
          items: sale.sale_items || []
        })
      } else {
        // Create mode - reset form
        setIsEditMode(false)
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          status: 'pending',
          payment_method: 'cash',
          items: []
        })
      }
      setSelectedProduct('')
      setQuantity(1)
      setError('')
    }
  }, [isOpen, sale])

  const loadProducts = async () => {
    try {
      const { data, error } = await productService.getProducts()
      if (error) throw new Error(error)
      setProducts(data || [])
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    if (!selectedProduct) {
      setError('Please select a product')
      return
    }
    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    const existingItem = formData.items.find(item => item.product_id === selectedProduct)
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.product_id === selectedProduct
            ? { ...item, quantity: item.quantity + parseInt(quantity) }
            : item
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            product_id: product.id,
            quantity: parseInt(quantity),
            unit_price: product.price || product.selling_price || 0,
            total_price: (product.price || product.selling_price || 0) * parseInt(quantity)
          }
        ]
      }))
    }
    setSelectedProduct('')
    setQuantity(1)
    setError('')
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.total_price || item.quantity * item.unit_price), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      setError('Please add at least one product')
      return
    }
    setError('')
    setLoading(true)

    try {
      await onSave({
        ...formData,
        total_amount: calculateTotal(),
        sale_date: new Date().toISOString().split('T')[0]
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create sale')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            <span className="text-blue-600">📝</span> 
            {isEditMode ? 'Edit Sale' : 'Create New Sale'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👤 Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📧 Customer Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="customer@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📱 Phone
              </label>
              <input
                type="text"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📊 Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">⏳ Pending</option>
                <option value="paid">✅ Paid</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              💳 Payment Method
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">💰 Cash</option>
              <option value="credit_card">💳 Credit Card</option>
              <option value="paypal">📱 PayPal</option>
              <option value="bank_transfer">🏦 Bank Transfer</option>
            </select>
          </div>

          {/* Add Products Section */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📦 Add Products
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price || product.selling_price || 0}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <Button type="button" variant="primary" onClick={handleAddItem}>
                  ➕ Add
                </Button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          {formData.items.length > 0 && (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">
                        {products.find(p => p.id === item.product_id)?.name || 'Unknown Product'}
                      </td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">${item.unit_price}</td>
                      <td className="px-4 py-2 text-sm font-medium">${(item.total_price || item.quantity * item.unit_price).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right font-medium">Total:</td>
                    <td className="px-4 py-2 text-right font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              ❌ Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading} 
              disabled={loading || formData.items.length === 0}
            >
              {loading ? 'Saving...' : isEditMode ? '✅ Update Sale' : '✅ Create Sale'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaleModal