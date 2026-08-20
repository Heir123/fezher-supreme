import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Simple Test Suite', () => {
  // Add a small delay to ensure environment is ready
  beforeAll(() => {
    // Small delay to ensure everything is loaded
    return new Promise(resolve => setTimeout(resolve, 100))
  })

  it('should pass basic math', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle strings', () => {
    expect('hello world').toContain('hello')
  })

  it('should handle objects', () => {
    expect({ name: 'test' }).toHaveProperty('name')
  })
})