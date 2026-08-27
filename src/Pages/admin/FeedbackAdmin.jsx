import React, { useState, useEffect } from 'react'
import { feedbackService } from '../../services/feedbackService'
import { notificationService } from '../../services/notificationService'
import Button from '../../components/common/Button'
import { AdminOnly } from '../../components/common/RoleBasedAccess'
import { formatDate } from '../../utils/helpers'

const FeedbackAdmin = () => {
  const [feedback, setFeedback] = useState([])
  const [featureRequests, setFeatureRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('feedback')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: feedbackData, error: feedbackError } = await feedbackService.getAllFeedback()
      if (feedbackError) throw new Error(feedbackError)
      setFeedback(feedbackData || [])

      const { data: featureData, error: featureError } = await feedbackService.getFeatureRequests()
      if (featureError) throw new Error(featureError)
      setFeatureRequests(featureData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status, type = 'feedback') => {
    try {
      if (type === 'feedback') {
        const { error } = await feedbackService.updateFeedbackStatus(id, status)
        if (error) throw new Error(error)
      } else {
        const { error } = await feedbackService.updateFeatureStatus(id, status)
        if (error) throw new Error(error)
      }
      notificationService.success('Updated', `Status updated to ${status}`)
      loadData()
    } catch (err) {
      notificationService.error('Failed to update', err.message)
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'text-yellow-800 bg-yellow-100',
      in_progress: 'text-blue-800 bg-blue-100',
      resolved: 'text-green-800 bg-green-100',
      closed: 'text-gray-800 bg-gray-100',
      under_review: 'text-purple-800 bg-purple-100',
      approved: 'text-green-800 bg-green-100',
      in_development: 'text-orange-800 bg-orange-100',
      released: 'text-blue-800 bg-blue-100',
      declined: 'text-red-800 bg-red-100'
    }
    return colors[status] || 'text-gray-800 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminOnly fallback={
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        ⚠️ You don't have permission to view this page. Admin access required.
      </div>
    }>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">💬 User Feedback</h1>
          <Button variant="secondary" onClick={loadData}>Refresh</Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'feedback' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback ({feedback.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('features')}
          >
            Feature Requests ({featureRequests.length})
          </button>
        </div>

        {activeTab === 'feedback' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedback.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No feedback yet</td>
                    </tr>
                  ) : (
                    feedback.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.user_name || item.user_email || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full text-white bg-blue-600">
                            {item.feedback_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                            {item.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={item.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {featureRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No feature requests yet</td>
                    </tr>
                  ) : (
                    featureRequests.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full text-white bg-purple-600">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          👍 {item.votes || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                            {item.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={item.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value, 'feature')}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="in_development">In Development</option>
                            <option value="released">Released</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminOnly>
  )
}

export default FeedbackAdmin