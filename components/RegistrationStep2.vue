<template>
  <div class="space-y-6">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Informations complémentaires</h3>
          <div class="mt-2 text-sm text-blue-700">
            <p>Ces informations nous permettent de mieux vous servir. Le téléphone est requis pour les livraisons.</p>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="block text-primary font-medium mb-1">
          Téléphone *
          <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="phone" 
          type="tel" 
          required 
          class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none transition-colors duration-200"
          :class="{ 'border-red-500': errors.phone }"
          placeholder="06 12 34 56 78"
        />
        <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
        <p class="text-gray-500 text-xs mt-1">Format recommandé : 06 12 34 56 78</p>
      </div>
      
      <div>
        <label class="block text-primary font-medium mb-1">Adresse (optionnel)</label>
        <textarea 
          v-model="address" 
          rows="3"
          class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none transition-colors duration-200 resize-none"
          placeholder="123 Rue de la Paix, 75001 Paris"
        ></textarea>
        <p class="text-gray-500 text-xs mt-1">Vous pourrez la modifier plus tard dans votre profil</p>
      </div>
      
      <div class="flex space-x-4">
        <button 
          type="button"
          @click="goBack"
          class="flex-1 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-crema transition-colors duration-300 focus:outline-none"
        >
          Retour
        </button>
        
        <button 
          type="submit" 
          class="flex-1 py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading">Finalisation...</span>
          <span v-else>Terminer l'inscription</span>
        </button>
      </div>
      
      <div class="text-center">
        <button 
          type="button"
          @click="skipStep"
          class="text-sm text-primary/60 hover:text-primary underline"
        >
          Passer cette étape pour l'instant
        </button>
      </div>
      
      <p v-if="error" class="text-red-600 text-center text-sm">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['complete', 'back', 'skip', 'error'])

const phone = ref('')
const address = ref('')
const loading = ref(false)
const error = ref('')
const errors = ref({
  phone: ''
})

// Validation en temps réel
watch(phone, () => {
  validatePhone()
})

const validatePhone = () => {
  errors.value.phone = ''
  
  if (!phone.value) {
    errors.value.phone = 'Le téléphone est requis'
  } else {
    // Validation basique du format français
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
      errors.value.phone = 'Format de téléphone invalide'
    }
  }
}

const isFormValid = computed(() => {
  return phone.value && !errors.value.phone
})

const onSubmit = async () => {
  validatePhone()
  
  if (!isFormValid.value) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    emit('complete', {
      phone: phone.value,
      address: address.value || null
    })
  } catch (err) {
    error.value = 'Erreur lors de la finalisation'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  emit('back')
}

const skipStep = () => {
  emit('skip')
}
</script> 