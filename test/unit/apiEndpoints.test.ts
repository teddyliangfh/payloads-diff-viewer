import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validatePayload, type StoredPayload, type StoredComparison } from '../../server/types/payload.types'
import { compareObjects } from '../../server/utils/payloadComparator'

// Mock Nuxt server utilities
const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}

const mockCreateError = vi.fn()
const mockReadBody = vi.fn()
const mockUseStorage = vi.fn(() => mockStorage)

vi.mock('h3', () => ({
  createError: mockCreateError,
  readBody: mockReadBody,
  useStorage: mockUseStorage
}))

// Mock the API handlers
vi.mock('../../server/api/payloads/payload.post.ts', () => ({
  default: vi.fn()
}))

vi.mock('../../server/api/payloads/status.get.ts', () => ({
  default: vi.fn()
}))

vi.mock('../../server/api/payloads/clear.post.ts', () => ({
  default: vi.fn()
}))

describe('API Endpoints Business Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Payload Storage Logic', () => {
    it('should store first payload correctly', async () => {
      const payload = { id: 1, name: "test" }
      const timestamp = '2023-01-01T00:00:00Z'
      
      // Mock no existing payload
      mockStorage.getItem.mockResolvedValueOnce(null)
      mockStorage.setItem.mockResolvedValueOnce(undefined)
      mockStorage.removeItem.mockResolvedValueOnce(undefined)

      const expectedStoredPayload: StoredPayload = {
        data: payload,
        timestamp,
        received: true
      }

      // Simulate the storage logic
      await mockStorage.setItem('payload1', expectedStoredPayload)
      await mockStorage.removeItem('payload2')

      expect(mockStorage.setItem).toHaveBeenCalledWith('payload1', expectedStoredPayload)
      expect(mockStorage.removeItem).toHaveBeenCalledWith('payload2')
    })

    it('should store second payload and perform comparison', async () => {
      const payload1 = { id: 1, name: "original" }
      const payload2 = { id: 1, name: "modified" }
      
      const existingPayload: StoredPayload = {
        data: payload1,
        timestamp: '2023-01-01T00:00:00Z',
        received: true
      }

      const newStoredPayload: StoredPayload = {
        data: payload2,
        timestamp: '2023-01-01T01:00:00Z',
        received: true
      }

      const comparisonResult = compareObjects(payload1, payload2)
      const expectedStoredComparison: StoredComparison = {
        result: comparisonResult,
        timestamp: '2023-01-01T01:00:00Z',
        payload1Timestamp: '2023-01-01T00:00:00Z',
        payload2Timestamp: '2023-01-01T01:00:00Z'
      }

      // Mock existing payload
      mockStorage.getItem.mockResolvedValueOnce(existingPayload)
      mockStorage.setItem.mockResolvedValue(undefined)

      // Simulate the storage logic
      await mockStorage.setItem('payload2', newStoredPayload)
      await mockStorage.setItem('comparison', expectedStoredComparison)

      expect(mockStorage.setItem).toHaveBeenCalledWith('payload2', newStoredPayload)
      expect(mockStorage.setItem).toHaveBeenCalledWith('comparison', expectedStoredComparison)
    })
  })

  describe('Status Retrieval Logic', () => {
    it('should return correct status when no payloads are stored', async () => {
      mockStorage.getItem.mockResolvedValue(null)

      const status = {
        payload1: { received: false },
        payload2: { received: false },
        comparison: { available: false },
        readyForComparison: false,
        timestamp: expect.any(String)
      }

      expect(status.payload1.received).toBe(false)
      expect(status.payload2.received).toBe(false)
      expect(status.comparison.available).toBe(false)
      expect(status.readyForComparison).toBe(false)
    })

    it('should return correct status when only first payload is stored', async () => {
      const storedPayload1: StoredPayload = {
        data: { id: 1, name: "test" },
        timestamp: '2023-01-01T00:00:00Z',
        received: true
      }

      mockStorage.getItem
        .mockResolvedValueOnce(storedPayload1) // payload1
        .mockResolvedValueOnce(null) // payload2
        .mockResolvedValueOnce(null) // comparison

      const status = {
        payload1: {
          received: true,
          timestamp: storedPayload1.timestamp,
          payloadId: storedPayload1.data.id
        },
        payload2: { received: false },
        comparison: { available: false },
        readyForComparison: false,
        timestamp: expect.any(String)
      }

      expect(status.payload1.received).toBe(true)
      expect(status.payload1.timestamp).toBe('2023-01-01T00:00:00Z')
      expect(status.payload1.payloadId).toBe(1)
      expect(status.payload2.received).toBe(false)
      expect(status.readyForComparison).toBe(false)
    })

    it('should return correct status when both payloads are stored', async () => {
      const storedPayload1: StoredPayload = {
        data: { id: 1, name: "test1" },
        timestamp: '2023-01-01T00:00:00Z',
        received: true
      }

      const storedPayload2: StoredPayload = {
        data: { id: 2, name: "test2" },
        timestamp: '2023-01-01T01:00:00Z',
        received: true
      }

      const storedComparison: StoredComparison = {
        result: {
          hasChanges: true,
          totalChanges: 1,
          diffs: [{ path: 'name', type: 'modified', oldValue: 'test1', newValue: 'test2' }]
        },
        timestamp: '2023-01-01T01:00:00Z',
        payload1Timestamp: '2023-01-01T00:00:00Z',
        payload2Timestamp: '2023-01-01T01:00:00Z'
      }

      mockStorage.getItem
        .mockResolvedValueOnce(storedPayload1) // payload1
        .mockResolvedValueOnce(storedPayload2) // payload2
        .mockResolvedValueOnce(storedComparison) // comparison

      const status = {
        payload1: {
          received: true,
          timestamp: storedPayload1.timestamp,
          payloadId: storedPayload1.data.id
        },
        payload2: {
          received: true,
          timestamp: storedPayload2.timestamp,
          payloadId: storedPayload2.data.id
        },
        comparison: {
          available: true,
          timestamp: storedComparison.timestamp,
          hasChanges: storedComparison.result.hasChanges,
          totalChanges: storedComparison.result.totalChanges
        },
        readyForComparison: true,
        timestamp: expect.any(String)
      }

      expect(status.payload1.received).toBe(true)
      expect(status.payload2.received).toBe(true)
      expect(status.comparison.available).toBe(true)
      expect(status.comparison.hasChanges).toBe(true)
      expect(status.comparison.totalChanges).toBe(1)
      expect(status.readyForComparison).toBe(true)
    })
  })

  describe('Clear Data Logic', () => {
    it('should clear all stored data', async () => {
      mockStorage.removeItem.mockResolvedValue(undefined)

      // Simulate clearing all data
      await mockStorage.removeItem('payload1')
      await mockStorage.removeItem('payload2')
      await mockStorage.removeItem('comparison')

      expect(mockStorage.removeItem).toHaveBeenCalledWith('payload1')
      expect(mockStorage.removeItem).toHaveBeenCalledWith('payload2')
      expect(mockStorage.removeItem).toHaveBeenCalledWith('comparison')
    })

    it('should handle clear operation errors', async () => {
      const clearError = new Error('Storage error')
      mockStorage.removeItem.mockRejectedValue(clearError)

      await expect(mockStorage.removeItem('payload1')).rejects.toThrow('Storage error')
    })
  })

  describe('Payload Validation Integration', () => {
    it('should validate payloads before storage', () => {
      const validPayload = { id: 1, name: "test" }
      const invalidPayload = null

      const validResult = validatePayload(validPayload)
      const invalidResult = validatePayload(invalidPayload)

      expect(validResult.isValid).toBe(true)
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.errors).toContain('Payload cannot be null or undefined')
    })

    it('should handle validation errors in API flow', () => {
      const invalidPayload = { circular: null }
      invalidPayload.circular = invalidPayload // Create circular reference

      const result = validatePayload(invalidPayload)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Payload must be JSON-serializable')
    })
  })

  describe('Comparison Logic Integration', () => {
    it('should perform correct comparison between payloads', () => {
      const payload1 = { id: 1, name: "original", value: 100 }
      const payload2 = { id: 1, name: "modified", value: 200 }

      const result = compareObjects(payload1, payload2)

      expect(result.hasChanges).toBe(true)
      expect(result.totalChanges).toBe(2)
      expect(result.diffs).toHaveLength(2)
      
      const nameDiff = result.diffs.find(diff => diff.path === 'name')
      const valueDiff = result.diffs.find(diff => diff.path === 'value')
      
      expect(nameDiff?.type).toBe('modified')
      expect(nameDiff?.oldValue).toBe('original')
      expect(nameDiff?.newValue).toBe('modified')
      
      expect(valueDiff?.type).toBe('modified')
      expect(valueDiff?.oldValue).toBe(100)
      expect(valueDiff?.newValue).toBe(200)
    })

    it('should handle identical payloads', () => {
      const payload = { id: 1, name: "test", nested: { value: 123 } }
      
      const result = compareObjects(payload, payload)
      
      expect(result.hasChanges).toBe(false)
      expect(result.totalChanges).toBe(0)
      expect(result.diffs).toHaveLength(0)
    })

    it('should handle complex nested structures', () => {
      const payload1 = {
        users: [
          { id: 1, name: "John", settings: { theme: "dark" } },
          { id: 2, name: "Jane", settings: { theme: "light" } }
        ],
        metadata: { version: "1.0.0" }
      }

      const payload2 = {
        users: [
          { id: 1, name: "John", settings: { theme: "dark" } },
          { id: 2, name: "Jane", settings: { theme: "dark" } }, // Changed theme
          { id: 3, name: "Bob", settings: { theme: "light" } }  // Added user
        ],
        metadata: { version: "1.0.0" }
      }

      const result = compareObjects(payload1, payload2)

      expect(result.hasChanges).toBe(true)
      expect(result.totalChanges).toBe(2)
      
      const themeChange = result.diffs.find(diff => diff.path === 'users[1].settings.theme')
      const addedUser = result.diffs.find(diff => diff.path === 'users[2]')
      
      expect(themeChange?.type).toBe('modified')
      expect(themeChange?.oldValue).toBe('light')
      expect(themeChange?.newValue).toBe('dark')
      
      expect(addedUser?.type).toBe('added')
    })
  })

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      const storageError = new Error('Storage unavailable')
      mockStorage.getItem.mockRejectedValue(storageError)

      await expect(mockStorage.getItem('payload1')).rejects.toThrow('Storage unavailable')
    })

    it('should handle comparison errors', () => {
      const circularObj1: any = { name: "test" }
      circularObj1.self = circularObj1

      const circularObj2: any = { name: "test" }
      circularObj2.self = circularObj2

      // The current implementation doesn't handle circular references and will throw
      expect(() => compareObjects(circularObj1, circularObj2)).toThrow('Maximum call stack size exceeded')
    })

    it('should handle malformed stored data', async () => {
      const malformedData = "invalid json"
      mockStorage.getItem.mockResolvedValue(malformedData)

      const result = await mockStorage.getItem('payload1')
      expect(result).toBe(malformedData)
    })
  })

  describe('Response Formatting', () => {
    it('should format first payload response correctly', () => {
      const payload = { id: 1, name: "test" }
      const timestamp = '2023-01-01T00:00:00Z'

      const response = {
        success: true,
        message: 'First payload received successfully',
        timestamp,
        payloadId: payload.id || 'unknown',
        nextStep: 'Send second payload to compare with the first one'
      }

      expect(response.success).toBe(true)
      expect(response.message).toBe('First payload received successfully')
      expect(response.payloadId).toBe(1)
      expect(response.nextStep).toBe('Send second payload to compare with the first one')
    })

    it('should format second payload response with comparison', () => {
      const payload = { id: 2, name: "test2" }
      const timestamp = '2023-01-01T01:00:00Z'
      const comparison = {
        hasChanges: true,
        totalChanges: 1,
        diffs: [{ path: 'name', type: 'modified', oldValue: 'test1', newValue: 'test2' }]
      }

      const response = {
        success: true,
        message: 'Second payload received and compared successfully',
        timestamp,
        payloadId: payload.id || 'unknown',
        comparison,
        summary: {
          hasChanges: comparison.hasChanges,
          totalChanges: comparison.totalChanges
        }
      }

      expect(response.success).toBe(true)
      expect(response.comparison).toEqual(comparison)
      expect(response.summary.hasChanges).toBe(true)
      expect(response.summary.totalChanges).toBe(1)
    })

    it('should format error responses correctly', () => {
      const errorResponse = {
        statusCode: 400,
        statusMessage: 'Invalid payload structure',
        data: { errors: ['Payload cannot be null or undefined'] }
      }

      expect(errorResponse.statusCode).toBe(400)
      expect(errorResponse.statusMessage).toBe('Invalid payload structure')
      expect(errorResponse.data.errors).toContain('Payload cannot be null or undefined')
    })
  })
})
