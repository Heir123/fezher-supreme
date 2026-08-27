import React, { useState } from 'react'
import Button from '../common/Button'
import { feedbackService } from '../../services/feedbackService'
import { notificationService } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'

const FeedbackModal = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    feedback_type: 'general',
    subject: '',
    message: '',
    priority: 'medium',
    rating: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFeatureRequest, setIsFeatureRequest] = useState(false)
  const [featureData, setFeatureData] = useState({
    title: '',
    description: '',
    category: 'new_feature',
    priority: 'medium'
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (e) => {
    const { name, value } = e.target
    setFeatureData(prev => ({ ...prev, [name]: value }))
  }

  const handleRating = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        user_id: user?.id,
        user_email: user?.email,
        user_name: user?.user_metadata?.name || user?.email,
        ...formData
      }

      const { error } = await feedbackService.submitFeedback(data)
      if (error) throw new Error(error)
      
      notificationService.success('Thank You!', 'Your feedback has been submitted successfully.')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        user_id: user?.id,
        user_email: user?.email,
        user_name: user?.user_metadata?.name || user?.email,
        ...featureData
      }

      const { error } = await feedbackService.submitFeatureRequest(data)
      if (error) throw new Error(error)
      
      notificationService.success('Feature Request Sent!', 'Your feature request has been submitted.')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isFeatureRequest ? '💡 Feature Request' : '💬 Feedback'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isFeatureRequest ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
              <select
                name="feedback_type"
                value={formData.feedback_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Suggestion</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your feedback in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" variant="primary" className="w-full" loading={loading} disabled={loading}>
                Submit Feedback
              </Button>
              <button
                type="button"
                onClick={() => setIsFeatureRequest(true)}
                className="text-sm text-blue-600 hover:text-blue-700 text-center"
              >
                💡 Submit a Feature Request instead
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feature Title</label>
              <input
                type="text"
                name="title"
                value={featureData.title}
                onChange={handleFeatureChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What feature would you like?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={featureData.description}
                onChange={handleFeatureChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the feature and why it would be useful..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={featureData.category}
                onChange={handleFeatureChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new_feature">New Feature</option>
                <option value="improvement">Improvement</option>
                <option value="integration">Integration</option>
                <option value="automation">Automation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={featureData.priority}
                onChange={handleFeatureChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" variant="primary" className="w-full" loading={loading} disabled={loading}>
                Submit Feature Request
              </Button>
              <button
                type="button"
                onClick={() => setIsFeatureRequest(false)}
                className="text-sm text-blue-600 hover:text-blue-700 text-center"
              >
                💬 Submit Feedback instead
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default FeedbackModal