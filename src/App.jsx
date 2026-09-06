import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import { SocketProvider } from './context/SocketContext'
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
import Settings from './pages/Settings'
import Organizations from './pages/admin/Organizations'
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
        <CurrencyProvider>
          <ThemeProvider>
            <NotificationProvider>
              <SocketProvider>
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
              </SocketProvider>
            </NotificationProvider>
          </ThemeProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App