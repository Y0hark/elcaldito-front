import { defineNuxtRouteMiddleware, useRoute, navigateTo } from '#app'
import { useAuth } from '../composables/useAuth'
import { useLocalePath } from '#i18n'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, fetchUser, token } = useAuth()
  const protectedRoutes = ['/commander', '/compte']
  
  const isProtectedRoute = protectedRoutes.some(path => {
    const splited = to.path.split("/");
    if (to.path.startsWith(path) || ("/"+splited[splited.length-1]) == path) {
      return true;
    } else {
      return false;
    }
  })
  
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