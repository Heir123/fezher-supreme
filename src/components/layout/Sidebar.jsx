 import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { isAdmin } = useAuth()

  const links = [
    { to: '/', label: 'Dashboard', icon: '📊', className: 'dashboard-link' },
    { to: '/analytics', label: 'Analytics', icon: '📈', className: 'analytics-link' },
    { to: '/profit-loss', label: 'Profit/Loss', icon: '📊', className: 'profit-loss-link' },
    { to: '/cash-flow', label: 'Cash Flow', icon: '💵', className: 'cash-flow-link' },
    { to: '/budget', label: 'Budget', icon: '💰', className: 'budget-link' },
    { to: '/bank-reconciliation', label: 'Bank Reconciliation', icon: '🏦', className: 'bank-reconciliation-link' },
    { to: '/inventory', label: 'Inventory', icon: '📦', className: 'inventory-link' },
    { to: '/products', label: 'Products', icon: '🏷️', className: 'products-link' },
    { to: '/sales', label: 'Sales', icon: '💰', className: 'sales-link' },
    { to: '/expenses', label: 'Expenses', icon: '💳', className: 'expenses-link' },
    { to: '/customers', label: 'Customers', icon: '👤', className: 'customers-link' },
    { to: '/email-reports', label: 'Email Reports', icon: '📧', className: 'email-reports-link' },
  ]

  // Only show Users link for admins
  if (isAdmin) {
    links.push({ to: '/users', label: 'Users', icon: '👥', className: 'users-link' })
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">BizFlow</h1>
        <p className="text-sm text-gray-500">Management Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                link.className,
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors',
                isActive && 'bg-blue-50 text-blue-600 font-medium'
              )
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400">BizFlow v1.0</div>
      </div>
    </aside>
  )
}

export default Sidebar