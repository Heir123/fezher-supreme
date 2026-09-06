import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  X
} from 'lucide-react'
import './Users.css'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  })

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', joined: '2025-06-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active', joined: '2025-07-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', joined: '2025-08-01' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', joined: '2025-09-10' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => setShowActionMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const getRoleBadge = (role) => {
    const roles = {
      admin: { label: 'Admin', color: '#8b5cf6', bg: '#f5f3ff' },
      manager: { label: 'Manager', color: '#3b82f6', bg: '#eff6ff' },
      user: { label: 'User', color: '#6b7280', bg: '#f1f5f9' }
    }
    return roles[role] || roles.user
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setShowEditModal(true)
    setShowActionMenu(null)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id))
      setShowActionMenu(null)
    }
  }

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ))
    setShowActionMenu(null)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...formData } : u
      ))
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        joined: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
    }
    setShowEditModal(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', role: 'user', status: 'active' })
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="users-loading">
        <div className="users-loading-spinner"></div>
        <p className="users-loading-text">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="users">
      <div className="users-header">
        <div>
          <div className="users-badge">
            <div className="users-badge-icon">
              <Users size={16} color="white" />
            </div>
            <span className="users-badge-text">USERS</span>
          </div>
          <h1 className="users-title">Users</h1>
          <p className="users-subtitle">Manage your team members and their access.</p>
        </div>
        <button 
          className="users-add-btn"
          onClick={() => {
            setEditingUser(null)
            setFormData({ name: '', email: '', role: 'user', status: 'active' })
            setShowEditModal(true)
          }}
        >
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div className="users-summary">
        <div className="user-stat">
          <span className="user-stat-value">{users.length}</span>
          <span className="user-stat-label">Total Users</span>
        </div>
        <div className="user-stat">
          <span className="user-stat-value">{users.filter(u => u.status === 'active').length}</span>
          <span className="user-stat-label">Active</span>
        </div>
        <div className="user-stat">
          <span className="user-stat-value">{users.filter(u => u.role === 'admin').length}</span>
          <span className="user-stat-label">Admins</span>
        </div>
        <div className="user-stat">
          <span className="user-stat-value">{users.filter(u => u.role === 'user').length}</span>
          <span className="user-stat-label">Users</span>
        </div>
      </div>

      <div className="users-filters">
        <div className="users-search">
          <Search size={18} className="users-search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="users-search-input"
          />
        </div>
        <div className="users-filter-group">
          <button className="users-filter-btn">
            <Filter size={16} />
            Role
            <ChevronDown size={14} />
          </button>
          <button className="users-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const roleBadge = getRoleBadge(user.role)
              return (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className="user-role" style={{ background: roleBadge.bg, color: roleBadge.color }}>
                      {roleBadge.label}
                    </span>
                  </td>
                  <td>
                    <span className={`user-status ${user.status}`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="user-joined">{user.joined}</td>
                  <td className="table-actions">
                    <div className="action-dropdown">
                      <button 
                        className="action-btn more"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowActionMenu(showActionMenu === user.id ? null : user.id)
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {showActionMenu === user.id && (
                        <div className="action-menu">
                          <button onClick={() => handleEdit(user)}>
                            <Edit size={14} />
                            Edit
                          </button>
                          <button onClick={() => handleToggleStatus(user.id)}>
                            {user.status === 'active' ? (
                              <>
                                <UserX size={14} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} />
                                Activate
                              </>
                            )}
                          </button>
                          <button className="danger" onClick={() => handleDelete(user.id)}>
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

      <div className="users-stats">
        <span className="users-stats-text">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-input"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage