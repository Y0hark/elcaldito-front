import type { UseFetchOptions } from '#app'

export const useStrapi = () => {
  const config = useRuntimeConfig()
  
  const fetchFromStrapi = async (endpoint: string, options: { headers?: Record<string, string> } = {}) => {
    const baseUrl = config.public.strapiBaseUrl
    const token = config.strapi.token

    return await useFetch(`${baseUrl}/api${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return {
    fetchFromStrapi,
  }
} 