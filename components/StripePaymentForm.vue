<template>
  <div ref="formRef" class="space-y-4">
    <!-- Informations de paiement -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-2">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-blue-800">{{ $t('order.stripe.securePayment') }}</h4>
          <p class="text-sm text-blue-700 mt-1">
            {{ $t('order.stripe.securePaymentDesc') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire de carte -->
    <div>
      <label class="block text-primary font-medium mb-2">{{ $t('order.stripe.cardInfo') }}</label>
      <div 
        ref="cardElementRef"
        class="w-full px-3 py-2 border border-primary/20 rounded-lg focus-within:border-primary transition-colors"
      ></div>
      <p class="text-xs text-primary/60 mt-1">
        {{ $t('order.stripe.secureByStripe') }}
      </p>
    </div>

    <!-- Informations de facturation -->
    <div class="grid grid-cols-1 mobiledesktop:grid-cols-2 gap-4">
      <div>
        <label class="block text-primary font-medium mb-1">{{ $t('order.stripe.fullName') }}</label>
        <input 
          v-model="billingName"
          type="text"
          required
          class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base"
          :placeholder="$t('order.stripe.fullNamePlaceholder')"
        />
      </div>
      <div>
        <label class="block text-primary font-medium mb-1">{{ $t('order.stripe.email') }}</label>
        <input 
          v-model="billingEmail"
          type="email"
          required
          class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base"
          :placeholder="$t('order.stripe.emailPlaceholder')"
        />
      </div>
    </div>



    <!-- Bouton de paiement -->
    <button 
      @click="handlePayment"
      :disabled="isLoading || !isFormValid"
      class="w-full px-4 py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
    >
      <span v-if="isLoading" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ $t('order.stripe.processing') }}
      </span>
      <span v-else>
        {{ $t('order.stripe.pay') }} {{ totalAmount.toFixed(2) }}€
      </span>
    </button>

    <!-- Messages d'erreur -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
      <p class="text-sm text-red-800">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStripePayment } from '../composables/useStripePayment'
import { useI18n } from '#i18n'

const { t } = useI18n()

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  livraison: {
    type: Boolean,
    default: false
  },
  commandeData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['success', 'error'])

// État du formulaire
const billingName = ref('')
const billingEmail = ref('')
const error = ref('')
const cardElementRef = ref(null)
const formRef = ref(null)

// Composable Stripe
const { 
  isLoading, 
  cardElement, 
  initializeStripe, 
  createElements, 
  createCardElement, 
  createPaymentIntent,
  processPaymentWithCommande, 
  cleanup 
} = useStripePayment()

// Calculs
const totalAmount = computed(() => {
  const baseAmount = props.prix * props.quantite
  return props.livraison ? baseAmount + 2 : baseAmount
})

const isFormValid = computed(() => {
  return billingName.value.trim() && 
         billingEmail.value.trim() && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail.value)
})

// Initialisation de Stripe
onMounted(async () => {
  try {
    await initializeStripe()
    
    // Créer un Payment Intent pour obtenir le clientSecret
    const paymentIntentData = await createPaymentIntent(totalAmount.value * 100)
    
    // Créer les éléments avec le clientSecret
    createElements(paymentIntentData.clientSecret)
    
    // Créer et monter l'élément de carte
    createCardElement()
    if (cardElement.value && cardElementRef.value) {
      cardElement.value.mount(cardElementRef.value)
    }
  } catch (err) {
    error.value = t('order.stripe.initError')
    console.error('Erreur Stripe:', err)
  }
})

// Nettoyage
onUnmounted(() => {
  cleanup()
})

// Exposer la méthode de focus
const focusForm = () => {
  if (formRef.value) {
    formRef.value.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    // Focus sur le premier champ après un petit délai pour laisser le temps au scroll
    setTimeout(() => {
      if (billingName.value === '') {
        // Si le nom est vide, focus sur le champ nom
        const nameInput = formRef.value.querySelector('input[type="text"]')
        if (nameInput) nameInput.focus()
      } else if (billingEmail.value === '') {
        // Si l'email est vide, focus sur le champ email
        const emailInput = formRef.value.querySelector('input[type="email"]')
        if (emailInput) emailInput.focus()
      } else {
        // Sinon focus sur l'élément de carte
        if (cardElement.value) {
          cardElement.value.focus()
        }
      }
    }, 300)
  }
}

// Exposer la méthode
defineExpose({
  focusForm
})

// Gestion du paiement
const handlePayment = async () => {
  if (!isFormValid.value) {
    error.value = t('order.stripe.fillFieldsError')
    return
  }

  error.value = ''

  try {
    const result = await processPaymentWithCommande(
      totalAmount.value * 100, // Stripe utilise les centimes
      props.commandeData,
      billingName.value,
      billingEmail.value
    )

    if (result.success) {
      emit('success', result)
    } else {
      error.value = result.error || 'Erreur lors du paiement'
      emit('error', result.error)
    }
  } catch (err) {
    error.value = t('order.stripe.paymentError')
    emit('error', error.value)
    console.error('Erreur paiement:', err)
  }
}
</script> 