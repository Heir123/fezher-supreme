import React, { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronDown,
  Eye,
  Download,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import './Sales.css'

function Sales() {
  const { formatCurrency, currency } = useCurrency()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setSales([
        { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', date: '2026-09-03', items: 3 },
        { id: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'pending', date: '2026-09-03', items: 2 },
        { id: 'ORD-003', customer: 'Bob Johnson', amount: 89.99, status: 'completed', date: '2026-09-02', items: 1 },
        { id: 'ORD-004', customer: 'Alice Brown', amount: 449.00, status: 'processing', date: '2026-09-02', items: 4 },
        { id: 'ORD-005', customer: 'Charlie Wilson', amount: 199.99, status: 'cancelled', date: '2026-09-01', items: 2 }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusConfig = (status) => {
    const configs = {
      completed: { label: 'Completed', icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
      pending: { label: 'Pending', icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
      processing: { label: 'Processing', icon: Clock, color: '#3b82f6', bg: '#eff6ff' },
      cancelled: { label: 'Cancelled', icon: XCircle, color: '#ef4444', bg: '#fef2f2' }
    }
    return configs[status] || configs.pending
  }

  if (loading) {
    return (
      <div className="sales-loading">
        <div className="sales-loading-spinner"></div>
        <p className="sales-loading-text">Loading sales data...</p>
      </div>
    )
  }

  return (
    <div className="sales">
      {/* Header */}
      <div className="sales-header">
        <div>
          <div className="sales-badge">
            <div className="sales-badge-icon">
              <ShoppingBag size={16} color="white" />
            </div>
            <span className="sales-badge-text">SALES</span>
          </div>
          <h1 className="sales-title">Sales</h1>
          <p className="sales-subtitle">Track and manage your sales orders. Currency: {currency}</p>
        </div>
        <div className="sales-actions">
          <button className="sales-export-btn">
            <Download size={16} />
            Export
          </button>
          <button className="sales-print-btn">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="sales-summary">
        <div className="summary-card">
          <div className="summary-icon summary-icon-blue">
            <DollarSign size={20} color="white" />
          </div>
          <div>
            <p className="summary-label">Total Revenue</p>
            <p className="summary-value">{formatCurrency(1188.47)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon summary-icon-green">
            <CheckCircle size={20} color="white" />
          </div>
          <div>
            <p className="summary-label">Completed Orders</p>
            <p className="summary-value">3</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon summary-icon-orange">
            <Clock size={20} color="white" />
          </div>
          <div>
            <p className="summary-label">Pending Orders</p>
            <p className="summary-value">2</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon summary-icon-purple">
            <Users size={20} color="white" />
          </div>
          <div>
            <p className="summary-label">Total Customers</p>
            <p className="summary-value">5</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sales-filters">
        <div className="sales-search">
          <Search size={18} className="sales-search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sales-search-input"
          />
        </div>
        <div className="sales-filter-group">
          <button className="sales-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
          <button className="sales-filter-btn">
            <Calendar size={16} />
            Date Range
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sales-table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((order) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon
              return (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">{order.id}</span>
                  </td>
                  <td className="order-customer">{order.customer}</td>
                  <td className="order-date">{order.date}</td>
                  <td className="order-items">{order.items}</td>
                  <td className="order-amount">{formatCurrency(order.amount)}</td>
                  <td>
                    <span className="order-status" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                      <StatusIcon size={12} />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="action-btn view">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="sales-stats">
        <span className="sales-stats-text">
          Showing {sales.length} orders · Currency: {currency}
        </span>
      </div>

      {/* Footer */}
      <footer className="sales-footer">
        <div className="sales-footer-content">
          <span className="sales-footer-text">© 2026 Fezher Supreme · Sales Management</span>
          <span className="sales-footer-currency">Currency: {currency}</span>
          <div className="sales-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Sales