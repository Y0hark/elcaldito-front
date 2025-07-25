// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  
  i18n: {
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        flag: '🇫🇷',
        file: 'fr-FR.json'
      },
      {
        code: 'es',
        iso: 'es-MX',
        name: 'Español (MX)',
        flag: '🇲🇽',
        file: 'es-MX.json'
      }
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'fr'
    },
    langDir: 'locales',
    lazy: true
  },
  
  runtimeConfig: {
    strapiApiUrl: process.env.STRAPI_BASE_URL || 'http://localhost:1337',
    strapiToken: process.env.STRAPI_API_TOKEN,
    public: {
      strapiApiUrl: process.env.STRAPI_BASE_URL || 'http://localhost:1337',
      strapiToken: process.env.STRAPI_API_TOKEN,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
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
  },

  // Add Vue configuration to prevent RouterLink warnings
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'RouterLink'
    }
  }
})