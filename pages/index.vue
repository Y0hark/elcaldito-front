<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <!-- Hero Section -->
    <section class="w-full max-w-screen-sm mx-auto mobiledesktop:max-w-none flex flex-col items-center justify-center flex-1 gap-6 py-10 mobiledesktop:py-16 px-2 mobiledesktop:px-0">
      <h1 class="text-2xl font-bold text-primary drop-shadow-lg text-center mobiledesktop:text-4xl">{{ $t('home.hero.title') }}</h1>
      <h2 class="text-base font-semibold text-secondary text-center mobiledesktop:text-xl">{{ $t('home.hero.subtitle') }}</h2>
      
      <!-- Loading State -->
      <div v-if="pending" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mobiledesktop:max-w-2xl">
        <LoadingSpinner :text="$t('home.hero.loading')" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mobiledesktop:max-w-2xl">
        <p class="text-crema text-center mb-4">{{ $t('home.hero.error') }}</p>
        <button 
          @click="refresh"
          class="px-6 py-2 bg-crema text-primary rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 mx-auto block"
        >
          {{ $t('home.hero.retry') }}
        </button>
      </div>

      <!-- Countdown Widget -->
      <div v-else-if="nextDistribution" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mobiledesktop:max-w-2xl">
        <h3 class="text-base font-semibold text-crema text-center mb-4 mobiledesktop:text-xl">{{ $t('home.hero.countdown.title') }}</h3>
        <div class="grid grid-cols-2 gap-2 mobiledesktop:grid-cols-4 mobiledesktop:gap-4 text-center">
          <div class="bg-crema rounded-lg p-2 mobiledesktop:p-3">
            <div class="text-lg font-bold text-primary mobiledesktop:text-2xl">{{ days }}</div>
            <div class="text-xs text-primary/80 mobiledesktop:text-sm">{{ $t('home.hero.countdown.days') }}</div>
          </div>
          <div class="bg-crema rounded-lg p-2 mobiledesktop:p-3">
            <div class="text-lg font-bold text-primary mobiledesktop:text-2xl">{{ hours }}</div>
            <div class="text-xs text-primary/80 mobiledesktop:text-sm">{{ $t('home.hero.countdown.hours') }}</div>
          </div>
          <div class="bg-crema rounded-lg p-2 mobiledesktop:p-3">
            <div class="text-lg font-bold text-primary mobiledesktop:text-2xl">{{ minutes }}</div>
            <div class="text-xs text-primary/80 mobiledesktop:text-sm">{{ $t('home.hero.countdown.minutes') }}</div>
          </div>
          <div class="bg-crema rounded-lg p-2 mobiledesktop:p-3">
            <div class="text-lg font-bold text-primary mobiledesktop:text-2xl">{{ seconds }}</div>
            <div class="text-xs text-primary/80 mobiledesktop:text-sm">{{ $t('home.hero.countdown.seconds') }}</div>
          </div>
        </div>
        <h4 class="text-xs font-semibold text-crema text-center mt-4 mobiledesktop:text-sm">{{ $t('home.hero.countdown.limited', { count: nextDistribution.disponibilite }) }}</h4>
      </div>

      <p class="text-lg text-primary/80 text-center max-w-2xl mt-2"></p>
      <NuxtLink :to="localePath('/commander')" class="mt-6 px-6 py-3 bg-primary text-crema rounded-xl text-base font-semibold shadow-lg hover:bg-accent hover:text-crema transition-colors duration-300 btn-transition w-full max-w-xs text-center mobiledesktop:text-xl mobiledesktop:max-w-md">{{ $t('home.hero.orderButton') }}</NuxtLink>
    </section>

    <!-- Présentation Section -->
    <section class="w-full max-w-screen-sm mx-auto mobiledesktop:max-w-screen-lg bg-white border border-primary/10 rounded-xl p-4 mobiledesktop:p-10 shadow-xl flex flex-col mobiledesktop:flex-row gap-4 mobiledesktop:gap-12 items-center mb-8 mobiledesktop:mb-10">
      <div class="flex-1 text-center mobiledesktop:text-left">
        <h3 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl">{{ $t('home.presentation.title') }}</h3>
        <p class="text-primary/90 text-base leading-relaxed mobiledesktop:text-lg" v-html="$t('home.presentation.description', {
          viviana: `<span class='font-semibold text-primary'>${$t('home.presentation.viviana')}</span>`,
          samuel: `<span class='font-semibold text-primary'>${$t('home.presentation.samuel')}</span>`,
          pozole: `<span class='font-semibold text-primary'>${$t('home.presentation.pozole')}</span>`,
          fiesta: `<span class='italic'>${$t('home.presentation.fiesta')}</span>`
        }).replace(/\n\n/g, '<br><br>')"></p>
      </div>
      <div class="flex-1 flex justify-center mt-4 mobiledesktop:mt-0">
        <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-24 h-24 rounded-full border-4 border-secondary shadow-md bg-crema mobiledesktop:w-32 mobiledesktop:h-32" />
      </div>
    </section>

    <!-- Valeurs/Avantages Section -->
    <section class="w-full max-w-screen-sm mx-auto mobiledesktop:max-w-screen-lg grid grid-cols-1 gap-4 mobiledesktop:grid-cols-4 mobiledesktop:gap-6 mb-8 mobiledesktop:mb-10 px-1 mobiledesktop:px-0">
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md flex flex-col items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover h-full" style="animation-delay: 0s;">
        <div class="flex flex-col items-center">
          <span class="text-2xl mb-2 mobiledesktop:text-3xl">👨‍🍳</span>
          <h4 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-xl text-center">{{ $t('home.values.recipe.title') }}</h4>
          <p class="text-primary/90 text-center text-sm mobiledesktop:text-base leading-relaxed">{{ $t('home.values.recipe.description') }}</p>
        </div>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md flex flex-col items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover h-full" style="animation-delay: 0.2s;">
        <div class="flex flex-col items-center">
          <span class="text-2xl mb-2 mobiledesktop:text-3xl">🌍</span>
          <h4 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-xl text-center">{{ $t('home.values.ingredients.title') }}</h4>
          <p class="text-primary/90 text-center text-sm mobiledesktop:text-base leading-relaxed">{{ $t('home.values.ingredients.description') }}</p>
        </div>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md flex flex-col items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover h-full" style="animation-delay: 0.4s;">
        <div class="flex flex-col items-center">
          <span class="text-2xl mb-2 mobiledesktop:text-3xl">⏳</span>
          <h4 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-xl text-center">{{ $t('home.values.cooking.title') }}</h4>
          <p class="text-primary/90 text-center text-sm mobiledesktop:text-base leading-relaxed">{{ $t('home.values.cooking.description') }}</p>
        </div>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md flex flex-col items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover h-full" style="animation-delay: 0.6s;">
        <div class="flex flex-col items-center">
          <span class="text-2xl mb-2 mobiledesktop:text-3xl">🚚</span>
          <h4 class="text-base font-semibold text-primary mb-1 mobiledesktop:text-xl text-center">{{ $t('home.values.delivery.title') }}</h4>
          <p class="text-primary/90 text-center text-sm mobiledesktop:text-base leading-relaxed">{{ $t('home.values.delivery.description') }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="w-full max-w-screen-sm mx-auto mobiledesktop:max-w-screen-lg bg-white border border-primary/10 rounded-xl p-4 mobiledesktop:p-10 shadow-xl flex flex-col items-center mb-8 mobiledesktop:mb-10 animate-on-scroll">
      <h3 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl">{{ $t('home.contact.title') }}</h3>
      <p class="text-primary/90 text-center mb-4 text-sm mobiledesktop:text-base">{{ $t('home.contact.description') }}</p>
      <NuxtLink
        :to="localePath('/contact')"
        class="px-6 py-3 bg-primary text-crema rounded-xl text-base font-semibold shadow-lg hover:bg-accent hover:text-crema transition-colors duration-300 btn-transition w-full max-w-xs text-center mobiledesktop:text-xl mobiledesktop:max-w-md"
      >
        {{ $t('home.contact.emailButton') }}
      </NuxtLink>
    </section>
  </div>
</template>

<script setup>
// Import Google Fonts pour Josefin Sans
import { useHead } from '#app'
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { useLocalePath } from '#i18n'
const localePath = useLocalePath()
const config = useRuntimeConfig()
const { fetchFromStrapi } = useStrapi()
const { animateOnScroll, addStaggeredAnimation } = useScrollAnimation()

// Fetch next distribution data
const { data: distribution, pending, error, refresh } = await fetchFromStrapi('/prochaine-marmites?populate=*')

// Get the next distribution
const nextDistribution = computed(() => {
  if (!distribution.value?.data?.length) {
    return null
  }

  const now = new Date()

  const upcomingDistributions = distribution.value.data
    .filter(d => d.date && new Date(d.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return upcomingDistributions.length > 0 ? upcomingDistributions[0] : null
})

// Variables pour le compte à rebours
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let countdownInterval

const updateCountdown = () => {
  if (!nextDistribution.value?.date) return

  const now = new Date()
  const nextDate = new Date(nextDistribution.value.date)
  const diff = nextDate - now

  if (diff <= 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
  
  // Initialiser les animations au scroll
  nextTick(() => {
    animateOnScroll()
    const valuesSection = document.querySelector('.grid.md\\:grid-cols-4')
    if (valuesSection) {
      addStaggeredAnimation(valuesSection, 150)
    }
  })
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap',
    },
  ],
})
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style> 