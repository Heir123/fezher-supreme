 import React, { useState, useEffect } from 'react'
import { inventoryService } from '../../services/inventoryService'
import { notificationService } from '../../services/notificationService'
import Button from '../../components/common/Button'
import { formatCurrency } from '../../utils/helpers'

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showAddStock, setShowAddStock] = useState(false)
  const [stockQuantity, setStockQuantity] = useState(1)
  const [warehouse, setWarehouse] = useState('Main')

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await inventoryService.getInventory()
      if (error) throw new Error(error)
      setInventory(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = async (productId) => {
    try {
      const { data, error } = await inventoryService.addStock(
        productId,
        parseInt(stockQuantity),
        warehouse,
        'Manual stock addition'
      )
      if (error) throw new Error(error)
      notificationService.success('Stock Added', `${stockQuantity} units added successfully to ${warehouse}`)
      setShowAddStock(false)
      setStockQuantity(1)
      loadInventory()
    } catch (err) {
      notificationService.error('Failed to add stock', err.message)
    }
  }

  const handleRemoveStock = async (productId) => {
    const quantity = prompt('Enter quantity to remove:')
    if (!quantity) return
    if (!confirm('Are you sure you want to remove stock?')) return

    try {
      const { data, error } = await inventoryService.removeStock(
        productId,
        parseInt(quantity),
        warehouse,
        'Manual stock removal'
      )
      if (error) throw new Error(error)
      notificationService.success('Stock Removed', `${quantity} units removed from ${warehouse}`)
      loadInventory()
    } catch (err) {
      notificationService.error('Failed to remove stock', err.message)
    }
  }

  const filteredInventory = inventory.filter(item =>
    item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouse?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading inventory: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📦 Inventory Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No inventory found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.products?.name || 'Unknown Product'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.products?.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={item.quantity < 10 ? 'text-red-600 font-medium' : ''}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'available' ? 'text-green-800 bg-green-100' :
                        item.status === 'reserved' ? 'text-yellow-800 bg-yellow-100' :
                        'text-red-800 bg-red-100'
                      }`}>
                        {item.status || 'available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex gap-1 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedItem(item)
                            setShowAddStock(true)
                          }}
                        >
                          Add Stock
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveStock(item.product_id)}
                          disabled={item.quantity === 0}
                        >
                          Remove Stock
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStock && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Stock</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <p className="text-gray-900 font-medium">{selectedItem.products?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Warehouse</label>
                <p className="text-gray-900">{selectedItem.warehouse}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Quantity</label>
                <p className="text-gray-900">{selectedItem.quantity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Warehouse</label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Main">Main</option>
                  <option value="Warehouse B">Warehouse B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => { setShowAddStock(false); setWarehouse('Main'); }}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleAddStock(selectedItem.product_id)}>
                  Add Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory