<template>
  <nav class="bg-crema text-primary sticky top-0 z-50 shadow-md border-b border-primary/10">
    <div class="flex items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
        <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-8 h-8 mr-2" />
        <span class="text-xl font-semibold">El Caldito</span>
      </NuxtLink>
      <div class="hidden md:flex items-center space-x-4">
        <NuxtLink to="/" class="nav-link px-4 py-2">Accueil</NuxtLink>
        <NuxtLink to="/commander" class="nav-link px-4 py-2">Commander</NuxtLink>
        <NuxtLink to="/blog" class="nav-link px-4 py-2">Blog</NuxtLink>
        <NuxtLink to="/actus" class="nav-link px-4 py-2">Actus</NuxtLink>
        <NuxtLink to="/a-propos" class="nav-link px-4 py-2">À propos</NuxtLink>
        <NuxtLink to="/contact" class="nav-link px-4 py-2">Contact</NuxtLink>
        
        <div v-if="isLoggedIn" class="relative" @mouseenter="isUserMenuOpen = true" @mouseleave="isUserMenuOpen = false">
          <button class="nav-link px-4 py-2 flex items-center" aria-label="Menu utilisateur">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
          <transition name="fade">
            <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-primary/10 z-20">
              <NuxtLink to="/compte" @click="isUserMenuOpen = false" class="block px-4 py-2 text-sm text-primary hover:bg-crema">Mon compte</NuxtLink>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-crema">Se déconnecter</button>
            </div>
          </transition>
        </div>
        <NuxtLink v-else to="/login" class="nav-link px-4 py-2">Se connecter</NuxtLink>
      </div>
      <button class="md:hidden" @click="toggleMenu" aria-label="Ouvrir le menu">
        <span v-if="!isMenuOpen" class="text-2xl">☰</span>
        <span v-else class="text-2xl">✕</span>
      </button>
    </div>
    <div v-show="isMenuOpen" class="md:hidden fixed inset-0 bg-crema/95 backdrop-blur-sm flex flex-col items-center justify-center">
      <div class="flex flex-col items-center space-y-4">
        <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity" @click="closeMenu">
          <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-12 h-12 mb-4" />
        </NuxtLink>
        <NuxtLink to="/" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Accueil</NuxtLink>
        <NuxtLink to="/commander" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Commander</NuxtLink>
        <NuxtLink to="/blog" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Blog</NuxtLink>
        <NuxtLink to="/actus" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Actus</NuxtLink>
        <NuxtLink to="/a-propos" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">À propos</NuxtLink>
        <NuxtLink to="/contact" class="text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Contact</NuxtLink>
        
        <div v-if="isLoggedIn" class="mt-4 pt-4 border-t border-primary/20 text-center">
          <NuxtLink to="/compte" class="block text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Mon compte</NuxtLink>
          <button @click="() => { logout(); closeMenu(); }" class="text-xl py-4 hover:text-accent transition-all duration-300">Se déconnecter</button>
        </div>
        <NuxtLink v-else to="/login" class="mt-4 pt-4 border-t border-primary/20 text-xl py-4 hover:text-accent transition-all duration-300" @click="closeMenu">Se connecter</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth'

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const { isLoggedIn, logout } = useAuth()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.nav-link {
  position: relative;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: theme('colors.accent');
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: theme('colors.accent');
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.router-link-exact-active {
  color: theme('colors.accent');
}

.router-link-exact-active::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* Remove focus outline */
a:focus, button:focus {
  outline: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
