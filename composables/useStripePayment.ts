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

export const useStripePayment = () => {
  const config = useRuntimeConfig()
  const stripe = ref<Stripe | null>(null)
  const elements = ref<StripeElements | null>(null)
  const cardElement = ref<StripeCardElement | null>(null)
  const isLoading = ref(false)

  /**
   * Initialise Stripe
   */
  const initializeStripe = async () => {
    if (stripe.value) return stripe.value

    try {
      const stripeInstance = await loadStripe(config.public.stripePublishableKey as string)
      if (!stripeInstance) {
        throw new Error('Impossible de charger Stripe')
      }
      
      stripe.value = stripeInstance
      return stripeInstance
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error)
      throw new Error('Erreur lors de l\'initialisation du système de paiement')
    }
  }

  /**
   * Crée les éléments Stripe
   */
  const createElements = (clientSecret: string) => {
    if (!stripe.value) {
      throw new Error('Stripe non initialisé')
    }

    if (!clientSecret) {
      throw new Error('Client Secret requis pour créer les éléments')
    }

    elements.value = stripe.value.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#1f2937', // Couleur primaire de votre app
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    })

    return elements.value
  }

  /**
   * Crée l'élément de carte
   */
  const createCardElement = (placeholders?: {
    cardNumber?: string
    expiryDate?: string
    cvc?: string
  }) => {
    if (!elements.value) {
      throw new Error('Elements non initialisés')
    }

    cardElement.value = elements.value.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1f2937',
          '::placeholder': {
            color: '#9ca3af',
          },
        },
        invalid: {
          color: '#ef4444',
        },
      },
      ...(placeholders && {
        placeholder: placeholders
      })
    })

    return cardElement.value
  }

  /**
   * Crée un Payment Intent côté serveur
   */
  const createPaymentIntent = async (amount: number): Promise<PaymentIntentData> => {
    const token = useCookie('token').value
    try {
      const response = await $fetch('/api/commandes/create-payment-intent', {
        method: 'POST',
        body: { amount }, // uniquement le montant en euros
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response as PaymentIntentData
    } catch (error) {
      console.error('Erreur lors de la création du Payment Intent:', error)
      throw new Error('Erreur lors de la préparation du paiement')
    }
  }

  /**
   * Crée une commande avec le paiement réussi
   */
  const createCommandeWithPayment = async (commandeData: any, stripePaymentIntentId: string) => {
    const token = useCookie('token').value
    try {
      const response = await $fetch('/api/commandes/create-with-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: { commandeData, stripePaymentIntentId }
      })
      return response
    } catch (error) {
      console.error('Erreur lors de la création de la commande avec paiement:', error)
      throw new Error('Erreur lors de la création de la commande')
    }
  }

  /**
   * Processus complet de paiement avec création de commande
   */
  const processPaymentWithCommande = async (
    amount: number,
    commandeData: any,
    userName: string,
    userEmail: string
  ): Promise<StripePaymentResult> => {
    isLoading.value = true
    
    try {
      // 1. Vérifier que Stripe est initialisé
      if (!stripe.value || !cardElement.value) {
        throw new Error('Stripe non initialisé')
      }
      
      // 2. Créer le Payment Intent d'abord
      const paymentIntentData = await createPaymentIntent(amount)
      console.log('✅ Payment Intent créé:', paymentIntentData)
      
      // 3. Traiter le paiement avec Stripe
      const { error, paymentIntent } = await stripe.value.confirmCardPayment(paymentIntentData.clientSecret, {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: userName,
            email: userEmail,
          },
        },
      })
      
      if (error) {
        console.error('❌ Erreur de paiement Stripe:', error)
        return {
          success: false,
          error: error.message || 'Erreur lors du paiement'
        }
      }
      
      // 4. Vérifier que le paiement a réussi
      if (paymentIntent.status !== 'succeeded') {
        return {
          success: false,
          error: 'Le paiement n\'a pas été confirmé'
        }
      }
      
      console.log('✅ Paiement confirmé:', paymentIntent)
      
      // 5. Créer la commande avec le Stripe Payment Intent ID
      const commandeResult = await createCommandeWithPayment(commandeData, paymentIntentData.paymentIntentId)
      console.log('✅ Commande créée:', commandeResult)
      
      return {
        success: true,
        paymentIntent: paymentIntent,
        commande: commandeResult
      }

    } catch (error) {
      console.error('Erreur lors du processus de paiement:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors du paiement'
      }
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Processus de paiement simple (pour compatibilité)
   */
  const processPayment = async (
    amount: number,
    _orderId: number,
    userName: string,
    userEmail: string
  ): Promise<StripePaymentResult> => {
    try {
      if (!stripe.value || !cardElement.value) {
        throw new Error('Stripe non initialisé')
      }
      
      const paymentIntentData = await createPaymentIntent(amount)
      
      const { error, paymentIntent } = await stripe.value.confirmCardPayment(paymentIntentData.clientSecret, {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: userName,
            email: userEmail,
          },
        },
      })
      
      if (error) {
        return {
          success: false,
          error: error.message || 'Erreur lors du paiement'
        }
      }
      
      return {
        success: true,
        paymentIntent: paymentIntent
      }

    } catch (error) {
      console.error('Erreur lors du processus de paiement:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors du paiement'
      }
    }
  }

  /**
   * Nettoie les ressources
   */
  const cleanup = () => {
    if (cardElement.value) {
      cardElement.value.destroy()
      cardElement.value = null
    }
    if (elements.value) {
      elements.value = null
    }
    if (stripe.value) {
      stripe.value = null
    }
  }

  return {
    // État
    isLoading: readonly(isLoading),
    cardElement: readonly(cardElement),
    
    // Méthodes
    initializeStripe,
    createElements,
    createCardElement,
    createPaymentIntent,
    processPayment,
    processPaymentWithCommande,
    createCommandeWithPayment,
    cleanup
  }
} 