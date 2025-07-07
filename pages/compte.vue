<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <h1 class="text-2xl font-bold text-primary text-center mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">{{ $t('home.account.title') }}</h1>
      
      <!-- Section informations utilisateur -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">{{ $t('home.account.userInfo.title') }}</h2>
        <div v-if="user && !userInfoLoading" class="space-y-3">
          <div class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">{{ $t('home.account.userInfo.email') }}</span>
            <span>{{ user.email }}</span>
          </div>
          <div v-if="user.username" class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">{{ $t('home.account.userInfo.username') }}</span>
            <span>{{ user.username }}</span>
          </div>
          
          <div class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">{{ $t('home.account.userInfo.phone') }}</span>
            <span v-if="userInfo?.phone" class="text-primary">{{ userInfo.phone }}</span>
            <span v-else class="text-primary/50 italic">{{ $t('home.account.userInfo.notProvided') }}</span>
          </div>
          
          <div class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">{{ $t('home.account.userInfo.address') }}</span>
            <span v-if="userInfo?.address" class="text-primary">{{ userInfo.address }}</span>
            <span v-else class="text-primary/50 italic">{{ $t('home.account.userInfo.notProvidedFem') }}</span>
          </div>
          
          <!-- Bouton pour modifier les informations -->
          <div class="pt-3 border-t border-primary/10">
            <button 
              @click="showEditForm = true"
              class="px-4 py-2 bg-primary text-crema rounded-lg font-semibold shadow hover:bg-accent transition-colors duration-300"
            >
              {{ userInfo ? $t('home.account.userInfo.editButton') : $t('home.account.userInfo.addButton') }}
            </button>
          </div>
        </div>
        <div v-else-if="userInfoLoading">
          <p class="text-primary/60">{{ $t('home.account.userInfo.loading') }}</p>
        </div>
        <div v-else>
          <p class="text-primary/60">Chargement de vos informations...</p>
        </div>
      </div>

      <!-- Formulaire de modification des informations -->
      <div v-if="showEditForm" class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h3 class="text-lg font-semibold text-primary mb-4">{{ $t('home.account.editForm.title') }}</h3>
        <form @submit.prevent="updateUserInfo" class="space-y-4">
          <div>
            <label class="block text-primary font-medium mb-1">{{ $t('home.account.editForm.phone') }}</label>
            <input 
              v-model="editForm.phone" 
              type="tel" 
              required 
              class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none"
              :placeholder="$t('home.account.editForm.phonePlaceholder')"
            />
          </div>
          
          <div>
            <label class="block text-primary font-medium mb-1">{{ $t('home.account.editForm.address') }}</label>
            <textarea 
              v-model="editForm.address" 
              rows="3"
              class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none resize-none"
              :placeholder="$t('home.account.editForm.addressPlaceholder')"
            ></textarea>
          </div>
          
          <div class="flex gap-3">
            <button 
              type="submit" 
              :disabled="updating"
              class="flex-1 py-2 bg-primary text-crema rounded-lg font-semibold shadow hover:bg-accent transition-colors duration-300 disabled:opacity-50"
            >
              <span v-if="updating">{{ $t('home.account.editForm.updating') }}</span>
              <span v-else>{{ $t('home.account.editForm.save') }}</span>
            </button>
            <button 
              type="button"
              @click="cancelEdit"
              class="flex-1 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-crema transition-colors duration-300"
            >
              {{ $t('home.account.editForm.cancel') }}
            </button>
          </div>
          
          <p v-if="updateError" class="text-red-600 text-sm">{{ updateError }}</p>
          <p v-if="updateSuccess" class="text-green-600 text-sm">{{ updateSuccess }}</p>
        </form>
      </div>

      <!-- Section commandes -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">{{ $t('home.account.orders.title') }}</h2>
        <div v-if="pending" class="text-center text-primary/60">
          <LoadingSpinner :text="$t('home.account.orders.loading')" />
        </div>
        <div v-else-if="error" class="text-red-500 text-center">
          {{ $t('home.account.orders.error') }}
        </div>
        <div v-else-if="commandes.length > 0">
          <!-- Commandes actives -->
          <div v-if="commandesActives.length > 0" class="space-y-4 mb-6">
            <h3 class="text-base font-semibold text-primary mb-3">{{ $t('home.account.orders.activeOrders') }}</h3>
            <div v-for="commande in commandesActives" :key="commande.id" class="bg-crema border border-primary/10 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <!-- En-tête de la commande -->
              <div class="flex flex-col mobiledesktop:flex-row mobiledesktop:items-start mobiledesktop:justify-between gap-3 mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-primary text-lg">{{ commande.event?.title || $t('home.account.orders.orderWithoutTitle') }}</h3>
                  <p class="text-primary/70 text-sm">{{ formatDate(commande.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="getStatusClass(commande.state)" class="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {{ commande.state }}
                  </span>
                  <span v-if="commande.cancelled" class="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    {{ $t('home.account.orders.cancelled') }}
                  </span>
                </div>
              </div>
              
              <!-- Détails de la commande -->
              <div class="grid grid-cols-1 mobiledesktop:grid-cols-2 gap-3 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🥘</span>
                  <span class="text-primary/80">{{ $t('home.account.orders.quantity') }}</span>
                  <span class="font-semibold text-primary">{{ commande.quantite }} {{ commande.quantite > 1 ? $t('home.account.orders.portions') : $t('home.account.orders.portion') }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-lg">🚚</span>
                  <span class="text-primary/80">{{ $t('home.account.orders.delivery') }}</span>
                  <span class="font-semibold" :class="commande.livraison ? 'text-accent' : 'text-primary'">
                    {{ commande.livraison ? $t('home.account.orders.homeDelivery') : $t('home.account.orders.pickupPoint') }}
                  </span>
                </div>
                
                <div v-if="commande.event?.date" class="flex items-center gap-2">
                  <span class="text-lg">📅</span>
                  <span class="text-primary/80">{{ $t('home.account.orders.distributionDate') }}</span>
                  <span class="font-semibold text-primary">{{ formatDate(commande.event.date) }}</span>
                </div>
                
                <div v-if="commande.event?.heure" class="flex items-center gap-2">
                  <span class="text-lg">⏰</span>
                  <span class="text-primary/80">{{ $t('home.account.orders.time') }}</span>
                  <span class="font-semibold text-primary">{{ commande.event.heure }}</span>
                </div>
              </div>
              
              <!-- Commentaire -->
              <div v-if="commande.commentaire" class="mt-3 pt-3 border-t border-primary/10">
                <div class="flex items-start gap-2">
                  <span class="text-lg">💬</span>
                  <div>
                    <span class="text-primary/80 text-sm">{{ $t('home.account.orders.comment') }}</span>
                    <p class="text-primary text-sm italic mt-1">{{ commande.commentaire }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Commandes validées (pliable) -->
          <div v-if="commandesValidees.length > 0" class="border-t border-primary/10 pt-4">
            <button 
              @click="toggleCommandesValidees" 
              class="flex items-center justify-between w-full text-left mb-3 group focus:outline-none"
            >
              <h3 class="text-base font-semibold text-primary group-hover:text-accent transition-colors">
                {{ $t('home.account.orders.validatedOrders') }} ({{ commandesValidees.length }})
              </h3>
              <span class="text-lg transition-transform duration-200" :class="{ 'rotate-180': showCommandesValidees }">
                ▼
              </span>
            </button>
            
            <div v-show="showCommandesValidees" class="space-y-4">
              <div v-for="commande in commandesValidees" :key="commande.id" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <!-- En-tête de la commande -->
                <div class="flex flex-col mobiledesktop:flex-row mobiledesktop:items-start mobiledesktop:justify-between gap-3 mb-3">
                  <div class="flex-1">
                    <h3 class="font-semibold text-primary text-lg">{{ commande.event?.title || $t('home.account.orders.orderWithoutTitle') }}</h3>
                    <p class="text-primary/70 text-sm">{{ formatDate(commande.createdAt) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="getStatusClass(commande.state)" class="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {{ commande.state }}
                    </span>
                  </div>
                </div>
                
                <!-- Détails de la commande -->
                <div class="grid grid-cols-1 mobiledesktop:grid-cols-2 gap-3 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🥘</span>
                    <span class="text-primary/80">{{ $t('home.account.orders.quantity') }}</span>
                    <span class="font-semibold text-primary">{{ commande.quantite }} {{ commande.quantite > 1 ? $t('home.account.orders.portions') : $t('home.account.orders.portion') }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🚚</span>
                    <span class="text-primary/80">{{ $t('home.account.orders.delivery') }}</span>
                    <span class="font-semibold" :class="commande.livraison ? 'text-accent' : 'text-primary'">
                      {{ commande.livraison ? $t('home.account.orders.homeDelivery') : $t('home.account.orders.pickupPoint') }}
                    </span>
                  </div>
                  
                  <div v-if="commande.event?.date" class="flex items-center gap-2">
                    <span class="text-lg">📅</span>
                    <span class="text-primary/80">{{ $t('home.account.orders.distributionDate') }}</span>
                    <span class="font-semibold text-primary">{{ formatDate(commande.event.date) }}</span>
                  </div>
                  
                  <div v-if="commande.event?.heure" class="flex items-center gap-2">
                    <span class="text-lg">⏰</span>
                    <span class="text-primary/80">{{ $t('home.account.orders.time') }}</span>
                    <span class="font-semibold text-primary">{{ commande.event.heure }}</span>
                  </div>
                </div>
                
                <!-- Commentaire -->
                <div v-if="commande.commentaire" class="mt-3 pt-3 border-t border-primary/10">
                  <div class="flex items-start gap-2">
                    <span class="text-lg">💬</span>
                    <div>
                      <span class="text-primary/80 text-sm">{{ $t('home.account.orders.comment') }}</span>
                      <p class="text-primary text-sm italic mt-1">{{ commande.commentaire }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-primary/60 italic text-center">{{ $t('home.account.orders.noOrders') }}</p>
      </div>
      
      <button class="w-full px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent transition-colors duration-300 btn-transition mobiledesktop:w-auto mobiledesktop:px-6 mobiledesktop:text-lg focus:outline-none">{{ $t('home.account.logout') }}</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useUserInfo } from '../composables/useUserInfo'
import { useAsyncData, useRuntimeConfig } from '#app'
import { computed, ref, onMounted, watch } from 'vue'

const { user, isLoggedIn, fetchUser } = useAuth()
const { t } = useI18n()
const { createOrUpdateUserInfoWithRetry } = useUserInfo()
const config = useRuntimeConfig()
const token = useCookie('token')

// État pour la modification des informations
const showEditForm = ref(false)
const updating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')

// Récupérer les userInfo séparément
const userInfo = ref(null)
const userInfoLoading = ref(false)

// Fonction pour récupérer les userInfo
const fetchUserInfo = async () => {
  if (!isLoggedIn.value) {
    userInfo.value = null
    return
  }
  
  userInfoLoading.value = true
  try {
    const { getUserInfo } = useUserInfo()
    const result = await getUserInfo()
    if (result.success) {
      userInfo.value = result.data
    } else {
      userInfo.value = null
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des userInfo:', error)
    userInfo.value = null
  } finally {
    userInfoLoading.value = false
  }
}

// Surveiller les changements de connexion pour récupérer les userInfo
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    fetchUserInfo()
  } else {
    userInfo.value = null
  }
}, { immediate: true })

const editForm = ref({
  phone: '',
  address: ''
})

// Initialiser le formulaire avec les données actuelles
const initEditForm = () => {
  if (userInfo.value) {
    editForm.value = {
      phone: userInfo.value.phone || '',
      address: userInfo.value.address || ''
    }
  } else {
    editForm.value = {
      phone: '',
      address: ''
    }
  }
}

// Surveiller les changements de userInfo pour mettre à jour le formulaire
watch(userInfo, () => {
  initEditForm()
}, { immediate: true })

// Mettre à jour les UserInfo
const updateUserInfo = async () => {
  if (!isLoggedIn.value) return
  
  updating.value = true
  updateError.value = ''
  updateSuccess.value = ''
  
  try {
    const result = await createOrUpdateUserInfoWithRetry({
      phone: editForm.value.phone,
      address: editForm.value.address
    })
    
    if (result.success) {
      const isNewUserInfo = !userInfo.value
      updateSuccess.value = isNewUserInfo 
        ? t('home.account.editForm.addSuccess')
        : t('home.account.editForm.updateSuccess')
      
      // Rafraîchir les userInfo pour mettre à jour l'interface
      await fetchUserInfo()
      
      // Attendre un peu pour que l'état réactif soit mis à jour
      await new Promise(resolve => setTimeout(resolve, 100))
      
      showEditForm.value = false
      
      // Nettoyer le message de succès après 3 secondes
      setTimeout(() => {
        updateSuccess.value = ''
      }, 3000)
    } else {
      updateError.value = result.message || t('home.account.editForm.error')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error)
    updateError.value = t('home.account.editForm.error')
  } finally {
    updating.value = false
  }
}

const cancelEdit = () => {
  showEditForm.value = false
  updateError.value = ''
  updateSuccess.value = ''
  initEditForm()
}

const { data: userData, pending, error } = useAsyncData(
  'user-with-orders',
  () => {
    if (!isLoggedIn.value) {
      return Promise.resolve(null)
    }
    return $fetch(`/api/users/me?populate[commandes][populate]=event`, {
      baseURL: config.public.strapiBaseUrl,
      headers: { Authorization: `Bearer ${token.value}` },
    })
  },
  {
    watch: [isLoggedIn]
  }
)

const commandes = computed(() => {
  if (!userData.value?.commandes) return []
  return [...userData.value.commandes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const commandesActives = computed(() => {
  return commandes.value.filter(commande => ['En attente', 'Livrée', 'Annulée'].includes(commande.state))
})

const commandesValidees = computed(() => {
  return commandes.value.filter(commande => commande.state === 'Validée')
})

const showCommandesValidees = ref(false)

const toggleCommandesValidees = () => {
  showCommandesValidees.value = !showCommandesValidees.value
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Livrée': return 'bg-green-100 text-green-800'
    case 'Annulée': return 'bg-red-100 text-red-800'
    case 'Validée': return 'bg-blue-100 text-blue-800'
    case 'En attente': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script> 