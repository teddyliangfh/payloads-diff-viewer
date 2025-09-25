/**
 * API composable with error handling and loading states
 */
export function useApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { data, error, pending, refresh, execute } = useFetch<T>(url, {
    ...options,
    onRequest({ request, options }) {
      // Log request in development
      if (process.dev) {
        console.log(`[API] ${options.method || 'GET'} ${request}`)
      }
    },
    onResponse({ response }) {
      // Log response in development
      if (process.dev) {
        console.log(`[API] Response ${response.status} for ${url}`)
      }
    },
    onRequestError({ request, error }) {
      console.error(`[API] Request error for ${request}:`, error)
    },
    onResponseError({ response }) {
      console.error(`[API] Response error ${response.status} for ${url}:`, response.statusText)
    },
  })

  return {
    data: readonly(data),
    error: readonly(error),
    pending: readonly(pending),
    refresh,
    execute,
    isLoading: pending,
  }
}

/**
 * Generic API client with common methods
 */
export function useApiClient() {
  const baseURL = useRuntimeConfig().public.apiBase

  const get = <T>(endpoint: string, options?: UseFetchOptions<T>) => {
    return useApi<T>(`${baseURL}${endpoint}`, {
      ...options,
      method: 'GET',
    })
  }

  const post = <T>(endpoint: string, body?: any, options?: UseFetchOptions<T>) => {
    return useApi<T>(`${baseURL}${endpoint}`, {
      ...options,
      method: 'POST',
      body,
    })
  }

  const put = <T>(endpoint: string, body?: any, options?: UseFetchOptions<T>) => {
    return useApi<T>(`${baseURL}${endpoint}`, {
      ...options,
      method: 'PUT',
      body,
    })
  }

  const del = <T>(endpoint: string, options?: UseFetchOptions<T>) => {
    return useApi<T>(`${baseURL}${endpoint}`, {
      ...options,
      method: 'DELETE',
    })
  }

  return {
    get,
    post,
    put,
    delete: del,
  }
}
