import { supabase } from './supabase'

export const chartService = {
  // Get sales trend data for charts
  getSalesTrend: async (days = 30) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const { data, error } = await supabase
        .from('sales')
        .select('created_at, total_amount')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      // Group by date
      const trendMap = {}
      data?.forEach(sale => {
        const date = sale.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        if (!trendMap[date]) {
          trendMap[date] = { date, sales: 0, revenue: 0 }
        }
        trendMap[date].sales += 1
        trendMap[date].revenue += sale.total_amount || 0
      })
      
      const trendData = Object.values(trendMap)
      return { data: trendData, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('sale_items')
        .select(`
          product_id,
          product_name,
          quantity,
          total_price,
          products (name)
        `)
        .order('total_price', { ascending: false })
        .limit(limit * 10)
      
      if (error) throw error
      
      // Aggregate by product
      const productMap = {}
      data?.forEach(item => {
        const id = item.product_id
        const name = item.products?.name || item.product_name || 'Unknown'
        if (!productMap[id]) {
          productMap[id] = { name, total_quantity: 0, total_revenue: 0 }
        }
        productMap[id].total_quantity += item.quantity || 0
        productMap[id].total_revenue += item.total_price || 0
      })
      
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, limit)
      
      return { data: topProducts, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get sales by status
  getSalesByStatus: async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('status, total_amount')
      
      if (error) throw error
      
      const statusMap = {}
      data?.forEach(sale => {
        const status = sale.status || 'pending'
        if (!statusMap[status]) {
          statusMap[status] = { count: 0, revenue: 0 }
        }
        statusMap[status].count += 1
        statusMap[status].revenue += sale.total_amount || 0
      })
      
      const statusData = Object.entries(statusMap).map(([name, values]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count: values.count,
        revenue: values.revenue
      }))
      
      return { data: statusData, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get monthly revenue for current year
  getMonthlyRevenue: async () => {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 11)
      startDate.setDate(1)
      
      const { data, error } = await supabase
        .from('sales')
        .select('created_at, total_amount')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const revenueMap = {}
      
      data?.forEach(sale => {
        const date = new Date(sale.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`
        if (!revenueMap[monthKey]) {
          revenueMap[monthKey] = { month: months[date.getMonth()], year: date.getFullYear(), revenue: 0 }
        }
        revenueMap[monthKey].revenue += sale.total_amount || 0
      })
      
      const monthlyData = Object.values(revenueMap)
      return { data: monthlyData, error: null }
    } catch (error) {
      return { data: [], error: error.message }
    }
  },

  // Get dashboard summary stats with charts
  getDashboardData: async () => {
    try {
      const [trend, topProducts, status, monthly] = await Promise.all([
        chartService.getSalesTrend(30),
        chartService.getTopProducts(5),
        chartService.getSalesByStatus(),
        chartService.getMonthlyRevenue()
      ])
      
      return {
        data: {
          trend: trend.data || [],
          topProducts: topProducts.data || [],
          status: status.data || [],
          monthlyRevenue: monthly.data || []
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }
}