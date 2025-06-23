<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <Notification
      :visible="notification.visible"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <h1 class="text-2xl font-bold text-primary text-center mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">Réservez votre bol de bonheur</h1>
      <p class="text-base text-primary/80 text-center mb-4 mobiledesktop:text-lg mobiledesktop:mb-6">
        Notre pozole sort de la marmite une ou deux fois par mois. Chaque service est limité : quand c'est complet, on ferme les commandes pour garder la qualité familiale.
      </p>
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-8 mobiledesktop:py-12">
        <LoadingSpinner text="Chargement des disponibilités..." />
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 mobiledesktop:py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 max-w-xs mx-auto mobiledesktop:p-6 mobiledesktop:max-w-md">
          <p class="text-red-600 mb-3 mobiledesktop:mb-4">Une erreur est survenue lors du chargement des disponibilités.</p>
          <button 
            @click="refresh"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-xl font-semibold shadow hover:bg-red-700 transition-colors duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>
      <!-- No Distribution Available -->
      <div v-else-if="!nextDistribution" class="text-center py-8 mobiledesktop:py-12">
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-xs mx-auto mobiledesktop:p-6 mobiledesktop:max-w-md">
          <p class="text-yellow-800 mb-3 mobiledesktop:mb-4">Aucune distribution prévue pour le moment.</p>
          <p class="text-yellow-700 text-xs mobiledesktop:text-sm">Revenez bientôt pour découvrir nos prochaines cuissons !</p>
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
              <span v-if="nextDistribution.disponibilite > 0">Réserver maintenant</span>
              <span v-else>Complet</span>
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-3 mobiledesktop:text-2xl mobiledesktop:mb-4">Comment se passe la commande ?</h2>
        <ul class="space-y-3 mobiledesktop:space-y-4">
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">📅</span>
            <div>
              <span class="font-semibold text-primary">Choisissez la date disponible</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">et réservez votre bol.</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">🥘</span>
            <div>
              <span class="font-semibold text-primary">Indiquez le nombre de portions</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">(max : 6 par personne).</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">💳</span>
            <div>
              <span class="font-semibold text-primary">Payez en ligne ou en liquide</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">(carte via Stripe, bientôt PayPal).</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">✉️</span>
            <div>
              <span class="font-semibold text-primary">Recevez votre confirmation</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">par email + SMS.</p>
            </div>
          </li>
          <li class="flex items-start gap-2 mobiledesktop:gap-3">
            <span class="text-xl mobiledesktop:text-2xl">🚚</span>
            <div>
              <span class="font-semibold text-primary">Dégustez</span>
              <p class="text-primary/90 text-sm mobiledesktop:text-base">le jour J : Samuel arrive jusqu'à votre porte ou point-relais.</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-base font-semibold text-primary mb-2 mobiledesktop:text-xl mobiledesktop:mb-3">Informations pratiques</h2>
        <div class="flex flex-col mobiledesktop:flex-row gap-4 mobiledesktop:gap-6">
          <div class="flex-1">
            <h3 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-lg mobiledesktop:mb-2">Allergènes</h3>
            <ul class="space-y-1 mobiledesktop:space-y-2">
              <li class="flex items-center gap-1 mobiledesktop:gap-2 text-primary/90">
                <span class="text-lg mobiledesktop:text-xl">🌾</span>
                <span>Sans gluten</span>
              </li>
              <li class="flex items-center gap-1 mobiledesktop:gap-2 text-primary/90">
                <span class="text-lg mobiledesktop:text-xl">🌶️</span>
                <span>Peut contenir traces de piment fort</span>
              </li>
            </ul>
          </div>
          <div class="flex-1 mt-3 mobiledesktop:mt-0">
            <h3 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-lg mobiledesktop:mb-2">Zone de livraison</h3>
            <p class="text-primary/90 flex items-center gap-1 mobiledesktop:gap-2 text-sm mobiledesktop:text-base">
              <span class="text-lg mobiledesktop:text-xl">📍</span>
              <span>Marseille intra-muros & proches environs</span>
            </p>
          </div>
        </div>
      </div>
      <p class="text-base text-primary/80 text-center italic mobiledesktop:text-lg">
        Chaque bol de pozole est une déclaration d'amour à nos racines et à notre ville.
      </p>
    </div>
    <!-- Order Panel -->
    <div 
      v-if="isOrderPanelOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-end mobiledesktop:items-center justify-center"
      @click.self="closeOrderPanel"
    >
      <div 
        class="bg-crema w-full max-w-lg rounded-t-2xl mobiledesktop:rounded-2xl p-4 mobiledesktop:p-6 transform transition-transform duration-300"
        :class="{ 'translate-y-0': isOrderPanelOpen, 'translate-y-full mobiledesktop:translate-y-0 mobiledesktop:scale-95': !isOrderPanelOpen }"
      >
        <div class="flex justify-between items-center mb-4 mobiledesktop:mb-6">
          <h3 class="text-lg font-semibold text-primary mobiledesktop:text-2xl">Votre commande</h3>
          <button 
            @click="closeOrderPanel"
            class="text-primary/60 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitOrder" class="space-y-4 mobiledesktop:space-y-6">
          <!-- Event Info -->
          <div class="bg-primary/5 rounded-xl p-3 mobiledesktop:p-4">
            <h4 class="font-semibold text-primary mb-1 mobiledesktop:mb-2">{{ nextDistribution?.title }}</h4>
            <p class="text-primary/80 text-sm mobiledesktop:text-base">{{ formatDate(nextDistribution?.date) }}</p>
          </div>
          <!-- Quantity -->
          <div>
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">Nombre de bols</label>
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
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">Nom</label>
            <input 
              v-model="orderForm.nom"
              type="text"
              required
              class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base mobiledesktop:text-lg"
            />
          </div>
          <div v-if="!isLoggedIn">
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">Email</label>
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
              <span class="text-primary font-medium">Livraison à domicile</span>
            </label>
          </div>
          <!-- Commentaire -->
          <div>
            <label class="block text-primary font-medium mb-1 mobiledesktop:mb-2">Commentaire (optionnel)</label>
            <textarea
              v-model="orderForm.commentaire"
              rows="2"
              class="w-full px-3 py-2 rounded-lg border border-primary/20 focus:border-primary outline-none text-base mobiledesktop:text-lg resize-none"
              placeholder="Un mot pour Viviana & Samuel ou une précision sur la livraison ?"
            ></textarea>
          </div>
          <!-- Submit -->
          <button type="submit" class="w-full px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent transition-colors duration-300 btn-transition mobiledesktop:w-auto mobiledesktop:px-6 mobiledesktop:text-lg">Valider la commande</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead } from '#app'
import Notification from '~/components/Notification.vue'
import { useStrapi } from '../composables/useStrapi'
import { useAuth } from '../composables/useAuth'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import { useCookie } from '#app'

const config = useRuntimeConfig()
const { fetchFromStrapi, postToStrapi } = useStrapi()
const { user, isLoggedIn } = useAuth()
const { animateOnScroll } = useScrollAnimation()
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

  // Vérification limite 6 par utilisateur pour la même marmite
  if (isLoggedIn.value && user.value && nextDistribution.value) {
    const total = alreadyOrderedQuantity.value + orderForm.value.quantite
    if (total > 6) {
      showNotification(`Vous avez déjà commandé ${alreadyOrderedQuantity.value} bols pour cette marmite. Maximum autorisé : 6 par personne.`, 'error')
      return
    }
  }

  isSubmitting.value = true

  try {
    // Préparer les données à envoyer
    let data = {
      quantite: orderForm.value.quantite,
      livraison: orderForm.value.livraison,
      commentaire: orderForm.value.commentaire,
      event: nextDistribution.value?.id,
      state: 'En attente'
    }
    console.log('Payload envoyé à Strapi:', data)
    const { data: response, error } = await postToStrapi('/commandes', data)

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
  fetchUserOrdersForCurrentDistribution()
})

watch([isLoggedIn, user, nextDistribution], () => {
  fetchUserOrdersForCurrentDistribution()
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