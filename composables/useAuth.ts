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
    if (process.client) {
      console.log('🍪 Debug cookies:')
      console.log('Document cookies:', document.cookie)
      console.log('Token cookie value:', token.value)
      console.log('Token cookie exists:', !!token.value)
      
      // Vérifier si le cookie existe dans document.cookie
      const allCookies = document.cookie.split(';')
      const tokenCookie = allCookies.find(cookie => cookie.trim().startsWith('token='))
      console.log('Token cookie found in document.cookie:', tokenCookie)
      
      // Vérifier les propriétés du cookie
      console.log('Cookie options:', {
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        httpOnly: false
      })
    }
  }

  const testStrapiEndpoints = async () => {
    if (!token.value) return
    
    console.log('🧪 Test des endpoints Strapi...')
    const tokenValue = token.value as string
    
    try {
      // Test 1: Endpoint public
      console.log('Test 1: Endpoint public /api/users')
      const publicResponse = await $fetch(`${config.public.strapiBaseUrl}/api/users`, {
        method: 'GET'
      })
      console.log('✅ Endpoint public fonctionne:', publicResponse)
    } catch (e) {
      console.log('❌ Endpoint public échoue:', e)
    }
    
    try {
      // Test 2: Endpoint avec token
      console.log('Test 2: Endpoint avec token /api/users/me')
      const meResponse = await $fetch(`${config.public.strapiBaseUrl}/api/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenValue}`
        }
      })
      console.log('✅ Endpoint /me fonctionne:', meResponse)
    } catch (e) {
      console.log('❌ Endpoint /me échoue:', e)
    }
    
    try {
      // Test 3: Endpoint avec ID spécifique
      const tokenParts = tokenValue.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        console.log('Test 3: Endpoint avec ID /api/users/' + payload.id)
        const idResponse = await $fetch(`${config.public.strapiBaseUrl}/api/users/${payload.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenValue}`
          }
        })
        console.log('✅ Endpoint avec ID fonctionne:', idResponse)
      }
    } catch (e) {
      console.log('❌ Endpoint avec ID échoue:', e)
    }
  }

  const fetchUser = async (): Promise<boolean> => {
    console.log('=== fetchUser appelé ===')
    debugCookies()
    console.log('Token présent:', !!token.value)
    console.log('Token value:', token.value ? (token.value as string).substring(0, 20) + '...' : 'null')
    console.log('User actuel:', user.value)
    console.log('Cookie token complet:', token.value)
    
    if (token.value) {
      try {
        console.log('Tentative de récupération des données utilisateur...')
        
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
          console.log('Résultat fetch /api/users/me:', { userData })
        } catch (meError) {
          console.log('Erreur fetch /api/users/me:', meError)
          fetchError = meError
        }
        
        console.log('Résultat fetchUser final:', { 
          data: userData, 
          error: fetchError,
          hasData: !!userData,
          hasError: !!fetchError
        })
        
        if (fetchError) {
          console.warn('❌ Erreur lors de la récupération utilisateur:', fetchError)
          console.log('Suppression du token et de l\'utilisateur')
          token.value = null
          user.value = null
          return false
        } else if (userData) {
          console.log('✅ Utilisateur récupéré avec succès:', userData)
          
          // Si les userInfo ne sont pas inclus dans la réponse, les récupérer séparément
          if (!(userData as any).userInfo) {
            console.log('🔄 UserInfo non trouvé dans la réponse, tentative de récupération séparée...')
            try {
              const { useUserInfo } = await import('../composables/useUserInfo')
              const { getUserInfo } = useUserInfo()
              const userInfoResult = await getUserInfo()
              
              if (userInfoResult.success && userInfoResult.data) {
                console.log('✅ UserInfo récupéré séparément:', userInfoResult.data)
                ;(userData as any).userInfo = userInfoResult.data
              } else {
                console.log('ℹ️ Aucun UserInfo trouvé ou erreur:', userInfoResult.message)
              }
            } catch (userInfoError) {
              console.log('⚠️ Erreur lors de la récupération séparée des UserInfo:', userInfoError)
            }
          }
          
          user.value = userData
          console.log('User mis à jour:', user.value)
          
          // Attendre que l'état réactif soit mis à jour
          await nextTick()
          console.log('État réactif mis à jour après nextTick')
          return true
        } else {
          console.warn('⚠️ Aucune donnée utilisateur reçue, mais pas d\'erreur')
          console.log('Conservation du token, suppression de l\'utilisateur seulement')
          // Ne pas supprimer le token si pas d'erreur, juste l'utilisateur
          user.value = null
          return false
        }
      } catch (e) {
        console.error('❌ Exception lors de fetchUser:', e)
        console.log('Suppression du token et de l\'utilisateur')
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
            console.log('Téléphone récupéré du localStorage:', savedPhone)
          }
        } catch (localStorageError) {
          console.log('Erreur localStorage:', localStorageError)
        }
      }
    } else {
      console.log('ℹ️ Aucun token présent, utilisateur non connecté')
      user.value = null
      return false
    }
    
    console.log('=== fetchUser terminé ===')
    console.log('État final - Token:', !!token.value, 'User:', !!user.value)
    return !!user.value
  }

  const setTokenCookie = (tokenValue: string) => {
    if (process.client) {
      // Forcer la sauvegarde du cookie côté client
      document.cookie = `token=${tokenValue}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
      console.log('🍪 Token cookie forcé côté client:', tokenValue.substring(0, 20) + '...')
    }
    token.value = tokenValue as any
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion pour:', email)
      const { data, error } = await useFetch('/api/auth/local', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.strapiBaseUrl,
        body: { identifier: email, password },
        watch: false,
        server: false,
      })
      const response = data.value as any
      const err = error.value as any
      
      console.log('Résultat login:', { response, error: err })
      
      if (err || !response?.jwt) {
        return { success: false, message: err?.data?.error?.message || 'Identifiants invalides' }
      }
      
      console.log('Connexion réussie, sauvegarde du token et des données utilisateur')
      setTokenCookie(response.jwt)
      user.value = response.user
      
      // Debug après sauvegarde
      console.log('🍪 Après sauvegarde du token:')
      debugCookies()
      
      return { success: true }
    } catch (e) {
      console.error('Exception lors du login:', e)
      return { success: false, message: 'Erreur serveur' }
    }
  }

  const register = async (email: string, password: string, username: string) => {
    try {
      console.log('Tentative d\'inscription pour:', email)
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
      console.log('Résultat inscription:', responseData)
      
      if (!responseData?.jwt) {
        return { success: false, message: "Erreur lors de l'inscription" }
      }

      console.log('Inscription réussie, sauvegarde du token et des données utilisateur')
      setTokenCookie(responseData.jwt)
      user.value = responseData.user
      
      // Debug après sauvegarde
      console.log('🍪 Après sauvegarde du token (inscription):')
      debugCookies()
      
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
    console.log('Déconnexion de l\'utilisateur')
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
    
    console.log('🔄 isLoggedIn computed:', { 
      hasToken, 
      hasUser, 
      loggedIn,
      tokenValue: token.value ? (token.value as string).substring(0, 20) + '...' : 'null',
      userValue: user.value ? `User ID: ${user.value.id}` : 'null'
    })
    
    return loggedIn
  })

  return { login, register, logout, getUser, isLoggedIn, user, fetchUser, token }
} 