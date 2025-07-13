import type { UseFetchOptions } from '#app'

export const useStrapi = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('token')
  
  const fetchFromStrapi = async (endpoint: string, options: { headers?: Record<string, string> } = {}) => {
    const baseUrl = config.public.strapiBaseUrl
    const token = config.public.strapiToken

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
    
    try {
      const response = await useFetch(`${baseUrl}/api${endpoint}`, {
        ...options,
        headers,
      })
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

    if (!baseUrl) {
      throw new Error('STRAPI_BASE_URL is not configured')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await $fetch(`${baseUrl}/api${endpoint}`, {
        method: 'PUT',
        headers,
        body: { data },
      })
      return { data: response, error: null }
    } catch (error) {
      console.error('❌ Erreur PUT Strapi:', error)
      return { data: null, error: { value: error } }
    }
  }

  return {
    fetchFromStrapi,
    postToStrapi,
    putToStrapi,
  }
} 