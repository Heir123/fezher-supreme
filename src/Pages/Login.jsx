import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient' // We will create this file next
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organization: '',
    remember: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // 2. Fetch the user's organization based on the slug
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', formData.organization)
        .single()

      if (orgError || !orgData) {
        setError('Organization not found. Please check your slug.')
        await supabase.auth.signOut() // Log them out if org doesn't exist
        setLoading(false)
        return
      }

      // 3. Save user session and org info to local storage (Optional, for your app logic)
      localStorage.setItem('org_slug', orgData.slug)
      localStorage.setItem('org_id', orgData.id)

      // 4. Navigate to Dashboard
      navigate('/dashboard')
      
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">◆</div>
          <span className="login-brand-name">
            Fezher <span className="login-brand-highlight">Supreme</span>
          </span>
        </div>

        <div className="login-welcome">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Organization Slug</label>
            <input
              type="text"
              className="login-input"
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e.target.value.toLowerCase().replace(/\s/g, '-')})}
              placeholder="techstart"
              required
            />
            <small className="login-hint">Enter your organization slug</small>
          </div>

          <div className="login-form-group">
            <label className="login-label">Email Address</label>
            <input
              type="email"
              className="login-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="•••••••••"
              required
            />
          </div>

          <div className="login-remember-container">
            <label className="login-checkbox-wrapper">
              <input
                type="checkbox"
                className="login-checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({...formData, remember: e.target.checked})}
              />
              <span className="login-remember-text">Remember me</span>
            </label>
            <Link to="/forgot-password" className="login-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-signin-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="login-signup-container">
          <span className="login-signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="login-signup-link">
              Sign up
            </Link>
          </span>
        </div>

        <div className="login-footer-features">
          <span className="login-footer-feature">🔒 Secure & encrypted</span>
          <span className="login-footer-feature">⚡ Fast performance</span>
          <span className="login-footer-feature">✅ 24/7 support</span>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-decoration"></div>
        <div className="login-right-decoration2"></div>
        <div className="login-right-decoration3"></div>

        <div className="login-right-content">
          <div className="login-right-badge">
            <span>✦</span>
            Fezher Supreme Management Platform
          </div>

          <h2 className="login-right-title">
            Smarter business<br />management
          </h2>

          <p className="login-right-description">
            Streamline your operations, gain valuable insights, and make 
            data-driven decisions with our comprehensive management platform.
          </p>

          <div className="login-right-stats">
            <div className="login-right-stat">
              <span className="login-right-stat-value">99.9%</span>
              <span className="login-right-stat-label">Uptime</span>
            </div>
            <div className="login-right-stat">
              <span className="login-right-stat-value">24/7</span>
              <span className="login-right-stat-label">Support</span>
            </div>
            <div className="login-right-stat">
              <span className="login-right-stat-value">Secure</span>
              <span className="login-right-stat-label">Encrypted</span>
            </div>
          </div>

          <hr className="login-right-divider" />

          <div className="login-right-footer">
            <span className="login-right-footer-item">🔒 Enterprise-grade security</span>
            <span className="login-right-footer-item">⚡ GDPR compliant</span>
            <span className="login-right-footer-item">✅ Multi-tenant support</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login