/**
 * API endpoint to clear all stored payloads and comparison data
 * Useful for testing or resetting the application state
 */
export default defineEventHandler(async (event) => {
  try {
    // Clear all stored payload data
    await useStorage('payloads').removeItem('payload1')
    await useStorage('payloads').removeItem('payload2')
    await useStorage('payloads').removeItem('comparison')
    
    return {
      success: true,
      message: 'All payload data cleared successfully',
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('Error clearing payload data:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while clearing payload data',
      data: { error: error?.message || 'Unknown error' }
    })
  }
})
