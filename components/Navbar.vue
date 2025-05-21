<template>
  <nav class="bg-crema text-primary sticky top-0 z-50 shadow-md border-b border-primary/10">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center">
        <img src="/public/favicon.ico" alt="El Caldito Logo" class="w-8 h-8 mr-2" />
        <span class="text-xl font-semibold">El Caldito</span>
      </div>
      <div class="hidden md:flex items-center space-x-4">
        <NuxtLink to="/" class="px-4 py-2 hover:text-accent transition-all duration-300">Accueil</NuxtLink>
        <NuxtLink to="/commander" class="px-4 py-2 hover:text-accent transition-all duration-300">Commander</NuxtLink>
        <NuxtLink to="/blog" class="px-4 py-2 hover:text-accent transition-all duration-300">Blog</NuxtLink>
        <NuxtLink to="/a-propos" class="px-4 py-2 hover:text-accent transition-all duration-300">À propos</NuxtLink>
        <NuxtLink to="/contact" class="px-4 py-2 hover:text-accent transition-all duration-300">Contact</NuxtLink>
      </div>
      <button class="md:hidden" @click="toggleMenu" aria-label="Ouvrir le menu">
        <span v-if="!isMenuOpen" class="text-2xl">☰</span>
        <span v-else class="text-2xl">✕</span>
      </button>
    </div>
    <div v-show="isMenuOpen" class="md:hidden fixed inset-0 bg-crema/95 backdrop-blur-sm flex flex-col items-center justify-center">
      <div class="flex flex-col items-center space-y-4">
        <img src="/public/favicon.ico" alt="El Caldito Logo" class="w-12 h-12 mb-4" />
        <NuxtLink to="/" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Accueil</NuxtLink>
        <NuxtLink to="/commander" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Commander</NuxtLink>
        <NuxtLink to="/blog" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Blog</NuxtLink>
        <NuxtLink to="/a-propos" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">À propos</NuxtLink>
        <NuxtLink to="/contact" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Contact</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #f6c90e;
}
</style>
