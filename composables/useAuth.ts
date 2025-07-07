import { useState, useCookie, useFetch } from '#app'
import { useRouter } from 'vue-router'
import { computed, nextTick } from 'vue'

export function useAuth() {
  const user = useState<any>('user', () => null)
  const token = useCookie('token', { 
    sameSite: 'lax',
    secure: false, // Désactiver secure en développement
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
    httpOnly: false, // Permettre l'accès côté client
    default: () => null
  })
  const router = useRouter()
  const config = useRuntimeConfig()

  const debugCookies = () => {
    // Fonction de debug des cookies (désactivée en production)
  }

  const testStrapiEndpoints = async () => {
    // Fonction de test des endpoints Strapi (désactivée en production)
  }

  const fetchUser = async (): Promise<boolean> => {
    
    if (token.value) {
      try {
        // Utiliser directement l'endpoint /api/users/me qui fonctionne
        let userData = null
        let fetchError = null
        
        try {
          userData = await $fetch(`${config.public.strapiBaseUrl}/api/users/me?populate[userInfo]=*`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          })
        } catch (meError) {
          fetchError = meError
        }
        
        if (fetchError) {
          console.warn('❌ Erreur lors de la récupération utilisateur:', fetchError)
          token.value = null
          user.value = null
          return false
        } else if (userData) {
          // Si les userInfo ne sont pas inclus dans la réponse, les récupérer séparément
          if (!(userData as any).userInfo) {
            try {
              const { useUserInfo } = await import('../composables/useUserInfo')
              const { getUserInfo } = useUserInfo()
              const userInfoResult = await getUserInfo()
              
              if (userInfoResult.success && userInfoResult.data) {
                ;(userData as any).userInfo = userInfoResult.data
              }
            } catch (userInfoError) {
              // Erreur silencieuse pour la récupération des userInfo
            }
          }
          
          user.value = userData
          
          // Attendre que l'état réactif soit mis à jour
          await nextTick()
          return true
        } else {
          // Ne pas supprimer le token si pas d'erreur, juste l'utilisateur
          user.value = null
          return false
        }
      } catch (e) {
        console.error('❌ Exception lors de fetchUser:', e)
        token.value = null
        user.value = null
        return false
      }
      
      // Récupérer le téléphone du localStorage si il n'est pas dans les données API (après le try-catch)
      if (user.value && !user.value.phone && process.client) {
        try {
          const savedPhone = localStorage.getItem('userPhone')
          if (savedPhone) {
            user.value.phone = savedPhone
          }
        } catch (localStorageError) {
          // Erreur silencieuse pour localStorage
        }
      }
    } else {
      user.value = null
      return false
    }
    
    return !!user.value
  }

  const setTokenCookie = (tokenValue: string) => {
    if (process.client) {
      // Forcer la sauvegarde du cookie côté client
      document.cookie = `token=${tokenValue}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
    }
    token.value = tokenValue as any
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/local', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.strapiBaseUrl,
        body: { identifier: email, password },
        watch: false,
        server: false,
      })
      const response = data.value as any
      const err = error.value as any
      
      if (err || !response?.jwt) {
        return { success: false, message: err?.data?.error?.message || 'Identifiants invalides' }
      }
      
      setTokenCookie(response.jwt)
      user.value = response.user
      
      return { success: true }
    } catch (e) {
      console.error('Exception lors du login:', e)
      return { success: false, message: 'Erreur serveur' }
    }
  }

  const register = async (email: string, password: string, username: string) => {
    try {
      // Créer l'utilisateur sans téléphone (sera ajouté dans l'étape 2)
      const response = await $fetch(`${config.public.strapiBaseUrl}/api/auth/local/register`, {
        method: 'POST',
        body: {
          email,
          username,
          password,
        },
      })
      
      const responseData = response as any
      
      if (!responseData?.jwt) {
        return { success: false, message: "Erreur lors de l'inscription" }
      }

      setTokenCookie(responseData.jwt)
      user.value = responseData.user
      
      return { success: true, user: responseData.user }
    } catch (err: any) {
      console.error('Erreur inscription:', err)
      return { 
        success: false, 
        message: err?.data?.error?.message || "Erreur lors de l'inscription" 
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    // Nettoyer les données temporaires
    localStorage.removeItem('registration_temp_data')
    localStorage.removeItem('userPhone')
    router.push('/')
  }

  const getUser = () => user.value
  const isLoggedIn = computed(() => {
    const hasToken = !!token.value
    const hasUser = !!user.value
    const loggedIn = hasToken && hasUser
    
    return loggedIn
  })

  return { login, register, logout, getUser, isLoggedIn, user, fetchUser, token }
} 