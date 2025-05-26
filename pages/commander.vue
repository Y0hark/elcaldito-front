<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">Réservez votre bol de bonheur</h1>
      <p class="text-lg text-primary/80 text-center mb-6">
        Notre pozole sort de la marmite une ou deux fois par mois. Chaque service est limité : quand c'est complet, on ferme les commandes pour garder la qualité familiale.
      </p>

      <div class="bg-secondary rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-2xl font-semibold text-primary mb-2">Prochaine distribution : {{ formatDate(nextDistributionDate) }}</h2>
        <div class="flex justify-center">
          <button class="mt-4 px-6 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">
            Voir les prochaines disponibilités
          </button>
        </div>
      </div>

      <div class="bg-charcoal rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-2xl font-semibold text-crema mb-4">Comment se passe la commande ?</h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <span class="text-2xl">📅</span>
            <div>
              <span class="font-semibold text-crema">Choisissez la date disponible</span>
              <p class="text-crema/90">et réservez votre bol.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">🥘</span>
            <div>
              <span class="font-semibold text-crema">Indiquez le nombre de portions</span>
              <p class="text-crema/90">(max : 6 par personne).</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">💳</span>
            <div>
              <span class="font-semibold text-crema">Payez en ligne ou en liquide</span>
              <p class="text-crema/90">(carte via Stripe, bientôt PayPal).</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✉️</span>
            <div>
              <span class="font-semibold text-crema">Recevez votre confirmation</span>
              <p class="text-crema/90">par email + SMS.</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">🚚</span>
            <div>
              <span class="font-semibold text-crema">Dégustez</span>
              <p class="text-crema/90">le jour J : Samuel arrive jusqu'à votre porte ou point-relais.</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-charcoal/80 rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-xl font-semibold text-crema mb-3">Informations pratiques</h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-crema mb-2">Allergènes</h3>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-crema/90">
                <span class="text-xl">🌾</span>
                <span>Sans gluten</span>
              </li>
              <li class="flex items-center gap-2 text-crema/90">
                <span class="text-xl">🌶️</span>
                <span>Peut contenir traces de piment fort</span>
              </li>
            </ul>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-crema mb-2">Zone de livraison</h3>
            <p class="text-crema/90 flex items-center gap-2">
              <span class="text-xl">📍</span>
              <span>Marseille intra-muros & proches environs</span>
            </p>
          </div>
        </div>
      </div>

      <p class="text-lg text-primary/80 text-center italic">
        Chaque bol de pozole est une déclaration d'amour à nos racines et à notre ville.
      </p>
    </div>
  </div>
</template>

<script setup>
// Import Google Fonts pour Josefin Sans
import { useHead } from '#app'
import { ref } from 'vue'

// Date de la prochaine distribution (à remplacer par les données Strapi)
const nextDistributionDate = ref(new Date('2024-06-01'))

// Fonction pour formater la date en français
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long'
  }).format(date)
}

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap',
    },
  ],
})
</script> 