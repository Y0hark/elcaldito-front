import { useState, useCookie, useFetch } from '#app'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export function useAuth() {
  const user = useState<any>('user', () => null)
  const token = useCookie('token', { sameSite: 'lax' })
  const router = useRouter()
  const config = useRuntimeConfig()

  const fetchUser = async () => {
    if (token.value) {
      try {
        const { data, error } = await useFetch('/api/users/me', {
          baseURL: config.public.strapiBaseUrl,
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
        if (error.value) {
          token.value = null
          user.value = null
        } else {
          user.value = data.value
        }
      } catch (e) {
        token.value = null
        user.value = null
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/local', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.strapiBaseUrl,
        body: { identifier: email, password },
        watch: false,
      })
      const response = data.value as any
      const err = error.value as any
      if (err || !response?.jwt) {
        return { success: false, message: err?.data?.error?.message || 'Identifiants invalides' }
      }
      token.value = response.jwt
      user.value = response.user
      return { success: true }
    } catch (e) {
      return { success: false, message: 'Erreur serveur' }
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/local/register', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.strapiBaseUrl,
        body: {
          email,
          username: email,
          password,
        },
        watch: false,
      })
      const response = data.value as any
      const err = error.value as any
      if (err || !response?.jwt) {
        return { success: false, message: err?.data?.error?.message || "Erreur lors de l'inscription" }
      }
      token.value = response.jwt
      user.value = response.user
      return { success: true }
    } catch (e) {
      return { success: false, message: "Erreur serveur" }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    router.push('/')
  }

  const getUser = () => user.value
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  return { login, register, logout, getUser, isLoggedIn, user, fetchUser }
} 