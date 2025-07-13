export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { commandeData, stripePaymentIntentId } = body

    if (!commandeData || !stripePaymentIntentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes'
      })
    }

    const config = useRuntimeConfig()
    const token = getHeader(event, 'authorization')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Non autorisé'
      })
    }

    // Préparer les données de la commande avec le statut "Validée" et l'ID du paiement
    const commandePayload = {
      data: {
        ...commandeData,
        state: 'Validée',
        stripePaymentIntentId: stripePaymentIntentId,
        paymentDate: new Date().toISOString()
      }
    }

    console.log('🚀 Création de commande avec paiement:', commandePayload)
    console.log('🔧 URL Strapi:', config.strapiBaseUrl)

    // Créer la commande dans Strapi
    const response = await $fetch(`${config.strapiBaseUrl}/api/commandes`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: commandePayload
    })

    console.log('✅ Commande créée avec succès:', response)

    return {
      success: true,
      data: response
    }

  } catch (error: any) {
    console.error('❌ Erreur lors de la création de la commande avec paiement:', error)
    
    // Retourner l'erreur spécifique si disponible
    if (error.data?.error?.message) {
      throw createError({
        statusCode: 500,
        statusMessage: error.data.error.message
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création de la commande'
    })
  }
}) 