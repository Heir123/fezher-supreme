import { supabase } from './supabase'

export const feedbackService = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          ...feedbackData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get all feedback (admin only)
  getAllFeedback: async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get feedback by user
  getFeedbackByUser: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Update feedback status (admin only)
  updateFeedbackStatus: async (id, status, notes = '') => {
    try {
      const updates = { 
        status, 
        updated_at: new Date().toISOString() 
      }
      
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString()
        updates.resolved_by = 'system'
      }
      
      if (notes) {
        updates.notes = notes
      }
      
      const { data, error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Submit feature request
  submitFeatureRequest: async (requestData) => {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .insert([{
          ...requestData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get all feature requests (admin only)
  getFeatureRequests: async () => {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Vote on feature request
  voteFeature: async (id, userId) => {
    try {
      // Get current votes
      const { data: current, error: getError } = await supabase
        .from('feature_requests')
        .select('votes')
        .eq('id', id)
        .single()
      
      if (getError) throw getError

      const { data, error } = await supabase
        .from('feature_requests')
        .update({ 
          votes: (current.votes || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Update feature request status (admin only)
  updateFeatureStatus: async (id, status) => {
    try {
      const updates = { 
        status, 
        updated_at: new Date().toISOString() 
      }
      
      if (status === 'released') {
        updates.released_at = new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('feature_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}