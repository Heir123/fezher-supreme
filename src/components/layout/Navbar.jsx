 import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import FeedbackModal from '../feedback/FeedbackModal'

const Navbar = () => {
  const { user, logout, userRole } = useAuth()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">BizFlow</h1>
            <span className="ml-3 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {userRole || 'staff'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFeedbackOpen(true)}
              className="feedback-btn"
            >
              💬 Feedback
            </Button>
            <span className="text-sm text-gray-600 user-profile">
              Welcome, {user?.user_metadata?.name || user?.email || 'User'}
            </span>
            <Button variant="outline" size="sm" onClick={logout} className="logout-btn">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </>
  )
}

export default Navbar