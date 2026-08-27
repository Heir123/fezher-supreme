 import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth'
import { userService } from '../services/userService'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('staff')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await authService.getCurrentUser()
        if (error) {
          console.error('Auth check failed:', error)
        } else if (user) {
          setUser(user)
          // Get user role from profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          setUserRole(profile?.role || 'staff')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
          // Get user role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          setUserRole(profile?.role || 'staff')
        } else {
          setUser(null)
          setUserRole('staff')
        }
        setLoading(false)
      }
    )

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email, password) => {
    const { user, error } = await authService.signIn(email, password)
    if (error) throw new Error(error)
    setUser(user)
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    setUserRole(profile?.role || 'staff')
    return user
  }

  const logout = async () => {
    await authService.signOut()
    setUser(null)
    setUserRole('staff')
  }

  const signup = async (email, password, userData) => {
    const { user, error } = await authService.signUp(email, password, userData)
    if (error) throw new Error(error)
    setUser(user)
    setUserRole('staff')
    return user
  }

  const refreshUserRole = async () => {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setUserRole(profile?.role || 'staff')
    }
  }

  const value = {
    user,
    userRole,
    loading,
    login,
    logout,
    signup,
    refreshUserRole,
    isAuthenticated: !!user,
    isAdmin: userRole === 'admin',
    isManager: userRole === 'admin' || userRole === 'manager',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}