<template>
  <div class="relative group">
    <button 
      @click="isOpen = !isOpen" 
      class="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors duration-200 focus:outline-none"
      aria-label="Changer de langue"
    >
      <span class="text-lg">{{ currentLocale.flag }}</span>
      <span class="text-sm font-medium hidden mobiledesktop:block">{{ currentLocale.code.toUpperCase() }}</span>
      <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    <transition name="fade">
      <div v-if="isOpen" class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-primary/10 z-20">
        <button 
          v-for="locale in availableLocales" 
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-primary hover:bg-crema transition-colors duration-200"
          :class="{ 'bg-crema font-semibold': locale.code === currentLocale.code }"
        >
          <span class="text-base">{{ locale.flag }}</span>
          <span>{{ locale.name }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '#i18n'
import { useRouter } from 'vue-router'

const { locale, locales } = useI18n()
const router = useRouter()

const isOpen = ref(false)

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value) || locales.value[0]
})

const availableLocales = computed(() => {
  return locales.value
})

const switchLanguage = async (code) => {
  locale.value = code
  isOpen.value = false
  
  // Sauvegarder la langue dans le cookie
  const cookie = useCookie('i18n_redirected')
  cookie.value = code
  
  // Naviguer vers la nouvelle URL avec la langue
  const currentRoute = router.currentRoute.value
  let newPath = currentRoute.path
  
  if (code === 'fr') {
    // Retirer le préfixe /es si présent
    newPath = currentRoute.path.replace(/^\/es/, '')
    if (newPath === '') newPath = '/'
  } else {
    // Ajouter le préfixe /es si pas déjà présent
    if (!currentRoute.path.startsWith('/es')) {
      newPath = `/es${currentRoute.path}`
    }
  }
  
  await router.push(newPath)
}

// Fermer le menu quand on clique ailleurs
const closeOnClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Récupérer la langue sauvegardée depuis le cookie
  const savedLocale = useCookie('i18n_redirected')
  if (savedLocale.value && (savedLocale.value === 'fr' || savedLocale.value === 'es') && savedLocale.value !== locale.value) {
    locale.value = savedLocale.value
  }
  
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 