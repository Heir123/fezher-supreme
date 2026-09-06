import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        const orgData = localStorage.getItem('organizationData')
        
        if (token && userData) {
          setUser(JSON.parse(userData))
          if (orgData) {
            setOrganization(JSON.parse(orgData))
          }
        } else {
          setUser(null)
          setOrganization(null)
        }
      } catch (error) {
        console.log('Auth check: No valid session')
        setUser(null)
        setOrganization(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password, organizationId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, organizationId })
      })

      const data = await response.json()
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      localStorage.setItem('organizationData', JSON.stringify(data.organization))
      
      setUser(data.user)
      setOrganization(data.organization)
      
      return { success: true, user: data.user, organization: data.organization }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('organizationData')
    setUser(null)
    setOrganization(null)
    navigate('/login')
  }

  const value = {
    user,
    organization,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext