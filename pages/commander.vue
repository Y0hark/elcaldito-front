<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <Notification
      :visible="notification.visible"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">Réservez votre bol de bonheur</h1>
      <p class="text-lg text-primary/80 text-center mb-6">
        Notre pozole sort de la marmite une ou deux fois par mois. Chaque service est limité : quand c'est complet, on ferme les commandes pour garder la qualité familiale.
      </p>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <LoadingSpinner text="Chargement des disponibilités..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p class="text-red-600 mb-4">Une erreur est survenue lors du chargement des disponibilités.</p>
          <button 
            @click="refresh"
            class="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold shadow hover:bg-red-700 transition-colors duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- No Distribution Available -->
      <div v-else-if="!nextDistribution" class="text-center py-12">
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
          <p class="text-yellow-800 mb-4">Aucune distribution prévue pour le moment.</p>
          <p class="text-yellow-700 text-sm">Revenez bientôt pour découvrir nos prochaines cuissons !</p>
        </div>
      </div>

      <!-- Next Distribution -->
      <div v-else-if="nextDistribution" class="bg-primary rounded-xl p-6 shadow-md mb-6">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <!-- Image -->
          <div class="w-full md:w-1/3">
            <img 
              v-if="nextDistribution.image"
              :src="getImageUrl(nextDistribution.image)"
              :alt="nextDistribution.image.alternativeText || nextDistribution.title"
              class="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <!-- Info -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-semibold text-white mb-2">{{ nextDistribution.title }}</h2>
            <p class="text-white/80 mb-4">{{ formatDate(nextDistribution.date) }}</p>
            <div class="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <div class="bg-white/20 rounded-lg p-3">
                <span class="block text-sm text-white/80">Prix</span>
                <span class="text-xl font-semibold text-white">{{ nextDistribution.prix }}€</span>
              </div>
              <div class="bg-white/20 rounded-lg p-3">
                <span class="block text-sm text-white/80">Disponibilités</span>
                <span class="text-xl font-semibold text-white">{{ nextDistribution.disponibilite }} bols</span>
              </div>
            </div>
            <button 
              @click="openOrderPanel"
              :disabled="nextDistribution.disponibilite <= 0"
              class="mt-4 px-6 py-2 bg-white text-primary rounded-xl font-semibold shadow hover:bg-crema transition-colors duration-300 btn-transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <span v-if="nextDistribution.disponibilite > 0">Réserver maintenant</span>
              <span v-else>Complet</span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white border border-primary/10 rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-2xl font-semibold text-primary mb-4">Comment se passe la commande ?</h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <span class="text-2xl">📅</span>
            <div>
              <span class="font-semibold text-primary">Choisissez la date disponible</span>
              <p class="text-primary/90">et réservez votre bol.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">🥘</span>
            <div>
              <span class="font-semibold text-primary">Indiquez le nombre de portions</span>
              <p class="text-primary/90">(max : 6 par personne).</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">💳</span>
            <div>
              <span class="font-semibold text-primary">Payez en ligne ou en liquide</span>
              <p class="text-primary/90">(carte via Stripe, bientôt PayPal).</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✉️</span>
            <div>
              <span class="font-semibold text-primary">Recevez votre confirmation</span>
              <p class="text-primary/90">par email + SMS.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">🚚</span>
            <div>
              <span class="font-semibold text-primary">Dégustez</span>
              <p class="text-primary/90">le jour J : Samuel arrive jusqu'à votre porte ou point-relais.</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white border border-primary/10 rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-xl font-semibold text-primary mb-3">Informations pratiques</h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-primary mb-2">Allergènes</h3>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-primary/90">
                <span class="text-xl">🌾</span>
                <span>Sans gluten</span>
              </li>
              <li class="flex items-center gap-2 text-primary/90">
                <span class="text-xl">🌶️</span>
                <span>Peut contenir traces de piment fort</span>
              </li>
            </ul>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-primary mb-2">Zone de livraison</h3>
            <p class="text-primary/90 flex items-center gap-2">
              <span class="text-xl">📍</span>
              <span>Marseille intra-muros & proches environs</span>
            </p>
          </div>
        </div>
      </div>

      <p class="text-lg text-primary/80 text-center italic">
        Chaque bol de pozole est une déclaration d'amour à nos racines et à notre ville.
      </p>
    </div>

    <!-- Order Panel -->
    <div 
      v-if="isOrderPanelOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
      @click.self="closeOrderPanel"
    >
      <div 
        class="bg-crema w-full max-w-2xl rounded-t-2xl md:rounded-2xl p-6 transform transition-transform duration-300"
        :class="{ 'translate-y-0': isOrderPanelOpen, 'translate-y-full md:translate-y-0 md:scale-95': !isOrderPanelOpen }"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-semibold text-primary">Votre commande</h3>
          <button 
            @click="closeOrderPanel"
            class="text-primary/60 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitOrder" class="space-y-6">
          <!-- Event Info -->
          <div class="bg-primary/5 rounded-xl p-4">
            <h4 class="font-semibold text-primary mb-2">{{ nextDistribution?.title }}</h4>
            <p class="text-primary/80">{{ formatDate(nextDistribution?.date) }}</p>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-primary font-medium mb-2">Nombre de bols</label>
            <div class="flex items-center gap-4">
              <button 
                type="button"
                @click="decrementQuantity"
                class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
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
                class="w-20 text-center text-xl font-semibold text-primary bg-transparent border-b-2 border-primary/20 focus:border-primary outline-none"
              />
              <button 
                type="button"
                @click="incrementQuantity"
                class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
                :disabled="orderForm.quantite >= 6"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-primary/60 mt-2">Maximum 6 bols par commande</p>
          </div>

          <!-- Delivery Option -->
          <div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                v-model="orderForm.livraison"
                class="w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary"
              />
              <span class="text-primary">Je souhaite me faire livrer</span>
            </label>
          </div>

          <!-- Comments -->
          <div>
            <label class="block text-primary font-medium mb-2">Commentaires (optionnel)</label>
            <textarea 
              v-model="orderForm.commentaire"
              rows="3"
              class="w-full rounded-lg border-2 border-primary/20 focus:border-primary outline-none p-3 text-primary"
              placeholder="Allergies, préférences, instructions de livraison..."
            ></textarea>
          </div>

          <!-- Total -->
          <div class="bg-primary/5 rounded-xl p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-primary">Total</span>
              <span class="text-xl font-semibold text-primary">{{ totalPrice }}€</span>
            </div>
            <p class="text-sm text-primary/60">Livraison incluse</p>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Traitement en cours...</span>
            <span v-else>Confirmer la commande</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead } from '#app'
import Notification from '~/components/Notification.vue'
import { useStrapi } from '../composables/useStrapi'
import { useAuth } from '../composables/useAuth'
import { useScrollAnimation } from '../composables/useScrollAnimation'

const config = useRuntimeConfig()
const { fetchFromStrapi, postToStrapi } = useStrapi()
const { user, isLoggedIn } = useAuth()
const { animateOnScroll } = useScrollAnimation()

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
  commentaire: ''
})

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
  console.log(isLoggedIn.value)
  isOrderPanelOpen.value = true
  document.body.style.overflow = 'hidden'
}

// Close order panel
const closeOrderPanel = () => {
  isOrderPanelOpen.value = false
  document.body.style.overflow = 'auto'
}

// Submit order
const submitOrder = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const { data: response, error } = await postToStrapi('/commandes', {
      quantite: orderForm.value.quantite,
      livraison: orderForm.value.livraison,
      commentaire: orderForm.value.commentaire,
      event: nextDistribution.value?.id,
      state: 'Validée'
    })

    if (error.value) {
      throw new Error(error.value?.data?.error?.message || 'Erreur lors de l\'enregistrement')
    }

    if (response.value) {
      showNotification('Votre commande a été enregistrée avec succès ! Nous vous contacterons bientôt.', 'success')
      closeOrderPanel()
      // Reset form
      orderForm.value = {
        quantite: 1,
        livraison: false,
        commentaire: ''
      }
      await refresh()
    }
  } catch (error) {
    console.error('Error submitting order:', error)
    showNotification(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'error')
  } finally {
    isSubmitting.value = false
  }
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
  }
}

const decrementQuantity = () => {
  if (orderForm.value.quantite > 1) {
    orderForm.value.quantite--
  }
}

onMounted(() => {
  // Initialiser les animations au scroll
  nextTick(() => {
    animateOnScroll()
  })
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
</style> 