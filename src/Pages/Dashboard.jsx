 import React, { useState, useEffect } from 'react'
import * as productService from '../services/productService'
import { salesService } from '../services/salesService'
import { formatCurrency } from '../utils/helpers'
import { notificationService } from '../services/notificationService'
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalSales: 0,
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

 const loadDashboardData = async () => {
  setLoading(true)
  try {
    // Get products
    const { data: products, error: productsError } = await productService.getProducts()
    if (productsError) throw new Error(productsError)
    
    // Get sales stats
    const { data: salesStats, error: salesError } = await salesService.getSalesStats()
    if (salesError) throw new Error(salesError)
    
    // Get low stock products
    const { data: lowStock, error: lowStockError } = await productService.getLowStockProducts(10)
    if (lowStockError) throw new Error(lowStockError)

    setStats({
      totalProducts: products?.length || 0,
      totalRevenue: salesStats?.totalRevenue || 0,
      totalSales: salesStats?.total || 0,
      lowStock: lowStock?.length || 0
    })

    // Show low stock alert if any
    if (lowStock && lowStock.length > 0) {
      notificationService.lowStockAlerts(lowStock)
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    setLoading(false)
  }
}

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'blue' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', color: 'green' },
    { label: 'Total Sales', value: stats.totalSales, icon: '🛒', color: 'purple' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: '⚠️', color: 'red' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard