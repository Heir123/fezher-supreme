// Notification service for the app
class NotificationService {
  constructor() {
    this.notifications = []
    this.listeners = []
    this.counter = 0
  }

  // Add a notification
  addNotification(notification) {
    const newNotification = {
      id: ++this.counter,
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    }
    this.notifications.unshift(newNotification)
    this.notifyListeners()
    return newNotification
  }

  // Success notification
  success(title, message, duration = 5000) {
    return this.addNotification({
      type: 'success',
      title,
      message,
      duration,
      icon: '✅'
    })
  }

  // Error notification
  error(title, message, duration = 6000) {
    return this.addNotification({
      type: 'error',
      title,
      message,
      duration,
      icon: '❌'
    })
  }

  // Warning notification
  warning(title, message, duration = 5000) {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      duration,
      icon: '⚠️'
    })
  }

  // Info notification
  info(title, message, duration = 4000) {
    return this.addNotification({
      type: 'info',
      title,
      message,
      duration,
      icon: 'ℹ️'
    })
  }

  // Mark as read
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  // Remove notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()
  }

  // Clear all
  clearAll() {
    this.notifications = []
    this.notifyListeners()
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length
  }

  // Get all notifications
  getAll() {
    return this.notifications
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }
}

// Create singleton instance
export const notificationService = new NotificationService()

export default notificationService