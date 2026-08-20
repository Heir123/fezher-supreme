import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../Navbar'

describe('Navbar Component', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    // Use a simpler assertion that doesn't need toBeInTheDocument
    const brand = screen.getByText(/Fezher Supreme/i)
    expect(brand).toBeTruthy()  // This works without jest-dom
    
    // Or check by role
    const heading = screen.getByRole('heading', { name: /Fezher Supreme/i })
    expect(heading).toBeTruthy()
  })
})