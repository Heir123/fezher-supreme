import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard2 from '../Dashboard2'

// Mock the dashboard service
vi.mock('../../../services/dashboardService', () => ({
  getDashboardStats: vi.fn().mockResolvedValue({
    totalRevenue: 125000,
    totalOrders: 342,
    totalCustomers: 1289,
    totalProducts: 156,
    recentOrders: [
      { id: 1, customer: 'John Doe', amount: 250, status: 'completed' },
      { id: 2, customer: 'Jane Smith', amount: 180, status: 'pending' },
    ],
    salesData: [
      { month: 'Jan', sales: 12000 },
      { month: 'Feb', sales: 15000 },
      { month: 'Mar', sales: 18000 },
    ],
  }),
}))

// Mock the chart components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div>Line</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>Grid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}))

describe('Dashboard2 Component', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard2 />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dashboard', () => {
    renderDashboard()
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  it('displays stats cards after loading', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument()
    })
  })

  it('displays charts', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })

  it('displays recent orders', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText(/Recent Orders/i)).toBeInTheDocument()
    })
  })
})