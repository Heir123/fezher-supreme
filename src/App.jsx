import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import WelcomeTour from './components/onboarding/WelcomeTour'
import HelpCenter from './components/onboarding/HelpCenter'

// Pages
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import Products from './Pages/Products'
import Sales from './Pages/Sales'
import Customers from './Pages/Customers'
import Analytics from './Pages/Analytics'
import Users from './Pages/admin/Users'
import Inventory from './Pages/inventory/Inventory'
import Expenses from './Pages/expenses/Expenses'
import ProfitLoss from './Pages/reports/ProfitLoss'
import EmailReports from './Pages/reports/EmailReports'
import BankReconciliation from './Pages/finance/BankReconciliation'
import BudgetTracking from './Pages/finance/BudgetTracking'
import CashFlow from './Pages/finance/CashFlow'
import FeedbackAdmin from './Pages/admin/FeedbackAdmin'
import Settings from './Pages/Settings'
import Organizations from './Pages/admin/Organizations'
import Layout from './components/layout/Layout'

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('fezher_supreme_visited')
    if (!hasVisited) {
      setIsFirstVisit(true)
      setShowTour(true)
    }
  }, [])

  const handleTourComplete = () => {
    localStorage.setItem('fezher_supreme_visited', 'true')
    setIsFirstVisit(false)
    setShowTour(false)
  }

  const handleStartTour = () => {
    setShowTour(true)
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profit-loss" element={<ProfitLoss />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="customers" element={<Customers />} />
            <Route path="users" element={<Users />} />
            <Route path="email-reports" element={<EmailReports />} />
            <Route path="bank-reconciliation" element={<BankReconciliation />} />
            <Route path="budget" element={<BudgetTracking />} />
            <Route path="cash-flow" element={<CashFlow />} />
            <Route path="feedback" element={<FeedbackAdmin />} />
            <Route path="settings" element={<Settings />} />
            <Route path="organizations" element={<Organizations />} />
          </Route>
        </Routes>

        {/* Onboarding Components */}
        <WelcomeTour 
          isFirstVisit={showTour} 
          onComplete={handleTourComplete} 
        />
        <HelpCenter onStartTour={handleStartTour} />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App