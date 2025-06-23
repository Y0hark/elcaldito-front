<template>
  <footer class="bg-primary text-crema py-8">
    <div class="max-w-5xl mx-auto px-4 flex flex-col items-center text-center gap-8 mobiledesktop:flex-row mobiledesktop:items-start mobiledesktop:justify-between mobiledesktop:text-left mobiledesktop:gap-12">
      <!-- Logo + baseline -->
      <div class="flex flex-col items-center mobiledesktop:items-start">
        <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-14 h-14 mx-auto mb-2 rounded-full border-2 border-secondary bg-crema" />
        <h2 class="text-xl font-semibold mb-1">El Caldito</h2>
        <p class="text-sm">Le goût du Mexique, mijoté avec amour à Marseille.</p>
      </div>
      <!-- Séparateur mobile -->
      <div class="w-full border-t border-crema/20 mobiledesktop:hidden"></div>
      <!-- Liens utiles -->
      <div class="flex flex-col items-center mobiledesktop:items-start">
        <h3 class="text-base font-semibold mb-3">Liens utiles</h3>
        <ul class="flex flex-col items-center gap-2 mobiledesktop:items-start">
          <li><NuxtLink to="/" class="hover:text-accent transition-all duration-200 px-2 py-1">Accueil</NuxtLink></li>
          <li><NuxtLink to="/commander" class="hover:text-accent transition-all duration-200 px-2 py-1">Commander</NuxtLink></li>
          <li><NuxtLink to="/blog" class="hover:text-accent transition-all duration-200 px-2 py-1">Blog</NuxtLink></li>
          <li><NuxtLink to="/actus" class="hover:text-accent transition-all duration-200 px-2 py-1">Actus</NuxtLink></li>
          <li><NuxtLink to="/a-propos" class="hover:text-accent transition-all duration-200 px-2 py-1">À propos</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-accent transition-all duration-200 px-2 py-1">Contact</NuxtLink></li>
        </ul>
      </div>
      <!-- Séparateur mobile -->
      <div class="w-full border-t border-crema/20 mobiledesktop:hidden"></div>
      <!-- Réseaux sociaux -->
      <div class="flex flex-col items-center mobiledesktop:items-start">
        <h3 class="text-base font-semibold mb-3">Suivez-nous</h3>
        <div class="flex justify-center gap-6 mobiledesktop:justify-start">
          <a href="#" class="hover:text-accent transition-all duration-200 text-lg">Instagram</a>
          <a href="#" class="hover:text-accent transition-all duration-200 text-lg">WhatsApp</a>
          <a href="mailto:contact@elcaldito.fr" class="hover:text-accent transition-all duration-200 text-lg">Email</a>
        </div>
      </div>
    </div>
    <div class="max-w-5xl mx-auto pt-8 mt-8 border-t border-crema/20 text-xs text-center">
      © 2025 El Caldito – Fait maison par Viviana & Samuel avec ❤️ depuis Marseille 🌶️
    </div>
  </footer>
</template>

<script setup>
// Aucun script nécessaire pour ce composant
</script> 