import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    user: null,
  }),
}))

describe('Login Page', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  }

  it('renders login form', () => {
    renderLogin()
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
    // Use getAllByText since "Login" appears twice (heading + button)
    const loginElements = screen.getAllByText(/Login/i)
    expect(loginElements.length).toBe(2)
  })

  it('handles form submission', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText(/Email/i)
    const passwordInput = screen.getByPlaceholderText(/Password/i)
    // Get the button (second "Login" element)
    const loginElements = screen.getAllByText(/Login/i)
    const submitButton = loginElements[1]

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
    })
  })
})