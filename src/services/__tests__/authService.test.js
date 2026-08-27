 import { describe, it, expect } from 'vitest'
import * as authService from '../authService'

describe('Auth Service', () => {
  it('should be defined', () => {
    expect(authService.signIn).toBeDefined()
    expect(authService.signOut).toBeDefined()
    expect(authService.getCurrentUser).toBeDefined()
  })

  it('should sign in a user', async () => {
    const result = await authService.signIn('test@example.com', 'password123')
    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('error')
  })

  it('should sign out a user', async () => {
    const result = await authService.signOut()
    expect(result).toHaveProperty('error')
  })

  it('should get current user', async () => {
    const result = await authService.getCurrentUser()
    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('error')
  })
})