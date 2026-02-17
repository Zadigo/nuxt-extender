export default defineAppConfig({
  business: {
    name: 'Nuxt Extender',
    legalName: 'Nuxt Extender',
    alternateName: 'Nuxt Extender',
    description: 'A Nuxt module to extend your application with powerful features and composables.',
    logo: 'https://nuxt.com/favicon.ico',
    siren: '123456789',
    siret: '12345678900000',
    numberoTVA: 'FR123456789',
    creationDate: '2023-01-01',
    sameAs: [
      'https://www.facebook.com/nuxtjs',
      'https://twitter.com/nuxt_js',
      'https://www.linkedin.com/company/nuxtjs'
    ],
    image: [
      'https://nuxt.com/images/nuxt-og-image.png'
    ],
    rcs: '123456789',
    address: '123 Nuxt Street, Nuxt City, Nuxt Country',
    priceRange: '$$',
    foundingDate: '2020-01-01',
    foundingLocation: 'Nuxt City',
    founderImage: 'https://nuxt.com/images/nuxt-founder.png',
    shareCapital: '1000000',
    founder: 'Nuxt Team',
    founderDescription: 'The team behind Nuxt.js, dedicated to building powerful tools for developers.',
    founderKnowsAbout: ['JavaScript', 'Vue.js', 'Nuxt.js', 'Web Development'],
    webContentManager: 'Nuxt Team',
    publishingDirector: 'Nuxt Team',
    editorInChief: 'Nuxt Team',
    websiteProvider: {
      legalName: 'Nuxt Hosting Inc.',
      url: 'https://nuxt.com/hosting'
    },
    cloudProvider: {
      legalName: 'Nuxt Cloud Inc.',
      url: 'https://nuxt.com/cloud',
      description: 'Cloud hosting and services for Nuxt applications.',
      address: '456 Nuxt Cloud Avenue, Nuxt City, Nuxt Country',
      rcs: '987654321'
    },
    contact: {
      telephone: '+1234567890',
      email: 'info@nuxt.com',
      address: '123 Nuxt Street, Nuxt City, Nuxt Country'
    },
    socials: {
      instagram: {
        url: 'https://www.instagram.com/nuxtjs',
        handle: '@nuxtjs'
      },
      facebook: {
        url: 'https://www.facebook.com/nuxtjs',
        handle: '@nuxtjs'
      },
      twitter: {
        url: 'https://twitter.com/nuxt_js',
        handle: '@nuxt_js'
      },
      linkedin: {
        url: 'https://www.linkedin.com/company/nuxtjs',
        handle: '@nuxtjs'
      }
    }
  },
  sessions: {
    name: 'sessionId',
    collectionName: 'sessions',
    initial: {
      test: 'test'
    }
  }
})
