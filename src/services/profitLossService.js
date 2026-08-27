 import { supabase } from './supabase'

export const profitLossService = {
  // Get profit/loss report for a period
  getProfitLossReport: async (startDate, endDate) => {
    try {
      console.log('Fetching report for:', startDate, 'to', endDate)

      // Get sales in period (paid/completed only)
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, status, created_at, invoice_number')
        .gte('created_at', `${startDate}T00:00:00.000Z`)
        .lte('created_at', `${endDate}T23:59:59.999Z`)
        .in('status', ['paid', 'completed'])
      
      if (salesError) {
        console.error('Sales error:', salesError)
        throw salesError
      }

      console.log('Sales found:', sales?.length || 0, sales)

      // Get expenses in period (paid only)
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount, category, status, expense_date, title')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .eq('status', 'paid')
      
      if (expensesError) {
        console.error('Expenses error:', expensesError)
        throw expensesError
      }

      console.log('Expenses found:', expenses?.length || 0, expenses)

      // Calculate totals
      const totalRevenue = sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0
      const totalExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0
      const netProfit = totalRevenue - totalExpenses
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

      // Group expenses by category
      const expensesByCategory = {}
      expenses?.forEach(expense => {
        if (!expensesByCategory[expense.category]) {
          expensesByCategory[expense.category] = { total: 0, count: 0, items: [] }
        }
        expensesByCategory[expense.category].total += expense.amount || 0
        expensesByCategory[expense.category].count += 1
        expensesByCategory[expense.category].items.push(expense)
      })

      const result = {
        data: {
          revenue: {
            total: totalRevenue,
            count: sales?.length || 0,
            items: sales || []
          },
          expenses: {
            total: totalExpenses,
            count: expenses?.length || 0,
            items: expenses || [],
            byCategory: expensesByCategory
          },
          profit: {
            net: netProfit,
            margin: profitMargin,
            isPositive: netProfit > 0
          },
          summary: {
            startDate,
            endDate,
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin
          }
        },
        error: null
      }

      console.log('Result:', result)
      return result
    } catch (error) {
      console.error('getProfitLossReport error:', error)
      return { data: null, error: error.message }
    }
  },

  // Get monthly profit/loss for current year
  getMonthlyProfitLoss: async (year = new Date().getFullYear()) => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyData = []

      for (let i = 0; i < 12; i++) {
        const startDate = new Date(year, i, 1)
        const endDate = new Date(year, i + 1, 0)
        
        const startStr = startDate.toISOString().split('T')[0]
        const endStr = endDate.toISOString().split('T')[0]
        
        const { data, error } = await profitLossService.getProfitLossReport(startStr, endStr)
        
        if (error) {
          monthlyData.push({
            month: months[i],
            year: year,
            revenue: 0,
            expenses: 0,
            profit: 0,
            margin: 0
          })
        } else {
          monthlyData.push({
            month: months[i],
            year: year,
            revenue: data.revenue.total || 0,
            expenses: data.expenses.total || 0,
            profit: data.profit.net || 0,
            margin: data.profit.margin || 0
          })
        }
      }

      return { data: monthlyData, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get year-to-date summary
  getYTDSummary: async () => {
    try {
      const startDate = new Date()
      startDate.setMonth(0)
      startDate.setDate(1)
      
      const endDate = new Date()
      
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]

      const { data, error } = await profitLossService.getProfitLossReport(startStr, endStr)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get comparison between two periods
  comparePeriods: async (period1Start, period1End, period2Start, period2End) => {
    try {
      const [period1, period2] = await Promise.all([
        profitLossService.getProfitLossReport(period1Start, period1End),
        profitLossService.getProfitLossReport(period2Start, period2End)
      ])

      if (period1.error) throw new Error(period1.error)
      if (period2.error) throw new Error(period2.error)

      const revenueChange = period2.data.revenue.total - period1.data.revenue.total
      const expensesChange = period2.data.expenses.total - period1.data.expenses.total
      const profitChange = period2.data.profit.net - period1.data.profit.net

      return {
        data: {
          period1: period1.data,
          period2: period2.data,
          changes: {
            revenue: revenueChange,
            revenuePercent: period1.data.revenue.total > 0 
              ? (revenueChange / period1.data.revenue.total) * 100 
              : 0,
            expenses: expensesChange,
            expensesPercent: period1.data.expenses.total > 0 
              ? (expensesChange / period1.data.expenses.total) * 100 
              : 0,
            profit: profitChange,
            profitPercent: period1.data.profit.net !== 0 
              ? (profitChange / Math.abs(period1.data.profit.net)) * 100 
              : 0
          }
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}