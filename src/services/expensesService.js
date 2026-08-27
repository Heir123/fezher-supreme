 import { supabase } from './supabase'

export const expensesService = {
  // Get all expenses
  getExpenses: async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false })
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error('getExpenses error:', error)
      return { data: [], error: error.message }
    }
  },

  // Get expense by ID
  getExpenseById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Create expense
  createExpense: async (expense) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expense,
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

  // Update expense
  updateExpense: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          ...updates,
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

  // Delete expense
  deleteExpense: async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get expenses by category
  getExpensesByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('category', category)
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get expenses by date range
  getExpensesByDateRange: async (startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date')
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get expense summary by category
  getExpenseSummary: async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('category, amount, status')
      
      if (error) throw error
      
      const summary = {}
      data?.forEach(expense => {
        if (!summary[expense.category]) {
          summary[expense.category] = { total: 0, count: 0, paid: 0, pending: 0 }
        }
        summary[expense.category].total += expense.amount || 0
        summary[expense.category].count += 1
        if (expense.status === 'paid') {
          summary[expense.category].paid += expense.amount || 0
        } else if (expense.status === 'pending') {
          summary[expense.category].pending += expense.amount || 0
        }
      })
      
      return { data: summary, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get total expenses
  getTotalExpenses: async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('amount, status')
      
      if (error) throw error
      
      const total = {
        total: data?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
        paid: data?.filter(e => e.status === 'paid').reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
        pending: data?.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
        count: data?.length || 0
      }
      
      return { data: total, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}