import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Pause,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Send,
  X,
  Calendar
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'
import './EmailReports.css'

function EmailReports() {
  const { formatCurrency, currency } = useCurrency()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    type: 'profit-loss',
    scheduledFor: '',
    frequency: 'monthly',
    status: 'pending'
  })

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setTimeout(() => {
      setReports([
        { 
          id: 1, 
          email: 'admin@fezher.com', 
          type: 'profit-loss', 
          scheduledFor: null, 
          frequency: 'monthly',
          status: 'pending',
          createdAt: '2026-09-06'
        },
        { 
          id: 2, 
          email: 'admin@fezher.com', 
          type: 'cash-flow', 
          scheduledFor: '2026-09-10T09:00:00', 
          frequency: 'weekly',
          status: 'scheduled',
          createdAt: '2026-09-05'
        },
        { 
          id: 3, 
          email: 'admin@fezher.com', 
          type: 'inventory', 
          scheduledFor: null, 
          frequency: 'monthly',
          status: 'pending',
          createdAt: '2026-09-04'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusInfo = (status) => {
    const statuses = {
      'pending': { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
      'sent': { label: 'Sent', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle },
      'scheduled': { label: 'Scheduled', color: '#3b82f6', bg: '#eff6ff', icon: Calendar },
      'cancelled': { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', icon: XCircle }
    }
    return statuses[status] || statuses['pending']
  }

  const getTypeLabel = (type) => {
    const types = {
      'profit-loss': 'Profit & Loss',
      'cash-flow': 'Cash Flow',
      'budget': 'Budget Report',
      'sales': 'Sales Report',
      'inventory': 'Inventory Report',
      'expenses': 'Expenses Report',
      'customers': 'Customers Report'
    }
    return types[type] || type
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleString()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingReport) {
      setReports(reports.map(r => 
        r.id === editingReport.id ? { ...r, ...formData } : r
      ))
    } else {
      setReports([...reports, {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }])
    }
    setShowModal(false)
    setEditingReport(null)
    setFormData({ email: '', type: 'profit-loss', scheduledFor: '', frequency: 'monthly', status: 'pending' })
  }

  const handleEdit = (report) => {
    setEditingReport(report)
    setFormData({
      email: report.email,
      type: report.type,
      scheduledFor: report.scheduledFor || '',
      frequency: report.frequency || 'monthly',
      status: report.status
    })
    setShowModal(true)
    setShowActionMenu(null)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      setReports(reports.filter(r => r.id !== id))
      setShowActionMenu(null)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ))
    setShowActionMenu(null)
  }

  const filteredReports = reports.filter(r => 
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="email-reports-loading">
        <div className="email-reports-loading-spinner"></div>
        <p className="email-reports-loading-text">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="email-reports">
      {/* Header */}
      <div className="email-reports-header">
        <div>
          <div className="email-reports-badge">
            <div className="email-reports-badge-icon">
              <Mail size={16} color="white" />
            </div>
            <span className="email-reports-badge-text">EMAIL REPORTS</span>
          </div>
          <h1 className="email-reports-title">Email Reports</h1>
          <p className="email-reports-subtitle">Schedule and manage email reports. Currency: {currency}</p>
        </div>
        <button className="email-reports-add-btn" onClick={() => { setEditingReport(null); setFormData({ email: '', type: 'profit-loss', scheduledFor: '', frequency: 'monthly', status: 'pending' }); setShowModal(true) }}>
          <Plus size={16} />
          Schedule Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="email-reports-summary">
        <div className="report-stat">
          <span className="report-stat-value">{reports.length}</span>
          <span className="report-stat-label">Total Reports</span>
        </div>
        <div className="report-stat">
          <span className="report-stat-value">{reports.filter(r => r.status === 'pending').length}</span>
          <span className="report-stat-label">Pending</span>
        </div>
        <div className="report-stat">
          <span className="report-stat-value">{reports.filter(r => r.status === 'scheduled').length}</span>
          <span className="report-stat-label">Scheduled</span>
        </div>
        <div className="report-stat">
          <span className="report-stat-value">{reports.filter(r => r.status === 'sent').length}</span>
          <span className="report-stat-label">Sent</span>
        </div>
      </div>

      {/* Filters */}
      <div className="email-reports-filters">
        <div className="email-reports-search">
          <Search size={18} className="email-reports-search-icon" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="email-reports-search-input"
          />
        </div>
        <div className="email-reports-filter-group">
          <button className="email-reports-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
          <button className="email-reports-filter-btn">
            <Filter size={16} />
            Type
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="email-reports-table-wrapper">
        <table className="email-reports-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Report Type</th>
              <th>Frequency</th>
              <th>Scheduled For</th>
              <th>Status</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => {
              const statusInfo = getStatusInfo(report.status)
              const StatusIcon = statusInfo.icon
              return (
                <tr key={report.id}>
                  <td>
                    <div className="report-email">
                      <Mail size={14} className="report-email-icon" />
                      <span>{report.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="report-type">{getTypeLabel(report.type)}</span>
                  </td>
                  <td>
                    <span className="report-frequency">{report.frequency || 'Monthly'}</span>
                  </td>
                  <td className="report-scheduled">
                    {formatDate(report.scheduledFor)}
                  </td>
                  <td>
                    <span className="report-status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="table-actions">
                    <div className="action-dropdown">
                      <button 
                        className="action-btn more"
                        onClick={() => setShowActionMenu(showActionMenu === report.id ? null : report.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {showActionMenu === report.id && (
                        <div className="action-menu">
                          <button onClick={() => handleEdit(report)}>
                            <Edit size={14} />
                            Edit
                          </button>
                          {report.status === 'pending' && (
                            <button onClick={() => handleStatusChange(report.id, 'sent')}>
                              <Send size={14} />
                              Send Now
                            </button>
                          )}
                          {report.status === 'pending' && (
                            <button onClick={() => handleStatusChange(report.id, 'scheduled')}>
                              <Calendar size={14} />
                              Schedule
                            </button>
                          )}
                          {report.status === 'scheduled' && (
                            <button onClick={() => handleStatusChange(report.id, 'pending')}>
                              <Pause size={14} />
                              Cancel Schedule
                            </button>
                          )}
                          <button className="danger" onClick={() => handleDelete(report.id)}>
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="email-reports-stats">
        <span className="email-reports-stats-text">
          Showing {filteredReports.length} of {reports.length} reports · Currency: {currency}
        </span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingReport ? 'Edit Scheduled Report' : 'Schedule New Report'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Report Type</label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="profit-loss">Profit & Loss</option>
                    <option value="cash-flow">Cash Flow</option>
                    <option value="budget">Budget Report</option>
                    <option value="sales">Sales Report</option>
                    <option value="inventory">Inventory Report</option>
                    <option value="expenses">Expenses Report</option>
                    <option value="customers">Customers Report</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select
                    className="form-input"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                />
                <small className="form-hint">Leave empty to send immediately</small>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingReport ? 'Update Report' : 'Schedule Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="email-reports-footer">
        <div className="email-reports-footer-content">
          <span className="email-reports-footer-text">© 2026 Fezher Supreme · Email Reports</span>
          <span className="email-reports-footer-currency">Currency: {currency}</span>
          <div className="email-reports-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default EmailReports