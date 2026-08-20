import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'

describe('Sidebar Component', () => {
  const renderSidebar = () => {
    return render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
  }

  it('renders sidebar navigation links', () => {
    renderSidebar()
    // Use queryAllByText to check that links exist
    const dashboardLinks = screen.queryAllByText(/Dashboard/i)
    expect(dashboardLinks.length).toBeGreaterThan(0)
    
    const productLinks = screen.queryAllByText(/Products/i)
    expect(productLinks.length).toBeGreaterThan(0)
    
    const salesLinks = screen.queryAllByText(/Sales/i)
    expect(salesLinks.length).toBeGreaterThan(0)
  })
})