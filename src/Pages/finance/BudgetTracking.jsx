import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  PieChart,
  BarChart3,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './BudgetTracking.css'

function BudgetTracking() {
  const { formatCurrency, currency } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [budgets, setBudgets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [formData, setFormData] = useState({
    category: '',
    allocated: '',
    spent: '',
    period: '',
    description: ''
  })

  useEffect(() => {
    setTimeout(() => {
      setBudgets([
        { 
          id: 1, 
          category: 'Marketing', 
          allocated: 5000, 
          spent: 3200, 
          period: '2026-09', 
          description: 'Q3 Marketing campaign',
          status: 'on-track'
        },
        { 
          id: 2, 
          category: 'Operations', 
          allocated: 8000, 
          spent: 7500, 
          period: '2026-09', 
          description: 'Operational expenses',
          status: 'over-budget'
        },
        { 
          id: 3, 
          category: 'R&D', 
          allocated: 3000, 
          spent: 2100, 
          period: '2026-10', 
          description: 'Research and development',
          status: 'on-track'
        },
        { 
          id: 4, 
          category: 'Sales', 
          allocated: 4000, 
          spent: 3800, 
          period: '2026-09', 
          description: 'Sales team expenses',
          status: 'near-limit'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getCurrentMonth = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingBudget) {
      setBudgets(budgets.map(b => 
        b.id === editingBudget.id ? { 
          ...b, 
          ...formData, 
          allocated: parseFloat(formData.allocated),
          spent: parseFloat(formData.spent),
          status: calculateStatus(formData.spent, formData.allocated)
        } : b
      ))
    } else {
      const newBudget = {
        id: Date.now(),
        ...formData,
        allocated: parseFloat(formData.allocated),
        spent: parseFloat(formData.spent),
        status: calculateStatus(formData.spent, formData.allocated)
      }
      setBudgets([...budgets, newBudget])
    }
    setShowModal(false)
    setEditingBudget(null)
    setFormData({ category: '', allocated: '', spent: '', period: getCurrentMonth(), description: '' })
  }

  const calculateStatus = (spent, allocated) => {
    const ratio = spent / allocated
    if (ratio >= 1) return 'over-budget'
    if (ratio >= 0.9) return 'near-limit'
    return 'on-track'
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      allocated: budget.allocated.toString(),
      spent: budget.spent.toString(),
      period: budget.period,
      description: budget.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id))
    }
  }

  const getStatusInfo = (status) => {
    const statuses = {
      'on-track': { label: 'On Track', color: '#10b981', bg: '#ecfdf5', icon: '✅' },
      'near-limit': { label: 'Near Limit', color: '#f59e0b', bg: '#fffbeb', icon: '⚠️' },
      'over-budget': { label: 'Over Budget', color: '#ef4444', bg: '#fef2f2', icon: '🚨' }
    }
    return statuses[status] || statuses['on-track']
  }

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalAllocated - totalSpent

  if (loading) {
    return (
      <div className="budget-loading">
        <div className="budget-loading-spinner"></div>
        <p className="budget-loading-text">Loading budget data...</p>
      </div>
    )
  }

  return (
    <div className="budget">
      {/* Header */}
      <div className="budget-header">
        <div>
          <div className="budget-badge">
            <div className="budget-badge-icon">
              <DollarSign size={16} color="white" />
            </div>
            <span className="budget-badge-text">BUDGET</span>
          </div>
          <h1 className="budget-title">Budget Tracking</h1>
          <p className="budget-subtitle">Manage and track your budget allocations. Currency: {currency}</p>
        </div>
        <button 
          className="budget-add-btn"
          onClick={() => {
            setEditingBudget(null)
            setFormData({ category: '', allocated: '', spent: '', period: getCurrentMonth(), description: '' })
            setShowModal(true)
          }}
        >
          <Plus size={16} />
          Add Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="budget-summary">
        <div className="budget-stat">
          <div className="budget-stat-icon budget-stat-blue">
            <DollarSign size={20} color="white" />
          </div>
          <div>
            <p className="budget-stat-label">Total Allocated</p>
            <p className="budget-stat-value">{formatCurrency(totalAllocated)}</p>
          </div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-icon budget-stat-purple">
            <TrendingDown size={20} color="white" />
          </div>
          <div>
            <p className="budget-stat-label">Total Spent</p>
            <p className="budget-stat-value">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
        <div className="budget-stat">
          <div className={`budget-stat-icon ${remaining >= 0 ? 'budget-stat-green' : 'budget-stat-red'}`}>
            <TrendingUp size={20} color="white" />
          </div>
          <div>
            <p className="budget-stat-label">Remaining</p>
            <p className={`budget-stat-value ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-icon budget-stat-orange">
            <PieChart size={20} color="white" />
          </div>
          <div>
            <p className="budget-stat-label">Utilization</p>
            <p className="budget-stat-value">
              {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="budget-filters">
        <div className="budget-search">
          <Search size={18} className="budget-search-icon" />
          <input
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="budget-search-input"
          />
        </div>
        <div className="budget-filter-group">
          <div className="budget-period-selector">
            <button 
              className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={`period-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Quarter
            </button>
            <button 
              className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
          <button className="budget-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="budget-table-wrapper">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Period</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets
              .filter(b => b.category.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((budget) => {
                const statusInfo = getStatusInfo(budget.status)
                const remaining = budget.allocated - budget.spent
                return (
                  <tr key={budget.id}>
                    <td>
                      <div className="budget-category">
                        <span className="budget-category-name">{budget.category}</span>
                        {budget.description && (
                          <span className="budget-category-desc">{budget.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="budget-period">{budget.period}</td>
                    <td className="budget-amount allocated">{formatCurrency(budget.allocated)}</td>
                    <td className="budget-amount spent">{formatCurrency(budget.spent)}</td>
                    <td className={`budget-amount remaining ${remaining < 0 ? 'negative' : ''}`}>
                      {formatCurrency(remaining)}
                    </td>
                    <td>
                      <span className="budget-status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(budget)}>
                        <Edit size={14} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(budget.id)}>
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
      <div className="budget-stats">
        <span className="budget-stats-text">
          Showing {budgets.filter(b => b.category.toLowerCase().includes(searchTerm.toLowerCase())).length} of {budgets.length} budgets · Currency: {currency}
        </span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
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
                  placeholder="e.g., Marketing"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Period (Year-Month)</label>
                <input
                  type="month"
                  className="form-input"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  required
                />
                <small className="form-hint">Select the budget period</small>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Allocated Amount ({currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.allocated}
                    onChange={(e) => setFormData({...formData, allocated: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Spent Amount ({currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.spent}
                    onChange={(e) => setFormData({...formData, spent: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
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
                  placeholder="Budget description..."
                  rows={2}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="budget-footer">
        <div className="budget-footer-content">
          <span className="budget-footer-text">© 2026 Fezher Supreme · Budget Tracking</span>
          <span className="budget-footer-currency">Currency: {currency}</span>
          <div className="budget-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BudgetTracking