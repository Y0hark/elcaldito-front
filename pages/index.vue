<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <!-- Hero Section -->
    <section class="container max-w-screen-lg mx-auto flex flex-col items-center justify-center flex-1 gap-6 py-16">
      <h1 class="text-4xl md:text-5xl font-bold text-primary drop-shadow-lg text-center">Le Pozole qui réchauffe Marseille.</h1>
      <h2 class="text-xl md:text-2xl font-semibold text-secondary text-center">Une marmite. Deux cœurs. Un seul goût d'authenticité.</h2>
      
      <!-- Countdown Widget -->
      <div class="bg-primary/95 rounded-xl p-6 shadow-xl mt-4 w-full max-w-2xl">
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
        <h4 class="text-sm font-semibold text-crema text-center mt-4">⏳ Portions limitées : quand la marmite est vide, il faut attendre la suivante !</h4>
      </div>

      <p class="text-lg text-primary/80 text-center max-w-2xl mt-2"></p>
      <NuxtLink to="/commander" class="mt-6 px-8 py-3 bg-primary text-crema rounded-xl text-xl font-semibold shadow-lg hover:bg-accent hover:text-crema transition-colors duration-300">Commander</NuxtLink>
    </section>

    <!-- Présentation Section -->
    <section class="container max-w-screen-lg mx-auto bg-charcoal/95 rounded-xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row gap-6 md:gap-12 items-center mb-10">
      <div class="flex-1">
        <h3 class="text-2xl font-semibold text-crema mb-2">Bienvenue chez El Caldito</h3>
        <p class="text-crema/90 text-lg leading-relaxed">
          Nous sommes <span class="font-semibold">Viviana</span>, Mexicaine jusqu'au bout des épices, et <span class="font-semibold">Samuel</span>, Marseillais amoureux de tout ce qui se mange avec du piment (et fou amoureux de Viviana).<br><br>
          Ensemble, nous mijotons un <span class="font-semibold text-charcoal">pozole maison</span> – ce "caldito" emblématique du Mexique – pour le partager, en petites séries, avec tous ceux qui ont la nostalgie d'un goût familial ou la curiosité d'une <span class="italic">fiesta de saveurs</span>.
        </p>
      </div>
      <div class="flex-1 flex justify-center">
        <img src="/public/favicon.ico" alt="El Caldito Logo" class="w-32 h-32 rounded-full border-4 border-secondary shadow-md bg-crema" />
      </div>
    </section>

    <!-- Valeurs/Avantages Section -->
    <section class="container max-w-screen-lg mx-auto grid md:grid-cols-4 gap-6 mb-10">
      <div class="bg-charcoal rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0s;">
        <span class="text-3xl mb-2">👨‍🍳</span>
        <h4 class="text-xl font-semibold text-crema mb-1">Recette unique</h4>
        <p class="text-crema/90 text-center">Samuel la goûte et re-goûte depuis des mois et vous certifie un voyage au paradis.</p>
      </div>
      <div class="bg-charcoal rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0.2s;">
        <span class="text-3xl mb-2">🌍</span>
        <h4 class="text-xl font-semibold text-crema mb-1">Ingrédients sourcés</h4>
        <p class="text-crema/90 text-center">On marie les saveurs du Mexique avec les trésors de la France.</p>
      </div>
      <div class="bg-charcoal rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0.4s;">
        <span class="text-3xl mb-2">⏳</span>
        <h4 class="text-xl font-semibold text-crema mb-1">Cuisson lente</h4>
        <p class="text-crema/90 text-center">Qui parfume toute la maison (et bientôt la vôtre).</p>
      </div>
      <div class="bg-charcoal rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0.6s;">
        <span class="text-3xl mb-2">🚚</span>
        <h4 class="text-xl font-semibold text-crema mb-1">Samuel vous livre</h4>
        <p class="text-crema/90 text-center">Sourire compris.</p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="container max-w-screen-lg mx-auto bg-charcoal rounded-xl p-6 md:p-10 shadow-xl flex flex-col items-center mb-10">
      <h3 class="text-2xl font-semibold text-crema mb-2">Contact & Commande</h3>
      <p class="text-crema/90 text-center mb-4">Prêt à goûter l'expérience El Caldito ? Commandez en ligne ou contactez-nous pour toute question !</p>
      <a href="mailto:contact@elcaldito.fr" class="px-6 py-2 bg-secondary text-primary rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">Nous écrire</a>
    </section>
  </div>
</template>

<script setup>
// Import Google Fonts pour Josefin Sans
import { useHead } from '#app'
import { ref, onMounted, onUnmounted } from 'vue'

// Date de la prochaine cuisson (à remplacer par les données Strapi)
const nextCookingDate = new Date('2025-07-30T18:00:00')

// Variables pour le compte à rebours
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let countdownInterval

const updateCountdown = () => {
  const now = new Date()
  const diff = nextCookingDate - now

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