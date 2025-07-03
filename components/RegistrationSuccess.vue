<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
      <div class="mb-6">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Inscription réussie !
      </h3>
      
      <p class="text-gray-600 mb-6">
        Votre compte a été créé avec succès. Vous pouvez maintenant commander vos plats préférés.
      </p>
      
      <div class="space-y-3">
        <button
          @click="goToCommander"
          class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300"
        >
          Commencer à commander
        </button>
        
        <button
          @click="goToProfile"
          class="w-full py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-crema transition-colors duration-300"
        >
          Compléter mon profil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCommander = () => {
  router.push('/commander')
}

const goToProfile = () => {
  router.push('/compte')
}
</script> 