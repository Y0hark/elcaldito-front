<template>
  <div class="min-h-screen bg-crema font-sans text-primary">
    <div class="max-w-4xl mx-auto p-6">
      <div v-if="pending" class="text-center py-12">
        <p class="text-xl text-primary/60">Chargement de l'article...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-xl text-primary/60">Une erreur est survenue lors du chargement de l'article.</p>
        <NuxtLink to="/blog" 
                class="mt-4 inline-block px-6 py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">
          Retour aux articles
        </NuxtLink>
      </div>

      <div v-else-if="article" class="bg-white rounded-xl p-8 shadow-xl">
        <img :src="`${config.public.strapiBaseUrl}${article.cover?.url}`" 
             :alt="article.cover?.alternativeText || article.title"
             class="w-full h-96 object-cover rounded-xl mb-8" />
        
        <h1 class="text-4xl font-bold text-primary mb-4">{{ article.title }}</h1>
        
        <div class="flex items-center gap-4 text-primary/60 mb-8">
          <span>{{ new Date(article.publishedAt).toLocaleDateString('fr-FR') }}</span>
          <span>{{ article.likes }} ❤️</span>
        </div>

        <div class="prose prose-lg max-w-none">
          <div v-for="(block, index) in article.content" :key="index">
            <p v-if="block.type === 'paragraph'" class="mb-4">
              <span v-for="(child, childIndex) in block.children" :key="childIndex">
                {{ child.text }}
              </span>
            </p>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-primary/10">
          <h2 class="text-2xl font-semibold mb-4">Commentaires</h2>
          <div v-if="article.commentaires && article.commentaires.length > 0">
            <div v-for="comment in article.commentaires" :key="comment.id" class="mb-4 p-4 bg-crema/50 rounded-lg">
              <p class="text-primary/80">{{ comment.content }}</p>
            </div>
          </div>
          <p v-else class="text-primary/60 italic">Soyez le premier à commenter cet article !</p>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-xl text-primary/60">Article non trouvé</p>
        <NuxtLink to="/blog" 
                class="mt-4 inline-block px-6 py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">
          Retour aux articles
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  validate: async (route) => {
    return typeof route.params.slug === 'string'
  }
})

const route = useRoute()
const config = useRuntimeConfig()
const { fetchFromStrapi } = useStrapi()

const article = ref(null)
const pending = ref(true)
const error = ref(null)

// Fetch article data
const fetchArticle = async () => {
  try {
    console.log('Article page - Starting fetch')
    console.log('Article page - Route params:', route.params)

    const { data: articleData, error: fetchError } = await fetchFromStrapi(`/articles?filters[slug][$eq]=${route.params.slug}&populate=*`)
    
    if (fetchError.value) {
      console.error('Article page - Fetch error:', fetchError.value)
      throw fetchError.value
    }

    if (articleData.value?.data?.[0]) {
      article.value = articleData.value.data[0]
      console.log('Article page - Found article:', {
        title: article.value.title,
        slug: article.value.slug,
        content: article.value.content
      })
    } else {
      console.log('Article page - No article found')
    }
  } catch (e) {
    console.error('Article page - Error:', e)
    error.value = e
  } finally {
    pending.value = false
  }
}

// Fetch article on component mount
onMounted(() => {
  console.log('Article page mounted')
  fetchArticle()
})

// Set the page title
useHead({
  title: article.value ? article.value.title : 'Article non trouvé',
  meta: [
    {
      name: 'description',
      content: article.value ? article.value.content[0]?.children[0]?.text : 'Article non trouvé'
    }
  ]
})
</script>

<style>
.prose {
  max-width: none;
}
</style> 