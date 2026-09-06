 import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  ChevronDown,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  DollarSign,
  AlertCircle,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './BankReconciliation.css'

function BankReconciliation() {
  const { formatCurrency, currency } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'income',
    status: 'pending',
    reference: ''
  })

  useEffect(() => {
    setTimeout(() => {
      setTransactions([
        { 
          id: 1, 
          date: '2026-09-05', 
          description: 'Sales Revenue', 
          amount: 4500.00, 
          type: 'income', 
          status: 'reconciled',
          reference: 'INV-001',
          bank: 'Chase Bank'
        },
        { 
          id: 2, 
          date: '2026-09-04', 
          description: 'Service Payment', 
          amount: 1200.00, 
          type: 'income', 
          status: 'pending',
          reference: 'INV-002',
          bank: 'Chase Bank'
        },
        { 
          id: 3, 
          date: '2026-09-03', 
          description: 'Office Rent', 
          amount: 1200.00, 
          type: 'expense', 
          status: 'reconciled',
          reference: 'RENT-09',
          bank: 'Chase Bank'
        },
        { 
          id: 4, 
          date: '2026-09-02', 
          description: 'Utilities Payment', 
          amount: 250.00, 
          type: 'expense', 
          status: 'pending',
          reference: 'UTIL-09',
          bank: 'Chase Bank'
        },
        { 
          id: 5, 
          date: '2026-09-01', 
          description: 'Office Supplies', 
          amount: 150.00, 
          type: 'expense', 
          status: 'reconciled',
          reference: 'SUP-09',
          bank: 'Chase Bank'
        },
        { 
          id: 6, 
          date: '2026-08-28', 
          description: 'Marketing Campaign', 
          amount: 300.00, 
          type: 'expense', 
          status: 'reconciled',
          reference: 'MKT-08',
          bank: 'Chase Bank'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? { ...t, ...formData, amount: parseFloat(formData.amount) } : t
      ))
    } else {
      setTransactions([...transactions, {
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount),
        bank: 'Chase Bank'
      }])
    }
    setShowModal(false)
    setEditingTransaction(null)
    setFormData({ date: '', description: '', amount: '', type: 'income', status: 'pending', reference: '' })
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      status: transaction.status,
      reference: transaction.reference || ''
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    ))
  }

  const getStatusInfo = (status) => {
    const statuses = {
      'reconciled': { label: 'Reconciled', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle },
      'pending': { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
      'unmatched': { label: 'Unmatched', color: '#ef4444', bg: '#fef2f2', icon: AlertCircle }
    }
    return statuses[status] || statuses['pending']
  }

  const getTypeInfo = (type) => {
    const types = {
      'income': { label: 'Income', color: '#10b981', bg: '#ecfdf5' },
      'expense': { label: 'Expense', color: '#ef4444', bg: '#fef2f2' },
      'transfer': { label: 'Transfer', color: '#3b82f6', bg: '#eff6ff' }
    }
    return types[type] || types['income']
  }

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = selectedFilter === 'all' || t.status === selectedFilter
    return matchSearch && matchFilter
  })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const reconciledCount = transactions.filter(t => t.status === 'reconciled').length
  const pendingCount = transactions.filter(t => t.status === 'pending').length

  if (loading) {
    return (
      <div className="bank-reconciliation-loading">
        <div className="bank-reconciliation-loading-spinner"></div>
        <p className="bank-reconciliation-loading-text">Loading transactions...</p>
      </div>
    )
  }

  return (
    <div className="bank-reconciliation">
      {/* Header */}
      <div className="bank-reconciliation-header">
        <div>
          <div className="bank-reconciliation-badge">
            <div className="bank-reconciliation-badge-icon">
              <Building2 size={16} color="white" />
            </div>
            <span className="bank-reconciliation-badge-text">BANK RECONCILIATION</span>
          </div>
          <h1 className="bank-reconciliation-title">Bank Reconciliation</h1>
          <p className="bank-reconciliation-subtitle">Reconcile your bank transactions. Currency: {currency}</p>
        </div>
        <div className="bank-reconciliation-actions">
          <button className="bank-reconciliation-export-btn">
            <Download size={16} />
            Export
          </button>
          <button className="bank-reconciliation-refresh-btn">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button 
            className="bank-reconciliation-add-btn"
            onClick={() => {
              setEditingTransaction(null)
              setFormData({ date: '', description: '', amount: '', type: 'income', status: 'pending', reference: '' })
              setShowModal(true)
            }}
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bank-reconciliation-summary">
        <div className="bank-stat">
          <div className="bank-stat-icon bank-stat-green">
            <CheckCircle size={20} color="white" />
          </div>
          <div>
            <p className="bank-stat-label">Reconciled</p>
            <p className="bank-stat-value">{reconciledCount}</p>
          </div>
        </div>
        <div className="bank-stat">
          <div className="bank-stat-icon bank-stat-orange">
            <Clock size={20} color="white" />
          </div>
          <div>
            <p className="bank-stat-label">Pending</p>
            <p className="bank-stat-value">{pendingCount}</p>
          </div>
        </div>
        <div className="bank-stat">
          <div className="bank-stat-icon bank-stat-blue">
            <DollarSign size={20} color="white" />
          </div>
          <div>
            <p className="bank-stat-label">Total Income</p>
            <p className="bank-stat-value">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="bank-stat">
          <div className="bank-stat-icon bank-stat-red">
            <ArrowDownRight size={20} color="white" />
          </div>
          <div>
            <p className="bank-stat-label">Total Expenses</p>
            <p className="bank-stat-value">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bank-reconciliation-filters">
        <div className="bank-reconciliation-search">
          <Search size={18} className="bank-reconciliation-search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bank-reconciliation-search-input"
          />
        </div>
        <div className="bank-reconciliation-filter-group">
          <select 
            className="bank-reconciliation-filter-select"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="reconciled">Reconciled</option>
            <option value="pending">Pending</option>
            <option value="unmatched">Unmatched</option>
          </select>
          <button className="bank-reconciliation-filter-btn">
            <Calendar size={16} />
            Date Range
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bank-reconciliation-table-wrapper">
        <table className="bank-reconciliation-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Reference</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction.status)
              const typeInfo = getTypeInfo(transaction.type)
              const StatusIcon = statusInfo.icon
              return (
                <tr key={transaction.id}>
                  <td className="transaction-date">{transaction.date}</td>
                  <td className="transaction-description">{transaction.description}</td>
                  <td className="transaction-reference">{transaction.reference || 'N/A'}</td>
                  <td>
                    <span className="transaction-type" style={{ background: typeInfo.bg, color: typeInfo.color }}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span className="transaction-status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="table-actions">
                    <div className="action-dropdown">
                      <button 
                        className="action-btn more"
                        onClick={() => {
                          if (transaction.status === 'pending') {
                            handleStatusChange(transaction.id, 'reconciled')
                          } else if (transaction.status === 'reconciled') {
                            handleStatusChange(transaction.id, 'pending')
                          }
                        }}
                      >
                        {transaction.status === 'pending' ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                      </button>
                      <button className="action-btn edit" onClick={() => handleEdit(transaction)}>
                        <Edit size={14} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(transaction.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="bank-reconciliation-stats">
        <span className="bank-reconciliation-stats-text">
          Showing {filteredTransactions.length} of {transactions.length} transactions · Currency: {currency}
        </span>
        <div className="bank-reconciliation-stats-details">
          <span>Reconciled: {reconciledCount}</span>
          <span>Pending: {pendingCount}</span>
          <span>Income: {formatCurrency(totalIncome)}</span>
          <span>Expenses: {formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Transaction description"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount ({currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reference</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    placeholder="INV-001"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="reconciled">Reconciled</option>
                    <option value="unmatched">Unmatched</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bank-reconciliation-footer">
        <div className="bank-reconciliation-footer-content">
          <span className="bank-reconciliation-footer-text">© 2026 Fezher Supreme · Bank Reconciliation</span>
          <span className="bank-reconciliation-footer-currency">Currency: {currency}</span>
          <div className="bank-reconciliation-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BankReconciliation