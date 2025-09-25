/**
 * Composable for handling payload operations
 * Provides reactive state and methods for sending payloads and managing comparison results
 */

// Re-export types from server for frontend use
export type { 
  ProductPayload as PayloadData,
  DiffResult,
  ComparisonResult,
  PayloadApiResponse as ApiResponse
} from '../../server/types/payload.types'

export const usePayloads = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const payload1Sent = ref(false)
  const payload2Sent = ref(false)
  const comparisonResult = ref<ComparisonResult | null>(null)
  const status = ref<any>(null)

  /**
   * Send payload to the server (unified endpoint)
   * Automatically handles first payload storage or second payload comparison
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
    const response = await sendPayload(payload)
    
    // If second payload was sent but comparison not in response, fetch it
    if (response.success && payload2Sent.value && !comparisonResult.value) {
      try {
        // Fetch comparison without setting loading state
        const comparisonResponse = await $fetch<{ comparison: ComparisonResult }>('/api/payloads/comparison')
        comparisonResult.value = comparisonResponse.comparison
      } catch (err) {
        console.warn('Failed to fetch comparison result:', err)
      }
    }
    
    return response
  }

  /**
   * Get current status of payloads
   */
  const getStatus = async () => {
    try {
      const response = await $fetch('/api/payloads/status')
      status.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to get status'
      throw err
    }
  }

  /**
   * Get detailed comparison result
   */
  const getComparison = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ comparison: ComparisonResult }>('/api/payloads/comparison')
      comparisonResult.value = response.comparison
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to get comparison'
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
      const response = await $fetch<ApiResponse>('/api/payloads/clear', {
        method: 'POST'
      })
      
      if (response.success) {
        payload1Sent.value = false
        payload2Sent.value = false
        comparisonResult.value = null
        status.value = null
        return response
      } else {
        throw new Error(response.message || 'Failed to clear data')
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to clear data'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Load sample payloads from server data
   */
  const loadSamplePayloads = async () => {
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
    getComparison,
    clearData,
    loadSamplePayloads
  }
}
