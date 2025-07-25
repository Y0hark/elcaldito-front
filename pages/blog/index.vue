<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">{{ $t('order.blog.title') }}</h1>
      <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl mb-8">
        <p class="text-lg text-primary/90 text-center mb-6">
          {{ $t('order.blog.subtitle') }}
        </p>
        <ul class="space-y-4 max-w-2xl mx-auto">
          <li class="flex items-center gap-3">
            <span class="text-2xl">🌶️</span>
            <span class="text-primary/90">{{ $t('order.blog.topics.ingredients') }}</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-2xl">✈️</span>
            <span class="text-primary/90">{{ $t('order.blog.topics.travel') }}</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-2xl">🥘</span>
            <span class="text-primary/90">{{ $t('order.blog.topics.garniture') }}</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-2xl">❤️</span>
            <span class="text-primary/90">{{ $t('order.blog.topics.couple') }}</span>
          </li>
        </ul>
      </div>
      <p class="text-lg text-primary/80 text-center italic max-w-2xl mx-auto">
        {{ $t('order.blog.invitation') }}
      </p>
      <div v-if="pending" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mx-auto text-center flex flex-col items-center">
        <LoadingSpinner :text="$t('order.blog.loading')" />
      </div>
      <div v-else-if="error" class="bg-primary/95 rounded-xl p-4 shadow-xl mt-4 w-full max-w-md mx-auto text-center">
        <span class="text-crema block mb-4">{{ $t('order.blog.error') }}</span>
        <button @click="refresh" class="px-6 py-2 bg-crema text-primary rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 mx-auto block focus:outline-none">{{ $t('order.blog.retry') }}</button>
      </div>
      <div v-else>
        <div v-if="articles.length === 0" class="text-center text-primary/60 py-8">{{ $t('order.blog.noArticles') }}</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div v-for="article in articles" :key="article.id" class="bg-white border border-primary/10 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[420px]">
            <img :src="getImageUrl(article.cover)" 
                 :alt="article.cover?.alternativeText || article.title" 
                 class="w-full h-48 object-cover rounded-xl mb-4" />
            <h2 class="text-2xl font-semibold text-primary mb-2">{{ article.title }}</h2>
            <div class="text-primary/80 mb-4">
              <template v-for="(block, i) in article.content" :key="i">
                <p v-if="block.type === 'paragraph'">
                  <template v-for="(child, j) in block.children" :key="j">
                    {{ child.text }}
                  </template>
                </p>
              </template>
            </div>
            <pre class="text-xs text-red-600 mb-2">slug: {{ article.slug }}</pre>
            <div class="flex justify-between items-center mt-auto">
              <NuxtLink :to="`/blog/${article.slug}`" 
                        class="px-4 py-2 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300">
                {{ $t('order.blog.readArticle') }}
              </NuxtLink>
              <span class="text-primary/60">
                {{ new Date(article.publishedAt).toLocaleDateString('fr-FR') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p class="text-lg text-primary/80 text-center mt-6 italic">
        {{ $t('order.blog.feedback') }}
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

const getImageUrl = (image) => {
  if (!image) return ''
  return image.formats?.medium?.url || image.formats?.large?.url || image.url
}
</script> 