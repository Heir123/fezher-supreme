import React, { useState, useEffect } from 'react'
import { emailReportService } from '../../services/emailReportService'
import { notificationService } from '../../services/notificationService'
import { profitLossService } from '../../services/profitLossService'
import Button from '../../components/common/Button'

const EmailReports = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [reportType, setReportType] = useState('daily')
  const [scheduledReports, setScheduledReports] = useState([])
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')

  useEffect(() => {
    loadScheduledReports()
  }, [])

  const loadScheduledReports = async () => {
    try {
      const { data, error } = await emailReportService.getScheduledReports()
      if (error) throw new Error(error)
      setScheduledReports(data || [])
    } catch (err) {
      console.error('Failed to load scheduled reports:', err)
    }
  }

  const handleSendReport = async () => {
    if (!email) {
      notificationService.error('Email Required', 'Please enter an email address')
      return
    }

    setLoading(true)
    try {
      // Get current month report
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const startStr = startDate.toISOString().split('T')[0]
      const endStr = endDate.toISOString().split('T')[0]

      const { data, error } = await profitLossService.getProfitLossReport(startStr, endStr)
      if (error) throw new Error(error)

      const result = await emailReportService.sendEmailReport(email, data, reportType)
      if (result.error) throw new Error(result.error)
      
      notificationService.success('Report Sent', `Report sent to ${email}`)
      setEmail('')
      loadScheduledReports()
    } catch (err) {
      notificationService.error('Failed to send report', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendTestReport = async () => {
    if (!email) {
      notificationService.error('Email Required', 'Please enter an email address')
      return
    }

    setLoading(true)
    try {
      const result = await emailReportService.sendTestReport(email)
      if (result.error) throw new Error(result.error)
      
      notificationService.success('Test Report Sent', `Test report sent to ${email}`)
    } catch (err) {
      notificationService.error('Failed to send test report', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleReport = async () => {
    if (!email) {
      notificationService.error('Email Required', 'Please enter an email address')
      return
    }

    if (!scheduleDate) {
      notificationService.error('Date Required', 'Please select a date')
      return
    }

    setLoading(true)
    try {
      const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}:00`)
      
      const scheduleData = {
        recipient_email: email,
        report_type: reportType,
        scheduled_for: scheduledFor.toISOString(),
        status: 'scheduled'
      }

      const { data, error } = await emailReportService.scheduleReport(scheduleData)
      if (error) throw new Error(error)
      
      notificationService.success('Report Scheduled', `Report scheduled for ${scheduleDate} at ${scheduleTime}`)
      setIsScheduling(false)
      setEmail('')
      setScheduleDate('')
      loadScheduledReports()
    } catch (err) {
      notificationService.error('Failed to schedule report', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSchedule = async (id) => {
    if (!confirm('Are you sure you want to cancel this scheduled report?')) return
    
    try {
      const { error } = await emailReportService.cancelScheduledReport(id)
      if (error) throw new Error(error)
      
      notificationService.success('Report Cancelled', 'Scheduled report has been cancelled')
      loadScheduledReports()
    } catch (err) {
      notificationService.error('Failed to cancel report', err.message)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent': return 'text-green-800 bg-green-100'
      case 'pending': return 'text-yellow-800 bg-yellow-100'
      case 'scheduled': return 'text-blue-800 bg-blue-100'
      case 'cancelled': return 'text-red-800 bg-red-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📧 Email Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Report Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📤 Send Report</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="profit-loss">Profit & Loss Report</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                onClick={handleSendReport} 
                loading={loading}
                disabled={loading}
              >
                Send Report
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleSendTestReport} 
                loading={loading}
                disabled={loading}
              >
                Send Test
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Report Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Schedule Report</h2>
          {!isScheduling ? (
            <Button variant="primary" onClick={() => setIsScheduling(true)}>
              + New Schedule
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily Report</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="profit-loss">Profit & Loss Report</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={handleScheduleReport} 
                  loading={loading}
                  disabled={loading}
                >
                  Schedule
                </Button>
                <Button variant="secondary" onClick={() => setIsScheduling(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Reports List */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Scheduled Reports</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {scheduledReports.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No scheduled reports found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled For</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduledReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.recipient_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.report_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.scheduled_for ? new Date(report.scheduled_for).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.status === 'scheduled' && (
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleCancelSchedule(report.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailReports