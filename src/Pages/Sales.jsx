import React, { useState, useEffect } from 'react'
import { salesService } from '../services/salesService'
import { exportService } from '../services/exportService'
import { notificationService } from '../services/notificationService'
import Button from '../components/common/Button'
import SaleModal from '../components/sales/SaleModal'
import SaleDetails from '../components/sales/SaleDetails'
import ExportButtons from '../components/common/ExportButtons'
import RoleBasedAccess from '../components/common/RoleBasedAccess'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/helpers'

const Sales = () => {
  const { isAdmin, isManager } = useAuth()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await salesService.getSales()
      if (error) throw new Error(error)
      setSales(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSale = async (saleData) => {
    const { data, error } = await salesService.createSale(saleData)
    if (error) throw new Error(error)
    setSales([data, ...sales])
    loadSales()
    notificationService.saleCreated(data?.invoice_number || 'New Sale')
  }

  const handleViewSale = (sale) => {
    setSelectedSale(sale)
    setIsDetailsOpen(true)
  }

  const handleEditSale = (sale) => {
    setSelectedSale(sale)
    setIsModalOpen(true)
  }

  const handleDeleteSale = async (id) => {
    if (!confirm('Are you sure you want to delete this sale?')) return
    try {
      const sale = sales.find(s => s.id === id)
      const { error } = await salesService.deleteSale(id)
      if (error) throw new Error(error)
      setSales(sales.filter(s => s.id !== id))
      notificationService.saleDeleted(sale?.invoice_number || 'Sale')
    } catch (err) {
      notificationService.error('Failed to delete sale', err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-green-800 bg-green-100'
      case 'completed': return 'text-green-800 bg-green-100'
      case 'pending': return 'text-yellow-800 bg-yellow-100'
      case 'cancelled': return 'text-red-800 bg-red-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  // Export functions
  const exportSalesAsExcel = () => {
    exportService.exportSalesToExcel(sales)
  }

  const printSalesReport = () => {
    const tableElement = document.querySelector('.sales-table')
    if (tableElement) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = `
        <div class="header">
          <h1>Sales Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <p>Total Sales: ${sales.length}</p>
          <p>Total Revenue: ${formatCurrency(sales.reduce((sum, s) => sum + (s.total_amount || 0), 0))}</p>
        </div>
        ${tableElement.innerHTML}
      `
      exportService.printReport(wrapper)
    }
  }

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const matchSearch = sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sale.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || sale.status?.toLowerCase() === statusFilter
    const matchDate = !dateFilter || sale.sale_date === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading sales: {error}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <div className="flex flex-wrap items-center gap-2">
          <RoleBasedAccess managerOnly>
            <Button variant="primary" onClick={() => { setSelectedSale(null); setIsModalOpen(true); }}>
              Create Sale
            </Button>
          </RoleBasedAccess>
          <RoleBasedAccess adminOnly>
            <Button variant="primary" onClick={() => { setSelectedSale(null); setIsModalOpen(true); }}>
              Create Sale
            </Button>
          </RoleBasedAccess>
          {/* If user is staff, hide the Create Sale button */}
          {!isAdmin && !isManager && (
            <Button variant="secondary" disabled className="opacity-50 cursor-not-allowed">
              Create Sale (Staff - View Only)
            </Button>
          )}
          <ExportButtons
            showImage={false}
            showPDF={false}
            onExportExcel={exportSalesAsExcel}
            onPrint={printSalesReport}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by customer or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button variant="secondary" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateFilter(''); }}>
          Clear Filters
        </Button>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 sales-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No sales found matching your filters
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.invoice_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sale.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(sale.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(sale.sale_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sale.status)}`}>
                        {sale.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex gap-1 flex-wrap">
                        <Button variant="outline" size="sm" onClick={() => handleViewSale(sale)}>View</Button>
                        <RoleBasedAccess managerOnly>
                          <Button variant="outline" size="sm" onClick={() => handleEditSale(sale)}>Edit</Button>
                        </RoleBasedAccess>
                        <RoleBasedAccess adminOnly>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteSale(sale.id)}>Delete</Button>
                        </RoleBasedAccess>
                        {/* If user is staff, show disabled buttons */}
                        {!isAdmin && !isManager && (
                          <>
                            <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed">Edit</Button>
                            <Button variant="danger" size="sm" disabled className="opacity-50 cursor-not-allowed">Delete</Button>
                          </>
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

      <SaleModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedSale(null); }}
        onSave={handleCreateSale}
        sale={selectedSale}
      />

      <SaleDetails
        sale={selectedSale}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  )
}

export default Sales