import React, { createContext, useContext, useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe((data) => {
      setNotifications(data)
      setUnreadCount(notificationService.getUnreadCount())
    })

    // Initial load
    setNotifications(notificationService.getAll())
    setUnreadCount(notificationService.getUnreadCount())

    return unsubscribe
  }, [])

  const value = {
    notifications,
    unreadCount,
    addNotification: notificationService.addNotification.bind(notificationService),
    success: notificationService.success.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    info: notificationService.info.bind(notificationService),
    markAsRead: notificationService.markAsRead.bind(notificationService),
    markAllAsRead: notificationService.markAllAsRead.bind(notificationService),
    removeNotification: notificationService.removeNotification.bind(notificationService),
    clearAll: notificationService.clearAll.bind(notificationService)
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext