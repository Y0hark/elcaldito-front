<template>
  <div v-if="pending" class="text-center py-12 text-primary/60">
    Chargement de l'article...
  </div>
  <div v-else-if="error" class="text-center py-12 text-red-600">
    Erreur lors du chargement de l'article.
  </div>
  <div v-else-if="article" class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <NuxtLink to="/blog" class="text-primary text-sm hover:text-accent mb-3 inline-block focus:outline-none">← Retour au blog</NuxtLink>
      <h1 class="text-2xl font-bold text-primary mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">{{ article.title }}</h1>
      <!-- Affichage de la cover si présente -->
      <div v-if="article.cover && getImageUrl(article.cover)" class="mb-4 flex justify-center">
        <img
          :src="getImageUrl(article.cover)"
          :alt="article.cover.alternativeText || article.title"
          class="rounded-xl max-h-80 w-auto object-cover shadow-lg border border-primary/10"
          loading="lazy"
        />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        <div class="text-xs text-primary/60">
          {{ article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt) }}
        </div>
        <div v-if="article.auteur" class="text-xs text-primary/80 mt-1 sm:mt-0">
          <span>Auteur : <b>{{ article.auteur.name }}</b></span>
          <template v-if="Array.isArray(article.auteur.bio) && article.auteur.bio.length">
            <span class="ml-2 italic text-primary/60">—
              <template v-for="(block, i) in article.auteur.bio" :key="i">
                <template v-for="(child, j) in block.children" :key="j">
                  {{ child.text }}
                </template>
              </template>
            </span>
          </template>
        </div>
      </div>
      <div class="prose prose-primary max-w-none text-base mobiledesktop:text-lg">
        <template v-for="(block, i) in article.content || []" :key="i">
          <p v-if="block.type === 'paragraph'">
            <template v-for="(child, j) in block.children" :key="j">
              {{ child.text }}
            </template>
          </p>
          <h2 v-else-if="block.type === 'heading'">
            <template v-for="(child, j) in block.children" :key="j">
              {{ child.text }}
            </template>
          </h2>
          <!-- Ajoute d'autres types de blocks ici si besoin -->
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useRoute, useRuntimeConfig } from '#imports'

definePageMeta({
  validate: async (route) => {
    return typeof route.params.slug === 'string'
  }
})

const route = useRoute()
const config = useRuntimeConfig()
const { fetchFromStrapi } = useStrapi()

// Fetch l'article côté serveur ou client (SSR friendly)
const { data: articleData, pending, error } = await useAsyncData(
  'article',
  () => fetchFromStrapi(`/articles/slug/${route.params.slug}?populate=*`, { noAuth: true })
)

const article = computed(() => {
  const val = articleData.value?.data
  if (!val) return null
  return Array.isArray(val) ? val[0] : val
})

// Set the page title dynamiquement
watch(article, (val) => {
  useHead({
    title: val ? val.title : 'Article non trouvé',
    meta: [
      {
        name: 'description',
        content: val && val.content && val.content[0]?.children[0]?.text ? val.content[0].children[0].text : 'Article non trouvé'
      }
    ]
  })
})

const getImageUrl = (image) => {
  if (!image) return ''
  return image.formats?.medium?.url || image.formats?.large?.url || image.url
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style>
.prose {
  max-width: none;
}
</style> 