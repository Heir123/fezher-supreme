 import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  ChevronDown,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import './Analytics.css'

function Analytics() {
  const { formatCurrency, currency, symbol } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [data, setData] = useState({
    revenue: { value: 45230, change: 12.5, trend: 'up' },
    orders: { value: 342, change: 8.2, trend: 'up' },
    customers: { value: 128, change: 15.3, trend: 'up' },
    conversion: { value: 3.2, change: 0.8, trend: 'down' }
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-loading-spinner"></div>
        <p className="analytics-loading-text">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="analytics">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <div className="analytics-badge">
            <div className="analytics-badge-icon">
              <BarChart3 size={16} color="white" />
            </div>
            <span className="analytics-badge-text">ANALYTICS</span>
          </div>
          <h1 className="analytics-title">Analytics</h1>
          <p className="analytics-subtitle">Track your business performance and growth metrics.</p>
          <p className="analytics-currency-info">Currency: {currency} ({symbol})</p>
        </div>
        <div className="analytics-actions">
          <div className="analytics-time-selector">
            <button className={`time-btn ${timeRange === 'week' ? 'active' : ''}`} onClick={() => setTimeRange('week')}>Week</button>
            <button className={`time-btn ${timeRange === 'month' ? 'active' : ''}`} onClick={() => setTimeRange('month')}>Month</button>
            <button className={`time-btn ${timeRange === 'quarter' ? 'active' : ''}`} onClick={() => setTimeRange('quarter')}>Quarter</button>
            <button className={`time-btn ${timeRange === 'year' ? 'active' : ''}`} onClick={() => setTimeRange('year')}>Year</button>
          </div>
          <button className="analytics-export">
            <Download size={16} />
            Export
          </button>
          <button className="analytics-refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpis">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Revenue</span>
            <div className="kpi-icon kpi-icon-green">
              <DollarSign size={20} color="white" />
            </div>
          </div>
          <div className="kpi-value">{formatCurrency(data.revenue.value)}</div>
          <div className="kpi-change kpi-change-up">
            <ArrowUpRight size={14} />
            {data.revenue.change}% from last month
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Orders</span>
            <div className="kpi-icon kpi-icon-blue">
              <ShoppingBag size={20} color="white" />
            </div>
          </div>
          <div className="kpi-value">{data.orders.value.toLocaleString()}</div>
          <div className="kpi-change kpi-change-up">
            <ArrowUpRight size={14} />
            {data.orders.change}% from last month
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Customers</span>
            <div className="kpi-icon kpi-icon-purple">
              <Users size={20} color="white" />
            </div>
          </div>
          <div className="kpi-value">{data.customers.value.toLocaleString()}</div>
          <div className="kpi-change kpi-change-up">
            <ArrowUpRight size={14} />
            {data.customers.change}% from last month
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Conversion Rate</span>
            <div className="kpi-icon kpi-icon-orange">
              <TrendingUp size={20} color="white" />
            </div>
          </div>
          <div className="kpi-value">{data.conversion.value}%</div>
          <div className="kpi-change kpi-change-down">
            <ArrowDownRight size={14} />
            {data.conversion.change}% from last month
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts">
        {/* Revenue Chart */}
        <div className="chart-card chart-card-full">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Revenue Overview</h3>
              <p className="chart-subtitle">Monthly revenue trend for the current year</p>
            </div>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <Eye size={16} />
                Details
              </button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-placeholder-content">
              <LineChart size={48} className="chart-placeholder-icon" />
              <p>Revenue Chart Coming Soon</p>
              <span>Connect your data source to see revenue trends</span>
            </div>
          </div>
        </div>

        {/* Orders & Customers */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Orders Overview</h3>
            <span className="chart-badge">+12.5%</span>
          </div>
          <div className="chart-placeholder small">
            <div className="chart-placeholder-content">
              <ShoppingBag size={32} className="chart-placeholder-icon" />
              <p>Orders Chart</p>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Customer Growth</h3>
            <span className="chart-badge">+8.2%</span>
          </div>
          <div className="chart-placeholder small">
            <div className="chart-placeholder-content">
              <Users size={32} className="chart-placeholder-icon" />
              <p>Customer Chart</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="chart-card chart-card-full">
          <div className="chart-header">
            <h3 className="chart-title">Top Products</h3>
            <span className="chart-subtitle">Best selling products this month</span>
          </div>
          <div className="top-products">
            {[
              { name: 'Product A', sales: 145, revenue: 4250, color: '#3b82f6' },
              { name: 'Product B', sales: 98, revenue: 3200, color: '#8b5cf6' },
              { name: 'Product C', sales: 76, revenue: 2800, color: '#10b981' },
              { name: 'Product D', sales: 54, revenue: 2100, color: '#f59e0b' }
            ].map((product, i) => (
              <div key={i} className="product-row">
                <div className="product-info">
                  <span className="product-rank">{i + 1}</span>
                  <span className="product-name">{product.name}</span>
                </div>
                <div className="product-stats">
                  <span className="product-sales">{product.sales} sales</span>
                  <span className="product-revenue">{formatCurrency(product.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="chart-card chart-card-full">
          <div className="chart-header">
            <h3 className="chart-title">Recent Activity</h3>
            <span className="chart-subtitle">Latest updates from your business</span>
          </div>
          <div className="activity-timeline">
            {[
              { action: 'New order #1234 placed', amount: 45.00, time: '2 min ago', icon: '🛒' },
              { action: 'Product "Widget Pro" added to inventory', amount: null, time: '15 min ago', icon: '📦' },
              { action: 'Monthly revenue target reached', amount: 720.00, time: '1 hour ago', icon: '💰' },
              { action: 'Low stock alert: Item X', amount: null, time: '3 hours ago', icon: '⚠️' }
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-icon">{item.icon}</div>
                <div className="timeline-content">
                  <p className="timeline-action">{item.action}</p>
                  {item.amount !== null && (
                    <span className="timeline-amount">{formatCurrency(item.amount)}</span>
                  )}
                </div>
                <span className="timeline-time">
                  <Clock size={12} />
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="analytics-footer">
        <div className="analytics-footer-content">
          <span className="analytics-footer-text">© 2026 Fezher Supreme · Analytics Dashboard</span>
          <span className="analytics-footer-currency">Currency: {currency} ({symbol})</span>
          <div className="analytics-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Analytics