import { describe, it, expect } from 'vitest'

describe('Simple Test Suite', () => {
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