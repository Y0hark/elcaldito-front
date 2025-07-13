<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div>
      <label class="block text-primary font-medium mb-1">Email *</label>
      <input 
        v-model="email" 
        type="email" 
        required 
        class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none transition-colors duration-200"
        :class="{ 'border-red-500': errors.email }"
        placeholder="votre@email.com"
      />
      <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
    </div>
    
    <div>
      <label class="block text-primary font-medium mb-1">Nom d'utilisateur *</label>
      <input 
        v-model="username" 
        type="text" 
        required 
        class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none transition-colors duration-200"
        :class="{ 'border-red-500': errors.username }"
        placeholder="votre_nom_utilisateur"
      />
      <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
    </div>
    
    <div>
      <label class="block text-primary font-medium mb-1">Mot de passe *</label>
      <input 
        v-model="password" 
        type="password" 
        required 
        class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none transition-colors duration-200"
        :class="{ 'border-red-500': errors.password }"
        placeholder="••••••••"
      />
      <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
    </div>
    
    <div>
      <label class="block text-primary font-medium mb-1">Confirmer le mot de passe *</label>
      <input 
        v-model="confirmPassword" 
        type="password" 
        required 
        class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none transition-colors duration-200"
        :class="{ 'border-red-500': errors.confirmPassword }"
        placeholder="••••••••"
      />
      <p v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</p>
    </div>
    
    <button 
      type="submit" 
      class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading || !isFormValid"
    >
      <span v-if="loading">Création du compte...</span>
      <span v-else>Continuer</span>
    </button>
    
    <p v-if="error" class="text-red-600 text-center text-sm">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['next-step', 'error'])

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const errors = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

// Validation en temps réel
watch([email, username, password, confirmPassword], () => {
  validateForm()
})

const validateForm = () => {
  errors.value = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  }
  
  // Validation email
  if (!email.value) {
    errors.value.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Format d\'email invalide'
  }
  
  // Validation username
  if (!username.value) {
    errors.value.username = 'Le nom d\'utilisateur est requis'
  } else if (username.value.length < 3) {
    errors.value.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
    errors.value.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'
  }
  
  // Validation password
  if (!password.value) {
    errors.value.password = 'Le mot de passe est requis'
  } else if (password.value.length < 6) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }
  
  // Validation confirmPassword
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'La confirmation du mot de passe est requise'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
}

const isFormValid = computed(() => {
  return email.value && 
         username.value && 
         password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value &&
         !errors.value.email &&
         !errors.value.username &&
         !errors.value.password &&
         !errors.value.confirmPassword
})

const onSubmit = async () => {
  validateForm()
  
  if (!isFormValid.value) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // Sauvegarder temporairement les données
    const tempData = {
      email: email.value,
      username: username.value,
      password: password.value
    }
    localStorage.setItem('registration_temp_data', JSON.stringify(tempData))
    
    emit('next-step', {
      email: email.value,
      username: username.value,
      password: password.value
    })
  } catch (err) {
    error.value = 'Erreur lors de la validation des données'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}
</script> 