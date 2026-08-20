import { vi } from 'vitest'
import '@testing-library/jest-dom'  // Make sure this is at the top
import React from 'react'

// ... rest of your setup code
// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => children,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  Link: ({ children }) => children,
  MemoryRouter: ({ children }) => children,
  Outlet: () => null,
}))

// Mock @/lib/utils
vi.mock('@/lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}))

// Mock @/layouts/DashboardLayout - Use React.createElement
vi.mock('@/layouts/DashboardLayout', () => ({
  default: ({ children }) => {
    return React.createElement('div', { 'data-testid': 'dashboard-layout' }, children)
  },
}))

// Mock @/services/authService
vi.mock('@/services/authService', () => ({
  signIn: vi.fn().mockResolvedValue({ user: { email: 'test@test.com' }, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  getCurrentUser: vi.fn().mockResolvedValue({ user: null, error: null }),
}))

// Mock @/services/productService
vi.mock('@/services/productService', () => ({
  getProducts: vi.fn().mockResolvedValue({ data: [], error: null }),
  deleteProduct: vi.fn().mockResolvedValue({ error: null }),
  createProduct: vi.fn().mockResolvedValue({ data: {}, error: null }),
  updateProduct: vi.fn().mockResolvedValue({ data: {}, error: null }),
}))

// Mock @/services/salesService
vi.mock('@/services/salesService', () => ({
  getSales: vi.fn().mockResolvedValue({ data: [], error: null }),
  createSale: vi.fn().mockResolvedValue({ data: {}, error: null }),
  deleteSale: vi.fn().mockResolvedValue({ error: null }),
}))

// Mock @/services/executiveDashboardService
vi.mock('@/services/executiveDashboardService', () => ({
  getExecutiveDashboard: vi.fn().mockResolvedValue({ data: {}, error: null }),
  getExecutiveSummary: vi.fn().mockResolvedValue({ data: {}, error: null }),
  getBusinessHealth: vi.fn().mockResolvedValue({ data: {}, error: null }),
  getPerformanceMetrics: vi.fn().mockResolvedValue({ data: {}, error: null }),
  getAIAnalytics: vi.fn().mockResolvedValue({ data: {}, error: null }),
}))

// Mock @/services/topProductsService
vi.mock('@/services/topProductsService', () => ({
  getTopSellingProducts: vi.fn().mockResolvedValue({ data: [], error: null }),
}))

// Mock @/services/lowStockService
vi.mock('@/services/lowStockService', () => ({
  getLowStockProducts: vi.fn().mockResolvedValue({ data: [], error: null }),
}))

// Mock @/services/supabase
vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.scrollTo
window.scrollTo = vi.fn()

// Suppress console errors during tests
const originalConsoleError = console.error
console.error = vi.fn((...args) => {
  if (
    args[0]?.includes?.('Warning:') ||
    args[0]?.includes?.('ReactDOM.render') ||
    args[0]?.includes?.('not wrapped in act')
  ) {
    return
  }
  originalConsoleError(...args)
})