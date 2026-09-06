import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  UserPlus,
  Star
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import './Customers.css'

function Customers() {
  const { formatCurrency, currency } = useCurrency()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setCustomers([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', totalSpent: 899.97, orders: 5, joined: '2025-06-15', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0102', totalSpent: 449.50, orders: 3, joined: '2025-07-20', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 555-0103', totalSpent: 179.98, orders: 2, joined: '2025-08-01', status: 'inactive' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 555-0104', totalSpent: 1349.00, orders: 7, joined: '2025-05-10', status: 'active' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1 555-0105', totalSpent: 299.99, orders: 2, joined: '2025-09-01', status: 'active' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="customers-loading">
        <div className="customers-loading-spinner"></div>
        <p className="customers-loading-text">Loading customers...</p>
      </div>
    )
  }

  return (
    <div className="customers">
      {/* Header */}
      <div className="customers-header">
        <div>
          <div className="customers-badge">
            <div className="customers-badge-icon">
              <Users size={16} color="white" />
            </div>
            <span className="customers-badge-text">CUSTOMERS</span>
          </div>
          <h1 className="customers-title">Customers</h1>
          <p className="customers-subtitle">Manage your customer relationships. Currency: {currency}</p>
        </div>
        <button className="customers-add-btn">
          <UserPlus size={16} />
          Add Customer
        </button>
      </div>

      {/* Summary */}
      <div className="customers-summary">
        <div className="customer-stat">
          <span className="customer-stat-value">5</span>
          <span className="customer-stat-label">Total Customers</span>
        </div>
        <div className="customer-stat">
          <span className="customer-stat-value">4</span>
          <span className="customer-stat-label">Active</span>
        </div>
        <div className="customer-stat">
          <span className="customer-stat-value">1</span>
          <span className="customer-stat-label">Inactive</span>
        </div>
        <div className="customer-stat">
          <span className="customer-stat-value">{formatCurrency(3178.44)}</span>
          <span className="customer-stat-label">Total Revenue</span>
        </div>
      </div>

      {/* Filters */}
      <div className="customers-filters">
        <div className="customers-search">
          <Search size={18} className="customers-search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="customers-search-input"
          />
        </div>
        <div className="customers-filter-group">
          <button className="customers-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Total Spent</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-cell">
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="customer-name">{customer.name}</span>
                  </div>
                </td>
                <td>
                  <div className="customer-contact">
                    <Mail size={14} />
                    <span>{customer.email}</span>
                  </div>
                  <div className="customer-contact">
                    <Phone size={14} />
                    <span>{customer.phone}</span>
                  </div>
                </td>
                <td className="customer-spent">{formatCurrency(customer.totalSpent)}</td>
                <td className="customer-orders">{customer.orders}</td>
                <td className="customer-joined">{customer.joined}</td>
                <td>
                  <span className={`customer-status ${customer.status}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="action-btn view">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="customers-stats">
        <span className="customers-stats-text">
          Showing {customers.length} customers · Currency: {currency}
        </span>
      </div>

      {/* Footer */}
      <footer className="customers-footer">
        <div className="customers-footer-content">
          <span className="customers-footer-text">© 2026 Fezher Supreme · Customer Management</span>
          <span className="customers-footer-currency">Currency: {currency}</span>
          <div className="customers-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Customers