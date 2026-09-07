import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      // Fetch organization from local storage (or database later)
      const orgData = localStorage.getItem('organizationData')
      if (orgData) {
        setOrganization(JSON.parse(orgData))
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Store user data
    setUser(data.user)
    localStorage.setItem('userData', JSON.stringify(data.user))

    return { success: true, user: data.user }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userData')
    localStorage.removeItem('organizationData')
    setUser(null)
    setOrganization(null)
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