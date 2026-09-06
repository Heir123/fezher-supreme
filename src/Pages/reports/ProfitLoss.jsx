import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Download,
  Printer,
  Filter,
  ChevronDown,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './ProfitLoss.css'

function ProfitLoss() {
  const { formatCurrency, currency } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('monthly')
  const [dateRange, setDateRange] = useState({
    start: '2026-08-31',
    end: '2026-09-29'
  })
  const [report, setReport] = useState({
    revenue: 2999.99,
    expenses: 1200.00,
    profit: 1799.99,
    margin: 60.0,
    revenueData: [
      { category: 'Sales', amount: 2500.00 },
      { category: 'Services', amount: 499.99 }
    ],
    expenseData: [
      { category: 'Rent', amount: 1200.00 },
      { category: 'Utilities', amount: 250.00 },
      { category: 'Office Supplies', amount: 150.00 },
      { category: 'Marketing', amount: 300.00 }
    ]
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className="profitloss-loading">
        <div className="profitloss-loading-spinner"></div>
        <p className="profitloss-loading-text">Loading report...</p>
      </div>
    )
  }

  return (
    <div className="profitloss">
      {/* Header */}
      <div className="profitloss-header">
        <div>
          <div className="profitloss-badge">
            <div className="profitloss-badge-icon">
              <TrendingUp size={16} color="white" />
            </div>
            <span className="profitloss-badge-text">PROFIT & LOSS</span>
          </div>
          <h1 className="profitloss-title">Profit & Loss Report</h1>
          <p className="profitloss-subtitle">Track your business profitability. Currency: {currency}</p>
        </div>
        <div className="profitloss-actions">
          <div className="profitloss-period-selector">
            <button 
              className={`period-btn ${period === 'weekly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('weekly')}
            >
              Week
            </button>
            <button 
              className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('monthly')}
            >
              Month
            </button>
            <button 
              className={`period-btn ${period === 'quarterly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('quarterly')}
            >
              Quarter
            </button>
            <button 
              className={`period-btn ${period === 'yearly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('yearly')}
            >
              Year
            </button>
          </div>
          <button className="profitloss-export-btn">
            <Download size={16} />
            Export
          </button>
          <button className="profitloss-print-btn">
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="profitloss-summary">
        <div className="summary-card summary-card-revenue">
          <div className="summary-card-icon">
            <DollarSign size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Total Revenue</p>
            <p className="summary-card-value revenue-amount">{formatCurrency(report.revenue)}</p>
            <div className="summary-card-change positive">
              <ArrowUpRight size={14} />
              12.5% from last period
            </div>
          </div>
        </div>

        <div className="summary-card summary-card-expenses">
          <div className="summary-card-icon">
            <TrendingDown size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Total Expenses</p>
            <p className="summary-card-value expense-amount">{formatCurrency(report.expenses)}</p>
            <div className="summary-card-change negative">
              <ArrowDownRight size={14} />
              8.3% from last period
            </div>
          </div>
        </div>

        <div className="summary-card summary-card-profit">
          <div className="summary-card-icon">
            <TrendingUp size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Net Profit</p>
            <p className={`summary-card-value profit-amount ${report.profit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(report.profit)}
            </p>
            <div className={`summary-card-change ${report.profit >= 0 ? 'positive' : 'negative'}`}>
              {report.profit >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              15.2% from last period
            </div>
          </div>
        </div>

        <div className="summary-card summary-card-margin">
          <div className="summary-card-icon">
            <BarChart3 size={24} color="white" />
          </div>
          <div className="summary-card-content">
            <p className="summary-card-label">Profit Margin</p>
            <p className="summary-card-value margin-value">{report.margin.toFixed(1)}%</p>
            <div className="summary-card-change positive">
              <ArrowUpRight size={14} />
              2.4% from last period
            </div>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="profitloss-daterange">
        <div className="profitloss-daterange-content">
          <Calendar size={18} className="daterange-icon" />
          <span>Report Period: </span>
          <span className="daterange-dates">
            {dateRange.start} to {dateRange.end}
          </span>
          <span className="daterange-separator">|</span>
          <span>Currency: {currency}</span>
        </div>
        <button className="profitloss-filter-btn">
          <Filter size={16} />
          Filter
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Charts Section */}
      <div className="profitloss-charts">
        {/* Revenue Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Revenue Breakdown</h3>
            <span className="chart-card-subtitle">By category</span>
          </div>
          <div className="chart-placeholder">
            <div className="chart-placeholder-content">
              <PieChart size={48} className="chart-placeholder-icon" />
              <p>Revenue Chart Coming Soon</p>
              <span>Connect your data source to see revenue breakdown</span>
            </div>
          </div>
          <div className="chart-legend">
            {report.revenueData.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: ['#3b82f6', '#8b5cf6'][index] }}></span>
                <span className="legend-label">{item.category}</span>
                <span className="legend-amount">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Expenses Breakdown</h3>
            <span className="chart-card-subtitle">By category</span>
          </div>
          <div className="chart-placeholder">
            <div className="chart-placeholder-content">
              <PieChart size={48} className="chart-placeholder-icon" />
              <p>Expenses Chart Coming Soon</p>
              <span>Connect your data source to see expenses breakdown</span>
            </div>
          </div>
          <div className="chart-legend">
            {report.expenseData.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-dot" style={{ 
                  backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#8b5cf6'][index] 
                }}></span>
                <span className="legend-label">{item.category}</span>
                <span className="legend-amount">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="profitloss-footer">
        <div className="profitloss-footer-content">
          <span className="profitloss-footer-text">© 2026 Fezher Supreme · Profit & Loss Report</span>
          <span className="profitloss-footer-currency">Currency: {currency}</span>
          <div className="profitloss-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProfitLoss