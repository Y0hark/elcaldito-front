<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <Notification
      :visible="notification.visible"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <h1 class="text-2xl font-bold text-primary text-center mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">{{ $t('order.title') }}</h1>
      <p class="text-base text-primary/80 text-center mb-4 mobiledesktop:text-lg mobiledesktop:mb-6">{{ $t('order.subtitle') }}</p>
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-8 mobiledesktop:py-12">
        <LoadingSpinner :text="$t('order.loading')" />
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 mobiledesktop:py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 max-w-xs mx-auto mobiledesktop:p-6 mobiledesktop:max-w-md">
          <p class="text-red-600 mb-3 mobiledesktop:mb-4">{{ $t('order.error') }}</p>
          <button 
            @click="refresh"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-xl font-semibold shadow hover:bg-red-700 transition-colors duration-300"
          >
            {{ $t('order.retry') }}
          </button>
        </div>
      </div>
      <!-- No Distribution Available -->
      <div v-else-if="!nextDistribution" class="text-center py-8 mobiledesktop:py-12">
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-xs mx-auto mobiledesktop:p-6 mobiledesktop:max-w-md">
          <p class="text-yellow-800 mb-3 mobiledesktop:mb-4">{{ $t('order.noDistribution') }}</p>
          <p class="text-yellow-700 text-xs mobiledesktop:text-sm">{{ $t('order.noDistributionHint') }}</p>
        </div>
      </div>
      <!-- Next Distribution -->
      <div v-else-if="nextDistribution" class="bg-primary rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <div class="flex flex-col mobiledesktop:flex-row items-center gap-4 mobiledesktop:gap-6">
          <!-- Image -->
          <div class="w-full mobiledesktop:w-1/3">
            <img 
              v-if="nextDistribution.image"
              :src="getImageUrl(nextDistribution.image)"
              :alt="nextDistribution.image.alternativeText || nextDistribution.title"
              class="w-full h-36 object-cover rounded-lg mobiledesktop:h-48"
            />
          </div>
          <!-- Info -->
          <div class="flex-1 text-center mobiledesktop:text-left">
            <h2 class="text-lg font-semibold text-white mb-1 mobiledesktop:text-2xl mobiledesktop:mb-2">{{ nextDistribution.title }}</h2>
            <p class="text-white/80 mb-2 mobiledesktop:mb-4">{{ formatDate(nextDistribution.date) }}</p>
            <div class="flex flex-col mobiledesktop:flex-row gap-2 mobiledesktop:gap-4 justify-center mobiledesktop:justify-start">
              <div class="bg-white/20 rounded-lg p-2 mobiledesktop:p-3">
                <span class="block text-xs text-white/80 mobiledesktop:text-sm">Prix</span>
                <span class="text-lg font-semibold text-white mobiledesktop:text-xl">{{ nextDistribution.prix }}€</span>
              </div>
              <div class="bg-white/20 rounded-lg p-2 mobiledesktop:p-3">
                <span class="block text-xs text-white/80 mobiledesktop:text-sm">Disponibilités</span>
                <span class="text-lg font-semibold text-white mobiledesktop:text-xl">{{ nextDistribution.disponibilite }} bols</span>
              </div>
            </div>
            <button 
              @click="openOrderPanel"
              :disabled="nextDistribution.disponibilite <= 0"
              class="mt-3 w-full px-4 py-2 bg-white text-primary rounded-xl font-semibold shadow hover:bg-crema transition-colors duration-300 btn-transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed mobiledesktop:mt-4 mobiledesktop:w-auto mobiledesktop:px-6"
            >
              <span v-if="nextDistribution.disponibilite > 0">{{ $t('order.reserveNow') }}</span>
              <span v-else>{{ $t('order.soldOut') }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-3 mobiledesktop:text-2xl mobiledesktop:mb-4">{{ $t('order.howTitle') }}</h2>
        <ul class="space-y-3 mobiledesktop:space-y-4">
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">📅</span>
            <div>
              <span class="font-semibold text-primary">{{ $t('order.step1Title') }}</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">{{ $t('order.step1Desc') }}</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">🥘</span>
            <div>
              <span class="font-semibold text-primary">{{ $t('order.step2Title') }}</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">{{ $t('order.step2Desc') }}</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">💳</span>
            <div>
              <span class="font-semibold text-primary">{{ $t('order.step3Title') }}</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">{{ $t('order.step3Desc') }}</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">✉️</span>
            <div>
              <span class="font-semibold text-primary">{{ $t('order.step4Title') }}</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">{{ $t('order.step4Desc') }}</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">🚚</span>
            <div>
              <span class="font-semibold text-primary">{{ $t('order.step5Title') }}</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">{{ $t('order.step5Desc') }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-base font-semibold text-primary mb-2 mobiledesktop:text-xl mobiledesktop:mb-3">{{ $t('order.infoTitle') }}</h2>
        <div class="flex flex-col mobiledesktop:flex-row gap-4 mobiledesktop:gap-6">
          <div class="flex-1">
            <h3 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-lg mobiledesktop:mb-2">{{ $t('order.allergensTitle') }}</h3>
            <ul class="space-y-1 mobiledesktop:space-y-2">
              <li class="flex items-center gap-1 mobiledesktop:gap-2 text-primary/90">
                <span class="text-lg mobiledesktop:text-xl">🌾</span>
                <span>{{ $t('order.stripe.glutenFree') }}</span>
              </li>
              <li class="flex items-center gap-1 mobiledesktop:gap-2 text-primary/90">
                <span class="text-lg mobiledesktop:text-xl">🌶️</span>
                <span>{{ $t('order.stripe.spicyWarning') }}</span>
              </li>
            </ul>
          </div>
          <div class="flex-1 mt-3 mobiledesktop:mt-0">
            <h3 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-lg mobiledesktop:mb-2">{{ $t('order.deliveryZoneTitle') }}</h3>
            <p class="text-primary/90 flex items-center gap-1 mobiledesktop:gap-2 text-sm mobiledesktop:text-base">
              <span class="text-lg mobiledesktop:text-xl">📍</span>
              <span>{{ $t('order.stripe.deliveryZone') }}</span>
            </p>
          </div>
        </div>
      </div>
      <p class="text-base text-primary/80 text-center italic mobiledesktop:text-lg">
        {{ $t('order.loveDeclaration') }}
      </p>
    </div>
    <!-- Order Panel -->
    <div 
      v-if="isOrderPanelOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-end mobiledesktop:items-center justify-center p-4"
      @click.self="closeOrderPanel"
    >
      <div 
        class="bg-crema w-full max-w-lg mobiledesktop:max-w-4xl rounded-t-2xl mobiledesktop:rounded-2xl transform transition-transform duration-300 mobiledesktop:max-h-[90vh] mobiledesktop:overflow-y-auto"
        :class="{ 'translate-y-0': isOrderPanelOpen, 'translate-y-full mobiledesktop:translate-y-0 mobiledesktop:scale-95': !isOrderPanelOpen }"
      >
        <div class="p-4 mobiledesktop:p-6">
        <div class="flex justify-between items-center mb-4 mobiledesktop:mb-6">
          <h3 class="text-lg font-semibold text-primary mobiledesktop:text-2xl">{{ $t('order.summaryTitle') }}</h3>
          <button 
            @click="closeOrderPanel"
            class="text-primary/60 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Layout en deux colonnes sur desktop -->
        <div class="mobiledesktop:grid mobiledesktop:grid-cols-2 mobiledesktop:gap-6">
          <!-- Colonne gauche : Formulaire de commande -->
          <div class="mobiledesktop:space-y-4">
            <form @submit.prevent="submitOrder" class="space-y-4 mobiledesktop:space-y-4">
          <!-- Event Info -->
          <div class="bg-primary/5 rounded-xl p-3 mobiledesktop:p-4">
            <h4 class="font-semibold text-primary mb-1 mobiledesktop:mb-2">{{ nextDistribution?.title }}</h4>
            <p class="text-primary/80 text-sm mobiledesktop:text-base">{{ formatDate(nextDistribution?.date) }}</p>
          </div>
          <!-- Quantity -->
          <div>
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">{{ $t('order.quantity') }}</label>
            <div class="flex items-center gap-2 mobiledesktop:gap-4">
              <button 
                type="button"
                @click="decrementQuantity"
                class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 mobiledesktop:w-10 mobiledesktop:h-10"
                :disabled="orderForm.quantite <= 1"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <input 
                type="number"
                v-model.number="orderForm.quantite"
                min="1"
                max="6"
                class="w-16 text-center text-lg font-semibold text-primary bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none mobiledesktop:w-20 mobiledesktop:text-xl"
              />
              <button 
                type="button"
                @click="incrementQuantity"
                class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 mobiledesktop:w-10 mobiledesktop:h-10"
                :disabled="orderForm.quantite >= 6"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Name & Email only if not logged in -->
          <div v-if="!isLoggedIn">
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">{{ $t('order.name') }}</label>
            <input 
              v-model="orderForm.nom"
              type="text"
              required
              class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base mobiledesktop:text-lg"
            />
          </div>
          <div v-if="!isLoggedIn">
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">{{ $t('order.email') }}</label>
            <input 
              v-model="orderForm.email"
              type="email"
              required
              class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base mobiledesktop:text-lg"
            />
          </div>
          <!-- Livraison -->
          <div>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="orderForm.livraison"
                class="form-checkbox h-5 w-5 text-primary"
              />
              <span class="text-primary font-medium">{{ $t('order.homeDelivery') }}</span>
            </label>
          </div>
          <!-- Commentaire -->
          <div>
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">{{ $t('order.comment') }}</label>
            <textarea
              v-model="orderForm.commentaire"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base mobiledesktop:text-lg resize-none"
              :placeholder="$t('order.commentPlaceholder')"
            ></textarea>
          </div>
          <!-- Payment Method -->
          <div>
            <label class="block text-primary font-medium mb-2 mobiledesktop:mb-3">{{ $t('order.paymentMethod') }}</label>
            
            <!-- Avertissement si paiement liquide non disponible -->
            <PaymentWarning
              :show="orderForm.paymentMethod === 'liquide' && !paymentValidation.canPayInCash && !paymentValidation.loading"
              :title="$t('order.cashNotAvailableTitle')"
              :message="$t('order.cashNotAvailableMessage')"
              :action="$t('order.switchToCard')"
              @action="orderForm.paymentMethod = 'stripe'"
            />
            
            <div class="space-y-3">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                <input
                  type="radio"
                  v-model="orderForm.paymentMethod"
                  value="liquide"
                  :disabled="!paymentValidation.canPayInCash"
                  class="form-radio h-5 w-5 text-primary mt-0.5"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-primary">💵 {{ $t('order.cashPayment') }}</span>
                    <span v-if="paymentValidation.loading" class="text-xs text-primary/60">{{ $t('order.checking') }}</span>
                  </div>
                  <p class="text-sm text-primary/70 mt-1">{{ $t('order.payOnDelivery') }}</p>
                  <p v-if="!paymentValidation.canPayInCash && !paymentValidation.loading" class="text-xs text-red-600 mt-1">
                    {{ $t('order.cashLimitReached') }}
                  </p>
                </div>
              </label>
              
              <label class="flex items-start gap-3 p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                <input
                  type="radio"
                  v-model="orderForm.paymentMethod"
                  value="stripe"
                  class="form-radio h-5 w-5 text-primary mt-0.5"
                />
                <div class="flex-1">
                  <span class="font-medium text-primary">💳 {{ $t('order.cardPayment') }}</span>
                  <p class="text-sm text-primary/70 mt-1">{{ $t('order.secureStripe') }}</p>
                </div>
              </label>
            </div>
            
            <!-- Info sur les règles de paiement -->
            <div v-if="isLoggedIn && user" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-xs text-blue-800">
                <strong>{{ $t('order.paymentRulesTitle') }}</strong><br>
                • {{ $t('order.max6PerPerson') }}<br>
                • {{ $t('order.max2Cash') }}<br>
                • {{ $t('order.cardRequired') }}
              </p>
            </div>
          </div>
          <!-- Submit -->
          <button type="submit" class="w-full px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent transition-colors duration-300 btn-transition focus:outline-none">{{ $t('order.submit') }}</button>
            </form>
          </div>
          
          <!-- Colonne droite : Résumé et paiement -->
          <div class="mobiledesktop:space-y-4">
            <!-- Résumé de la commande -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mobiledesktop:sticky mobiledesktop:top-4">
              <h4 class="font-medium text-primary mb-3">{{ $t('order.summaryTitle') }}</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-primary/70">{{ orderForm.quantite }} {{ orderForm.quantite > 1 ? $t('order.bowls') : $t('order.bowl') }} de pozole</span>
                  <span class="font-medium">{{ (nextDistribution?.prix || 0) * orderForm.quantite }}€</span>
                </div>
                <div v-if="orderForm.livraison" class="flex justify-between">
                  <span class="text-primary/70">{{ $t('order.deliveryFee') }}</span>
                  <span class="font-medium">+2.00€</span>
                </div>
                <div class="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{{ totalPrice }}€</span>
                </div>
              </div>
            </div>
            
            <!-- Formulaire de paiement Stripe -->
            <div v-if="showStripeForm" class="border-t border-primary/20 pt-4">
              <StripePaymentForm
                ref="stripeFormRef"
                :amount="totalPrice"
                :quantite="orderForm.quantite"
                :prix="nextDistribution?.prix || 0"
                :livraison="orderForm.livraison"
                :commandeData="{
                  quantite: orderForm.quantite,
                  livraison: orderForm.livraison,
                  commentaire: orderForm.commentaire,
                  paymentMethod: orderForm.paymentMethod,
                  amount: totalPrice,
                  event: nextDistribution?.id
                }"
                @success="handlePaymentSuccess"
                @error="handlePaymentError"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead } from '#app'
import Notification from '~/components/Notification.vue'
import PaymentWarning from '~/components/PaymentWarning.vue'
import StripePaymentForm from '~/components/StripePaymentForm.vue'
import { useStrapi } from '../composables/useStrapi'
import { useAuth } from '../composables/useAuth'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import { useCookie } from '#app'
import { useCommandeValidation } from '../composables/useCommandeValidation'

const config = useRuntimeConfig()
const { fetchFromStrapi, postToStrapi, putToStrapi } = useStrapi()
const { user, isLoggedIn } = useAuth()
const { animateOnScroll } = useScrollAnimation()
const { validateCommande, canPayInCash } = useCommandeValidation()
const userOrdersForCurrentDistribution = ref([])
const alreadyOrderedQuantity = computed(() => {
  if (!isLoggedIn.value || !user.value || !nextDistribution.value) return 0
  return userOrdersForCurrentDistribution.value.reduce((sum, cmd) => sum + (cmd.quantite || 0), 0)
})

const fetchUserOrdersForCurrentDistribution = async () => {
  if (!isLoggedIn.value || !user.value || !nextDistribution.value) {
    userOrdersForCurrentDistribution.value = []
    return
  }
  try {
    const token = useCookie('token').value
    const res = await fetch(
      `${config.public.strapiBaseUrl}/api/users/me?populate[commandes][populate]=event`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    const json = await res.json()
    userOrdersForCurrentDistribution.value = (json.commandes || []).filter(
      c => c.event && c.event.id === nextDistribution.value.id
    )
  } catch (e) {
    userOrdersForCurrentDistribution.value = []
  }
}

// Fetch next distribution data
const { data: distribution, pending, error, refresh } = await fetchFromStrapi('/prochaine-marmites?populate=*')

// Get the next distribution
const nextDistribution = computed(() => {
  if (!distribution.value?.data?.length) {
    return null
  }

  const now = new Date()

  const upcomingDistributions = distribution.value.data
    .filter(d => d.date && new Date(d.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return upcomingDistributions.length > 0 ? upcomingDistributions[0] : null
})

// Total price computed property
const totalPrice = computed(() => {
  const prix = nextDistribution.value?.prix || 0
  const quantite = orderForm.value.quantite || 0
  return prix * quantite
})

// Order form state
const isOrderPanelOpen = ref(false)
const isSubmitting = ref(false)
const orderForm = ref({
  quantite: 1,
  livraison: false,
  commentaire: '',
  paymentMethod: 'liquide'
})

// État pour la validation du paiement
const paymentValidation = ref({
  canPayInCash: true,
  loading: false
})

// État pour le paiement Stripe
const showStripeForm = ref(false)
const stripeFormRef = ref(null)

const notification = ref({
  visible: false,
  message: '',
  type: 'success'
})

const showNotification = (message, type = 'success', duration = 5000) => {
  notification.value = { visible: true, message, type }
  setTimeout(() => {
    closeNotification()
  }, duration)
}

const closeNotification = () => {
  notification.value.visible = false
}

// Open order panel
const openOrderPanel = () => {
  isOrderPanelOpen.value = true
  document.body.style.overflow = 'hidden'
}

// Close order panel
const closeOrderPanel = () => {
  isOrderPanelOpen.value = false
  document.body.style.overflow = 'auto'
  // Reset Stripe states
  showStripeForm.value = false
}

// Vérifier si l'utilisateur peut payer en liquide
const checkCashPaymentAvailability = async () => {
  if (!isLoggedIn.value || !user.value || !nextDistribution.value) {
    paymentValidation.value.canPayInCash = true
    return
  }

  paymentValidation.value.loading = true
  try {
    const canPay = await canPayInCash(
      nextDistribution.value.id,
      orderForm.value.quantite,
      user.value.id
    )
    paymentValidation.value.canPayInCash = canPay
    
    // Si l'utilisateur ne peut pas payer en liquide, forcer Stripe
    if (!canPay && orderForm.value.paymentMethod === 'liquide') {
      orderForm.value.paymentMethod = 'stripe'
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement en liquide:', error)
    paymentValidation.value.canPayInCash = false
    orderForm.value.paymentMethod = 'stripe'
  } finally {
    paymentValidation.value.loading = false
  }
}

// Submit order
const submitOrder = async () => {
  if (isSubmitting.value) return

  // Vérification limite 6 par utilisateur pour la même marmite
  if (isLoggedIn.value && user.value && nextDistribution.value) {
    const total = alreadyOrderedQuantity.value + orderForm.value.quantite
    if (total > 6) {
      showNotification(`Vous avez déjà commandé ${alreadyOrderedQuantity.value} bols pour cette marmite. Maximum autorisé : 6 par personne.`, 'error')
      return
    }
  }

  // Validation de la commande avec la nouvelle logique
  if (isLoggedIn.value && user.value && nextDistribution.value) {
    const validation = await validateCommande(
      nextDistribution.value.id,
      orderForm.value.quantite,
      orderForm.value.paymentMethod,
      user.value.id
    )

    if (!validation.isValid) {
      showNotification(validation.error || 'Erreur de validation', 'error')
      return
    }

    // Si la validation indique qu'il faut utiliser Stripe, forcer le changement
    if (validation.requiresStripe) {
      orderForm.value.paymentMethod = 'stripe'
      showNotification('Le paiement en liquide n\'est pas autorisé pour cette commande. Veuillez utiliser le paiement par carte.', 'warning')
      return
    }
  }

  isSubmitting.value = true

  try {
    // Calculer le montant total
    const baseAmount = nextDistribution.value?.prix * orderForm.value.quantite
    const totalAmount = orderForm.value.livraison ? baseAmount + 2 : baseAmount

    // Préparer les données à envoyer
    let data = {
      quantite: orderForm.value.quantite,
      livraison: orderForm.value.livraison,
      commentaire: orderForm.value.commentaire,
      paymentMethod: orderForm.value.paymentMethod,
      amount: totalAmount,
      event: nextDistribution.value?.id,
      state: 'En attente'
    }

    if (orderForm.value.paymentMethod === 'stripe') {
      // Pour le paiement Stripe, afficher directement le formulaire de paiement
      showStripeForm.value = true
      
      // Focus sur le formulaire Stripe après un petit délai
      nextTick(() => {
        setTimeout(() => {
          if (stripeFormRef.value && stripeFormRef.value.focusForm) {
            stripeFormRef.value.focusForm()
          }
        }, 100)
      })
    } else {
      // Paiement en liquide - logique existante
      const { data: response, error } = await postToStrapi('/commandes', data)

      if (error) {
        throw new Error(error?.data?.error?.message || 'Erreur lors de l\'enregistrement')
      }

      if (response) {
        showNotification('Votre commande a été enregistrée avec succès ! Nous vous contacterons bientôt.', 'success')
        closeOrderPanel()
        // Reset form
        orderForm.value = {
          quantite: 1,
          livraison: false,
          commentaire: '',
          paymentMethod: 'liquide'
        }
        await refresh()
      }
    }
  } catch (error) {
    console.error('Error submitting order:', error)
    showNotification(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Handlers pour les événements Stripe
const handlePaymentSuccess = async (result) => {
  try {
    showNotification('Paiement réussi ! Votre commande a été confirmée.', 'success')
    closeOrderPanel()
    // Reset form
    orderForm.value = {
      quantite: 1,
      livraison: false,
      commentaire: '',
      paymentMethod: 'liquide'
    }
    showStripeForm.value = false
    await refresh()
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error)
    showNotification('Paiement réussi mais erreur lors du traitement.', 'warning')
  }
}

const handlePaymentError = async (error) => {
  console.error('❌ Erreur de paiement Stripe:', error)
  
  showNotification(`Erreur de paiement : ${error}`, 'error')
  // Optionnel : permettre à l'utilisateur de réessayer
  showStripeForm.value = false
}

// Get image URL with proper format
const getImageUrl = (image) => {
  if (!image) return ''
  // Use medium format if available, otherwise fallback to original
  const imageUrl = image.formats?.medium?.url || image.url
  return `${config.public.strapiBaseUrl}${imageUrl}`
}

// Fonction pour formater la date en français
const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Add these functions
const incrementQuantity = () => {
  if (orderForm.value.quantite < 6) {
    orderForm.value.quantite++
    // Vérifier la disponibilité du paiement en liquide quand la quantité change
    nextTick(() => {
      checkCashPaymentAvailability()
    })
  }
}

const decrementQuantity = () => {
  if (orderForm.value.quantite > 1) {
    orderForm.value.quantite--
    // Vérifier la disponibilité du paiement en liquide quand la quantité change
    nextTick(() => {
      checkCashPaymentAvailability()
    })
  }
}

onMounted(() => {
  // Initialiser les animations au scroll
  nextTick(() => {
    animateOnScroll()
  })
  fetchUserOrdersForCurrentDistribution()
})

watch([isLoggedIn, user, nextDistribution], () => {
  fetchUserOrdersForCurrentDistribution()
  // Vérifier la disponibilité du paiement en liquide quand l'utilisateur ou la distribution change
  nextTick(() => {
    checkCashPaymentAvailability()
  })
})

// Watcher pour la méthode de paiement
watch(() => orderForm.value.paymentMethod, (newMethod) => {
  if (newMethod === 'liquide') {
    checkCashPaymentAvailability()
  }
})

// Watcher pour la quantité
watch(() => orderForm.value.quantite, () => {
  checkCashPaymentAvailability()
})

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap',
    },
  ],
})
</script>

<style>
.prose {
  color: theme('colors.charcoal');
}

.prose p {
  margin-bottom: 1.5em;
  line-height: 1.8;
}

/* Panel Animation */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

/* Hide number input spinners for Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input spinners for Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Supprimer le contour de focus par défaut sur les boutons radio */
input[type="radio"] {
  outline: none;
}

input[type="radio"]:focus {
  outline: none;
  box-shadow: none;
}

/* Style personnalisé pour les boutons radio */
input[type="radio"]:focus-visible {
  outline: 2px solid theme('colors.primary');
  outline-offset: 2px;
  border-radius: 50%;
}

/* Supprimer le contour de focus par défaut sur les checkboxes */
input[type="checkbox"] {
  outline: none;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: none;
}

/* Style personnalisé pour les checkboxes */
input[type="checkbox"]:focus-visible {
  outline: 2px solid theme('colors.primary');
  outline-offset: 2px;
  border-radius: 4px;
}

/* Supprimer le contour de focus par défaut sur les boutons */
button {
  outline: none;
}

button:focus {
  outline: none;
  box-shadow: none;
}

/* Style personnalisé pour les boutons */
button:focus-visible {
  outline: 2px solid theme('colors.primary');
  outline-offset: 2px;
  border-radius: 8px;
}

/* Style pour le scroll du panneau de commande */
.mobiledesktop\:overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.mobiledesktop\:overflow-y-auto::-webkit-scrollbar-track {
  background: theme('colors.crema');
  border-radius: 3px;
}

.mobiledesktop\:overflow-y-auto::-webkit-scrollbar-thumb {
  background: theme('colors.primary');
  border-radius: 3px;
}

.mobiledesktop\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: theme('colors.accent');
}

/* Style pour le scroll du panneau de commande - alternative */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: theme('colors.crema');
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: theme('colors.primary');
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: theme('colors.accent');
}

/* Masquer la barre de scroll mais garder la fonctionnalité */
.mobiledesktop\:overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.mobiledesktop\:overflow-y-auto {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

.mobiledesktop\:overflow-y-auto::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style> 