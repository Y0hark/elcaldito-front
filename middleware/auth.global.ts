import { defineNuxtRouteMiddleware, useRoute, navigateTo } from '#app'
import { useAuth } from '../composables/useAuth'
import { useLocalePath } from '#i18n'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, fetchUser, token } = useAuth()
  const protectedRoutes = ['/commander', '/compte']
  
  console.log('🔒 Auth middleware - Route:', to.path)
  console.log('🔒 Auth middleware - isLoggedIn initial:', isLoggedIn.value)
  console.log('🔒 Auth middleware - Token présent:', !!token.value)
  
  const isProtectedRoute = protectedRoutes.some(path => to.path.startsWith(path))
  console.log('🔒 Auth middleware - Is protected route:', isProtectedRoute)
  
  // Si c'est une route protégée et qu'on n'est pas connecté, essayer de récupérer l'utilisateur
  if (isProtectedRoute && !isLoggedIn.value) {
    console.log('🔒 Auth middleware - Tentative de récupération de l\'utilisateur...')
    
    try {
      // Si on a un token mais pas d'utilisateur, c'est probablement un problème d'initialisation
      if (token.value) {
        console.log('🔒 Auth middleware - Token présent, tentative de récupération utilisateur...')
        
        // Attendre un peu plus longtemps pour laisser le temps au plugin d'auth de s'initialiser
        console.log('🔒 Auth middleware - Attente de 300ms...')
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Essayer de récupérer l'utilisateur
        console.log('🔒 Auth middleware - Appel de fetchUser...')
        const fetchSuccess = await fetchUser()
        
        // Attendre un peu plus pour que l'état se mette à jour
        console.log('🔒 Auth middleware - Attente supplémentaire de 200ms...')
        await new Promise(resolve => setTimeout(resolve, 200))
        
        console.log('🔒 Auth middleware - Après fetchUser, isLoggedIn:', isLoggedIn.value, 'fetchSuccess:', fetchSuccess)
        
        // Si toujours pas connecté après la tentative, rediriger
        if (!isLoggedIn.value || !fetchSuccess) {
          console.log('🔒 Auth middleware - ❌ Redirection vers /login (toujours pas connecté ou fetch échoué)')
          const localePath = useLocalePath()
          return navigateTo(localePath('/login'))
        } else {
          console.log('🔒 Auth middleware - ✅ Utilisateur connecté, accès autorisé')
        }
      } else {
        // Pas de token, rediriger directement
        console.log('🔒 Auth middleware - ❌ Aucun token, redirection vers /login')
        const localePath = useLocalePath()
        return navigateTo(localePath('/login'))
      }
    } catch (error) {
      console.error('🔒 Auth middleware - ❌ Erreur lors de la récupération:', error)
      console.log('🔒 Auth middleware - Redirection vers /login (erreur)')
      const localePath = useLocalePath()
      return navigateTo(localePath('/login'))
    }
  } else if (isProtectedRoute && isLoggedIn.value) {
    console.log('🔒 Auth middleware - ✅ Déjà connecté, accès autorisé')
  } else {
    console.log('🔒 Auth middleware - ℹ️ Route non protégée ou utilisateur connecté')
  }
  
  console.log('🔒 Auth middleware - Accès autorisé')
}) 