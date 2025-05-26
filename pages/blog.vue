<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">Le chaudron et le clavier</h1>
      
      <div class="bg-charcoal rounded-xl p-8 shadow-xl mb-8">
        <p class="text-lg text-crema/90 text-center mb-6">
          Entre deux tétées de nos jumelles et un brassage de bouillon, on écrit ici :
        </p>
        
        <ul class="space-y-4 max-w-2xl mx-auto">
          <li class="flex items-start gap-3">
            <span class="text-2xl">🌶️</span>
            <p class="text-crema/90">Histoires d'ingrédients mexicains introuvables au Panier</p>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">✈️</span>
            <p class="text-crema/90">Carnets de voyage culinaire entre Guadalajara et la Bonne Mère</p>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">🥘</span>
            <p class="text-crema/90">Conseils pour préparer votre garniture de pozole parfaite (radis, origan, citron vert)</p>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl">❤️</span>
            <p class="text-crema/90">Billets d'humeur sur la vie de couple mixte en cuisine</p>
          </li>
        </ul>
      </div>

      <p class="text-lg text-primary/80 text-center italic max-w-2xl mx-auto">
        Prenez une cuillère, servez-vous d'un article, et laissez un commentaire – on répond toujours !
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-crema rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
          <img src="/public/favicon.ico" alt="Pozole Rouge" class="w-full h-48 object-cover rounded-xl mb-4" />
          <h2 class="text-2xl font-semibold text-primary mb-2">Comment préparer un vrai pozole rouge ?</h2>
          <p class="text-primary/80 mb-4">Découvrez les étapes pour préparer un pozole rouge authentique, comme le faisait ma grand-mère.</p>
          <NuxtLink to="/blog/comment-preparer-un-vrai-pozole-rouge" class="px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">Lire l'article</NuxtLink>
        </div>

        <div class="bg-crema rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
          <img src="/public/favicon.ico" alt="Maïs Hominy" class="w-full h-48 object-cover rounded-xl mb-4" />
          <h2 class="text-2xl font-semibold text-primary mb-2">Le maïs hominy, ingrédient sacré du Mexique</h2>
          <p class="text-primary/80 mb-4">Le maïs hominy est un ingrédient essentiel dans la cuisine mexicaine. Apprenez-en plus sur son histoire et son utilisation.</p>
          <NuxtLink to="/blog/le-mais-hominy-ingredient-sacre-du-mexique" class="px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">Lire l'article</NuxtLink>
        </div>

        <div class="bg-crema rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
          <img src="/public/favicon.ico" alt="Cuisine Mixte" class="w-full h-48 object-cover rounded-xl mb-4" />
          <h2 class="text-2xl font-semibold text-primary mb-2">De Mexico à Marseille : cuisiner entre deux cultures</h2>
          <p class="text-primary/80 mb-4">Comment nous avons fusionné nos traditions culinaires pour créer une expérience unique à Marseille.</p>
          <NuxtLink to="/blog/de-mexico-a-marseille-cuisiner-entre-deux-cultures" class="px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">Lire l'article</NuxtLink>
        </div>
      </div>

      <p class="text-lg text-primary/80 text-center mt-6 italic">
        Vos retours comptent énormément pour nous. Si une recette vous a touché, écrivez-nous ❤️
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