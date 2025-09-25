/**
 * API endpoint to retrieve the latest comparison result
 * Returns detailed diff information if comparison is available
 */
export default defineEventHandler(async (event) => {
  try {
    // Get the latest comparison result
    const comparisonData = await useStorage('payloads').getItem('comparison')
    
    if (!comparisonData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No comparison result found',
        data: { error: 'Please send both payloads first to generate comparison' }
      })
    }
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      comparison: comparisonData.result,
      metadata: {
        payload1Timestamp: comparisonData.payload1Timestamp,
        payload2Timestamp: comparisonData.payload2Timestamp,
        comparisonTimestamp: comparisonData.timestamp
      }
    }
    
  } catch (error) {
    console.error('Error retrieving comparison:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while retrieving comparison',
      data: { error: error.message }
    })
  }
})
