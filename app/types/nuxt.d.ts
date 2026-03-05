declare module '@nuxt/schema' {
  interface CustomAppConfig {
    
  }
  
  interface PublicRuntimeConfig {
    businessDetails: BusinessDetails
  }
  
  interface NuxtConfig {
    businessDetails?: BusinessDetails
  }
  
  interface NuxtOptions {
    businessDetails?: ModuleOptions
  }
}

export {}
