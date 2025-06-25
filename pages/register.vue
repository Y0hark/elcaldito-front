<template>
  <div class="min-h-screen flex items-center justify-center bg-crema">
    <form @submit.prevent="onRegister" class="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold text-primary text-center">Créer un compte</h2>
      <div>
        <label class="block text-primary font-medium mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none" />
      </div>
      <div>
        <label class="block text-primary font-medium mb-1">Téléphone</label>
        <input v-model="phone" type="tel" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none" placeholder="06 12 34 56 78" />
      </div>
      <div>
        <label class="block text-primary font-medium mb-1">Mot de passe</label>
        <input v-model="password" type="password" required class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none" />
      </div>
      <div>
        <label class="block text-primary font-medium mb-1">Confirmer le mot de passe</label>
        <input v-model="confirmPassword" type="password" required class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none" />
        <p v-if="passwordMismatch" class="text-red-600 text-sm mt-1">Les mots de passe ne correspondent pas</p>
      </div>
      <button type="submit" class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 focus:outline-none" :disabled="loading || passwordMismatch">
        <span v-if="loading">Inscription...</span>
        <span v-else>Créer un compte</span>
      </button>
      <p v-if="error" class="text-red-600 text-center">{{ error }}</p>
      <p class="text-center text-primary/60">Déjà un compte ? <NuxtLink to="/login" class="underline">Se connecter</NuxtLink></p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const { register } = useAuth()

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

const onRegister = async () => {
  // Vérifier que les mots de passe correspondent
  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  error.value = ''
  const { success, message } = await register(email.value, password.value, phone.value)
  loading.value = false
  if (success) {
    router.push('/commander')
  } else {
    error.value = message || "Erreur lors de l'inscription"
  }
}
</script> 