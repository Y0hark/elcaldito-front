// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  runtimeConfig: {
    public: {
      strapiBaseUrl: process.env.STRAPI_BASE_URL || 'http://localhost:1337',
      strapiToken: process.env.STRAPI_API_TOKEN,
    }
  },

  // Add route rules
  routeRules: {
    '/blog/**': { ssr: true }
  },

  // Add nitro configuration
  nitro: {
    routeRules: {
      '/blog/**': { cors: true }
    }
  }
})