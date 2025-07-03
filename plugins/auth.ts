import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log('🔧 Plugin auth initialisé')
  
  const { fetchUser, token } = useAuth()
  
  // Initialiser l'auth immédiatement si on est côté client et qu'on a un token
  if (process.client && token.value) {
    try {
      console.log('🔧 Début de fetchUser depuis le plugin (immédiat) - Token présent')
      const success = await fetchUser()
      console.log('🔧 fetchUser terminé depuis le plugin (immédiat) - Success:', success)
    } catch (error) {
      console.error('🔧 Erreur lors de l\'initialisation de l\'auth:', error)
    }
  } else if (process.client) {
    console.log('🔧 Pas de token présent, pas d\'initialisation immédiate')
  }
  
  // Également s'assurer que l'auth est initialisé après le montage de l'app
  nuxtApp.hook('app:mounted', async () => {
    try {
      console.log('🔧 Début de fetchUser depuis le plugin (après montage)')
      const success = await fetchUser()
      console.log('🔧 fetchUser terminé depuis le plugin (après montage) - Success:', success)
    } catch (error) {
      console.error('🔧 Erreur lors de l\'initialisation de l\'auth:', error)
    }
  })
}) 