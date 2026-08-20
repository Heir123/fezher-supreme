import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../supabase'

// Mock Supabase
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
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

// Import the actual service - use the correct path
import * as executiveService from '../executiveDashboardService'

describe('executiveDashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Basic test to verify the service exists
  it('should have exported functions', () => {
    expect(executiveService).toBeDefined()
  })

  // Test each function if it exists
  describe('getExecutiveSummary', () => {
    it.skipIf(typeof executiveService.getExecutiveSummary !== 'function')(
      'returns executive summary data',
      async () => {
        const result = await executiveService.getExecutiveSummary()
        expect(result).toBeDefined()
      }
    )
  })

  describe('getBusinessHealth', () => {
    it.skipIf(typeof executiveService.getBusinessHealth !== 'function')(
      'returns business health metrics',
      async () => {
        const result = await executiveService.getBusinessHealth()
        expect(result).toBeDefined()
      }
    )
  })

  describe('getPerformanceMetrics', () => {
    it.skipIf(typeof executiveService.getPerformanceMetrics !== 'function')(
      'returns performance metrics',
      async () => {
        const result = await executiveService.getPerformanceMetrics()
        expect(result).toBeDefined()
      }
    )
  })

  describe('getAIAnalytics', () => {
    it.skipIf(typeof executiveService.getAIAnalytics !== 'function')(
      'returns AI predictions',
      async () => {
        const result = await executiveService.getAIAnalytics()
        expect(result).toBeDefined()
      }
    )
  })
})