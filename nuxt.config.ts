// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable Vue 3.5+ features
  vue: {
    propsDestructure: true,
  },

  // Modules
  modules: [
    '@unocss/nuxt',
  ],

  // Development tools
  devtools: { enabled: true },

  // TypeScript strict mode
  typescript: {
    strict: true,
  },

  // SSR mode (default)
  ssr: true,

  compatibilityDate: '2025-12-17',
})
