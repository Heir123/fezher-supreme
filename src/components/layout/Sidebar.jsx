import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ onClose }) => {
  const { isAdmin } = useAuth()

  const sections = [
    {
      title: 'Overview',
      links: [
        { to: '/', label: 'Dashboard', icon: '📊', end: true },
        { to: '/analytics', label: 'Analytics', icon: '📈' },
      ],
    },
    {
      title: 'Finance',
      links: [
        { to: '/profit-loss', label: 'Profit & Loss', icon: '📊' },
        { to: '/cash-flow', label: 'Cash Flow', icon: '💵' },
        { to: '/budget', label: 'Budget', icon: '💰' },
        {
          to: '/bank-reconciliation',
          label: 'Bank Reconciliation',
          icon: '🏦',
        },
      ],
    },
    {
      title: 'Sales',
      links: [
        { to: '/sales', label: 'Sales', icon: '🛒' },
        { to: '/customers', label: 'Customers', icon: '👤' },
        { to: '/expenses', label: 'Expenses', icon: '💳' },
      ],
    },
    {
      title: 'Inventory',
      links: [
        { to: '/inventory', label: 'Inventory', icon: '📦' },
        { to: '/products', label: 'Products', icon: '🏷️' },
      ],
    },
    {
      title: 'Reporting',
      links: [
        {
          to: '/email-reports',
          label: 'Email Reports',
          icon: '📧',
        },
      ],
    },
  ]

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">

      {/* BRAND */}
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg shadow-lg">
              📊
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Fezher Supreme
              </h1>

              <p className="text-xs text-slate-400">
                Management Dashboard
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="Close navigation"
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">

        {sections.map((section) => (
          <div key={section.title} className="mb-6">

            {/* SECTION TITLE */}
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {section.title}
            </p>

            {/* LINKS */}
            <div className="space-y-1">

              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-950/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )
                  }
                >
                  <span className="flex w-6 items-center justify-center text-base">
                    {link.icon}
                  </span>

                  <span className="truncate">
                    {link.label}
                  </span>
                </NavLink>
              ))}

            </div>
          </div>
        ))}

        {/* ADMINISTRATION */}
        {isAdmin && (
          <div className="mb-6">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Administration
            </p>

            <NavLink
              to="/users"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <span className="flex w-6 items-center justify-center text-base">
                👥
              </span>

              <span>Users</span>
            </NavLink>

          </div>
        )}

      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-800 p-4">
        <p className="text-xs font-medium text-slate-500">
          Fezher Supreme
        </p>

        <p className="mt-1 text-[11px] text-slate-600">
          Management Dashboard • v1.0
        </p>
      </div>

    </aside>
  )
}

export default Sidebar