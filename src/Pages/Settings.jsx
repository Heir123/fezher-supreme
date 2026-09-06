import React, { useState } from 'react'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  Palette,
  Database,
  Lock,
  HelpCircle,
  LogOut,
  Check,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react'
import './Settings.css'

function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ]

  return (
    <div className="settings">
      {/* Header */}
      <div className="settings-header">
        <div>
          <div className="settings-badge">
            <div className="settings-badge-icon">
              <SettingsIcon size={16} color="white" />
            </div>
            <span className="settings-badge-text">SETTINGS</span>
          </div>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences and configurations.</p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="settings-layout">
        {/* Sidebar */}
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                <ChevronRight size={16} className="settings-tab-arrow" />
              </button>
            )
          })}
          <button className="settings-tab settings-tab-logout">
            <LogOut size={18} />
            <span>Logout</span>
            <ChevronRight size={16} className="settings-tab-arrow" />
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Profile Settings</h2>
              <p className="settings-panel-subtitle">Update your personal information</p>

              <div className="settings-form">
                <div className="settings-avatar-section">
                  <div className="settings-avatar">
                    <span>JD</span>
                  </div>
                  <div>
                    <button className="settings-avatar-btn">Change Photo</button>
                    <p className="settings-avatar-text">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>

                <div className="settings-form-group">
                  <label className="settings-form-label">Full Name</label>
                  <input type="text" className="settings-form-input" value="John Doe" />
                </div>

                <div className="settings-form-group">
                  <label className="settings-form-label">Email Address</label>
                  <input type="email" className="settings-form-input" value="john@example.com" />
                </div>

                <div className="settings-form-group">
                  <label className="settings-form-label">Phone Number</label>
                  <input type="tel" className="settings-form-input" value="+1 555-0101" />
                </div>

                <button className="settings-save-btn">
                  <Check size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Notification Preferences</h2>
              <p className="settings-panel-subtitle">Manage how you receive notifications</p>

              <div className="settings-notifications">
                <div className="settings-notification-item">
                  <div>
                    <h4 className="settings-notification-title">Email Notifications</h4>
                    <p className="settings-notification-desc">Receive updates via email</p>
                  </div>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => setNotifications({...notifications, email: !notifications.email})}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="settings-notification-item">
                  <div>
                    <h4 className="settings-notification-title">Push Notifications</h4>
                    <p className="settings-notification-desc">Receive real-time push alerts</p>
                  </div>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => setNotifications({...notifications, push: !notifications.push})}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>

                <div className="settings-notification-item">
                  <div>
                    <h4 className="settings-notification-title">SMS Notifications</h4>
                    <p className="settings-notification-desc">Receive SMS alerts</p>
                  </div>
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={() => setNotifications({...notifications, sms: !notifications.sms})}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Security Settings</h2>
              <p className="settings-panel-subtitle">Protect your account</p>

              <div className="settings-security">
                <div className="settings-security-item">
                  <div className="settings-security-icon">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="settings-security-title">Change Password</h4>
                    <p className="settings-security-desc">Update your password to keep your account secure</p>
                  </div>
                  <button className="settings-security-btn">Change</button>
                </div>

                <div className="settings-security-item">
                  <div className="settings-security-icon">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="settings-security-title">Two-Factor Authentication</h4>
                    <p className="settings-security-desc">Add an extra layer of security</p>
                  </div>
                  <button className="settings-security-btn">Enable</button>
                </div>

                <div className="settings-security-item">
                  <div className="settings-security-icon">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="settings-security-title">Active Sessions</h4>
                    <p className="settings-security-desc">Manage your active login sessions</p>
                  </div>
                  <button className="settings-security-btn">Manage</button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Appearance</h2>
              <p className="settings-panel-subtitle">Customize your dashboard experience</p>

              <div className="settings-appearance">
                <div className="settings-appearance-item">
                  <div className="settings-appearance-icon">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h4 className="settings-appearance-title">Theme</h4>
                    <p className="settings-appearance-desc">Choose between light and dark mode</p>
                  </div>
                  <div className="settings-appearance-theme">
                    <button 
                      className={`settings-theme-btn ${!darkMode ? 'active' : ''}`}
                      onClick={() => setDarkMode(false)}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                    <button 
                      className={`settings-theme-btn ${darkMode ? 'active' : ''}`}
                      onClick={() => setDarkMode(true)}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="settings-footer">
        <div className="settings-footer-content">
          <span className="settings-footer-text">© 2026 Fezher Supreme · Settings</span>
          <div className="settings-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Settings