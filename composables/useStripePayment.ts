import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'

export interface StripePaymentResult {
  success: boolean
  paymentIntent?: any
  commande?: any
  error?: string
}

export interface PaymentIntentData {
  clientSecret: string
  paymentIntentId: string
  amount: number
}

export interface CommandeResult {
  id?: number
  paymentStatus?: string
  [key: string]: any
}

export const useStripePayment = () => {
  const config = useRuntimeConfig()
  const stripe = ref<Stripe | null>(null)
  const elements = ref<StripeElements | null>(null)
  const cardElement = ref<StripeCardElement | null>(null)
  const isLoading = ref(false)

  /**
   * Initialise Stripe.js côté front
   */
  const initializeStripe = async () => {
    if (stripe.value) return stripe.value
    try {
      const stripeInstance = await loadStripe(config.public.stripePublishableKey as string)
      if (!stripeInstance) throw new Error('Impossible de charger Stripe')
      stripe.value = stripeInstance
      return stripeInstance
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error)
      throw new Error('Erreur lors de l\'initialisation du système de paiement')
    }
  }

  /**
   * Crée les éléments Stripe (Elements)
   */
  const createElements = (clientSecret: string) => {
    if (!stripe.value) throw new Error('Stripe non initialisé')
    if (!clientSecret) throw new Error('Client Secret requis pour créer les éléments')
    elements.value = stripe.value.elements({
      clientSecret,
      appearance: { theme: 'stripe' }
    })
    return elements.value
  }

  /**
   * Crée l'élément de carte
   */
  const createCardElement = () => {
    if (!elements.value) throw new Error('Elements non initialisés')
    cardElement.value = elements.value.create('card')
    return cardElement.value
  }

  /**
   * Appelle l'API Strapi pour créer un Payment Intent
   * Body: { amount: number, currency?: string }
   */
  const createPaymentIntent = async (amount: number, currency = 'eur'): Promise<PaymentIntentData> => {
    const token = useCookie('token').value
    const strapiApiUrl = config.public.strapiApiUrl
    if (!strapiApiUrl) throw new Error('strapiApiUrl non défini dans la config Nuxt')
    try {
      const response = await $fetch(`${strapiApiUrl}/api/commandes/create-payment-intent`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { amount, currency }
      })
      return response as PaymentIntentData
    } catch (error) {
      console.error('Erreur lors de la création du Payment Intent via Strapi:', error)
      throw new Error('Erreur lors de la préparation du paiement')
    }
  }

  /**
   * Utilise Stripe.js pour confirmer le paiement côté front
   */
  const confirmStripePayment = async (clientSecret: string, userName: string, userEmail: string) => {
    if (!stripe.value || !cardElement.value) throw new Error('Stripe non initialisé')
    const { error, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.value,
        billing_details: { name: userName, email: userEmail }
      }
    })
    if (error) {
      return { success: false, error: error.message || 'Erreur lors du paiement' }
    }
    return { success: true, paymentIntent }
  }

  /**
   * Crée la commande liée à un Payment Intent
   * Body: { commandeData, paymentIntentId }
   */
  const createCommandeWithPayment = async (commandeData: any, stripePaymentIntentId: string): Promise<CommandeResult> => {
    const token = useCookie('token').value
    const strapiApiUrl = config.public.strapiApiUrl
    if (!strapiApiUrl) throw new Error('strapiApiUrl non défini dans la config Nuxt')
    try {
      const response = await $fetch(`${strapiApiUrl}/api/commandes/create-with-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: { commandeData, stripePaymentIntentId }
      })
      return response as CommandeResult
    } catch (error) {
      console.error('Erreur lors de la création de la commande avec paiement:', error)
      throw new Error('Erreur lors de la création de la commande')
    }
  }

  /**
   * Vérifie le statut du paiement d'une commande
   * GET /commandes/:commandeId/payment-status
   */
  const fetchPaymentStatus = async (commandeId: number) => {
    const token = useCookie('token').value
    const strapiApiUrl = config.public.strapiApiUrl
    if (!strapiApiUrl) throw new Error('strapiApiUrl non défini dans la config Nuxt')
    try {
      const response = await $fetch(`${strapiApiUrl}/api/commandes/${commandeId}/payment-status`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      return response
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de paiement:', error)
      throw new Error('Erreur lors de la vérification du statut de paiement')
    }
  }

  /**
   * Nettoie les ressources Stripe côté front
   */
  const cleanup = () => {
    if (cardElement.value) {
      cardElement.value.destroy()
      cardElement.value = null
    }
    if (elements.value) elements.value = null
    if (stripe.value) stripe.value = null
  }

  return {
    // État
    isLoading: readonly(isLoading),
    cardElement: readonly(cardElement),
    // Méthodes principales
    initializeStripe,
    createElements,
    createCardElement,
    createPaymentIntent,
    confirmStripePayment,
    createCommandeWithPayment,
    fetchPaymentStatus,
    cleanup
  }
} 