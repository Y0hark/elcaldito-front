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
        <ul v-else-if="commandes.length > 0" class="space-y-2 mobiledesktop:space-y-3">
          <li v-for="commande in commandes" :key="commande.id" class="flex flex-col mobiledesktop:flex-row mobiledesktop:items-center gap-2 mobiledesktop:gap-4 bg-primary/5 rounded-lg p-3">
            <span class="font-semibold text-primary">{{ commande.event?.title }}</span>
            <span class="text-primary/80 text-sm">{{ formatDate(commande.createdAt) }}</span>
            <span :class="getStatusClass(commande.state)" class="text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider">{{ commande.state }}</span>
          </li>
        </ul>
        <p v-else class="text-primary/60 italic text-center">Vous n'avez pas encore passé de commande.</p>
      </div>
      <button class="w-full px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent transition-colors duration-300 btn-transition mobiledesktop:w-auto mobiledesktop:px-6 mobiledesktop:text-lg">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useAsyncData, useRuntimeConfig } from '#app'
import { computed } from 'vue'

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

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Livrée': return 'bg-green-100 text-green-800'
    case 'Annulée': return 'bg-red-100 text-red-800'
    case 'Validée': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script> 