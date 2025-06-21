import { defineNuxtRouteMiddleware, useRoute, navigateTo } from '#app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()
  const protectedRoutes = ['/commander', '/compte']
  if (protectedRoutes.some(path => to.path.startsWith(path)) && !isLoggedIn.value) {
    return navigateTo('/login')
  }
}) 