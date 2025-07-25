import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, token } = useAuth()
  
  // Initialiser l'auth immédiatement si on est côté client et qu'on a un token
  if (process.client && token.value) {
    try {
      console.log('🔧 Plugin auth - Initialisation avec token présent')
      await fetchUser()
    } catch (error) {
      console.error('🔧 Erreur lors de l\'initialisation de l\'auth:', error)
    }
  } else if (process.client) {
    console.log('🔧 Plugin auth - Pas de token, initialisation différée')
  }
  
  // Également s'assurer que l'auth est initialisé après le montage de l'app
  nuxtApp.hook('app:mounted', async () => {
    try {
      console.log('🔧 Plugin auth - App montée, vérification auth')
      await fetchUser()
    } catch (error) {
      console.error('🔧 Erreur lors de l\'initialisation de l\'auth:', error)
    }
  })
}) 