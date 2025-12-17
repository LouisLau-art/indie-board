// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable Vue 3.5+ features
  vue: {
    propsDestructure: true,
  },

  // Modules - Una UI includes UnoCSS automatically
  modules: [
    '@una-ui/nuxt',
  ],

  // Una UI configuration
  una: {
    // Una UI prefix for components (e.g., <UButton>)
    prefix: 'U',
    // Theme configuration
    ui: {
      // Primary color
      primary: 'emerald',
    },
  },

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
