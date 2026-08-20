import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout min-h-screen bg-gray-50">
      <main className="main-content p-6">
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default DashboardLayout