<template>
  <div class="min-h-screen flex items-center justify-center bg-crema">
    <form @submit.prevent="onLogin" class="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
      <h2 class="text-2xl font-bold text-primary text-center">Connexion</h2>
      <div>
        <label class="block text-primary font-medium mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none" />
      </div>
      <div>
        <label class="block text-primary font-medium mb-1">Mot de passe</label>
        <input v-model="password" type="password" required class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none" />
      </div>
      <button type="submit" class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300" :disabled="loading">
        <span v-if="loading">Connexion...</span>
        <span v-else>Se connecter</span>
      </button>
      <p v-if="error" class="text-red-600 text-center">{{ error }}</p>
      <p class="text-center text-primary/60">Pas encore de compte ? <NuxtLink to="/register" class="underline">Créer un compte</NuxtLink></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const { login } = useAuth()

const onLogin = async () => {
  loading.value = true
  error.value = ''
  const { success, message } = await login(email.value, password.value)
  loading.value = false
  if (success) {
    router.push('/commander')
  } else {
    error.value = message || 'Erreur de connexion'
  }
}
</script> 