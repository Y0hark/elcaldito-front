<template>
  <footer class="bg-primary text-crema py-8">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 class="text-2xl font-semibold mb-2">El Caldito</h2>
          <p class="text-sm">Le goût du Mexique, mijoté avec amour à Marseille.</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Liens utiles</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="hover:text-accent transition-all duration-300">Accueil</NuxtLink></li>
            <li><NuxtLink to="/commander" class="hover:text-accent transition-all duration-300">Commander</NuxtLink></li>
            <li><NuxtLink to="/blog" class="hover:text-accent transition-all duration-300">Blog</NuxtLink></li>
            <li><NuxtLink to="/a-propos" class="hover:text-accent transition-all duration-300">À propos</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-accent transition-all duration-300">Contact</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Suivez-nous</h3>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-accent transition-all duration-300">Instagram</a>
            <a href="#" class="hover:text-accent transition-all duration-300">WhatsApp</a>
            <a href="mailto:contact@elcaldito.fr" class="hover:text-accent transition-all duration-300">Email</a>
          </div>
        </div>
      </div>

      <div class="border-t border-crema/20 mt-6 pt-4 text-xs text-center">
        © 2025 El Caldito – Fait maison par Viviana & Samuel avec ❤️ depuis Marseille 🌶️
      </div>
    </div>
  </footer>
</template>

<script setup>
// Aucun script nécessaire pour ce composant
</script> 