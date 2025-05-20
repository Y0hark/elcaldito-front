<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">Commander votre Pozole</h1>
      <p class="text-lg text-primary/80 text-center mb-6">
        Nos événements sont ponctuels (1x ou 2x par mois) et les commandes sont limitées à un nombre de parts fixes. Tout est cuisiné maison par Viviana, avec amour, tandis que Samuel gère l'organisation et les livraisons.
      </p>

      <div class="bg-secondary rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-2xl font-semibold text-primary mb-2">Prochaine distribution : 1er juin – Marseille Centre</h2>
        <button class="mt-4 px-6 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-primary/90 transition-colors duration-300">
          Voir les prochaines disponibilités
        </button>
      </div>

      <div class="bg-crema rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-2xl font-semibold text-primary mb-2">Comment se passe la commande ?</h2>
        <ul class="list-disc pl-6 text-primary/80">
          <li>Réserver via le site</li>
          <li>Paiement sécurisé (PayPal ou Stripe)</li>
          <li>Livraison ou retrait à Marseille</li>
        </ul>
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
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap',
    },
  ],
})
</script> 