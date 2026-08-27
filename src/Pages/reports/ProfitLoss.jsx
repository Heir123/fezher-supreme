 import React, { useState, useEffect } from 'react'
import { profitLossService } from '../../services/profitLossService'
import { notificationService } from '../../services/notificationService'
import { formatCurrency } from '../../utils/helpers'
import Button from '../../components/common/Button'

const ProfitLoss = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reportData, setReportData] = useState({
    revenue: { total: 0, count: 0, items: [] },
    expenses: { total: 0, count: 0, items: [], byCategory: {} },
    profit: { net: 0, margin: 0, isPositive: true },
    summary: { totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 }
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewType, setViewType] = useState('summary')

  useEffect(() => {
    loadReport()
  }, [selectedMonth, selectedYear])

  const loadReport = async () => {
    setLoading(true)
    setError('')
    try {
      // Get monthly data
      const { data: monthly, error: monthlyError } = await profitLossService.getMonthlyProfitLoss(selectedYear)
      if (monthlyError) throw new Error(monthlyError)
      setMonthlyData(monthly || [])

      // Get current month report
      const startDate = new Date(selectedYear, selectedMonth, 1)
      const endDate = new Date(selectedYear, selectedMonth + 1, 0)
      
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]

      console.log('📊 Loading report for:', startStr, 'to', endStr)

      const { data, error } = await profitLossService.getProfitLossReport(startStr, endStr)
      if (error) throw new Error(error)
      
      console.log('📊 Report data received:', data)
      
      // Ensure data has all required properties
      setReportData({
        revenue: data?.revenue || { total: 0, count: 0, items: [] },
        expenses: data?.expenses || { total: 0, count: 0, items: [], byCategory: {} },
        profit: data?.profit || { net: 0, margin: 0, isPositive: true },
        summary: data?.summary || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 }
      })
    } catch (err) {
      console.error('❌ Load error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    notificationService.info('Export', 'Export functionality coming soon!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profit/loss report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading report: {error}
      </div>
    )
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = [2024, 2025, 2026]

  // Safely access nested properties
  const revenueTotal = reportData?.revenue?.total || 0
  const expensesTotal = reportData?.expenses?.total || 0
  const netProfit = reportData?.profit?.net || 0
  const profitMargin = reportData?.profit?.margin || 0
  const isPositive = reportData?.profit?.isPositive !== undefined ? reportData.profit.isPositive : netProfit >= 0
  const revenueCount = reportData?.revenue?.count || 0
  const revenueItems = reportData?.revenue?.items || []
  const expensesItems = reportData?.expenses?.items || []
  const expensesByCategory = reportData?.expenses?.byCategory || {}
  const expensesCount = reportData?.expenses?.count || 0

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Profit & Loss Report</h1>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => setViewType(viewType === 'summary' ? 'monthly' : 'summary')}>
            {viewType === 'summary' ? 'View Monthly' : 'View Summary'}
          </Button>
          <Button variant="secondary" onClick={handleExport}>📥 Export</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(revenueTotal)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(expensesTotal)}</p>
        </div>
        <div className={`bg-white rounded-lg shadow p-4 ${isPositive ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
          <p className="text-sm font-medium text-gray-500">Net Profit</p>
          <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Profit Margin</p>
          <p className="text-xl font-bold text-blue-600">{profitMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Monthly View */}
      {viewType === 'monthly' && monthlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month} {item.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(item.revenue || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(item.expenses || 0)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${(item.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.profit || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {(item.margin || 0).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-green-600">💰 Revenue Details</h2>
            <p className="text-sm text-gray-500">{revenueCount} transactions</p>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {revenueItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No revenue recorded</p>
            ) : (
              revenueItems.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-100 text-sm">
                  <span className="text-gray-600">{item.invoice_number || 'Sale'}</span>
                  <span className="font-medium text-green-600">{formatCurrency(item.total_amount || 0)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-red-600">💳 Expenses by Category</h2>
            <p className="text-sm text-gray-500">{expensesCount} transactions</p>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {Object.keys(expensesByCategory).length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses recorded</p>
            ) : (
              Object.entries(expensesByCategory).map(([category, data]) => (
                <div key={category} className="flex justify-between py-1 border-b border-gray-100 text-sm">
                  <span className="text-gray-600">{category} ({data.count || 0})</span>
                  <span className="font-medium text-red-600">{formatCurrency(data.total || 0)}</span>
                </div>
              ))
            )}
            <div className="flex justify-between py-2 mt-2 border-t border-gray-200 font-semibold">
              <span>Total Expenses</span>
              <span className="text-red-600">{formatCurrency(expensesTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfitLoss