import React, { useState, useEffect } from 'react'
import { budgetService } from '../../services/budgetService'
import { notificationService } from '../../services/notificationService'
import Button from '../../components/common/Button'
import { formatCurrency } from '../../utils/helpers'

const BudgetTracking = () => {
  const [budgets, setBudgets] = useState([])
  const [comparison, setComparison] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    period: 'monthly'
  })

  useEffect(() => {
    loadData()
  }, [selectedYear, selectedMonth])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: budgetsData, error: budgetsError } = await budgetService.getBudgets(selectedYear, selectedMonth)
      if (budgetsError) throw new Error(budgetsError)
      setBudgets(budgetsData || [])

      const { data: comparisonData, error: comparisonError } = await budgetService.getBudgetVsActual(selectedYear, selectedMonth)
      if (comparisonError) throw new Error(comparisonError)
      setComparison(comparisonData || [])

      const { data: summaryData, error: summaryError } = await budgetService.getBudgetSummary(selectedYear, selectedMonth)
      if (summaryError) throw new Error(summaryError)
      setSummary(summaryData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        year: selectedYear,
        month: selectedMonth
      }

      if (editingBudget) {
        const { data, error } = await budgetService.updateBudget(editingBudget.id, budgetData)
        if (error) throw new Error(error)
        notificationService.success('Budget Updated', `${data.category} updated`)
      } else {
        const { data, error } = await budgetService.createBudget(budgetData)
        if (error) throw new Error(error)
        notificationService.success('Budget Added', `${data.category} added`)
      }

      setIsModalOpen(false)
      setEditingBudget(null)
      setFormData({ category: '', amount: '', description: '', period: 'monthly' })
      loadData()
    } catch (err) {
      notificationService.error('Failed to save budget', err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this budget?')) return
    try {
      const { error } = await budgetService.deleteBudget(id)
      if (error) throw new Error(error)
      notificationService.success('Budget Deleted', 'Budget removed')
      loadData()
    } catch (err) {
      notificationService.error('Failed to delete', err.message)
    }
  }

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading budget data...</p>
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
        <h1 className="text-2xl font-bold text-gray-900">💰 Budget Tracking</h1>
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
          <Button variant="primary" onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}>
            Add Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Total Budgeted</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalBudgeted)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-gray-500">Total Actual</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.totalActual)}</p>
          </div>
          <div className={`bg-white rounded-lg shadow p-4 ${summary.totalVariance >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <p className="text-sm font-medium text-gray-500">Variance</p>
            <p className={`text-xl font-bold ${summary.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.totalVariance)}
            </p>
          </div>
        </div>
      )}

      {/* Budget Comparison Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budgeted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparison.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No budgets found for this period
                  </td>
                </tr>
              ) : (
                comparison.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(item.budgeted)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {formatCurrency(item.actual)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getVarianceColor(item.variance)}`}>
                      {formatCurrency(item.variance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${item.percentage > 100 ? 'bg-red-600' : 'bg-green-600'}`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{item.percentage.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <Button variant="outline" size="sm" onClick={() => {
                        const budget = budgets.find(b => b.category === item.category)
                        if (budget) {
                          setEditingBudget(budget)
                          setFormData({
                            category: budget.category,
                            amount: budget.amount,
                            description: budget.description || '',
                            period: budget.period || 'monthly'
                          })
                          setIsModalOpen(true)
                        }
                      }}>Edit</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingBudget ? 'Edit Budget' : 'Add Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Office Supplies"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingBudget(null); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingBudget ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetTracking