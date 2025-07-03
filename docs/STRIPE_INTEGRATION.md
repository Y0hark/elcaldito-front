# Intégration Stripe

## Vue d'ensemble

L'intégration Stripe permet aux utilisateurs de payer leurs commandes par carte bancaire de manière sécurisée. Le système est conçu pour fonctionner en parallèle avec le paiement en liquide, avec des règles de validation spécifiques.

## Configuration

### 1. Variables d'Environnement

Ajoutez dans votre `.env` :

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Configuration Nuxt

Dans `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }
  }
})
```

## Installation des Dépendances

```bash
npm install @stripe/stripe-js
```

## Architecture

### 1. Composable `useStripePayment`

Le composable centralise toute la logique de paiement Stripe :

```typescript
const {
  isLoading,
  cardElement,
  processPayment,
  cleanup
} = useStripePayment()
```

**Fonctionnalités :**
- Initialisation de Stripe
- Création des éléments de carte
- Gestion des Payment Intents
- Confirmation des paiements
- Nettoyage des ressources

### 2. Composant `StripePaymentForm`

Interface utilisateur pour le paiement :

```vue
<StripePaymentForm
  :amount="totalAmount"
  :quantite="orderForm.quantite"
  :prix="nextDistribution.prix"
  :livraison="orderForm.livraison"
  :orderId="orderId"
  @success="handlePaymentSuccess"
  @error="handlePaymentError"
/>
```

## API Endpoints

### 1. Création du Payment Intent

```javascript
// server/api/commandes/create-payment-intent.post.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
  const { amount, orderId, currency = 'eur' } = await readBody(event)
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe utilise les centimes
      currency,
      metadata: {
        orderId: orderId.toString(),
      },
    })
    
    return {
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Erreur lors de la création du Payment Intent'
    })
  }
})
```

### 2. Webhook pour les Événements

```javascript
// server/api/webhooks/stripe.post.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')
  
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(stripeEvent.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(stripeEvent.data.object)
        break
    }
    
    return { received: true }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook error'
    })
  }
})

async function handlePaymentSuccess(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId
  
  // Mettre à jour le statut de la commande dans Strapi
  await updateOrderStatus(orderId, 'Payée')
}

async function handlePaymentFailure(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId
  
  // Mettre à jour le statut de la commande dans Strapi
  await updateOrderStatus(orderId, 'Échec de paiement')
}
```

## Intégration dans le Processus de Commande

### 1. Modification de la Page Commander

```vue
<template>
  <!-- ... formulaire existant ... -->
  
  <!-- Affichage conditionnel du formulaire Stripe -->
  <div v-if="orderForm.paymentMethod === 'stripe' && orderId">
    <StripePaymentForm
      :amount="totalAmount"
      :quantite="orderForm.quantite"
      :prix="nextDistribution.prix"
      :livraison="orderForm.livraison"
      :orderId="orderId"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </div>
</template>

<script setup>
import StripePaymentForm from '~/components/StripePaymentForm.vue'

// ... logique existante ...

const orderId = ref(null)

// Modification de submitOrder
const submitOrder = async () => {
  // ... validation existante ...
  
  if (orderForm.value.paymentMethod === 'stripe') {
    // Créer la commande d'abord
    const { data: response, error } = await postToStrapi('/commandes', data)
    
    if (response.value) {
      orderId.value = response.value.id
      // Le formulaire Stripe s'affichera automatiquement
    }
  } else {
    // Paiement en liquide - logique existante
    // ...
  }
}

const handlePaymentSuccess = async (paymentIntent) => {
  showNotification('Paiement réussi ! Votre commande a été confirmée.', 'success')
  closeOrderPanel()
  await refresh()
}

const handlePaymentError = (error) => {
  showNotification(`Erreur de paiement : ${error}`, 'error')
}
</script>
```

## Sécurité

### 1. Validation Côté Serveur

Toujours valider les données côté serveur :

```javascript
// Validation du montant
if (amount <= 0 || amount > 10000) {
  throw new Error('Montant invalide')
}

// Validation de la commande
const order = await getOrder(orderId)
if (!order || order.user.id !== userId) {
  throw new Error('Commande invalide')
}
```

### 2. Protection CSRF

Stripe gère automatiquement la protection CSRF avec les signatures de webhook.

### 3. Chiffrement

Toutes les communications avec Stripe sont chiffrées en HTTPS.

## Tests

### 1. Cartes de Test Stripe

Utilisez ces cartes pour tester :

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

### 2. Test avec cURL

```bash
# Créer un Payment Intent
curl -X POST http://localhost:3000/api/commandes/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "orderId": 1,
    "currency": "eur"
  }'
```

## Gestion des Erreurs

### 1. Erreurs Courantes

```typescript
const errorMessages = {
  'card_declined': 'Carte refusée',
  'insufficient_funds': 'Fonds insuffisants',
  'expired_card': 'Carte expirée',
  'incorrect_cvc': 'Code CVC incorrect',
  'processing_error': 'Erreur de traitement'
}
```

### 2. Retry Logic

```typescript
const retryPayment = async (maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await processPayment(amount, orderId, userName, userEmail)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## Monitoring

### 1. Logs

```javascript
// Log des paiements
console.log('Payment Intent created:', {
  orderId,
  amount,
  currency,
  timestamp: new Date().toISOString()
})
```

### 2. Métriques

- Taux de succès des paiements
- Temps de traitement
- Erreurs par type
- Montants moyens

## Déploiement

### 1. Production

```env
# Production
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Webhooks

Configurez les webhooks dans le dashboard Stripe :
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

### 3. SSL

Assurez-vous que votre site utilise HTTPS en production.

## Support

### 1. Documentation Stripe

- [Documentation officielle](https://stripe.com/docs)
- [API Reference](https://stripe.com/docs/api)
- [Testing](https://stripe.com/docs/testing)

### 2. Debugging

```javascript
// Mode debug
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})
```

### 3. Support Client

- Erreurs de paiement claires
- Instructions de retry
- Support par email/chat 