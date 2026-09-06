import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronDown,
  Star,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Reply,
  Trash2,
  Eye,
  MoreHorizontal,
  X  // <-- ADD THIS IMPORT
} from 'lucide-react'
import './FeedbackAdmin.css'

function FeedbackAdmin() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setFeedback([
        { 
          id: 1, 
          user: 'John Doe', 
          email: 'john@example.com',
          rating: 5, 
          comment: 'Great platform! Really helped streamline our business operations.',
          status: 'pending',
          date: '2026-09-03',
          replies: []
        },
        { 
          id: 2, 
          user: 'Jane Smith', 
          email: 'jane@example.com',
          rating: 4, 
          comment: 'Very useful features. Would love to see more integrations.',
          status: 'replied',
          date: '2026-09-02',
          replies: [{ id: 1, text: 'Thank you for your feedback! We are working on more integrations.', date: '2026-09-03' }]
        },
        { 
          id: 3, 
          user: 'Bob Johnson', 
          email: 'bob@example.com',
          rating: 3, 
          comment: 'Good but the mobile app needs improvement.',
          status: 'pending',
          date: '2026-09-01',
          replies: []
        },
        { 
          id: 4, 
          user: 'Alice Brown', 
          email: 'alice@example.com',
          rating: 5, 
          comment: 'Excellent customer support and amazing features!',
          status: 'replied',
          date: '2026-08-30',
          replies: [{ id: 2, text: 'We appreciate your kind words!', date: '2026-08-31' }]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getStatusInfo = (status) => {
    const statuses = {
      'pending': { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
      'replied': { label: 'Replied', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle },
      'resolved': { label: 'Resolved', color: '#3b82f6', bg: '#eff6ff', icon: CheckCircle },
      'archived': { label: 'Archived', color: '#6b7280', bg: '#f1f5f9', icon: XCircle }
    }
    return statuses[status] || statuses['pending']
  }

  const handleReply = (feedbackItem) => {
    setSelectedFeedback(feedbackItem)
    setShowReplyModal(true)
  }

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      setFeedback(feedback.map(f => 
        f.id === selectedFeedback.id 
          ? { 
              ...f, 
              status: 'replied', 
              replies: [...f.replies, { 
                id: Date.now(), 
                text: replyText, 
                date: new Date().toISOString().split('T')[0] 
              }]
            } 
          : f
      ))
      setShowReplyModal(false)
      setReplyText('')
      setSelectedFeedback(null)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      setFeedback(feedback.filter(f => f.id !== id))
    }
  }

  const filteredFeedback = feedback.filter(f => 
    f.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="feedback-loading">
        <div className="feedback-loading-spinner"></div>
        <p className="feedback-loading-text">Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className="feedback">
      {/* Header */}
      <div className="feedback-header">
        <div>
          <div className="feedback-badge">
            <div className="feedback-badge-icon">
              <MessageSquare size={16} color="white" />
            </div>
            <span className="feedback-badge-text">FEEDBACK</span>
          </div>
          <h1 className="feedback-title">Feedback</h1>
          <p className="feedback-subtitle">Manage and respond to user feedback.</p>
        </div>
        <div className="feedback-actions">
          <button className="feedback-export-btn">
            <Filter size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="feedback-summary">
        <div className="feedback-stat">
          <span className="feedback-stat-value">{feedback.length}</span>
          <span className="feedback-stat-label">Total Feedback</span>
        </div>
        <div className="feedback-stat">
          <span className="feedback-stat-value">{feedback.filter(f => f.status === 'pending').length}</span>
          <span className="feedback-stat-label">Pending</span>
        </div>
        <div className="feedback-stat">
          <span className="feedback-stat-value">{feedback.filter(f => f.status === 'replied').length}</span>
          <span className="feedback-stat-label">Replied</span>
        </div>
        <div className="feedback-stat">
          <span className="feedback-stat-value">{feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length || 0}</span>
          <span className="feedback-stat-label">Avg Rating</span>
        </div>
      </div>

      {/* Filters */}
      <div className="feedback-filters">
        <div className="feedback-search">
          <Search size={18} className="feedback-search-icon" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="feedback-search-input"
          />
        </div>
        <div className="feedback-filter-group">
          <button className="feedback-filter-btn">
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>
          <button className="feedback-filter-btn">
            <Filter size={16} />
            Rating
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="feedback-table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Feedback</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Date</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedback.map((item) => {
              const statusInfo = getStatusInfo(item.status)
              const StatusIcon = statusInfo.icon
              return (
                <tr key={item.id}>
                  <td>
                    <div className="feedback-user">
                      <div className="feedback-user-avatar">
                        {item.user.charAt(0)}
                      </div>
                      <div>
                        <span className="feedback-user-name">{item.user}</span>
                        <span className="feedback-user-email">{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="feedback-comment">
                      <p className="feedback-comment-text">{item.comment}</p>
                      {item.replies.length > 0 && (
                        <span className="feedback-reply-count">
                          {item.replies.length} reply{item.replies.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="feedback-rating">
                    <span className="feedback-stars">{getRatingStars(item.rating)}</span>
                    <span className="feedback-rating-number">{item.rating}/5</span>
                  </td>
                  <td>
                    <span className="feedback-status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="feedback-date">{item.date}</td>
                  <td className="table-actions">
                    <button className="action-btn reply" onClick={() => handleReply(item)}>
                      <Reply size={14} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
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
      <div className="feedback-stats">
        <span className="feedback-stats-text">
          Showing {filteredFeedback.length} of {feedback.length} feedback items
        </span>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedFeedback && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reply to Feedback</h2>
              <button className="modal-close" onClick={() => setShowReplyModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="feedback-original">
                <div className="feedback-original-header">
                  <span className="feedback-original-user">{selectedFeedback.user}</span>
                  <span className="feedback-original-rating">{getRatingStars(selectedFeedback.rating)}</span>
                </div>
                <p className="feedback-original-comment">{selectedFeedback.comment}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Your Reply</label>
                <textarea
                  className="form-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowReplyModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-submit" onClick={handleSubmitReply}>
                <Reply size={16} />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackAdmin