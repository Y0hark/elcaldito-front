<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <!-- Hero Section -->
    <section class="container max-w-screen-lg mx-auto flex flex-col items-center justify-center flex-1 gap-6 py-16">
      <h1 class="text-4xl md:text-5xl font-bold text-primary drop-shadow-lg text-center">El Caldito</h1>
      <h2 class="text-xl md:text-2xl font-semibold text-secondary text-center">La dark kitchen mexicaine à Marseille</h2>
      <p class="text-lg text-primary/80 text-center max-w-2xl mt-2">Des saveurs authentiques, une ambiance chaleureuse, et la passion du Mexique dans chaque plat.</p>
      <NuxtLink to="/commander" class="mt-6 px-8 py-3 bg-primary text-crema rounded-xl text-xl font-semibold shadow-lg hover:bg-secondary hover:text-primary transition-colors duration-300">Commander</NuxtLink>
    </section>

    <!-- Présentation Section -->
    <section class="container max-w-screen-lg mx-auto bg-primary/95 rounded-xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row gap-6 md:gap-12 items-center mb-10">
      <div class="flex-1">
        <h3 class="text-2xl font-semibold text-crema mb-2">Une cuisine mexicaine authentique</h3>
        <p class="text-crema/90 text-lg">Chez El Caldito, nous vous proposons des recettes traditionnelles revisitées, préparées avec des produits frais et locaux. Goûtez à l'âme du Mexique, sans quitter Marseille !</p>
      </div>
      <div class="flex-1 flex justify-center">
        <img src="/public/favicon.ico" alt="El Caldito Logo" class="w-32 h-32 rounded-full border-4 border-secondary shadow-md bg-crema" />
      </div>
    </section>

    <!-- Valeurs/Avantages Section -->
    <section class="container max-w-screen-lg mx-auto grid md:grid-cols-3 gap-6 mb-10">
      <div class="bg-secondary rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0s;">
        <span class="text-3xl mb-2">🌮</span>
        <h4 class="text-xl font-semibold text-primary mb-1">Saveurs uniques</h4>
        <p class="text-primary/80 text-center">Des plats inspirés des recettes de famille, relevés et généreux.</p>
      </div>
      <div class="bg-crema rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0.2s;">
        <span class="text-3xl mb-2">🥑</span>
        <h4 class="text-xl font-semibold text-primary mb-1">Produits frais</h4>
        <p class="text-primary/80 text-center">Des ingrédients locaux, de saison, pour une cuisine saine et savoureuse.</p>
      </div>
      <div class="bg-accent rounded-xl p-6 shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style="animation-delay: 0.4s;">
        <span class="text-3xl mb-2">🌵</span>
        <h4 class="text-xl font-semibold text-crema mb-1">Ambiance mexicaine</h4>
        <p class="text-crema/90 text-center">Un univers coloré, chaleureux et authentique, à découvrir chez vous.</p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="container max-w-screen-lg mx-auto bg-primary rounded-xl p-6 md:p-10 shadow-xl flex flex-col items-center mb-10">
      <h3 class="text-2xl font-semibold text-crema mb-2">Contact & Commande</h3>
      <p class="text-crema/90 text-center mb-4">Prêt à goûter l'expérience El Caldito ? Commandez en ligne ou contactez-nous pour toute question !</p>
      <a href="mailto:contact@elcaldito.fr" class="px-6 py-2 bg-secondary text-primary rounded-xl font-semibold shadow hover:bg-crema hover:text-primary transition-colors duration-300">Nous écrire</a>
    </section>
  </div>
</template>

<script setup>
// Import Google Fonts pour Josefin Sans
import { useHead } from '#app'
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