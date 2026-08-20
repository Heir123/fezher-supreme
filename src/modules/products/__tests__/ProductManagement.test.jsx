import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductManagement from '../ProductManagement'

vi.mock('../../../services/productService', () => ({
  getProducts: vi.fn().mockResolvedValue([
    { id: 1, name: 'Product 1', price: 99.99, stock: 50 },
    { id: 2, name: 'Product 2', price: 149.99, stock: 30 },
    { id: 3, name: 'Product 3', price: 199.99, stock: 20 },
  ]),
  deleteProduct: vi.fn().mockResolvedValue({ success: true }),
}))

describe('ProductManagement Component', () => {
  const renderProductManagement = () => {
    return render(
      <BrowserRouter>
        <ProductManagement />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders product management title', () => {
    renderProductManagement()
    // Use a more specific heading
    expect(screen.getByText(/Manage products, stock and inventory/i)).toBeInTheDocument()
  })

  it('displays product list', async () => {
    renderProductManagement()
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 2')).toBeInTheDocument()
      expect(screen.getByText('Product 3')).toBeInTheDocument()
    })
  })

  it('shows add product button', () => {
    renderProductManagement()
    // Use a more specific button text
    expect(screen.getByText(/Add Product/i)).toBeInTheDocument()
  })
})