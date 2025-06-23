<template>
  <div id="app">
    <Navbar />
    <main class="min-h-screen w-full px-4 mobiledesktop:px-0">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
</script>

<style>
/* Animations globales */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Classes d'animation réutilisables */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInFromRight 0.5s ease-out forwards;
}

/* Transitions de page */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Animations pour les éléments qui apparaissent au scroll */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Amélioration des transitions de boutons */
.btn-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-transition:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Animation pour les cartes */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Animation de pulsation pour les éléments importants */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(155, 28, 28, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(155, 28, 28, 0.6);
  }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Amélioration de la lisibilité */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #9b1c1c;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7a1616;
}

/* Focus visible pour l'accessibilité */
*:focus {
  outline: 2px solid #9b1c1c;
  outline-offset: 2px;
}

/* Amélioration des transitions de couleur */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

html, body {
  background: #fdf6ec !important;
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
}
</style>
