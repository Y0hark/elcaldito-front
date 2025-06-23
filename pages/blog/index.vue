<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">Le chaudron et le clavier</h1>
      <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl mb-8">
        <p class="text-lg text-primary/90 text-center mb-6">
          Entre deux tétées de nos jumelles et un brassage de bouillon, on écrit ici :
        </p>
        <ul class="space-y-4 max-w-2xl mx-auto">
          <li class="flex items-center gap-3">
            <span class="text-2xl">🌶️</span>
            <span class="text-primary/90">Histoires d'ingrédients mexicains introuvables au Panier</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-2xl">✈️</span>
            <span class="text-primary/90">Carnets de voyage culinaire entre Queretaro et la Bonne Mère</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-2xl">🥘</span>
            <span class="text-primary/90">Conseils pour préparer votre garniture de pozole parfaite (radis, origan, citron vert)</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-2xl">❤️</span>
            <span class="text-primary/90">Billets d'humeur sur la vie de couple mixte en cuisine</span>
          </li>
        </ul>
      </div>
      <p class="text-lg text-primary/80 text-center italic max-w-2xl mx-auto">
        Prenez une cuillère, servez-vous d'un article, et laissez un commentaire – on répond toujours !
      </p>
      <div v-if="pending" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mx-auto text-center flex flex-col items-center">
        <LoadingSpinner text="Chargement des articles..." />
      </div>
      <div v-else-if="error" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mx-auto text-center">
        <span class="text-crema block mb-4">Erreur lors du chargement des articles.</span>
        <button @click="refresh" class="px-6 py-2 bg-crema text-primary rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 mx-auto block">Réessayer</button>
      </div>
      <div v-else>
        <div v-if="articles.length === 0" class="text-center text-primary/60 py-8">Aucun article pour le moment.</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div v-for="article in articles" :key="article.id" class="bg-white border border-primary/10 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[420px]">
            <img :src="`${config.public.strapiBaseUrl}${article.cover?.url}`" 
                 :alt="article.cover?.alternativeText || article.title" 
                 class="w-full h-48 object-cover rounded-xl mb-4" />
            <h2 class="text-2xl font-semibold text-primary mb-2">{{ article.title }}</h2>
            <p class="text-primary/80 mb-4">{{ article.content[0]?.children[0]?.text || '' }}</p>
            <div class="flex justify-between items-center mt-auto">
              <NuxtLink :to="`/blog/${article.slug}`" 
                        class="px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">
                Lire l'article
              </NuxtLink>
              <span class="text-primary/60">
                {{ new Date(article.publishedAt).toLocaleDateString('fr-FR') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p class="text-lg text-primary/80 text-center mt-6 italic">
        Vos retours comptent énormément pour nous. Si une recette vous a touché, écrivez-nous ❤️
      </p>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { useCookie } from '#app'

definePageMeta({
  key: route => route.fullPath
})

const config = useRuntimeConfig()
const { fetchFromStrapi } = useStrapi()

const { data: articlesData, pending, error, refresh } = await fetchFromStrapi('/articles?populate=*')
const articles = articlesData.value?.data || []
</script> 