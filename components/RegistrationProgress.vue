<template>
  <div class="w-full max-w-md mx-auto mb-8">
    <div class="flex items-center justify-between">
      <!-- Étape 1 -->
      <div class="flex flex-col items-center">
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300"
          :class="currentStep >= 1 ? 'bg-primary text-crema' : 'bg-gray-200 text-gray-500'"
        >
          1
        </div>
        <span class="text-xs mt-2 text-center" :class="currentStep >= 1 ? 'text-primary font-medium' : 'text-gray-500'">
          Informations de base
        </span>
      </div>
      
      <!-- Ligne de connexion -->
      <div class="flex-1 h-0.5 mx-4" :class="currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'"></div>
      
      <!-- Étape 2 -->
      <div class="flex flex-col items-center">
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300"
          :class="currentStep >= 2 ? 'bg-primary text-crema' : 'bg-gray-200 text-gray-500'"
        >
          2
        </div>
        <span class="text-xs mt-2 text-center" :class="currentStep >= 2 ? 'text-primary font-medium' : 'text-gray-500'">
          Informations complémentaires
        </span>
      </div>
    </div>
    
    <!-- Message de progression -->
    <div class="mt-4 text-center">
      <p class="text-sm text-primary/70">
        <span v-if="currentStep === 1">Étape 1 sur 2 : Créez votre compte</span>
        <span v-else-if="currentStep === 2">Étape 2 sur 2 : Complétez votre profil</span>
        <span v-else-if="currentStep === 3">Finalisation...</span>
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 3
  }
})
</script> 