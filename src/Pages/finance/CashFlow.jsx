import React, { useState, useEffect } from 'react'
import { cashFlowService } from '../../services/cashFlowService'
import { formatCurrency, formatDate } from '../../utils/helpers'
import Button from '../../components/common/Button'

const CashFlow = () => {
  const [summary, setSummary] = useState(null)
  const [trend, setTrend] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [cashPosition, setCashPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    loadData()
  }, [selectedYear, selectedMonth])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      // Get monthly cash flow
      const { data: monthly, error: monthlyError } = await cashFlowService.getMonthlyCashFlow(selectedYear)
      if (monthlyError) throw new Error(monthlyError)
      setMonthlyData(monthly || [])

      // Get current month cash flow
      const startDate = new Date(selectedYear, selectedMonth - 1, 1)
      const endDate = new Date(selectedYear, selectedMonth, 0)
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]

      const { data, error } = await cashFlowService.getCashFlowSummary(startStr, endStr)
      if (error) throw new Error(error)
      setSummary(data.summary)
      setTrend(data.trend || [])

      // Get cash position
      const { data: position, error: positionError } = await cashFlowService.getCashPosition()
      if (positionError) throw new Error(positionError)
      setCashPosition(position)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cash flow data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    )
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = [2024, 2025, 2026]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">💵 Cash Flow</h1>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
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
          <Button variant="secondary" onClick={loadData}>Refresh</Button>
        </div>
      </div>

      {/* Cash Position */}
      {cashPosition && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash Position</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(cashPosition.totalBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">30-Day Inflow</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(cashPosition.thirtyDayInflow)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">30-Day Outflow</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(cashPosition.thirtyDayOutflow)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">30-Day Net</p>
              <p className={`text-xl font-bold ${cashPosition.thirtyDayNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashPosition.thirtyDayNet)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Accounts</p>
              <p className="text-xl font-bold text-gray-900">{cashPosition.accounts?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Cash Flow */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Cash Flow</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inflow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outflow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.month} {item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(item.inflow)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(item.outflow)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(item.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Total Inflow</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalInflow)}</p>
            <p className="text-xs text-gray-400">{summary.transactionCount} transactions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Total Outflow</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(summary.totalOutflow)}</p>
            <p className="text-xs text-gray-400">{summary.transactionCount} transactions</p>
          </div>
          <div className={`bg-white rounded-lg shadow p-4 ${summary.netCashFlow >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <p className="text-sm font-medium text-gray-500">Net Cash Flow</p>
            <p className={`text-xl font-bold ${summary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.netCashFlow)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CashFlow