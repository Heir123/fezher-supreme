import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
// Import Dashboard2 since that's what you have
import Dashboard from '../Dashboard2'

vi.mock('../../../services/dashboardService', () => ({
  getDashboardStats: vi.fn().mockResolvedValue({
    totalRevenue: 125000,
    totalOrders: 342,
    totalCustomers: 1289,
    totalProducts: 156,
  }),
}))

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
}))

describe('Dashboard Component', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
  }

  it('renders the dashboard', () => {
    renderDashboard()
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })

  it('displays stats cards', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument()
    })
  })
})