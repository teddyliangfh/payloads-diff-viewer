/**
 * Unified API endpoint for handling payload operations
 * Supports both single payload storage and payload comparison
 */
import { 
  validatePayload,
  type ProductPayload,
  type PayloadApiResponse,
  type StoredPayload,
  type StoredComparison
} from '../../types/payload.types'
import { comparePayloads } from '../../utils/payloadComparator'

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

    const payload: ProductPayload = body
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
        payloadId: payload.id,
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
      
      // Perform comparison
      const comparisonResult = comparePayloads(existingPayload1.data, payload)
      
      // Store comparison result
      const storedComparison: StoredComparison = {
        result: comparisonResult,
        timestamp: new Date().toISOString(),
        payload1Timestamp: existingPayload1.timestamp,
        payload2Timestamp: new Date().toISOString()
      }
      
      await storage.setItem('comparison', storedComparison)
      
      const response: PayloadApiResponse = {
        success: true,
        message: 'Second payload received and compared successfully',
        timestamp: new Date().toISOString(),
        payloadId: payload.id,
        comparison: comparisonResult,
        summary: {
          hasChanges: comparisonResult.hasChanges,
          totalChanges: comparisonResult.totalChanges,
          changesByCategory: comparisonResult.summary
        }
      }
      
      return response
    }
    
  } catch (error) {
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
