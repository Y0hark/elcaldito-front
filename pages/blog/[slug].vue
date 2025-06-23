<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <NuxtLink to="/blog" class="text-primary text-sm hover:text-accent mb-3 inline-block">← Retour au blog</NuxtLink>
      <h1 class="text-2xl font-bold text-primary mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">{{ article.title }}</h1>
      <div class="text-xs text-primary/60 mb-4">{{ formatDate(new Date(article.publishedAt)) }}</div>
      <div class="prose prose-primary max-w-none text-base mobiledesktop:text-lg">
        <div v-html="article.content" />
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