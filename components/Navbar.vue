<template>
  <nav class="bg-crema text-primary sticky top-0 z-50 shadow-md border-b border-primary/10">
    <div class="flex items-center justify-between px-4 py-3 mobiledesktop:px-6 mobiledesktop:py-4">
      <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity focus:outline-none" tabindex="0">
        <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-9 h-9 mr-2 mobiledesktop:w-10 mobiledesktop:h-10" />
        <span class="text-lg font-semibold mobiledesktop:text-xl">El Caldito</span>
      </NuxtLink>
      <!-- Menu desktop -->
      <div class="hidden mobiledesktop:flex items-center space-x-2 mobiledesktop:space-x-4">
        <NuxtLink :to="$localePath('/')" class="nav-link px-3 py-2 rounded-lg font-medium hover:text-accent transition-colors duration-200 mobiledesktop:px-4 mobiledesktop:py-2 focus:outline-none">{{ $t('nav.home') }}</NuxtLink>
        <NuxtLink :to="$localePath('/commander')" class="nav-link px-3 py-2 rounded-lg font-medium hover:text-accent transition-colors duration-200 mobiledesktop:px-4 mobiledesktop:py-2 focus:outline-none">{{ $t('nav.order') }}</NuxtLink>
        <NuxtLink :to="$localePath('/blog')" class="nav-link px-3 py-2 rounded-lg font-medium hover:text-accent transition-colors duration-200 mobiledesktop:px-4 mobiledesktop:py-2 focus:outline-none">{{ $t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="$localePath('/actus')" class="nav-link px-3 py-2 rounded-lg font-medium hover:text-accent transition-colors duration-200 mobiledesktop:px-4 mobiledesktop:py-2 focus:outline-none">{{ $t('nav.news') }}</NuxtLink>
        <NuxtLink :to="$localePath('/a-propos')" class="nav-link px-3 py-2 rounded-lg font-medium hover:text-accent transition-colors duration-200 mobiledesktop:px-4 mobiledesktop:py-2 focus:outline-none">{{ $t('nav.about') }}</NuxtLink>
        <NuxtLink :to="$localePath('/contact')" class="nav-link px-3 py-2 rounded-lg font-medium hover:text-accent transition-colors duration-200 mobiledesktop:px-4 mobiledesktop:py-2 focus:outline-none">{{ $t('nav.contact') }}</NuxtLink>
        <LanguageSwitcher />
        <div class="relative group">
          <button v-if="isLoggedIn" class="px-2 py-2 rounded-lg flex items-center hover:text-accent transition-colors duration-200" @click="isUserMenuOpen = !isUserMenuOpen" aria-label="Menu utilisateur">
            <img src="/mexican-skull-skull-svgrepo-com.svg" alt="Compte" class="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
          </button>
          <NuxtLink v-else :to="$localePath('/login')" class="px-2 py-2 rounded-lg flex items-center group hover:text-accent transition-colors duration-200">
            <img src="/mexican-skull-skull-svgrepo-com.svg" alt="Se connecter" class="w-8 h-8 transition-transform duration-200 group-hover:scale-110" />
          </NuxtLink>
          <transition name="fade">
            <div v-if="isUserMenuOpen && isLoggedIn" class="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-1 border border-primary/10 z-20">
              <NuxtLink :to="$localePath('/compte')" @click="isUserMenuOpen = false" class="block px-4 py-2 text-sm text-primary hover:bg-crema">{{ $t('nav.account') }}</NuxtLink>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-crema">{{ $t('nav.logout') }}</button>
            </div>
          </transition>
        </div>
      </div>
      <!-- Burger menu mobile -->
      <button class="mobiledesktop:hidden flex items-center justify-center w-10 h-10 rounded-lg focus:outline-none" @click="toggleMenu" aria-label="Ouvrir le menu">
        <span v-if="!isMenuOpen" class="text-2xl">☰</span>
        <span v-else class="text-2xl">✕</span>
      </button>
    </div>
    <!-- Menu mobile plein écran -->
    <transition name="slide-fade">
      <div v-show="isMenuOpen" class="mobiledesktop:hidden fixed inset-0 bg-crema/95 backdrop-blur-sm flex flex-col items-center justify-center z-40" @click.self="closeMenu">
        <div class="flex flex-col items-center space-y-2 w-full px-8">
          <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity mb-2" @click="closeMenu">
            <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-14 h-14 mb-2" />
          </NuxtLink>
          <NuxtLink :to="$localePath('/')" class="text-lg py-3 w-full text-center rounded-lg hover:text-accent transition-all duration-200" @click="closeMenu">{{ $t('nav.home') }}</NuxtLink>
          <NuxtLink :to="$localePath('/commander')" class="text-lg py-3 w-full text-center rounded-lg hover:text-accent transition-all duration-200" @click="closeMenu">{{ $t('nav.order') }}</NuxtLink>
          <NuxtLink :to="$localePath('/blog')" class="text-lg py-3 w-full text-center rounded-lg hover:text-accent transition-all duration-200" @click="closeMenu">{{ $t('nav.blog') }}</NuxtLink>
          <NuxtLink :to="$localePath('/actus')" class="text-lg py-3 w-full text-center rounded-lg hover:text-accent transition-all duration-200" @click="closeMenu">{{ $t('nav.news') }}</NuxtLink>
          <NuxtLink :to="$localePath('/a-propos')" class="text-lg py-3 w-full text-center rounded-lg hover:text-accent transition-all duration-200" @click="closeMenu">{{ $t('nav.about') }}</NuxtLink>
          <NuxtLink :to="$localePath('/contact')" class="text-lg py-3 w-full text-center rounded-lg hover:text-accent transition-all duration-200" @click="closeMenu">{{ $t('nav.contact') }}</NuxtLink>
          <div class="flex justify-center mt-2 pt-2 border-t border-primary/20 w-full">
            <LanguageSwitcher />
          </div>
          <div v-if="isLoggedIn" class="mt-2 pt-2 border-t border-primary/20 w-full flex flex-col items-center">
            <div class="relative" ref="mobileUserMenuRef">
              <button class="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none" @click="isMobileUserMenuOpen = !isMobileUserMenuOpen" aria-label="Menu utilisateur mobile">
                <img src="/mexican-skull-skull-svgrepo-com.svg" alt="Compte" class="w-12 h-12 mb-1" />
              </button>
              <transition name="fade">
                <div v-if="isMobileUserMenuOpen" class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-40 bg-white rounded-md shadow-lg py-1 border border-primary/10 z-50 flex flex-col items-center max-h-60 overflow-auto">
                  <NuxtLink :to="$localePath('/compte')" @click="() => { closeMobileUserMenu(); closeMenu(); }" class="block px-4 py-2 text-sm text-primary hover:bg-crema w-full text-center">{{ $t('nav.account') }}</NuxtLink>
                  <button @click="() => { logout(); closeMenu(); closeMobileUserMenu(); }" class="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-crema text-center">{{ $t('nav.logout') }}</button>
                </div>
              </transition>
            </div>
          </div>
          <div v-else class="mt-2 pt-2 border-t border-primary/20 w-full flex justify-center">
            <NuxtLink :to="$localePath('/login')" @click="closeMenu" class="flex flex-col items-center group">
              <img src="/mexican-skull-skull-svgrepo-com.svg" alt="Se connecter" class="w-12 h-12 mb-1 transition-transform duration-200 group-hover:scale-110" />
              <span class="text-xs text-primary/70 group-hover:text-accent">{{ $t('nav.login') }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../composables/useAuth'
import { useLocalePath } from '#i18n'

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const { isLoggedIn, logout } = useAuth()
const localePath = useLocalePath()
const isMobileUserMenuOpen = ref(false)
const mobileUserMenuRef = ref(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const closeMobileUserMenu = () => {
  isMobileUserMenuOpen.value = false;
}

const handleClickOutsideMobileUserMenu = (e) => {
  if (isMobileUserMenuOpen.value && mobileUserMenuRef.value && !mobileUserMenuRef.value.contains(e.target)) {
    isMobileUserMenuOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutsideMobileUserMenu)
})
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutsideMobileUserMenu)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
/* Animation menu mobile burger */
.slide-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1);
}
.slide-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-40px) scale(0.98);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(0.98);
}
/* Animation active link desktop */
.nav-link {
  position: relative;
  text-decoration: none;
  transition: color 0.3s;
}
.mobiledesktop\:flex .nav-link.router-link-exact-active::after,
.mobiledesktop\:flex .nav-link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
.mobiledesktop\:flex .nav-link.router-link-exact-active,
.mobiledesktop\:flex .nav-link.router-link-active {
  color: #275b00;
  font-weight: 600;
}
.mobiledesktop\:flex .nav-link::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #275b00;
  transition: transform 0.25s;
  transform-origin: bottom right;
}
.mobiledesktop\:flex .nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
/* Supprimer le contour sur tous les liens/logo navbar (mobile & desktop) */
a:focus, button:focus, .nav-link:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>
