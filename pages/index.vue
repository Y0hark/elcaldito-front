<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <!-- Hero Section -->
    <section class="container max-w-screen-lg mx-auto flex flex-col items-center justify-center flex-1 gap-6 py-16">
      <h1 class="text-4xl md:text-5xl font-bold text-primary drop-shadow-lg text-center">Le Pozole qui réchauffe Marseille.</h1>
      <h2 class="text-xl md:text-2xl font-semibold text-secondary text-center">Une marmite. Deux cœurs. Un seul goût d'authenticité.</h2>
      
      <!-- Loading State -->
      <div v-if="pending" class="bg-primary/95 rounded-xl p-6 shadow-xl mt-4 w-full max-w-2xl">
        <LoadingSpinner text="Préparation de la prochaine marmite..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-primary/95 rounded-xl p-6 shadow-xl mt-4 w-full max-w-2xl">
        <p class="text-crema text-center mb-4">Désolé, une erreur est survenue lors du chargement des disponibilités.</p>
        <button 
          @click="refresh"
          class="px-6 py-2 bg-crema text-primary rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300"
        >
          Réessayer
        </button>
      </div>

      <!-- Countdown Widget -->
      <div v-else-if="nextDistribution" class="bg-primary/95 rounded-xl p-6 shadow-xl mt-4 w-full max-w-2xl">
        <h3 class="text-xl font-semibold text-crema text-center mb-4">Prochaine cuisson dans :</h3>
        <div class="grid grid-cols-4 gap-4 text-center">
          <div class="bg-crema rounded-lg p-3">
            <div class="text-2xl font-bold text-primary">{{ days }}</div>
            <div class="text-sm text-primary/80">Jours</div>
          </div>
          <div class="bg-crema rounded-lg p-3">
            <div class="text-2xl font-bold text-primary">{{ hours }}</div>
            <div class="text-sm text-primary/80">Heures</div>
          </div>
          <div class="bg-crema rounded-lg p-3">
            <div class="text-2xl font-bold text-primary">{{ minutes }}</div>
            <div class="text-sm text-primary/80">Minutes</div>
          </div>
          <div class="bg-crema rounded-lg p-3">
            <div class="text-2xl font-bold text-primary">{{ seconds }}</div>
            <div class="text-sm text-primary/80">Secondes</div>
          </div>
        </div>
        <h4 class="text-sm font-semibold text-crema text-center mt-4">⏳ Portions limitées : {{ nextDistribution.disponibilite }} bols disponibles !</h4>
      </div>

      <p class="text-lg text-primary/80 text-center max-w-2xl mt-2"></p>
      <NuxtLink to="/commander" class="mt-6 px-8 py-3 bg-primary text-crema rounded-xl text-xl font-semibold shadow-lg hover:bg-accent hover:text-crema transition-colors duration-300 btn-transition">Commander</NuxtLink>
    </section>

    <!-- Présentation Section -->
    <section class="container max-w-screen-lg mx-auto bg-white border border-primary/10 rounded-xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row gap-6 md:gap-12 items-center mb-10">
      <div class="flex-1">
        <h3 class="text-2xl font-semibold text-primary mb-2">Bienvenue chez El Caldito</h3>
        <p class="text-primary/90 text-lg leading-relaxed">
          Nous sommes <span class="font-semibold text-primary">Viviana</span>, Mexicaine jusqu'au bout des épices, et <span class="font-semibold text-primary">Samuel</span>, Marseillais amoureux de tout ce qui se mange avec du piment (et fou amoureux de Viviana).<br><br>
          Ensemble, nous mijotons un <span class="font-semibold text-primary">pozole maison</span> – ce "caldito" emblématique du Mexique – pour le partager, en petites séries, avec tous ceux qui ont la nostalgie d'un goût familial ou la curiosité d'une <span class="italic">fiesta de saveurs</span>.
        </p>
      </div>
      <div class="flex-1 flex justify-center">
        <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-32 h-32 rounded-full border-4 border-secondary shadow-md bg-crema" />
      </div>
    </section>

    <!-- Valeurs/Avantages Section -->
    <section class="container max-w-screen-lg mx-auto grid md:grid-cols-4 gap-6 mb-10">
      <div class="bg-white border border-primary/10 rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover" style="animation-delay: 0s;">
        <span class="text-3xl mb-2">👨‍🍳</span>
        <h4 class="text-xl font-semibold text-primary mb-1">Recette unique</h4>
        <p class="text-primary/90 text-center">Samuel la goûte et re-goûte depuis des mois et vous certifie un voyage au paradis.</p>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover" style="animation-delay: 0.2s;">
        <span class="text-3xl mb-2">🌍</span>
        <h4 class="text-xl font-semibold text-primary mb-1">Ingrédients sourcés</h4>
        <p class="text-primary/90 text-center">On marie les saveurs du Mexique avec les trésors de la France.</p>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover" style="animation-delay: 0.4s;">
        <span class="text-3xl mb-2">⏳</span>
        <h4 class="text-xl font-semibold text-primary mb-1">Cuisson lente</h4>
        <p class="text-primary/90 text-center">Qui parfume toute la maison (et bientôt la vôtre).</p>
      </div>
      <div class="bg-white border border-primary/10 rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-on-scroll stagger-animate card-hover" style="animation-delay: 0.6s;">
        <span class="text-3xl mb-2">🚚</span>
        <h4 class="text-xl font-semibold text-primary mb-1">Samuel vous livre</h4>
        <p class="text-primary/90 text-center">Sourire compris.</p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="container max-w-screen-lg mx-auto bg-white border border-primary/10 rounded-xl p-6 md:p-10 shadow-xl flex flex-col items-center mb-10 animate-on-scroll">
      <h3 class="text-2xl font-semibold text-primary mb-2">Contact & Commande</h3>
      <p class="text-primary/90 text-center mb-4">Prêt à goûter l'expérience El Caldito ? Commandez en ligne ou contactez-nous pour toute question !</p>
      <a href="mailto:contact@elcaldito.fr" class="px-8 py-3 bg-primary text-crema rounded-xl text-xl font-semibold shadow-lg hover:bg-accent hover:text-crema transition-colors duration-300 btn-transition">Nous écrire</a>
    </section>
  </div>
</template>

<script setup>
// Import Google Fonts pour Josefin Sans
import { useHead } from '#app'
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation'
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