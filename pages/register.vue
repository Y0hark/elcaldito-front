<template>
  <div class="min-h-screen flex items-center justify-center bg-crema">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <!-- Titre et progression -->
      <h2 class="text-2xl font-bold text-primary text-center mb-6">{{ t('register.title') }}</h2>
      
      <RegistrationProgress :current-step="currentStep" />
      
      <!-- Étape 1: Informations de base -->
      <div v-if="currentStep === 1">
        <RegistrationStep1 
          @next-step="handleStep1Complete"
          @error="handleError"
        />
      </div>
      
      <!-- Étape 2: Informations complémentaires -->
      <div v-else-if="currentStep === 2">
        <RegistrationStep2 
          @complete="handleStep2Complete"
          @back="goBackToStep1"
          @skip="handleSkipStep2"
          @error="handleError"
        />
      </div>
      
      <!-- Étape 3: Finalisation -->
      <div v-else-if="currentStep === 3" class="text-center space-y-6">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h3 class="text-lg font-semibold text-primary">{{ t('register.finalizing') }}</h3>
        <p class="text-gray-600">{{ t('register.pleaseWait') }}</p>
      </div>
      
      <!-- Messages d'erreur globaux -->
      <div v-if="globalError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ globalError }}</p>
          </div>
        </div>
      </div>
      
      <!-- Lien de connexion -->
      <div class="mt-6 text-center">
        <p class="text-primary/60">{{ t('register.hasAccount') }} 
          <NuxtLink :to="localePath('/login')" class="underline hover:text-primary">{{ t('register.login') }}</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useUserInfo } from '../composables/useUserInfo'
import { useI18n, useLocalePath } from '#i18n'

// État local
const currentStep = ref(1)
const globalError = ref('')
const step1Data = ref(null)
const step2Data = ref(null)

// Composables
const router = useRouter()
const { register, isLoggedIn } = useAuth()
const { createOrUpdateUserInfoWithRetry } = useUserInfo()
const { t } = useI18n()
const localePath = useLocalePath()

// Vérifier si l'utilisateur est déjà connecté
onMounted(() => {
  if (isLoggedIn.value) {
    router.push(localePath('/commander'))
    return
  }
  
  // Récupérer les données temporaires si elles existent
  const tempData = localStorage.getItem('registration_temp_data')
  if (tempData) {
    try {
      const parsed = JSON.parse(tempData)
      step1Data.value = parsed
      currentStep.value = 2
    } catch (e) {
      console.error('Erreur lors de la récupération des données temporaires:', e)
      localStorage.removeItem('registration_temp_data')
    }
  }
})

// Gestionnaires d'événements
const handleStep1Complete = async (data) => {
  try {
    step1Data.value = data
    currentStep.value = 2
    globalError.value = ''
  } catch (error) {
    globalError.value = 'Erreur lors de la validation des données'
  }
}

const handleStep2Complete = async (data) => {
  try {
    step2Data.value = data
    currentStep.value = 3
    globalError.value = ''
    
    await completeRegistration()
  } catch (error) {
    globalError.value = 'Erreur lors de la finalisation'
    currentStep.value = 2
  }
}

const handleSkipStep2 = async () => {
  try {
    step2Data.value = { phone: '', address: null }
    currentStep.value = 3
    globalError.value = ''
    
    await completeRegistration()
  } catch (error) {
    globalError.value = 'Erreur lors de la finalisation'
    currentStep.value = 2
  }
}

const goBackToStep1 = () => {
  currentStep.value = 1
  globalError.value = ''
}

const handleError = (error) => {
  globalError.value = error
}

// Processus de finalisation
const completeRegistration = async () => {
  try {
    // Étape 1: Créer le compte utilisateur
    const registerResult = await register(
      step1Data.value.email,
      step1Data.value.password,
      step1Data.value.username
    )
    
    if (!registerResult.success) {
      throw new Error(registerResult.message || t('register.accountError'))
    }
    
    // Étape 2: Créer ou mettre à jour les UserInfo si des données sont fournies
    if (step2Data.value && step2Data.value.phone) {
      const userInfoResult = await createOrUpdateUserInfoWithRetry({
        phone: step2Data.value.phone,
        address: step2Data.value.address,
        user: registerResult.user.id
      })
      
      if (!userInfoResult.success) {
        console.warn('Échec de la création des UserInfo:', userInfoResult.message)
        // On continue quand même car l'utilisateur peut les ajouter plus tard
      }
    }
    
    // Nettoyer les données temporaires
    localStorage.removeItem('registration_temp_data')
    localStorage.removeItem('userPhone')
    
    // Rediriger vers la page de commande
    router.push(localePath('/commander'))
    
  } catch (error) {
    console.error('Erreur lors de la finalisation:', error)
    globalError.value = error.message || t('register.finalizationError')
    currentStep.value = 2
  }
}

// Gestion de la fermeture de la page
if (process.client) {
  window.addEventListener('beforeunload', () => {
    // Les données sont déjà sauvegardées dans localStorage
    // Pas besoin de faire quoi que ce soit de spécial
  })
}
</script> 