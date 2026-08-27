 import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import WelcomeTour from './components/onboarding/WelcomeTour'
import HelpCenter from './components/onboarding/HelpCenter'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Customers from './pages/Customers'
import Analytics from './pages/Analytics'
import Users from './pages/admin/Users'
import Inventory from './pages/inventory/Inventory'
import Expenses from './pages/expenses/Expenses'
import ProfitLoss from './pages/reports/ProfitLoss'
import EmailReports from './pages/reports/EmailReports'
import BankReconciliation from './pages/finance/BankReconciliation'
import BudgetTracking from './pages/finance/BudgetTracking'
import CashFlow from './pages/finance/CashFlow'
import FeedbackAdmin from './pages/admin/FeedbackAdmin'
import Layout from './components/layout/Layout'

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('bizflow_visited')
    if (!hasVisited) {
      setIsFirstVisit(true)
      setShowTour(true)
    }
  }, [])

  const handleTourComplete = () => {
    localStorage.setItem('bizflow_visited', 'true')
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Layout />
                <WelcomeTour 
                  isFirstVisit={showTour} 
                  onComplete={handleTourComplete} 
                />
                <HelpCenter onStartTour={handleStartTour} />
              </>
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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App