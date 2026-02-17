import type { BusinessDetails } from '~/composables/business'
import type { CreateSessonOptions } from './sessions'

declare module '@nuxt/schema' {
  interface CustomAppConfig {
    business: BusinessDetails
    sessions: {
      name: string
      collectionName: string
    }
  }
}


export {}
