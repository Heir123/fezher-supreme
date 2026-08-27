 // Auth Service - Supabase Authentication
import { supabase } from './supabase'

export const authService = {
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return {
        user: data.user,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error.message,
      }
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })
      
      if (error) throw error
      
      return {
        user: data.user,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error.message,
      }
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  updateUser: async (data) => {
    try {
      const { data: userData, error } = await supabase.auth.updateUser(data)
      if (error) throw error
      return { user: userData.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },
}