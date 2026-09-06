import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import FeedbackModal from '../feedback/FeedbackModal'

const Navbar = ({ onMenuClick }) => {
  const { user, logout, userRole } = useAuth()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'

  return (
    <>
      <header className="h-16 shrink-0 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-4 md:px-6">

          {/* LEFT SIDE */}
          <div className="flex min-w-0 items-center gap-3">

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
              aria-label="Open navigation"
            >
              ☰
            </button>

            {/* PAGE BRAND */}
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-gray-900">
                Fezher Supreme
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Management Dashboard
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* FEEDBACK */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFeedbackOpen(true)}
              className="feedback-btn !rounded-lg"
            >
              <span className="hidden sm:inline">💬 </span>
              Feedback
            </Button>

            {/* USER PROFILE */}
            <div className="hidden items-center gap-3 border-l border-gray-200 pl-4 sm:flex">

              {/* AVATAR */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {displayName.charAt(0).toUpperCase()}
              </div>

              {/* USER INFO */}
              <div className="hidden lg:block">
                <p className="max-w-[180px] truncate text-sm font-medium text-gray-800">
                  {displayName}
                </p>

                <p className="text-xs capitalize text-gray-500">
                  {userRole || 'User'}
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="logout-btn !rounded-lg"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">↪</span>
            </Button>

          </div>
        </div>
      </header>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  )
}

export default Navbar