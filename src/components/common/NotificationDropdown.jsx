import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import './NotificationDropdown.css'

function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getTypeStyles = (type) => {
    const styles = {
      success: { border: '#10b981', bg: '#ecfdf5', color: '#065f46' },
      error: { border: '#ef4444', bg: '#fef2f2', color: '#991b1b' },
      warning: { border: '#f59e0b', bg: '#fffbeb', color: '#92400e' },
      info: { border: '#3b82f6', bg: '#eff6ff', color: '#1e40af' }
    }
    return styles[type] || styles.info
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button 
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-header-actions">
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllAsRead} className="action-btn">
                    <CheckCheck size={16} />
                    Mark all read
                  </button>
                  <button onClick={clearAll} className="action-btn">
                    <Trash2 size={16} />
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={32} />
                <p>No notifications</p>
                <span>You're all caught up!</span>
              </div>
            ) : (
              notifications.map((notification) => {
                const styles = getTypeStyles(notification.type)
                return (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    style={{ borderLeftColor: styles.border }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon" style={{ background: styles.bg, color: styles.color }}>
                      {notification.icon}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{formatTime(notification.timestamp)}</div>
                    </div>
                    <button 
                      className="notification-close"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown