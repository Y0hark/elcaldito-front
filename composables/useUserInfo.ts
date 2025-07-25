import { $fetch } from 'ofetch'

export interface UserInfo {
  id?: number
  phone: string
  address?: string
  user?: number // Optionnel côté client, géré par JWT token dans Strapi
}

interface StrapiResponse<T> {
  data: T
  meta?: any
}

interface StrapiError {
  data?: {
    error?: {
      message?: string
    }
  }
}

export function useUserInfo() {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('token')

  const createUserInfo = async (userInfo: Omit<UserInfo, 'id' | 'user'>): Promise<{ success: boolean; data?: UserInfo; message?: string }> => {
    try {
      // Structure exacte comme dans le curl
      const requestBody = {
        data: {
          phone: userInfo.phone,
          address: userInfo.address
        }
      }
      
      const response = await $fetch<StrapiResponse<UserInfo>>(`${config.public.strapiApiUrl}/api/user-infos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenCookie.value}`,
        },
        body: requestBody
      })

      return { success: true, data: response.data }
    } catch (err: any) {
      console.error('Erreur création UserInfo:', err)
      console.error('Status:', err.status)
      console.error('Response:', err.data)
      
      // Si l'endpoint n'existe pas encore, on considère que c'est OK
      if (err.status === 404 || err.status === 405) {
        console.warn('Endpoint user-infos non disponible, création ignorée')
        return { success: true, message: 'Endpoint non disponible, création ignorée' }
      }
      
      // Erreur d'autorisation
      if (err.status === 401) {
        console.warn('Token d\'authentification invalide ou manquant')
        return { success: false, message: 'Token d\'authentification invalide' }
      }
      
      // Erreur de format de données
      if (err.status === 400) {
        console.warn('Format de données invalide:', err.data)
        
        // Si Strapi indique qu'un UserInfo existe déjà, on essaie de le récupérer et le mettre à jour
        if (err.data?.error?.message?.includes('already exists')) {
          try {
            const existingResult = await getUserInfo()
            if (existingResult.success && existingResult.data) {
              return await updateUserInfo(existingResult.data.id!, userInfo)
            }
          } catch (updateErr) {
            console.error('Erreur lors de la tentative de mise à jour:', updateErr)
          }
        }
        
        return { success: false, message: `Format de données invalide: ${err.data?.error?.message || 'Données malformées'}` }
      }
      
      const strapiError = err as StrapiError
      return { 
        success: false, 
        message: strapiError.data?.error?.message || 'Erreur lors de la création des informations utilisateur' 
      }
    }
  }

  const updateUserInfo = async (id: number, userInfo: Omit<UserInfo, 'id' | 'user'>): Promise<{ success: boolean; data?: UserInfo; message?: string }> => {
    try {
      // Structure exacte comme dans le curl
      const requestBody = {
        data: {
          phone: userInfo.phone,
          address: userInfo.address
        }
      }
      
      // Utiliser directement l'endpoint avec ID
      const response = await $fetch<StrapiResponse<UserInfo>>(`${config.public.strapiApiUrl}/api/user-infos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenCookie.value}`,
        },
        body: requestBody
      })

      return { success: true, data: response.data }
    } catch (err: any) {
      console.error('Erreur mise à jour UserInfo:', err)
      console.error('Status:', err.status)
      console.error('Response:', err.data)
      
      // Erreur d'autorisation
      if (err.status === 401) {
        console.warn('Token d\'authentification invalide ou manquant')
        return { success: false, message: 'Token d\'authentification invalide' }
      }
      
      // Erreur de format de données
      if (err.status === 400) {
        console.warn('Format de données invalide:', err.data)
        return { success: false, message: `Format de données invalide: ${err.data?.error?.message || 'Données malformées'}` }
      }
      
      // Erreur 404 - UserInfo non trouvé
      if (err.status === 404) {
        console.warn('UserInfo non trouvé, tentative de création...')
        return await createUserInfo(userInfo)
      }
      
      const strapiError = err as StrapiError
      return { 
        success: false, 
        message: strapiError.data?.error?.message || 'Erreur lors de la mise à jour des informations utilisateur' 
      }
    }
  }

  const getUserInfo = async (): Promise<{ success: boolean; data?: UserInfo; message?: string }> => {
    try {
      // Récupérer le UserInfo de l'utilisateur connecté (identifié par le JWT token)
      // Strapi filtrera automatiquement par l'utilisateur authentifié
      const endpoint = `${config.public.strapiApiUrl}/api/user-infos?populate=*`

      const response = await $fetch<StrapiResponse<UserInfo[]>>(endpoint, {
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      })

      // Retourner le premier UserInfo trouvé
      const userInfoData = response.data
      const userInfo = Array.isArray(userInfoData) ? userInfoData[0] : userInfoData
      return { success: true, data: userInfo }
    } catch (err: any) {
      console.error('Erreur récupération UserInfo:', err)
      console.error('Status:', err.status)
      console.error('Response:', err.data)
      
      // Si l'endpoint n'existe pas encore, on retourne null (pas d'erreur)
      if (err.status === 404 || err.status === 405) {
        console.warn('Endpoint user-infos non disponible, aucun UserInfo trouvé')
        return { success: true, data: undefined, message: 'Endpoint non disponible' }
      }
      
      // Erreur d'autorisation
      if (err.status === 401) {
        console.warn('Token d\'authentification invalide ou manquant')
        return { success: false, message: 'Token d\'authentification invalide' }
      }
      
      // Erreur d'accès interdit (403) - probablement pas de UserInfo pour cet utilisateur
      if (err.status === 403) {
        console.warn('Accès interdit - probablement pas de UserInfo pour cet utilisateur')
        return { success: true, data: undefined, message: 'Aucun UserInfo trouvé' }
      }
      
      // Erreur de format de données
      if (err.status === 400) {
        console.warn('Format de requête invalide:', err.data)
        return { success: false, message: `Format de requête invalide: ${err.data?.error?.message || 'Requête malformée'}` }
      }
      
      const strapiError = err as StrapiError
      return { 
        success: false, 
        message: strapiError.data?.error?.message || 'Erreur lors de la récupération des informations utilisateur' 
      }
    }
  }

  const createOrUpdateUserInfo = async (userInfo: Omit<UserInfo, 'id' | 'user'>): Promise<{ success: boolean; data?: UserInfo; message?: string }> => {
    try {
      // D'abord, essayer de récupérer un UserInfo existant
      const existingResult = await getUserInfo()
      
      if (existingResult.success && existingResult.data) {
        // Mettre à jour l'existant
        return await updateUserInfo(existingResult.data.id!, userInfo)
      } else {
        // Créer un nouveau
        return await createUserInfo(userInfo)
      }
    } catch (err) {
      console.error('Exception createOrUpdateUserInfo:', err)
      return { success: false, message: 'Erreur lors de la sauvegarde des informations utilisateur' }
    }
  }

  // Fonction avec retry automatique
  const createOrUpdateUserInfoWithRetry = async (
    userInfo: Omit<UserInfo, 'id' | 'user'>, 
    maxRetries: number = 3
  ): Promise<{ success: boolean; data?: UserInfo; message?: string }> => {
    let lastError: string = ''
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await createOrUpdateUserInfo(userInfo)
        
        if (result.success) {
          return result
        }
        
        lastError = result.message || 'Erreur inconnue'
        
        // Attendre avant de réessayer (backoff exponentiel)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s...
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      } catch (err) {
        lastError = 'Erreur réseau'
        console.error(`Tentative ${attempt} échouée:`, err)
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    return { success: false, message: `Échec après ${maxRetries} tentatives: ${lastError}` }
  }

  return {
    createUserInfo,
    updateUserInfo,
    getUserInfo,
    createOrUpdateUserInfo,
    createOrUpdateUserInfoWithRetry
  }
} 