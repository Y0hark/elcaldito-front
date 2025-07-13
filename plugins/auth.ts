import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, token } = useAuth()
  
  // Initialiser l'auth immédiatement si on est côté client et qu'on a un token
  if (process.client && token.value) {
    try {
      await fetchUser()
    } catch (error) {
      console.error('🔧 Erreur lors de l\'initialisation de l\'auth:', error)
    }
  }
  
  // Également s'assurer que l'auth est initialisé après le montage de l'app
  nuxtApp.hook('app:mounted', async () => {
    try {
      await fetchUser()
    } catch (error) {
      console.error('🔧 Erreur lors de l\'initialisation de l\'auth:', error)
    }
  })
}) 