import React from 'react'

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="skeleton h-4 w-24 mb-2"></div>
            <div className="skeleton h-8 w-32 mb-2"></div>
            <div className="skeleton h-4 w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="skeleton h-6 w-40"></div>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton h-6 flex-1"></div>
              <div className="skeleton h-6 w-24"></div>
              <div className="skeleton h-6 w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default LoadingSkeleton