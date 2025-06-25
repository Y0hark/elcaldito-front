<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <h1 class="text-2xl font-bold text-primary text-center mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">Mon compte</h1>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">Mes informations</h2>
        <div v-if="user" class="space-y-3">
          <div class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">Email</span>
            <span>{{ user.email }}</span>
          </div>
          <div v-if="user.username" class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">Nom d'utilisateur</span>
            <span>{{ user.username }}</span>
          </div>
          <div v-if="user.phone" class="flex items-center gap-x-8">
            <span class="w-32 font-medium text-primary/70">Téléphone</span>
            <span>{{ user.phone }}</span>
          </div>
        </div>
        <div v-else>
          <p class="text-primary/60">Chargement de vos informations...</p>
        </div>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">Mes commandes</h2>
        <div v-if="pending" class="text-center text-primary/60">
          <LoadingSpinner text="Chargement des commandes..." />
        </div>
        <div v-else-if="error" class="text-red-500 text-center">
          Erreur lors du chargement des commandes.
        </div>
        <div v-else-if="commandes.length > 0">
          <!-- Commandes actives -->
          <div v-if="commandesActives.length > 0" class="space-y-4 mb-6">
            <h3 class="text-base font-semibold text-primary mb-3">Commandes en cours</h3>
            <div v-for="commande in commandesActives" :key="commande.id" class="bg-crema border border-primary/10 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <!-- En-tête de la commande -->
              <div class="flex flex-col mobiledesktop:flex-row mobiledesktop:items-start mobiledesktop:justify-between gap-3 mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-primary text-lg">{{ commande.event?.title || 'Commande sans titre' }}</h3>
                  <p class="text-primary/70 text-sm">{{ formatDate(commande.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="getStatusClass(commande.state)" class="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {{ commande.state }}
                  </span>
                  <span v-if="commande.cancelled" class="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Annulée
                  </span>
                </div>
              </div>
              
              <!-- Détails de la commande -->
              <div class="grid grid-cols-1 mobiledesktop:grid-cols-2 gap-3 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🥘</span>
                  <span class="text-primary/80">Quantité :</span>
                  <span class="font-semibold text-primary">{{ commande.quantite }} {{ commande.quantite > 1 ? 'portions' : 'portion' }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-lg">🚚</span>
                  <span class="text-primary/80">Livraison :</span>
                  <span class="font-semibold" :class="commande.livraison ? 'text-accent' : 'text-primary'">
                    {{ commande.livraison ? 'À domicile' : 'Point relais' }}
                  </span>
                </div>
                
                <div v-if="commande.event?.date" class="flex items-center gap-2">
                  <span class="text-lg">📅</span>
                  <span class="text-primary/80">Date de distribution :</span>
                  <span class="font-semibold text-primary">{{ formatDate(commande.event.date) }}</span>
                </div>
                
                <div v-if="commande.event?.heure" class="flex items-center gap-2">
                  <span class="text-lg">⏰</span>
                  <span class="text-primary/80">Heure :</span>
                  <span class="font-semibold text-primary">{{ commande.event.heure }}</span>
                </div>
              </div>
              
              <!-- Commentaire -->
              <div v-if="commande.commentaire" class="mt-3 pt-3 border-t border-primary/10">
                <div class="flex items-start gap-2">
                  <span class="text-lg">💬</span>
                  <div>
                    <span class="text-primary/80 text-sm">Commentaire :</span>
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
                Commandes validées ({{ commandesValidees.length }})
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
                    <h3 class="font-semibold text-primary text-lg">{{ commande.event?.title || 'Commande sans titre' }}</h3>
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
                    <span class="text-primary/80">Quantité :</span>
                    <span class="font-semibold text-primary">{{ commande.quantite }} {{ commande.quantite > 1 ? 'portions' : 'portion' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <span class="text-lg">🚚</span>
                    <span class="text-primary/80">Livraison :</span>
                    <span class="font-semibold" :class="commande.livraison ? 'text-accent' : 'text-primary'">
                      {{ commande.livraison ? 'À domicile' : 'Point relais' }}
                    </span>
                  </div>
                  
                  <div v-if="commande.event?.date" class="flex items-center gap-2">
                    <span class="text-lg">📅</span>
                    <span class="text-primary/80">Date de distribution :</span>
                    <span class="font-semibold text-primary">{{ formatDate(commande.event.date) }}</span>
                  </div>
                  
                  <div v-if="commande.event?.heure" class="flex items-center gap-2">
                    <span class="text-lg">⏰</span>
                    <span class="text-primary/80">Heure :</span>
                    <span class="font-semibold text-primary">{{ commande.event.heure }}</span>
                  </div>
                </div>
                
                <!-- Commentaire -->
                <div v-if="commande.commentaire" class="mt-3 pt-3 border-t border-primary/10">
                  <div class="flex items-start gap-2">
                    <span class="text-lg">💬</span>
                    <div>
                      <span class="text-primary/80 text-sm">Commentaire :</span>
                      <p class="text-primary text-sm italic mt-1">{{ commande.commentaire }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-primary/60 italic text-center">Vous n'avez pas encore passé de commande.</p>
      </div>
      <button class="w-full px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent transition-colors duration-300 btn-transition mobiledesktop:w-auto mobiledesktop:px-6 mobiledesktop:text-lg focus:outline-none">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useAsyncData, useRuntimeConfig } from '#app'
import { computed, ref } from 'vue'

const { user, isLoggedIn } = useAuth()
const config = useRuntimeConfig()
const token = useCookie('token')

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