 import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import './Dashboard.css'

function Dashboard() {
  const { formatCurrency, currency } = useCurrency()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalSales: 0,
    lowStockItems: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalProducts: 2,
        totalRevenue: 720.00,
        totalSales: 8,
        lowStockItems: 1
      })
      setRecentActivity([
        { id: 1, description: 'New order #1234', amount: 45.00, time: '2 min ago', icon: '🛒' },
        { id: 2, description: 'Product "Widget Pro" added', amount: null, time: '15 min ago', icon: '📦' },
        { id: 3, description: 'Monthly revenue target reached', amount: 720.00, time: '1 hour ago', icon: '💰' },
        { id: 4, description: 'Low stock alert: Item X', amount: null, time: '3 hours ago', icon: '⚠️' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const StatCard = ({ icon: Icon, label, value, subtext, change, trend, color }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div>
          <p className="stat-label">{label}</p>
          <div className="stat-value-wrapper">
            <h3 className="stat-value">
              {typeof value === 'number' && label.includes('Revenue') ? formatCurrency(value) : value}
            </h3>
            {change && (
              <span className={`stat-change ${trend === 'up' ? 'stat-change-up' : 'stat-change-down'}`}>
                {trend === 'up' ? <ArrowUpRight className="stat-change-icon" /> : <ArrowDownRight className="stat-change-icon" />}
                {change}%
              </span>
            )}
          </div>
          {subtext && <p className="stat-subtext">{subtext}</p>}
        </div>
        <div className={`stat-icon-wrapper ${color}`}>
          <Icon className="stat-icon" />
        </div>
      </div>
    </div>
  )

  const QuickActionCard = ({ icon, label, description, link, color }) => (
    <Link to={link} className="quick-action-card">
      <div className="quick-action-content">
        <div className={`quick-action-icon ${color}`}>
          <span>{icon}</span>
        </div>
        <div className="quick-action-text">
          <h4 className="quick-action-label">{label}</h4>
          <p className="quick-action-description">{description}</p>
        </div>
        <ArrowUpRight className="quick-action-arrow" />
      </div>
    </Link>
  )

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-badge">
            <div className="dashboard-badge-icon">
              <Activity className="dashboard-badge-icon-svg" />
            </div>
            <span className="dashboard-badge-text">BUSINESS INTELLIGENCE</span>
          </div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Here's an overview of your business performance.</p>
          <p className="dashboard-currency-info">Currency: {currency}</p>
        </div>
        <div className="dashboard-actions">
          <div className="dashboard-date">
            <Calendar className="dashboard-date-icon" />
            <span>Last 30 days</span>
          </div>
          <button className="dashboard-refresh-btn">
            <BarChart3 className="dashboard-refresh-icon" />
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          subtext="Products in your catalog"
          change="12"
          trend="up"
          color="stat-color-blue"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats.totalRevenue}
          subtext="Revenue generated"
          change="8.2"
          trend="up"
          color="stat-color-green"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Sales"
          value={stats.totalSales}
          subtext="Completed sales"
          change="3.1"
          trend="up"
          color="stat-color-purple"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={stats.lowStockItems}
          subtext="Items need attention"
          change="2"
          trend="down"
          color="stat-color-orange"
        />
      </div>

      <div className="quick-stats">
        {[
          { label: 'Products', value: stats.totalProducts, icon: '📦', color: 'quick-stat-blue' },
          { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', color: 'quick-stat-green' },
          { label: 'Sales', value: stats.totalSales, icon: '🛒', color: 'quick-stat-purple' },
          { label: 'Stock Alerts', value: stats.lowStockItems, icon: '⚠️', color: 'quick-stat-orange' }
        ].map((item, index) => (
          <div key={index} className="quick-stat">
            <div className={`quick-stat-icon-wrapper ${item.color}`}>
              <span className="quick-stat-icon">{item.icon}</span>
            </div>
            <div>
              <p className="quick-stat-label">{item.label}</p>
              <p className="quick-stat-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Common tasks to manage your business</p>
          </div>
          <button className="section-view-all">View All</button>
        </div>
        <div className="quick-actions-grid">
          <QuickActionCard
            icon="📦"
            label="Manage Products"
            description="Add, edit or remove products"
            link="/products"
            color="quick-action-blue"
          />
          <QuickActionCard
            icon="🛒"
            label="View Sales"
            description="Review your sales history"
            link="/sales"
            color="quick-action-purple"
          />
          <QuickActionCard
            icon="📊"
            label="Check Inventory"
            description="Monitor stock levels"
            link="/inventory"
            color="quick-action-orange"
          />
        </div>
      </div>

      <div className="recent-activity-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Activity</h2>
            <p className="section-subtitle">Latest updates from your business</p>
          </div>
          <button className="section-view-all">View All</button>
        </div>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon-wrapper">
                <span className="activity-icon">{activity.icon}</span>
              </div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                {activity.amount !== null && (
                  <p className="activity-amount">{formatCurrency(activity.amount)}</p>
                )}
              </div>
              <div className="activity-time">
                <Clock className="activity-time-icon" />
                <span className="activity-time-text">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="welcome-banner">
        <div className="welcome-banner-decoration"></div>
        <div className="welcome-banner-decoration2"></div>
        <div className="welcome-banner-content">
          <div>
            <div className="welcome-banner-greeting">
              <span className="welcome-banner-emoji">👋</span>
              <span className="welcome-banner-welcome">Welcome back!</span>
            </div>
            <h3 className="welcome-banner-title">Fezher Supreme</h3>
            <p className="welcome-banner-description">
              This is your all-in-one business management platform.
            </p>
          </div>
          <div className="welcome-banner-actions">
            <button className="welcome-banner-skip">Skip Tour</button>
            <button className="welcome-banner-next">Next →</button>
          </div>
        </div>
        <div className="welcome-banner-progress">
          <div className="welcome-banner-progress-bar">
            <div className="welcome-banner-progress-fill" />
          </div>
          <span className="welcome-banner-progress-text">Step 1 of 8</span>
        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="dashboard-footer-content">
          <div className="dashboard-footer-left">
            <span>© 2026 Fezher Supreme</span>
            <span className="dashboard-footer-separator">·</span>
            <span>v2.0.0</span>
            <span className="dashboard-footer-separator">·</span>
            <span>Currency: {currency}</span>
          </div>
          <div className="dashboard-footer-right">
            <a href="#" className="dashboard-footer-link">Privacy</a>
            <a href="#" className="dashboard-footer-link">Terms</a>
            <a href="#" className="dashboard-footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard