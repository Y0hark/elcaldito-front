import type { UseFetchOptions } from '#app'

export const useStrapi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('token')
  
  const fetchFromStrapi = async (endpoint: string, options: { headers?: Record<string, string> } = {}) => {
    console.log('useStrapi: Starting fetch')
    const baseUrl = config.public.strapiBaseUrl
    const token = config.public.strapiToken

    console.log('useStrapi: Config', { baseUrl, hasToken: !!token })

    if (!baseUrl) {
      console.error('useStrapi: No base URL configured')
      throw new Error('STRAPI_BASE_URL is not configured')
    }

    const headers: Record<string, string> = {
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    console.log('useStrapi: Fetching from', `${baseUrl}/api${endpoint}`)
    
    try {
      const response = await useFetch(`${baseUrl}/api${endpoint}`, {
        ...options,
        headers,
      })
      console.log('useStrapi: Response received', response)
      return response
    } catch (error) {
      console.error('useStrapi: Error during fetch', error)
      throw error
    }
  }

  const postToStrapi = async (endpoint: string, data: any) => {
    const baseUrl = config.public.strapiBaseUrl
    const token = tokenCookie.value

    if (!baseUrl) {
      throw new Error('STRAPI_BASE_URL is not configured')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return useFetch(`${baseUrl}/api${endpoint}`, {
      method: 'POST',
      headers,
      body: { data },
    })
  }

  return {
    fetchFromStrapi,
    postToStrapi,
  }
} 