import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const stripe = new Stripe(config.stripeSecretKey!, {
    apiVersion: '2025-05-28.basil'
  })

  try {
    // Vérifier l'authentification
    const token = getHeader(event, 'authorization')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token d\'authentification manquant'
      })
    }

    // Récupérer le montant depuis le body
    const { amount } = await readBody(event)
    
    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Montant invalide'
      })
    }

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe utilise les centimes
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount
    }

  } catch (error: any) {
    console.error('Erreur lors de la création du Payment Intent:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création du Payment Intent'
    })
  }
}) 