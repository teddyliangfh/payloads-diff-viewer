/**
 * Composable for handling payload operations
 * Provides reactive state and methods for sending payloads and managing comparison results
 * Uses useLazyAsyncData for better async data handling
 */

// Re-export types from server for frontend use
export type { 
  ProductPayload as PayloadData,
  DiffResult,
  ComparisonResult,
  PayloadApiResponse as ApiResponse
} from '../../server/types/payload.types'

export const usePayloads = () => {
  // State management
  const payload1Sent = ref(false)
  const payload2Sent = ref(false)
  const comparisonResult = ref<ComparisonResult | null>(null)
  const status = ref<any>(null)

  // Load sample payloads method
  const loadSamplePayloads = async (): Promise<{ payload1: PayloadData; payload2: PayloadData }> => {
    try {
      const [payload1, payload2] = await Promise.all([
        $fetch<PayloadData>('/data/sample-payload1.json'),
        $fetch<PayloadData>('/data/sample-payload2.json')
      ])
      return { payload1, payload2 }
    } catch (err: any) {
      error.value = err.message || 'Failed to load sample payloads'
      throw err
    }
  }

  // Simple loading and error state management
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Send payload to server
   */
  const sendPayload = async (payload: PayloadData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse>('/api/payloads/payload', {
        method: 'POST',
        body: payload
      })
      
      if (response.success) {
        // Check if this was the first or second payload based on response
        if (response.nextStep) {
          // First payload
          payload1Sent.value = true
          payload2Sent.value = false
          comparisonResult.value = null
        } else if (response.comparison) {
          // Second payload with comparison
          payload1Sent.value = true
          payload2Sent.value = true
          comparisonResult.value = response.comparison
        } else {
          // Second payload sent but comparison not ready yet
          payload1Sent.value = true
          payload2Sent.value = true
          comparisonResult.value = null
        }
        return response
      } else {
        throw new Error(response.message || 'Failed to send payload')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to send payload'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Send first payload (alias for backward compatibility)
   */
  const sendPayload1 = async (payload: PayloadData) => {
    return sendPayload(payload)
  }

  /**
   * Send second payload (alias for backward compatibility)
   */
  const sendPayload2 = async (payload: PayloadData) => {
    return sendPayload(payload)
  }

  /**
   * Get current status of payloads
   */
  const getStatus = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/payloads/status')
      status.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to get status'
      throw err
    } finally {
      loading.value = false
    }
  }


  /**
   * Clear all stored data
   */
  const clearData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/payloads/clear', { method: 'POST' })
      
      if (response && 'success' in response && (response as any).success) {
        payload1Sent.value = false
        payload2Sent.value = false
        comparisonResult.value = null
        status.value = null
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to clear data'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    payload1Sent: readonly(payload1Sent),
    payload2Sent: readonly(payload2Sent),
    comparisonResult: readonly(comparisonResult),
    status: readonly(status),
    
    // Methods
    sendPayload,
    sendPayload1, // Backward compatibility
    sendPayload2, // Backward compatibility
    getStatus,
    clearData,
    loadSamplePayloads
  }
}