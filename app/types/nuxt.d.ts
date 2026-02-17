import type { BusinessDetails } from '~/composables/business'

declare module '@nuxt/schema' {
  interface CustomAppConfig {
    business: BusinessDetails
  }
}


export {}
