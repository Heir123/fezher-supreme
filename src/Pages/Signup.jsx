import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://fezher-api.fietprojects.workers.dev'

function Signup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    orgName: '',
    orgSlug: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!formData.orgName.trim()) {
      setError('Organization name is required')
      setLoading(false)
      return
    }

    if (!formData.orgSlug.trim()) {
      setError('Organization slug is required')
      setLoading(false)
      return
    }

    if (!formData.adminName.trim()) {
      setError('Your name is required')
      setLoading(false)
      return
    }

    if (!formData.adminEmail.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (formData.adminPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const payload = {
        orgName: formData.orgName.trim(),
        orgSlug: formData.orgSlug
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-'),
        adminName: formData.adminName.trim(),
        adminEmail: formData.adminEmail.trim().toLowerCase(),
        adminPassword: formData.adminPassword
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      let data = {}

      try {
        data = await response.json()
      } catch {
        data = {}
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Signup failed (${response.status})`
        )
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token)
      }

      if (data.user) {
        localStorage.setItem(
          'userData',
          JSON.stringify(data.user)
        )
      }

      if (data.organization) {
        localStorage.setItem(
          'organizationData',
          JSON.stringify(data.organization)
        )
      }

      setSuccess(true)
      setLoading(false)

      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)

    } catch (err) {
      console.error('Signup failed:', err)
      setError(
        err.message || 'Unable to create your organization. Please try again.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">

        {/* Brand */}
        <div className="signup-brand">
          <div className="signup-brand-icon">◆</div>

          <span className="signup-brand-name">
            Fezher <span className="signup-brand-highlight">Supreme</span>
          </span>
        </div>

        {/* Header */}
        <div className="signup-header">
          <h1>Create Your Organization</h1>
          <p>Start your free trial today</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="signup-success">
            <span>✅</span>
            Organization created successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="signup-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="signup-form-group">
            <label>Organization Name</label>

            <input
              type="text"
              className="signup-input"
              value={formData.orgName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  orgName: e.target.value
                })
              }
              placeholder="Acme Inc."
              required
            />
          </div>

          <div className="signup-form-group">
            <label>Organization Slug</label>

            <div className="signup-slug-wrapper">
              <span className="signup-slug-prefix">
                https://app.fezher.com/
              </span>

              <input
                type="text"
                className="signup-slug-input"
                value={formData.orgSlug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orgSlug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                  })
                }
                placeholder="acme-inc"
                required
              />
            </div>

            <small className="signup-hint">
              This will be your unique URL
            </small>
          </div>

          <div className="signup-row">

            <div className="signup-form-group">
              <label>Your Name</label>

              <input
                type="text"
                className="signup-input"
                value={formData.adminName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminName: e.target.value
                  })
                }
                placeholder="John Doe"
                required
              />
            </div>

            <div className="signup-form-group">
              <label>Email</label>

              <input
                type="email"
                className="signup-input"
                value={formData.adminEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminEmail: e.target.value
                  })
                }
                placeholder="you@example.com"
                required
              />
            </div>

          </div>

          <div className="signup-row">

            <div className="signup-form-group">
              <label>Password</label>

              <input
                type="password"
                className="signup-input"
                value={formData.adminPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminPassword: e.target.value
                  })
                }
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            <div className="signup-form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                className="signup-input"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value
                  })
                }
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

          </div>

          <button
            type="submit"
            className="signup-submit-btn"
            disabled={loading || success}
          >
            {loading
              ? 'Creating...'
              : success
                ? '✓ Created!'
                : 'Create Organization →'}
          </button>

        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="signup-features">
          <span>🔒 Secure & encrypted</span>
          <span>⚡ Fast setup</span>
          <span>✅ Free to start</span>
        </div>

      </div>
    </div>
  )
}

export default Signup
