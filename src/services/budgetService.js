import { supabase } from './supabase'

export const budgetService = {
  // Get all budgets
  getBudgets: async (year = null, month = null) => {
    try {
      let query = supabase
        .from('budgets')
        .select('*')
        .order('category')
      
      if (year) {
        query = query.eq('year', year)
      }
      
      if (month !== null) {
        query = query.eq('month', month)
      }
      
      const { data, error } = await query
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Create budget
  createBudget: async (budget) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          ...budget,
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

  // Update budget
  updateBudget: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
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

  // Delete budget
  deleteBudget: async (id) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get budget vs actual
  getBudgetVsActual: async (year, month) => {
    try {
      // Get budgets
      const { data: budgets, error: budgetsError } = await budgetService.getBudgets(year, month)
      if (budgetsError) throw budgetsError
      
      // Get actual expenses for the period
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`
      
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('category, amount')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .eq('status', 'paid')
      
      if (expensesError) throw expensesError
      
      // Calculate actual by category
      const actualByCategory = {}
      expenses?.forEach(expense => {
        if (!actualByCategory[expense.category]) {
          actualByCategory[expense.category] = 0
        }
        actualByCategory[expense.category] += expense.amount || 0
      })
      
      // Combine budget and actual
      const comparison = budgets.map(budget => ({
        category: budget.category,
        budgeted: budget.amount,
        actual: actualByCategory[budget.category] || 0,
        variance: budget.amount - (actualByCategory[budget.category] || 0),
        percentage: budget.amount > 0 ? ((actualByCategory[budget.category] || 0) / budget.amount) * 100 : 0
      }))
      
      return { data: comparison, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get budget summary
  getBudgetSummary: async (year, month) => {
    try {
      const { data: comparison, error } = await budgetService.getBudgetVsActual(year, month)
      if (error) throw error
      
      const summary = {
        totalBudgeted: comparison.reduce((sum, item) => sum + item.budgeted, 0) || 0,
        totalActual: comparison.reduce((sum, item) => sum + item.actual, 0) || 0,
        totalVariance: comparison.reduce((sum, item) => sum + item.variance, 0) || 0,
        categories: comparison
      }
      
      return { data: summary, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}