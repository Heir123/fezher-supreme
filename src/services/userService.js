import { supabase } from './supabase'

export const userService = {
  // Get all users with profiles
  getUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error('getUsers error:', error)
      return { data: [], error: error.message }
    }
  },

  // Get a single user by ID
  getUserById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get current user with role
  getCurrentUserWithRole: async () => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single()
      
      if (profileError) throw profileError
      
      return { 
        data: { ...user.user, ...profile }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      // First delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (profileError) throw profileError
      
      // Then delete auth user (requires admin)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)
      if (authError) throw authError
      
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Check if user has admin role
  isAdmin: async () => {
    try {
      const { data, error } = await userService.getCurrentUserWithRole()
      if (error) throw error
      return { isAdmin: data?.role === 'admin', error: null }
    } catch (error) {
      return { isAdmin: false, error: error.message }
    }
  },

  // Check if user has manager role or higher
  isManagerOrAbove: async () => {
    try {
      const { data, error } = await userService.getCurrentUserWithRole()
      if (error) throw error
      const roles = ['admin', 'manager']
      return { isManager: roles.includes(data?.role), error: null }
    } catch (error) {
      return { isManager: false, error: error.message }
    }
  },

  // Get user's role
  getUserRole: async () => {
    try {
      const { data, error } = await userService.getCurrentUserWithRole()
      if (error) throw error
      return { role: data?.role || 'staff', error: null }
    } catch (error) {
      return { role: 'staff', error: error.message }
    }
  }
}