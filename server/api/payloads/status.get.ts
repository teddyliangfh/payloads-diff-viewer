/**
 * API endpoint to check the status of stored payloads
 * Returns information about what payloads are available and their timestamps
 */
export default defineEventHandler(async (event) => {
  try {
    // Check what payloads are stored
    const payload1Data = await useStorage('payloads').getItem('payload1')
    const payload2Data = await useStorage('payloads').getItem('payload2')
    const comparisonData = await useStorage('payloads').getItem('comparison')
    
    const status = {
      payload1: payload1Data ? {
        received: true,
        timestamp: payload1Data.timestamp,
        payloadId: payload1Data.data.id
      } : { received: false },
      
      payload2: payload2Data ? {
        received: true,
        timestamp: payload2Data.timestamp,
        payloadId: payload2Data.data.id
      } : { received: false },
      
      comparison: comparisonData ? {
        available: true,
        timestamp: comparisonData.timestamp,
        hasChanges: comparisonData.result.hasChanges,
        totalChanges: comparisonData.result.totalChanges
      } : { available: false },
      
      readyForComparison: !!(payload1Data && payload2Data),
      timestamp: new Date().toISOString()
    }
    
    return status
    
  } catch (error) {
    console.error('Error checking payload status:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while checking payload status',
      data: { error: error.message }
    })
  }
})
