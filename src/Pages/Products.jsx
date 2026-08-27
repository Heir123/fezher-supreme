import React, { useState, useEffect } from 'react'
import * as ProductService from '../services/productService'
import { notificationService } from '../services/notificationService'
import Button from '../components/common/Button'
import ProductModal from '../components/products/ProductModal'
import RoleBasedAccess from '../components/common/RoleBasedAccess'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/helpers'

const Products = () => {
  const { isAdmin, isManager } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('Add Product')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await ProductService.getProducts()
      if (error) throw new Error(error)
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setModalTitle('Add Product')
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setModalTitle('Edit Product')
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        const { data, error } = await ProductService.updateProduct(selectedProduct.id, productData)
        if (error) throw new Error(error)
        setProducts(products.map(p => p.id === data.id ? data : p))
        notificationService.productUpdated(productData.name)
      } else {
        const { data, error } = await ProductService.createProduct(productData)
        if (error) throw new Error(error)
        setProducts([data, ...products])
        notificationService.productAdded(productData.name)
      }
    } catch (err) {
      notificationService.error('Failed to save product', err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const product = products.find(p => p.id === id)
      const { error } = await ProductService.deleteProduct(id)
      if (error) throw new Error(error)
      setProducts(products.filter(p => p.id !== id))
      notificationService.productDeleted(product?.name || 'Product')
    } catch (err) {
      notificationService.error('Failed to delete product', err.message)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading products: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <RoleBasedAccess managerOnly>
            <Button variant="primary" onClick={handleAddProduct}>
              Add Product
            </Button>
          </RoleBasedAccess>
          <RoleBasedAccess adminOnly>
            <Button variant="primary" onClick={handleAddProduct}>
              Add Product
            </Button>
          </RoleBasedAccess>
          {/* If user is staff, hide the Add Product button */}
          {!isAdmin && !isManager && (
            <Button variant="secondary" disabled className="opacity-50 cursor-not-allowed">
              Add Product (Staff - View Only)
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No products match your search' : 'No products found. Add your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.category || product.brand || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(product.price || product.selling_price || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                        {product.stock || product.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex gap-1 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </Button>
                        <RoleBasedAccess adminOnly>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </RoleBasedAccess>
                        {/* If user is not admin, show disabled delete button */}
                        {!isAdmin && (
                          <Button 
                            variant="danger" 
                            size="sm" 
                            disabled
                            className="opacity-50 cursor-not-allowed"
                            title="Only admins can delete products"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        title={modalTitle}
      />
    </div>
  )
}

export default Products