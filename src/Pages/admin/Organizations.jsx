import React, { useState, useEffect, useRef } from 'react'
import { 
  Building2, 
  Users, 
  Package, 
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  X,
  Check,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import './Organizations.css'

function Organizations() {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    loadOrganizations()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActionMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadOrganizations = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/admin/organizations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }
      const data = await response.json()
      setOrganizations(data)
    } catch (error) {
      console.error('Error loading organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/organizations/${id}/deactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        loadOrganizations()
        setShowDeactivateModal(false)
        setShowActionMenu(null)
      }
    } catch (error) {
      console.error('Error deactivating organization:', error)
    }
  }

  const handleReactivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/organizations/${id}/reactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        loadOrganizations()
        setShowActionMenu(null)
      }
    } catch (error) {
      console.error('Error reactivating organization:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/organizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      if (response.ok) {
        loadOrganizations()
        setShowDeleteModal(false)
        setShowActionMenu(null)
      }
    } catch (error) {
      console.error('Error deleting organization:', error)
    }
  }

  const filteredOrgs = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name) => {
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className="orgs-loading">
        <div className="orgs-loading-spinner"></div>
        <p className="orgs-loading-text">Loading organizations...</p>
      </div>
    )
  }

  return (
    <div className="orgs">
      {/* Header */}
      <div className="orgs-header">
        <div>
          <div className="orgs-badge">
            <div className="orgs-badge-icon">
              <Building2 size={16} color="white" />
            </div>
            <span className="orgs-badge-text">ORGANIZATIONS</span>
          </div>
          <h1 className="orgs-title">Organizations</h1>
          <p className="orgs-subtitle">Manage all organizations on the platform.</p>
        </div>
        <button className="orgs-refresh-btn" onClick={loadOrganizations}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="orgs-summary">
        <div className="org-stat">
          <span className="org-stat-value">{organizations.length}</span>
          <span className="org-stat-label">Total Organizations</span>
        </div>
        <div className="org-stat">
          <span className="org-stat-value">{organizations.filter(o => o.status === 'active').length}</span>
          <span className="org-stat-label">Active</span>
        </div>
        <div className="org-stat">
          <span className="org-stat-value">{organizations.filter(o => o.status === 'inactive').length}</span>
          <span className="org-stat-label">Inactive</span>
        </div>
        <div className="org-stat">
          <span className="org-stat-value">{organizations.reduce((sum, o) => sum + (Number(o.user_count) || 0), 0)}</span>
          <span className="org-stat-label">Total Users</span>
        </div>
      </div>

      {/* Filters */}
      <div className="orgs-filters">
        <div className="orgs-search">
          <Search size={18} className="orgs-search-icon" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="orgs-search-input"
          />
        </div>
        <div className="orgs-filter-group">
          <button className="orgs-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
          <button className="orgs-filter-btn">
            <Filter size={16} />
            Sort By
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="orgs-table-wrapper">
        <table className="orgs-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Slug</th>
              <th>Users</th>
              <th>Products</th>
              <th>Status</th>
              <th>Created</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.map((org) => (
              <tr key={org.id}>
                <td>
                  <div className="org-cell">
                    <div className="org-avatar">
                      {getInitials(org.name)}
                    </div>
                    <span className="org-name">{org.name || 'Unnamed'}</span>
                  </div>
                </td>
                <td className="org-slug">{org.slug || 'N/A'}</td>
                <td className="org-users">{org.user_count || 0}</td>
                <td className="org-products">{org.product_count || 0}</td>
                <td>
                  <span className={`org-status ${org.status === 'active' ? 'active' : 'inactive'}`}>
                    {org.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="org-created">
                  {org.created_at ? new Date(org.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="table-actions">
                  <div className="action-dropdown" ref={menuRef}>
                    <button 
                      className="action-btn more"
                      onClick={() => setShowActionMenu(showActionMenu === org.id ? null : org.id)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {showActionMenu === org.id && (
                      <div className="action-menu">
                        <button onClick={() => {
                          setShowActionMenu(null)
                          alert(`Viewing details for: ${org.name}`)
                        }}>
                          <Eye size={14} />
                          View Details
                        </button>
                        {org.status === 'active' && (
                          <button onClick={() => {
                            setShowActionMenu(null)
                            setSelectedOrg(org)
                            setShowDeactivateModal(true)
                          }}>
                            <AlertTriangle size={14} />
                            Deactivate
                          </button>
                        )}
                        {org.status === 'inactive' && (
                          <button onClick={() => {
                            setShowActionMenu(null)
                            handleReactivate(org.id)
                          }}>
                            <Check size={14} />
                            Reactivate
                          </button>
                        )}
                        <button className="danger" onClick={() => {
                          setShowActionMenu(null)
                          setSelectedOrg(org)
                          setShowDeleteModal(true)
                        }}>
                          <Trash2 size={14} />
                          Delete Permanently
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="orgs-stats">
        <span className="orgs-stats-text">
          Showing {filteredOrgs.length} of {organizations.length} organizations
        </span>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && selectedOrg && (
        <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Deactivate Organization</h2>
              <button className="modal-close" onClick={() => setShowDeactivateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon warning">
                <AlertTriangle size={48} />
              </div>
              <p className="modal-text">
                Are you sure you want to deactivate <strong>{selectedOrg.name}</strong>?
              </p>
              <p className="modal-subtext">
                This will:
                • Deactivate all users in this organization
                • Prevent them from logging in
                • Data will be preserved but hidden
                • You can reactivate later
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeactivateModal(false)}>
                Cancel
              </button>
              <button className="btn-warning" onClick={() => handleDeactivate(selectedOrg.id)}>
                Deactivate Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedOrg && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Organization</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon danger">
                <Trash2 size={48} />
              </div>
              <p className="modal-text">
                Are you sure you want to permanently delete <strong>{selectedOrg.name}</strong>?
              </p>
              <p className="modal-subtext">
                This action CANNOT be undone. This will permanently delete:
                • All users in this organization
                • All products
                • All sales
                • All customers
                • ALL data associated with this organization
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDelete(selectedOrg.id)}>
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Organizations