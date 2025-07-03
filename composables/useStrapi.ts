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

    console.log('🔐 Debug auth - Token présent:', !!token)
    console.log('🔐 Debug auth - Token:', token ? `${token.substring(0, 20)}...` : 'null')

    if (!baseUrl) {
      throw new Error('STRAPI_BASE_URL is not configured')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    console.log('🔐 Debug auth - Headers:', headers)

    try {
      const response = await $fetch(`${baseUrl}/api${endpoint}`, {
        method: 'POST',
        headers,
        body: { data },
      })
      return { data: response, error: null }
    } catch (error) {
      console.error('❌ Erreur POST Strapi:', error)
      return { data: null, error: { value: error } }
    }
  }

  const putToStrapi = async (endpoint: string, data: any) => {
    const baseUrl = config.public.strapiBaseUrl
    const token = tokenCookie.value

    console.log('🔐 Debug auth PUT - Token présent:', !!token)
    console.log('🔐 Debug auth PUT - Endpoint:', endpoint)
    console.log('🔐 Debug auth PUT - Data:', data)

    if (!baseUrl) {
      throw new Error('STRAPI_BASE_URL is not configured')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    console.log('🔐 Debug auth PUT - Headers:', headers)
    console.log('🔐 Debug auth PUT - Full URL:', `${baseUrl}/api${endpoint}`)
    console.log('🔐 Debug auth PUT - Body:', { data })

    try {
      const response = await $fetch(`${baseUrl}/api${endpoint}`, {
        method: 'PUT',
        headers,
        body: { data },
      })
      console.log('✅ PUT Strapi - Success:', response)
      return { data: response, error: null }
    } catch (error) {
      console.error('❌ Erreur PUT Strapi:', error)
      const errorObj = error as any
      console.error('❌ Erreur PUT Strapi - Status:', errorObj.status)
      console.error('❌ Erreur PUT Strapi - Message:', errorObj.message)
      console.error('❌ Erreur PUT Strapi - Data:', errorObj.data)
      return { data: null, error: { value: error } }
    }
  }

  return {
    fetchFromStrapi,
    postToStrapi,
    putToStrapi,
  }
} 