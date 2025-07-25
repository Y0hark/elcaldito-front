<template>
  <footer class="bg-primary text-crema py-8">
    <div class="max-w-5xl mx-auto px-4 flex flex-col items-center text-center gap-8 mobiledesktop:flex-row mobiledesktop:items-start mobiledesktop:justify-between mobiledesktop:text-left mobiledesktop:gap-12">
      <!-- Logo + baseline -->
      <div class="flex flex-col items-center mobiledesktop:items-start">
        <img src="/logo-elcaldito.png" alt="El Caldito Logo" class="w-14 h-14 mx-auto mb-2 rounded-full border-2 border-secondary bg-crema" />
        <h2 class="text-xl font-semibold mb-1">{{ t('footer.title') }}</h2>
        <p class="text-sm">{{ t('footer.baseline') }}</p>
      </div>
      <!-- Séparateur mobile -->
      <div class="w-full border-t border-crema/20 mobiledesktop:hidden"></div>
      <!-- Liens utiles -->
      <div class="flex flex-col items-center mobiledesktop:items-start">
        <h3 class="text-base font-semibold mb-3">{{ t('footer.usefulLinks') }}</h3>
        <ul class="flex flex-col items-center gap-2 mobiledesktop:items-start">
          <li><NuxtLink :to="$localePath('/')" class="hover:text-accent transition-all duration-200 px-2 py-1 focus:outline-none">{{ t('nav.home') }}</NuxtLink></li>
          <li><NuxtLink :to="$localePath('/commander')" class="hover:text-accent transition-all duration-200 px-2 py-1 focus:outline-none">{{ t('nav.order') }}</NuxtLink></li>
          <li><NuxtLink :to="$localePath('/blog')" class="hover:text-accent transition-all duration-200 px-2 py-1 focus:outline-none">{{ t('nav.blog') }}</NuxtLink></li>
          <li><NuxtLink :to="$localePath('/actus')" class="hover:text-accent transition-all duration-200 px-2 py-1 focus:outline-none">{{ t('nav.news') }}</NuxtLink></li>
          <li><NuxtLink :to="$localePath('/a-propos')" class="hover:text-accent transition-all duration-200 px-2 py-1 focus:outline-none">{{ t('nav.about') }}</NuxtLink></li>
          <li><NuxtLink :to="$localePath('/contact')" class="hover:text-accent transition-all duration-200 px-2 py-1 focus:outline-none">{{ t('nav.contact') }}</NuxtLink></li>
        </ul>
      </div>
      <!-- Séparateur mobile -->
      <div class="w-full border-t border-crema/20 mobiledesktop:hidden"></div>
      <!-- Réseaux sociaux -- TODO -- Set up social media profiles --> 
      <!-- <div class="flex flex-col items-center mobiledesktop:items-start">
        <h3 class="text-base font-semibold mb-3">{{ t('footer.followUs') }}</h3>
        <div class="flex justify-center gap-6 mobiledesktop:justify-start">
          <a href="#" class="hover:text-accent transition-all duration-200 text-lg focus:outline-none">{{ t('footer.instagram') }}</a>
          <a href="#" class="hover:text-accent transition-all duration-200 text-lg focus:outline-none">{{ t('footer.whatsapp') }}</a>
          <a href="mailto:contact@elcaldito.fr" class="hover:text-accent transition-all duration-200 text-lg focus:outline-none">{{ t('footer.email') }}</a>
        </div>
      </div> -->
    </div>
    <div class="max-w-5xl mx-auto pt-8 mt-8 border-t border-crema/20 text-xs text-center">
      {{ t('footer.copyright') }}
    </div>
  </footer>
</template>

<script setup>
import { useI18n, useLocalePath } from '#i18n'
const { t } = useI18n()
const localePath = useLocalePath()
// Aucun script nécessaire pour ce composant
</script> 