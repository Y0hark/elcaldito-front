import { useRuntimeConfig } from '#app'

export interface CommandeValidationResult {
  isValid: boolean
  error?: string
  requiresStripe?: boolean
}

interface Order {
  id: number
  quantite: number
  paymentMethod?: 'liquide' | 'stripe'
  event?: {
    id: number
  }
}

export const useCommandeValidation = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('token')

  /**
   * Valide une commande selon les règles métier
   * @param eventId - ID de l'événement/marmite
   * @param quantite - Quantité de la nouvelle commande
   * @param paymentMethod - Méthode de paiement ('liquide' ou 'stripe')
   * @param userId - ID de l'utilisateur (optionnel si pas connecté)
   * @returns Promise<CommandeValidationResult>
   */
  const validateCommande = async (
    eventId: number,
    quantite: number,
    paymentMethod: 'liquide' | 'stripe',
    userId?: number
  ): Promise<CommandeValidationResult> => {
    try {
      // Si pas d'utilisateur connecté, on ne peut pas valider les règles de paiement liquide
      if (!userId) {
        return {
          isValid: true,
          requiresStripe: false
        }
      }

      // Récupérer toutes les commandes de l'utilisateur pour cet événement
      const userOrders = await getUserOrdersForEvent(eventId, userId)
      
      // Calculer le total des commandes existantes
      const totalExistingOrders = userOrders.reduce((sum: number, order: Order) => sum + (order.quantite || 0), 0)
      
      // Calculer le total après la nouvelle commande
      const totalAfterNewOrder = totalExistingOrders + quantite

      // Règle 1: Maximum 6 bols par utilisateur par marmite
      if (totalAfterNewOrder > 6) {
        return {
          isValid: false,
          error: `Vous avez déjà commandé ${totalExistingOrders} bols pour cette marmite. Avec cette commande, vous dépasseriez la limite de 6 bols par personne.`
        }
      }

      // Règle 2: Paiement en liquide limité à 2 commandes par utilisateur par marmite
      if (paymentMethod === 'liquide') {
        const existingLiquideOrders = userOrders.filter((order: Order) => order.paymentMethod === 'liquide')
        const totalLiquideOrders = existingLiquideOrders.reduce((sum: number, order: Order) => sum + (order.quantite || 0), 0)
        
        if (totalLiquideOrders + quantite > 2) {
          return {
            isValid: false,
            error: `Le paiement en liquide est limité à 2 bols par utilisateur par marmite. Vous avez déjà commandé ${totalLiquideOrders} bols en liquide pour cette marmite. Veuillez utiliser le paiement par carte.`,
            requiresStripe: true
          }
        }
      }

      return {
        isValid: true,
        requiresStripe: false
      }

    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error)
      return {
        isValid: false,
        error: 'Erreur lors de la validation de la commande. Veuillez réessayer.'
      }
    }
  }

  /**
   * Récupère toutes les commandes d'un utilisateur pour un événement donné
   */
  const getUserOrdersForEvent = async (eventId: number, userId: number): Promise<Order[]> => {
    const token = tokenCookie.value
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    const response = await fetch(
      `${config.public.strapiApiUrl}/api/users/me?populate[commandes][populate]=event`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes utilisateur')
    }

    const userData = await response.json()
    const userOrders = userData.commandes || []
    
    // Filtrer les commandes pour cet événement spécifique
    return userOrders.filter((order: Order) => 
      order.event && order.event.id === eventId
    )
  }

  /**
   * Vérifie si un utilisateur peut payer en liquide pour un événement donné
   */
  const canPayInCash = async (eventId: number, quantite: number, userId?: number): Promise<boolean> => {
    if (!userId) return false

    try {
      const userOrders = await getUserOrdersForEvent(eventId, userId)
      const existingLiquideOrders = userOrders.filter((order: Order) => order.paymentMethod === 'liquide')
      const totalLiquideOrders = existingLiquideOrders.reduce((sum: number, order: Order) => sum + (order.quantite || 0), 0)
      
      return (totalLiquideOrders + quantite) <= 2
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement en liquide:', error)
      return false
    }
  }

  return {
    validateCommande,
    getUserOrdersForEvent,
    canPayInCash
  }
} 