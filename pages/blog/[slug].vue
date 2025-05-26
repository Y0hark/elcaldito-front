<template>
  <div class="min-h-screen bg-crema font-sans text-primary">
    <!-- Loading State -->
    <div v-if="pending" class="container max-w-3xl mx-auto py-12 px-4">
      <div class="animate-pulse">
        <div class="h-8 bg-charcoal/10 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-charcoal/10 rounded w-1/2 mb-8"></div>
        <div class="h-96 bg-charcoal/10 rounded-xl mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-charcoal/10 rounded w-full"></div>
          <div class="h-4 bg-charcoal/10 rounded w-5/6"></div>
          <div class="h-4 bg-charcoal/10 rounded w-4/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container max-w-3xl mx-auto py-12 px-4">
      <div class="bg-charcoal/10 rounded-xl p-8 text-center">
        <h2 class="text-2xl font-semibold text-primary mb-4">Oups !</h2>
        <p class="text-charcoal/80 mb-6">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
        <NuxtLink to="/blog" class="text-accent hover:underline">← Retour au blog</NuxtLink>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else class="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
      <!-- Navigation -->
      <div class="flex justify-between items-center mb-8">
        <NuxtLink to="/blog" class="text-accent hover:underline flex items-center gap-2">
          <span>←</span> Retour au blog
        </NuxtLink>
        <div class="flex gap-4">
          <button @click="shareOnFacebook" class="text-charcoal/60 hover:text-primary transition-colors">
            <span class="text-xl">📘</span>
          </button>
          <button @click="shareOnWhatsApp" class="text-charcoal/60 hover:text-primary transition-colors">
            <span class="text-xl">💬</span>
          </button>
          <button @click="shareOnInstagram" class="text-charcoal/60 hover:text-primary transition-colors">
            <span class="text-xl">📸</span>
          </button>
        </div>
      </div>

      <!-- Article Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-secondary mb-4">{{ article.title }}</h1>
        <p v-if="article.excerpt" class="text-xl text-charcoal/80 mb-4">{{ article.excerpt }}</p>
        <div class="flex items-center gap-4 text-sm text-charcoal/60">
          <time>{{ formatDate(article.publishedAt) }}</time>
          <span>•</span>
          <span>Par {{ article.author }}</span>
        </div>
      </header>

      <!-- Featured Image -->
      <img 
        v-if="article.featuredImage" 
        :src="article.featuredImage" 
        :alt="article.title"
        class="w-full h-[400px] object-cover rounded-xl shadow-md mb-8"
      />

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none">
        <div v-html="article.content"></div>
      </div>

      <!-- Similar Articles -->
      <section v-if="similarArticles.length" class="mt-16">
        <h2 class="text-2xl font-semibold text-primary mb-6">Articles similaires</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="similar in similarArticles" :key="similar.slug" class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <img 
              v-if="similar.featuredImage" 
              :src="similar.featuredImage" 
              :alt="similar.title"
              class="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 class="text-xl font-semibold text-primary mb-2">{{ similar.title }}</h3>
            <p class="text-charcoal/80 mb-4">{{ similar.excerpt }}</p>
            <NuxtLink :to="`/blog/${similar.slug}`" class="text-accent hover:underline">Lire l'article →</NuxtLink>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug

// Fetch article data
const { data: article, pending, error } = await useFetch(`/api/articles/${slug}`)

// Fetch similar articles
const { data: similarArticles } = await useFetch(`/api/articles/similar/${slug}`)

// Format date
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}

// Share functions
const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
}

const shareOnWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank')
}

const shareOnInstagram = () => {
  // Instagram doesn't support direct sharing via URL
  // You might want to copy the link to clipboard instead
  navigator.clipboard.writeText(window.location.href)
  alert('Lien copié ! Vous pouvez maintenant le partager sur Instagram.')
}

// Add custom styles for the article content
useHead({
  style: [
    {
      children: `
        .prose h2, .prose h3 {
          @apply text-2xl font-semibold text-primary mt-8 mb-4;
        }
        .prose p {
          @apply text-lg leading-relaxed text-charcoal mb-4;
        }
        .prose ul {
          @apply list-disc ml-6 mb-4;
        }
        .prose img {
          @apply rounded-md my-4;
        }
        .prose blockquote {
          @apply italic text-accent border-l-2 pl-4 my-4;
        }
        .prose .recipe {
          @apply bg-crema p-4 border-l-4 border-primary shadow-sm rounded-md my-4;
        }
      `
    }
  ]
})
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style> 