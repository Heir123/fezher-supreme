import React, { useState, useEffect } from 'react'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './CashFlow.css'

function CashFlow() {
  const { formatCurrency, currency } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('monthly')
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    netCashFlow: 0,
    openingBalance: 5000,
    closingBalance: 0
  })

  useEffect(() => {
    setTimeout(() => {
      setTransactions([
        { id: 1, description: 'Sales Revenue', amount: 4500.00, type: 'inflow', date: '2026-09-05', category: 'Revenue' },
        { id: 2, description: 'Service Income', amount: 1200.00, type: 'inflow', date: '2026-09-04', category: 'Revenue' },
        { id: 3, description: 'Office Rent', amount: 1200.00, type: 'outflow', date: '2026-09-01', category: 'Expenses' },
        { id: 4, description: 'Utilities', amount: 250.00, type: 'outflow', date: '2026-09-03', category: 'Expenses' },
        { id: 5, description: 'Office Supplies', amount: 150.00, type: 'outflow', date: '2026-09-02', category: 'Expenses' },
        { id: 6, description: 'Marketing', amount: 300.00, type: 'outflow', date: '2026-08-28', category: 'Expenses' }
      ])

      const totalInflow = transactions.reduce((sum, t) => t.type === 'inflow' ? sum + t.amount : sum, 0)
      const totalOutflow = transactions.reduce((sum, t) => t.type === 'outflow' ? sum + t.amount : sum, 0)
      
      setSummary({
        totalInflow: 4500 + 1200,
        totalOutflow: 1200 + 250 + 150 + 300,
        netCashFlow: (4500 + 1200) - (1200 + 250 + 150 + 300),
        openingBalance: 5000,
        closingBalance: 5000 + (4500 + 1200) - (1200 + 250 + 150 + 300)
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="cashflow-loading">
        <div className="cashflow-loading-spinner"></div>
        <p className="cashflow-loading-text">Loading cash flow data...</p>
      </div>
    )
  }

  return (
    <div className="cashflow">
      {/* Header */}
      <div className="cashflow-header">
        <div>
          <div className="cashflow-badge">
            <div className="cashflow-badge-icon">
              <Wallet size={16} color="white" />
            </div>
            <span className="cashflow-badge-text">CASH FLOW</span>
          </div>
          <h1 className="cashflow-title">Cash Flow</h1>
          <p className="cashflow-subtitle">Track your cash inflows and outflows. Currency: {currency}</p>
        </div>
        <div className="cashflow-actions">
          <button className="cashflow-export-btn">
            <Download size={16} />
            Export
          </button>
          <button className="cashflow-refresh-btn">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="cashflow-summary">
        <div className="summary-card summary-card-inflow">
          <div className="summary-card-icon">
            <TrendingUp size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Total Inflow</p>
            <p className="summary-card-value inflow-amount">{formatCurrency(summary.totalInflow)}</p>
          </div>
        </div>

        <div className="summary-card summary-card-outflow">
          <div className="summary-card-icon">
            <TrendingDown size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Total Outflow</p>
            <p className="summary-card-value outflow-amount">{formatCurrency(summary.totalOutflow)}</p>
          </div>
        </div>

        <div className="summary-card summary-card-net">
          <div className="summary-card-icon">
            <DollarSign size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Net Cash Flow</p>
            <p className={`summary-card-value net-amount ${summary.netCashFlow >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(summary.netCashFlow)}
            </p>
          </div>
        </div>

        <div className="summary-card summary-card-balance">
          <div className="summary-card-icon">
            <Wallet size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Closing Balance</p>
            <p className="summary-card-value balance-amount">{formatCurrency(summary.closingBalance)}</p>
          </div>
        </div>
      </div>

      {/* Balance Info */}
      <div className="cashflow-balance">
        <div className="balance-info">
          <span className="balance-label">Opening Balance</span>
          <span className="balance-value">{formatCurrency(summary.openingBalance)}</span>
        </div>
        <div className="balance-divider"></div>
        <div className="balance-info">
          <span className="balance-label">Net Cash Flow</span>
          <span className={`balance-value ${summary.netCashFlow >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(summary.netCashFlow)}
          </span>
        </div>
        <div className="balance-divider"></div>
        <div className="balance-info">
          <span className="balance-label">Closing Balance</span>
          <span className="balance-value">{formatCurrency(summary.closingBalance)}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="cashflow-transactions">
        <div className="transactions-header">
          <h3 className="transactions-title">Transaction History</h3>
          <div className="transactions-filters">
            <button className="filter-btn">
              <Filter size={16} />
              Type
              <ChevronDown size={14} />
            </button>
            <button className="filter-btn">
              <Calendar size={16} />
              Date
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th className="table-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="transaction-date">{transaction.date}</td>
                  <td className="transaction-description">{transaction.description}</td>
                  <td className="transaction-category">{transaction.category}</td>
                  <td>
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type === 'inflow' ? 'Inflow' : 'Outflow'}
                    </span>
                  </td>
                  <td className={`transaction-amount ${transaction.type}`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="table-actions">
                    <button className="action-btn view">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="cashflow-stats">
        <span className="cashflow-stats-text">
          Showing {transactions.length} transactions · Currency: {currency}
        </span>
      </div>

      {/* Footer */}
      <footer className="cashflow-footer">
        <div className="cashflow-footer-content">
          <span className="cashflow-footer-text">© 2026 Fezher Supreme · Cash Flow</span>
          <span className="cashflow-footer-currency">Currency: {currency}</span>
          <div className="cashflow-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CashFlow