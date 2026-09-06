import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  TrendingUp,
  Wallet,
  Building2,
  Mail,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import CurrencySelector from '../common/CurrencySelector'
import NotificationDropdown from '../common/NotificationDropdown'
import RealTimeIndicator from '../common/RealTimeIndicator'
import DarkModeToggle from '../common/DarkModeToggle'

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { 
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'blue'
    },
    { 
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      color: 'violet'
    },
    { 
      label: 'Profit & Loss',
      icon: TrendingUp,
      path: '/profit-loss',
      color: 'emerald'
    },
    { 
      label: 'Cash Flow',
      icon: Wallet,
      path: '/cash-flow',
      color: 'teal'
    },
    { 
      label: 'Budget',
      icon: DollarSign,
      path: '/budget',
      color: 'amber'
    },
    { 
      label: 'Bank Reconciliation',
      icon: Building2,
      path: '/bank-reconciliation',
      color: 'indigo'
    },
    { 
      label: 'Sales',
      icon: ShoppingBag,
      path: '/sales',
      color: 'rose'
    },
    { 
      label: 'Customers',
      icon: Users,
      path: '/customers',
      color: 'cyan'
    },
    { 
      label: 'Expenses',
      icon: DollarSign,
      path: '/expenses',
      color: 'orange'
    },
    { 
      label: 'Inventory',
      icon: Package,
      path: '/inventory',
      color: 'purple'
    },
    { 
      label: 'Products',
      icon: Package,
      path: '/products',
      color: 'pink'
    },
    { 
      label: 'Email Reports',
      icon: Mail,
      path: '/email-reports',
      color: 'sky'
    },
    { 
      label: 'Users',
      icon: Users,
      path: '/users',
      color: 'gray'
    },
    { 
      label: 'Organizations',
      icon: Building2,
      path: '/organizations',
      color: 'indigo'
    },
    { 
      label: 'Feedback',
      icon: MessageSquare,
      path: '/feedback',
      color: 'lime'
    },
    { 
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      color: 'indigo'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
      violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
      emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
      teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
      amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
      indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
      rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
      cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100',
      orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
      purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
      pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100',
      sky: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
      gray: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
      lime: 'bg-lime-50 text-lime-600 group-hover:bg-lime-100'
    }
    return colors[color] || colors.blue
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200/80 dark:border-gray-700/80 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}
      >
        {/* Brand */}
        <div className={`flex h-16 items-center ${isCollapsed ? 'justify-center' : 'px-4'} border-b border-gray-200/80 dark:border-gray-700/80`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">Fezher Supreme</h1>
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const colorClasses = getColorClasses(item.color)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0 ${
                    isActive ? colorClasses : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-600/50 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200/80 dark:border-gray-700/80 p-3 space-y-1">
          {!isCollapsed ? (
            <>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <span>Help</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500">
                  <Settings className="h-4 w-4" />
                </div>
                <span>Settings</span>
              </button>
            </>
          ) : (
            <>
              <button className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </button>
              <button className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-gray-600 dark:text-gray-400 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500">
                  <Settings className="h-4 w-4" />
                </div>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileOpen(!isMobileOpen)
                  } else {
                    setIsCollapsed(!isCollapsed)
                  }
                }}
                className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Toggle Button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Real-Time Indicator */}
              <RealTimeIndicator />

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Currency Selector */}
              <CurrencySelector />

              {/* Notification Dropdown */}
              <NotificationDropdown />

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white shadow-lg shadow-blue-500/25">
                    {user?.name?.[0] || 'H'}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                    <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@fezher.com'}</p>
                    </div>
                    <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700">
                      <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>© 2026 Fezher Supreme</span>
              <span className="hidden sm:inline">•</span>
              <span>v2.0.0</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout