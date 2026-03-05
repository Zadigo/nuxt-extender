import type { Nullable } from '~/types'

export interface WebsiteProvider {
  legalName: string
  url: string
}

export interface CloudProvider extends WebsiteProvider {
  description: string
  address: string
  rcs: string
}

export interface ContactPoints {
  telephone: string
  email: string
  address: string
}

export type SocialPlatform = 'instagram' | 'facebook' | 'pinterest' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'

export type Social = {
  url: string
  handle?: string
}

export interface BusinessDetails {
  name: string
  legalName: string
  siren: string
  siret: string
  numberoTVA: Nullable<string>
  creationDate: string
  alternateName: string
  description: string
  logo: string
  sameAs: string[]
  image: string[]
  rcs: string
  address: {
    street: string
    postalCode: string
    city: string
    lat: number | null
    lng: number | null
  }
  priceRange: '$' | '$$' | '$$$' | (string & {})
  foundingDate: string
  foundingLocation: string
  founderImage: Nullable<string>
  shareCapital: Nullable<string>
  founder: string
  founderDescription: string
  founderKnowsAbout: string[]
  webContentManager: string
  publishingDirector: string
  editorInChief: string
  websiteProvider: WebsiteProvider
  cloudProvider: CloudProvider
  contact: ContactPoints
  socials: Partial<Record<SocialPlatform, Social>>
}

type BusinessDetailsKeys = keyof BusinessDetails

type BusinessDetailsKeyValue = {
  [K in BusinessDetailsKeys]: BusinessDetails[K]
}

const businessDetails =  {
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
  address: {
    street: '123 Nuxt Street',
    postalCode: '75000',
    city: 'Nuxt City',
    lat: null,
    lng: null
  },
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
}

/**
 * A composable to access business details throughout the application. It provides a `get` function 
 * to retrieve specific details by key, ensuring type safety and consistency across the app.
 */
export async function useBusinessDetails() {
  function get<K extends BusinessDetailsKeys>(key: K): BusinessDetailsKeyValue[K] {
    return businessDetails[key]
  }

  const reactiveGet = reactify(get)
  const activeSocials = computed(() => Object.keys(get('socials')) as SocialPlatform[])

  function getSocial(platform: SocialPlatform): Social | null {
    const socials = get('socials')
    return socials[platform] || null
  }

  function getSocialIcon(platform: SocialPlatform): string {
    const icons: Record<SocialPlatform, string> = {
      instagram: 'fa-brands:instagram',
      facebook: 'fa-brands:facebook',
      pinterest: 'fa-brands:pinterest',
      twitter: 'fa-brands:twitter',
      linkedin: 'fa-brands:linkedin',
      tiktok: 'fa-brands:tiktok',
      youtube: 'fa-brands:youtube'
    }
    return icons[platform]
  }

  const address = computed(() => {
    const address = get('address')
    return `${address.street}, ${address.postalCode} ${address.city}`
  })

  return {
    businessDetails: readonly(businessDetails),
    activeSocials: readonly(activeSocials),
    address: readonly(address),
    get,
    reactiveGet,
    getSocial,
    getSocialIcon
  }
}
