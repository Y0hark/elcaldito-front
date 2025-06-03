<template>
  <div class="min-h-screen bg-crema">
    <!-- Header -->
    <header class="py-12 px-4 text-center">
      <h1 class="text-4xl font-bold text-secondary">Le coin des nouvelles fraîches (et bien chaudes)</h1>
      <p class="text-charcoal/70 text-center text-lg mt-2">
        Suivez l'actualité d'El Caldito en temps réel
      </p>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 pb-16">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-pulse flex space-x-4">
          <div class="h-12 w-12 bg-charcoal/20 rounded-full"></div>
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-charcoal/20 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-charcoal/20 rounded"></div>
              <div class="h-4 bg-charcoal/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-charcoal/70">Désolé, une erreur est survenue lors du chargement des actualités.</p>
        <button 
          @click="refresh"
          class="mt-4 px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-accent hover:text-crema transition-colors"
        >
          Réessayer
        </button>
      </div>

      <!-- Timeline -->
      <div v-else class="relative">
        <!-- Timeline line -->
        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-charcoal/20"></div>

        <!-- Posts -->
        <div class="space-y-8">
          <article 
            v-for="(post, index) in sortedPosts" 
            :key="post.id"
            class="relative pl-12 animate-fade-in"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Timeline dot -->
            <div class="absolute left-3 top-2 w-3 h-3 rounded-full bg-accent"></div>

            <!-- Post content -->
            <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <!-- Date -->
              <time 
                v-if="post.date" 
                :datetime="post.date" 
                class="text-sm text-charcoal/60 block mb-2"
              >
                {{ formatDate(post.date) }}
              </time>

              <!-- Title -->
              <h2 v-if="post.title" class="text-xl font-semibold text-charcoal mb-2">
                {{ post.title }}
              </h2>

              <!-- Featured Image -->
              <div v-if="post.image" class="mb-4 rounded-lg overflow-hidden">
                <img 
                  :src="getImageUrl(post.image)" 
                  :alt="post.image.alternativeText || post.title"
                  class="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>

              <!-- Description -->
              <div v-if="post.description" class="text-lg text-charcoal">
                <div v-for="(block, blockIndex) in post.description" :key="blockIndex">
                  <p v-if="block.type === 'paragraph'" class="mb-2">
                    <span v-for="(child, childIndex) in block.children" :key="childIndex">
                      {{ child.text }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mt-3">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag.id"
                  class="bg-accent/10 text-accent text-xs rounded-full px-2 py-1"
                >
                  #{{ tag.name }}
                </span>
              </div>

              <!-- Link to full post -->
              <NuxtLink 
                v-if="post.slug"
                :to="`/actus/${post.slug}`"
                class="mt-3 text-accent hover:underline inline-flex items-center text-sm"
              >
                En savoir plus
                <svg 
                  class="w-4 h-4 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { fetchFromStrapi } = useStrapi()

const { data: posts, pending, error, refresh } = await fetchFromStrapi('/actus?populate=*')

// Sort posts by date (newest first)
const sortedPosts = computed(() => {
  if (!posts?.value?.data) return []
  return [...posts.value.data].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0)
    const dateB = b.date ? new Date(b.date) : new Date(0)
    return dateB - dateA
  })
})

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
  // Use medium format if available, otherwise fallback to original
  const imageUrl = image.formats?.medium?.url || image.url
  return `${config.public.strapiBaseUrl}${imageUrl}`
}
</script>

<style scoped>
article {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 