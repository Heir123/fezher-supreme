 import React, { useState, useEffect, useRef } from 'react'
import { chartService } from '../services/chartService'
import { exportService } from '../services/exportService'
import SalesTrendChart from '../components/charts/SalesTrendChart'
import TopProductsChart from '../components/charts/TopProductsChart'
import SalesStatusChart from '../components/charts/SalesStatusChart'
import MonthlyRevenueChart from '../components/charts/MonthlyRevenueChart'
import ExportButtons from '../components/common/ExportButtons'
import { formatCurrency } from '../utils/helpers'
import { notificationService } from '../services/notificationService'
const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chartData, setChartData] = useState({
    trend: [],
    topProducts: [],
    status: [],
    monthlyRevenue: []
  })
  const [days, setDays] = useState(30)
  
  const reportRef = useRef(null)
  const chartRefs = {
    trend: useRef(null),
    monthly: useRef(null),
    topProducts: useRef(null),
    status: useRef(null)
  }

  useEffect(() => {
    loadChartData()
  }, [days])

  const loadChartData = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await chartService.getDashboardData()
      if (error) throw new Error(error)
      setChartData(data || { trend: [], topProducts: [], status: [], monthlyRevenue: [] })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary stats
  const totalRevenue = chartData.trend?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0
  const totalSales = chartData.trend?.reduce((sum, item) => sum + (item.sales || 0), 0) || 0
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

  // Export functions
  const exportReportAsImage = async () => {
  if (reportRef.current) {
    const result = await exportService.exportChartAsImage(reportRef.current, 'analytics_report.png')
    if (result.success) {
      notificationService.success('Export Successful', 'Image downloaded successfully')
    } else {
      notificationService.error('Export Failed', result.error)
    }
  }
}

const exportReportAsPDF = async () => {
  if (reportRef.current) {
    const result = await exportService.exportToPDF(reportRef.current, 'analytics_report.pdf', 'Analytics Report')
    if (result.success) {
      notificationService.success('Export Successful', 'PDF downloaded successfully')
    } else {
      notificationService.error('Export Failed', result.error)
    }
  }
}

const exportDataAsExcel = () => {
  const exportData = [
    ...chartData.trend.map(item => ({ type: 'Sales Trend', date: item.date, sales: item.sales, revenue: item.revenue })),
    ...chartData.topProducts.map(item => ({ type: 'Top Products', name: item.name, quantity: item.total_quantity, revenue: item.total_revenue })),
    ...chartData.status.map(item => ({ type: 'Sales Status', status: item.name, count: item.count, revenue: item.revenue }))
  ]
  const result = exportService.exportToExcel(exportData, 'analytics_data.xlsx', 'Analytics')
  if (result.success) {
    notificationService.success('Export Successful', 'Excel file downloaded successfully')
  } else {
    notificationService.error('Export Failed', result.error)
  }
}

const printReport = () => {
  if (reportRef.current) {
    exportService.printReport(reportRef.current)
    notificationService.info('Print', 'Print window opened')
  }
}

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading analytics: {error}
      </div>
    )
  }

  return (
    <div ref={reportRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Analytics & Charts</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Period:</label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <ExportButtons
            onExportImage={exportReportAsImage}
            onExportPDF={exportReportAsPDF}
            onExportExcel={exportDataAsExcel}
            onPrint={printReport}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrderValue)}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div ref={chartRefs.trend}>
          <SalesTrendChart data={chartData.trend} />
        </div>
        <div ref={chartRefs.monthly}>
          <MonthlyRevenueChart data={chartData.monthlyRevenue} />
        </div>
        <div ref={chartRefs.topProducts}>
          <TopProductsChart data={chartData.topProducts} />
        </div>
        <div ref={chartRefs.status}>
          <SalesStatusChart data={chartData.status} />
        </div>
      </div>
    </div>
  )
}

export default Analytics