// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxt/test-utils/module'],

  typescript: {
    tsConfig: {
      include: [
        '../test/unit/**/*.ts'
      ]
    }
  }
})
