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
        // Attendre plus longtemps en production pour les requêtes plus lentes
        const timeout = process.env.NODE_ENV === 'production' ? 1000 : 300
        await new Promise(resolve => setTimeout(resolve, timeout))
        
        // Essayer de récupérer l'utilisateur
        const fetchSuccess = await fetchUser()
        
        // Attendre un peu plus pour que l'état se mette à jour
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Si toujours pas connecté après la tentative, rediriger
        if (!isLoggedIn.value || !fetchSuccess) {
          console.log('🔒 Auth middleware - Redirection vers login: utilisateur non connecté')
          const localePath = useLocalePath()
          return navigateTo(localePath('/login'))
        }
      } else {
        // Pas de token, rediriger directement
        console.log('🔒 Auth middleware - Redirection vers login: pas de token')
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