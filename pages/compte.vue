<template>
  <div class="min-h-screen bg-crema">
    <div class="max-w-2xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold mb-6 text-primary">Mon compte</h1>
      <div class="bg-white rounded-xl shadow p-6 mb-8 border border-primary/10">
        <h2 class="text-xl font-semibold text-primary mb-4">Mes informations</h2>
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
      <div class="bg-white rounded-xl shadow p-6 border border-primary/10">
        <h2 class="text-xl font-semibold text-primary mb-4">Mes commandes</h2>
        <div v-if="pending" class="text-center text-primary/60">
          <LoadingSpinner text="Chargement des commandes..." />
        </div>
        <div v-else-if="error" class="text-red-500 text-center">
          Erreur lors du chargement des commandes.
        </div>
        <ul v-else-if="commandes.length > 0" class="space-y-4">
          <li v-for="commande in commandes" :key="commande.id" class="border border-primary/10 rounded-lg p-4 bg-primary/5">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold text-lg">{{ commande.event?.title }}</p>
                <p class="text-sm text-primary/70">{{ formatDate(commande.createdAt) }}</p>
              </div>
              <span :class="getStatusClass(commande.state)" class="text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider">{{ commande.state }}</span>
            </div>
            <div class="mt-4 border-t border-primary/10 pt-4 text-sm space-y-1">
              <p><span class="font-medium">Quantité:</span> {{ commande.quantite }} bols</p>
              <p><span class="font-medium">Total:</span> {{ ((commande.quantite * (commande.event?.prix || 0))).toFixed(2) }}€</p>
            </div>
          </li>
        </ul>
        <p v-else class="text-primary/60 italic text-center">Vous n'avez pas encore passé de commande.</p>
      </div>
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