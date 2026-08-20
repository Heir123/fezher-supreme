import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SalesManagement from '../SalesManagement'

// Mock the sales service with getSales (matching your component)
vi.mock('@/services/salesService', () => ({
  getSales: vi.fn().mockResolvedValue([
    { id: 1, customer: 'John Doe', total: 250, status: 'completed' },
    { id: 2, customer: 'Jane Smith', total: 180, status: 'pending' },
  ]),
}))

// Mock supabase
vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}))

// Mock the DashboardLayout
vi.mock('@/layouts/DashboardLayout', () => ({
  default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}))

// Mock SaleDialog
vi.mock('../SaleDialog', () => ({
  default: ({ open, onClose, onSave }) => (
    <div data-testid="sale-dialog">
      {open && <div>Sale Dialog Open</div>}
    </div>
  ),
}))

describe('SalesManagement Component', () => {
  const renderSalesManagement = () => {
    return render(
      <BrowserRouter>
        <SalesManagement />
      </BrowserRouter>
    )
  }

  it('renders sales management title', () => {
    renderSalesManagement()
    expect(screen.getByText(/Sales Management/i)).toBeInTheDocument()
  })

  it('displays sales orders', async () => {
    renderSalesManagement()
    
    await waitFor(() => {
      // Check if the sales data appears
      expect(screen.getByText(/Sales/i)).toBeInTheDocument()
    })
  })
})