/**
 * Unified API endpoint for handling payload operations
 * Supports both single payload storage and generic payload comparison
 */
import { 
  validatePayload,
  type PayloadApiResponse,
  type StoredPayload,
  type StoredComparison
} from '../../types/payload.types'
import { compareObjects } from '../../utils/payloadComparator'

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event)
    
    // Validate the payload structure
    const validation = validatePayload(body)
    if (!validation.isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payload structure',
        data: { errors: validation.errors }
      })
    }

    const payload: any = body
    const storage = useStorage('payloads')
    
    // Check if this is the first payload
    const existingPayload1 = await storage.getItem('payload1')
    
    if (!existingPayload1) {
      // First payload - store it and return confirmation
      const storedPayload: StoredPayload = {
        data: payload,
        timestamp: new Date().toISOString(),
        received: true
      }
      
      await storage.setItem('payload1', storedPayload)
      
      // Clear any existing payload2 to ensure fresh comparison
      await storage.removeItem('payload2')
      
      const response: PayloadApiResponse = {
        success: true,
        message: 'First payload received successfully',
        timestamp: new Date().toISOString(),
        payloadId: payload.id || 'unknown',
        nextStep: 'Send second payload to compare with the first one'
      }
      
      return response
    } else {
      // Second payload - store it and perform comparison
      const storedPayload2: StoredPayload = {
        data: payload,
        timestamp: new Date().toISOString(),
        received: true
      }
      
      await storage.setItem('payload2', storedPayload2)
      
      // Perform comparison using generic comparator
      const payload1Data = (existingPayload1 as StoredPayload).data
      const comparisonResult = compareObjects(payload1Data, payload)
      
      // Store comparison result
      const storedComparison: StoredComparison = {
        result: comparisonResult,
        timestamp: new Date().toISOString(),
        payload1Timestamp: (existingPayload1 as StoredPayload).timestamp,
        payload2Timestamp: new Date().toISOString()
      }
      
      await storage.setItem('comparison', storedComparison)
      
      const response: PayloadApiResponse = {
        success: true,
        message: 'Second payload received and compared successfully',
        timestamp: new Date().toISOString(),
        payloadId: payload.id || 'unknown',
        comparison: comparisonResult,
        summary: {
          hasChanges: comparisonResult.hasChanges,
          totalChanges: comparisonResult.totalChanges
        }
      }
      
      return response
    }
    
  } catch (error: any) {
    console.error('Error processing payload:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while processing payload',
      data: { error: error.message }
    })
  }
})
