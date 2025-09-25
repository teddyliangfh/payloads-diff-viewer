/**
 * Health check endpoint
 * Returns server status and basic information
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.public.appVersion,
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  }
})
