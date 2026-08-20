import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock React Router v7
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  }
})

// Mock MUI components
vi.mock('@mui/material', () => ({
  Box: ({ children }) => <div>{children}</div>,
  Typography: ({ children }) => <span>{children}</span>,
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  Grid: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  TextField: ({ children, ...props }) => <input {...props}>{children}</input>,
  Dialog: ({ children, open, ...props }) => open ? <div {...props}>{children}</div> : null,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogActions: ({ children }) => <div>{children}</div>,
  IconButton: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  useTheme: () => ({ palette: { mode: 'light' } }),
}))

// Mock MUI icons
vi.mock('@mui/icons-material', () => ({
  Dashboard: () => <span>DashboardIcon</span>,
  People: () => <span>PeopleIcon</span>,
  Inventory: () => <span>InventoryIcon</span>,
  AttachMoney: () => <span>MoneyIcon</span>,
  Settings: () => <span>SettingsIcon</span>,
  Menu: () => <span>MenuIcon</span>,
  Close: () => <span>CloseIcon</span>,
  Search: () => <span>SearchIcon</span>,
  Add: () => <span>AddIcon</span>,
  Edit: () => <span>EditIcon</span>,
  Delete: () => <span>DeleteIcon</span>,
}))

// Mock Supabase
vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(),
          limit: vi.fn(),
        })),
        order: vi.fn(),
        limit: vi.fn(),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(),
        single: vi.fn(),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(),
          single: vi.fn(),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
    auth: {
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

// Suppress React 19 console warnings in tests
const originalError = console.error
console.error = (...args) => {
  const message = args[0]?.toString() || ''
  if (message.includes('Warning: ReactDOM.render is no longer supported')) {
    return
  }
  if (message.includes('Warning: React.createElement')) {
    return
  }
  if (message.includes('not wrapped in act')) {
    return
  }
  if (message.includes('inside a test was not wrapped in act')) {
    return
  }
  originalError(...args)
}