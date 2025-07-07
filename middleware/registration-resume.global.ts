import { useLocalePath } from '#i18n'

export default defineNuxtRouteMiddleware((to, from) => {
  // Seulement côté client
  if (process.server) return
  
  // Seulement sur la page d'enregistrement
  if (to.path !== '/register') return
  
  // Vérifier si l'utilisateur est déjà connecté
  const token = useCookie('token')
  if (token.value) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/commander'))
  }
  
  // Vérifier s'il y a des données temporaires d'enregistrement
  const tempData = localStorage.getItem('registration_temp_data')
  if (tempData) {
    try {
      const parsed = JSON.parse(tempData)
      // Les données sont valides, on peut les utiliser
    } catch (e) {
      // Données corrompues, les supprimer
      console.error('Données temporaires corrompues, suppression:', e)
      localStorage.removeItem('registration_temp_data')
    }
  }
}) 