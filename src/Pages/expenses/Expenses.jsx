 import React, { useState, useEffect } from 'react'
import { 
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  MoreHorizontal,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './Expenses.css'

function Expenses() {
  const { formatCurrency, currency } = useCurrency()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    expense_date: '',
    payment_method: ''
  })

  useEffect(() => {
    setTimeout(() => {
      setExpenses([
        { id: 1, category: 'Office Supplies', amount: 150.00, description: 'Printer paper and ink', expense_date: '2026-09-05', payment_method: 'Credit Card' },
        { id: 2, category: 'Utilities', amount: 250.00, description: 'Electricity bill', expense_date: '2026-09-04', payment_method: 'Bank Transfer' },
        { id: 3, category: 'Rent', amount: 1200.00, description: 'Monthly office rent', expense_date: '2026-09-01', payment_method: 'Bank Transfer' },
        { id: 4, category: 'Marketing', amount: 300.00, description: 'Social media ads', expense_date: '2026-08-28', payment_method: 'Credit Card' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingExpense) {
      setExpenses(expenses.map(p => 
        p.id === editingExpense.id ? { ...p, ...formData, amount: parseFloat(formData.amount) } : p
      ))
    } else {
      setExpenses([...expenses, {
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount)
      }])
    }
    setShowModal(false)
    setEditingExpense(null)
    setFormData({ category: '', amount: '', description: '', expense_date: '', payment_method: '' })
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      expense_date: expense.expense_date,
      payment_method: expense.payment_method
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(p => p.id !== id))
    }
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (loading) {
    return (
      <div className="expenses-loading">
        <div className="expenses-loading-spinner"></div>
        <p className="expenses-loading-text">Loading expenses...</p>
      </div>
    )
  }

  return (
    <div className="expenses">
      {/* Header */}
      <div className="expenses-header">
        <div>
          <div className="expenses-badge">
            <div className="expenses-badge-icon">
              <DollarSign size={16} color="white" />
            </div>
            <span className="expenses-badge-text">EXPENSES</span>
          </div>
          <h1 className="expenses-title">Expenses</h1>
          <p className="expenses-subtitle">Track your business expenses. Currency: {currency}</p>
          <p className="expenses-total">Total Expenses: {formatCurrency(totalExpenses)}</p>
        </div>
        <button className="expenses-add-btn" onClick={() => { setEditingExpense(null); setFormData({ category: '', amount: '', description: '', expense_date: '', payment_method: '' }); setShowModal(true) }}>
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Summary Stats */}
      <div className="expenses-summary">
        <div className="expense-stat">
          <span className="expense-stat-value">{expenses.length}</span>
          <span className="expense-stat-label">Total Expenses</span>
        </div>
        <div className="expense-stat">
          <span className="expense-stat-value">{formatCurrency(totalExpenses)}</span>
          <span className="expense-stat-label">Total Amount</span>
        </div>
        <div className="expense-stat">
          <span className="expense-stat-value">{new Set(expenses.map(e => e.category)).size}</span>
          <span className="expense-stat-label">Categories</span>
        </div>
        <div className="expense-stat">
          <span className="expense-stat-value">{formatCurrency(totalExpenses / expenses.length || 0)}</span>
          <span className="expense-stat-label">Average Expense</span>
        </div>
      </div>

      {/* Filters */}
      <div className="expenses-filters">
        <div className="expenses-search">
          <Search size={18} className="expenses-search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="expenses-search-input"
          />
        </div>
        <div className="expenses-filter-group">
          <button className="expenses-filter-btn">
            <Filter size={16} />
            Category
            <ChevronDown size={14} />
          </button>
          <button className="expenses-filter-btn">
            <Filter size={16} />
            Date
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="expenses-table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <span className="expense-category">{expense.category}</span>
                </td>
                <td className="expense-description">{expense.description}</td>
                <td className="expense-amount">{formatCurrency(expense.amount)}</td>
                <td className="expense-date">{expense.expense_date}</td>
                <td className="expense-payment">{expense.payment_method}</td>
                <td className="table-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(expense)}>
                    <Edit size={14} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(expense.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="expenses-stats">
        <span className="expenses-stats-text">
          Showing {filteredExpenses.length} of {expenses.length} expenses · Currency: {currency}
        </span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Office Supplies"
                  required
                />
              </div>
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
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Expense description..."
                  rows={2}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.expense_date}
                    onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-input"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="expenses-footer">
        <div className="expenses-footer-content">
          <span className="expenses-footer-text">© 2026 Fezher Supreme · Expense Management</span>
          <span className="expenses-footer-currency">Currency: {currency}</span>
          <div className="expenses-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Expenses