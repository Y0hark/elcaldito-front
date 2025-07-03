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
      console.log('Tentative de création UserInfo (sans ID utilisateur):', userInfo)
      console.log('Token disponible:', !!tokenCookie.value)
      
      // Structure exacte comme dans le curl
      const requestBody = {
        data: {
          phone: userInfo.phone,
          address: userInfo.address
        }
      }
      
      console.log('Body de la requête:', requestBody)
      
      const response = await $fetch<StrapiResponse<UserInfo>>(`${config.public.strapiBaseUrl}/api/user-infos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenCookie.value}`,
        },
        body: requestBody
      })

      console.log('UserInfo créé avec succès:', response)
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
          console.log('UserInfo existe déjà, tentative de récupération et mise à jour...')
          try {
            const existingResult = await getUserInfo()
            if (existingResult.success && existingResult.data) {
              console.log('UserInfo existant trouvé, mise à jour...')
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
      console.log('Tentative de mise à jour UserInfo avec ID:', { id, userInfo })
      
      // Structure exacte comme dans le curl
      const requestBody = {
        data: {
          phone: userInfo.phone,
          address: userInfo.address
        }
      }
      
      console.log('Body de la requête (mise à jour):', requestBody)
      
      // Utiliser directement l'endpoint avec ID
      const response = await $fetch<StrapiResponse<UserInfo>>(`${config.public.strapiBaseUrl}/api/user-infos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenCookie.value}`,
        },
        body: requestBody
      })

      console.log('UserInfo mis à jour avec succès:', response)
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
      const endpoint = `${config.public.strapiBaseUrl}/api/user-infos?populate=*`

      console.log('Tentative de récupération UserInfo (utilisateur connecté):', endpoint)
      console.log('Token disponible:', !!tokenCookie.value)

      const response = await $fetch<StrapiResponse<UserInfo[]>>(endpoint, {
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      })

      console.log('UserInfo récupéré avec succès:', response)
      
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
      console.log('Début createOrUpdateUserInfo:', userInfo)
      
      // D'abord, essayer de récupérer un UserInfo existant
      const existingResult = await getUserInfo()
      
      if (existingResult.success && existingResult.data) {
        console.log('UserInfo existant trouvé, mise à jour...')
        // Mettre à jour l'existant
        return await updateUserInfo(existingResult.data.id!, userInfo)
      } else {
        console.log('Aucun UserInfo existant, création...')
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
        console.log(`Tentative ${attempt}/${maxRetries} de createOrUpdateUserInfo`)
        const result = await createOrUpdateUserInfo(userInfo)
        
        if (result.success) {
          console.log(`Succès à la tentative ${attempt}`)
          return result
        }
        
        lastError = result.message || 'Erreur inconnue'
        console.log(`Échec à la tentative ${attempt}: ${lastError}`)
        
        // Attendre avant de réessayer (backoff exponentiel)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s...
          console.log(`Attente de ${delay}ms avant la prochaine tentative...`)
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
    
    console.error(`Échec après ${maxRetries} tentatives: ${lastError}`)
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