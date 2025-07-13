import { defineNuxtRouteMiddleware, useRoute, navigateTo } from '#app'
import { useAuth } from '../composables/useAuth'
import { useLocalePath } from '#i18n'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, fetchUser, token } = useAuth()
  const protectedRoutes = ['/commander', '/compte']
  
  const isProtectedRoute = protectedRoutes.some(path => to.path.startsWith(path))
  
  // Si c'est une route protégée et qu'on n'est pas connecté, essayer de récupérer l'utilisateur
  if (isProtectedRoute && !isLoggedIn.value) {
    try {
      // Si on a un token mais pas d'utilisateur, c'est probablement un problème d'initialisation
      if (token.value) {
        // Attendre un peu plus longtemps pour laisser le temps au plugin d'auth de s'initialiser
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Essayer de récupérer l'utilisateur
        const fetchSuccess = await fetchUser()
        
        // Attendre un peu plus pour que l'état se mette à jour
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Si toujours pas connecté après la tentative, rediriger
        if (!isLoggedIn.value || !fetchSuccess) {
          const localePath = useLocalePath()
          return navigateTo(localePath('/login'))
        }
      } else {
        // Pas de token, rediriger directement
        const localePath = useLocalePath()
        return navigateTo(localePath('/login'))
      }
    } catch (error) {
      console.error('🔒 Auth middleware - Erreur lors de la récupération:', error)
      const localePath = useLocalePath()
      return navigateTo(localePath('/login'))
    }
  }
}) 