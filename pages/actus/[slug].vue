<template>
  <div class="min-h-screen bg-crema">
    <!-- Loading State -->
    <div v-if="pending" class="bg-primary/95 rounded-xl p-6 shadow-xl mt-4 w-full max-w-2xl mx-auto">
      <LoadingSpinner text="Chargement de l'article..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-primary/95 rounded-xl p-6 shadow-xl mt-4 w-full max-w-2xl mx-auto">
      <p class="text-crema text-center mb-4">Une erreur est survenue lors du chargement de l'article.</p>
      <button 
        @click="refresh"
        class="px-6 py-2 bg-crema text-primary rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 mx-auto block focus:outline-none"
      >
        Réessayer
      </button>
    </div>

    <!-- Article Content -->
    <article v-else-if="articleData" class="max-w-3xl mx-auto px-4 py-12">
      <!-- Back Button -->
      <NuxtLink
        to="/actus"
        class="text-primary text-sm hover:text-accent mb-3 inline-block focus:outline-none"
      >
        ← Retour aux actus
      </NuxtLink>

      <!-- Article Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-primary/10">
        <!-- Article Header -->
        <header class="mb-8">
          <time 
            v-if="articleData.date" 
            :datetime="articleData.date" 
            class="text-sm text-primary/60 block mb-4"
          >
            {{ formatDate(articleData.date) }}
          </time>

          <h1 class="text-4xl font-bold text-primary mb-4">
            {{ articleData.title }}
          </h1>

          <!-- Tags -->
          <div v-if="articleData.tags && articleData.tags.length" class="flex flex-wrap gap-2">
            <span 
              v-for="tag in articleData.tags" 
              :key="tag.id"
              class="bg-accent/10 text-accent text-sm rounded-full px-3 py-1"
            >
              #{{ tag.name }}
            </span>
          </div>
        </header>

        <!-- Featured Image -->
        <div v-if="articleData.image" class="mb-8 rounded-xl overflow-hidden">
          <img 
            :src="getImageUrl(articleData.image)" 
            :alt="articleData.image.alternativeText || articleData.title"
            class="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <!-- Article Content -->
        <div class="prose prose-lg max-w-none text-primary">
          <div v-for="(block, blockIndex) in articleData.description" :key="blockIndex">
            <p v-if="block.type === 'paragraph'" class="mb-4">
              <span v-for="(child, childIndex) in block.children" :key="childIndex">
                {{ child.text }}
              </span>
            </p>
          </div>
        </div>

        <!-- Share Section -->
        <div class="mt-12 pt-8 border-t border-primary/10">
          <h2 class="text-xl font-semibold text-primary mb-4">Partager cet article</h2>
          <div class="flex gap-4">
            <button 
              @click="shareOnTwitter"
              class="flex items-center text-primary/70 hover:text-[#1DA1F2] transition-colors"
            >
              <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            <button 
              @click="shareOnFacebook"
              class="flex items-center text-primary/70 hover:text-[#1877F2] transition-colors"
            >
              <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </article>

    <!-- Not Found State -->
    <div v-else class="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 class="text-4xl font-bold text-primary mb-4">Article non trouvé</h1>
      <p class="text-primary/70 text-center mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
      <NuxtLink 
        to="/actus"
        class="px-8 py-3 bg-primary text-crema rounded-xl text-lg font-semibold shadow-lg hover:bg-accent hover:text-crema transition-colors"
      >
        Retour aux actualités
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '~/components/LoadingSpinner.vue'

const route = useRoute()
const config = useRuntimeConfig()
const { fetchFromStrapi } = useStrapi()

// Fetch article data
const { data: article, pending, error, refresh } = await fetchFromStrapi(`/actus?filters[slug][$eq]=${route.params.slug}&populate=*`)

// Get the first article from the data array
const articleData = computed(() => article.value?.data?.[0])

// Format date in French
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get image URL with proper format
const getImageUrl = (image) => {
  if (!image) return ''
  // Use large format if available, otherwise fallback to original
  const imageUrl = image.formats?.large?.url || image.url
  return `${config.public.strapiBaseUrl}${imageUrl}`
}

// Share functions
const shareOnTwitter = () => {
  if (!articleData.value) return
  const text = encodeURIComponent(`${articleData.value.title} - El Caldito`)
  const url = encodeURIComponent(window.location.href)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}
</script>

<style>
.prose {
  color: theme('colors.primary');
}

.prose p {
  margin-bottom: 1.5em;
  line-height: 1.8;
}
</style>
