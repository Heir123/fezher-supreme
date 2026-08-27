import { supabase } from './supabase'

export const cashFlowService = {
  // Get cash flow summary
  getCashFlowSummary: async (startDate, endDate) => {
    try {
      // Get sales (inflows)
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, created_at, status')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .in('status', ['paid', 'completed'])
      
      if (salesError) throw salesError

      // Get expenses (outflows)
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount, expense_date, status')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .eq('status', 'paid')
      
      if (expensesError) throw expensesError

      // Calculate totals
      const totalInflow = sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0
      const totalOutflow = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0
      const netCashFlow = totalInflow - totalOutflow

      // Group by date for trend
      const dailyCashFlow = {}
      
      sales?.forEach(sale => {
        const date = sale.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        if (!dailyCashFlow[date]) {
          dailyCashFlow[date] = { date, inflow: 0, outflow: 0, net: 0 }
        }
        dailyCashFlow[date].inflow += sale.total_amount || 0
      })

      expenses?.forEach(expense => {
        const date = expense.expense_date || new Date().toISOString().split('T')[0]
        if (!dailyCashFlow[date]) {
          dailyCashFlow[date] = { date, inflow: 0, outflow: 0, net: 0 }
        }
        dailyCashFlow[date].outflow += expense.amount || 0
      })

      // Calculate net for each day
      Object.values(dailyCashFlow).forEach(day => {
        day.net = day.inflow - day.outflow
      })

      const trendData = Object.values(dailyCashFlow).sort((a, b) => a.date.localeCompare(b.date))

      return {
        data: {
          summary: {
            totalInflow,
            totalOutflow,
            netCashFlow,
            transactionCount: (sales?.length || 0) + (expenses?.length || 0)
          },
          trend: trendData,
          sales: sales || [],
          expenses: expenses || []
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Get monthly cash flow
  getMonthlyCashFlow: async (year) => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyData = []

      for (let i = 0; i < 12; i++) {
        const startDate = new Date(year, i, 1)
        const endDate = new Date(year, i + 1, 0)
        
        const startStr = startDate.toISOString().split('T')[0]
        const endStr = endDate.toISOString().split('T')[0]

        const { data, error } = await cashFlowService.getCashFlowSummary(startStr, endStr)
        
        if (error) {
          monthlyData.push({
            month: months[i],
            year: year,
            inflow: 0,
            outflow: 0,
            net: 0
          })
        } else {
          monthlyData.push({
            month: months[i],
            year: year,
            inflow: data.summary.totalInflow,
            outflow: data.summary.totalOutflow,
            net: data.summary.netCashFlow
          })
        }
      }

      return { data: monthlyData, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get cash position
  getCashPosition: async () => {
    try {
      // Get current bank balance
      const { data: accounts, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('balance, account_name')
      
      if (accountsError) throw accountsError

      // Get last 30 days cash flow
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]

      const { data, error } = await cashFlowService.getCashFlowSummary(startStr, endStr)
      
      if (error) throw error

      const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0

      return {
        data: {
          totalBalance,
          accounts: accounts || [],
          thirtyDayInflow: data.summary.totalInflow,
          thirtyDayOutflow: data.summary.totalOutflow,
          thirtyDayNet: data.summary.netCashFlow,
          averageDailyInflow: data.summary.totalInflow / 30,
          averageDailyOutflow: data.summary.totalOutflow / 30
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}