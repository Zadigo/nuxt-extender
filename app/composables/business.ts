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
  creationDate: Nullable<string>
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
  siren: null,
  siret: null,
  numberoTVA: null,
  creationDate: null,
  sameAs: [],
  image: [],
  rcs: null,
  address: {
    street: '',
    postalCode: '',
    city: '',
    lat: null,
    lng: null
  },
  priceRange: '$$',
  foundingDate: '2020-01-01',
  foundingLocation: '',
  founderImage: '',
  shareCapital: '',
  founder: '',
  founderDescription: '',
  founderKnowsAbout: [],
  webContentManager: '',
  publishingDirector: '',
  editorInChief: '',
  websiteProvider: {
    legalName: 'Nuxt Hosting Inc.',
    url: ''
  },
  cloudProvider: {
    legalName: 'Nuxt Cloud Inc.',
    url: '',
    description: '',
    address: '',
    rcs: null
  },
  contact: {
    telephone: '',
    email: '',
    address: ''
  },
  socials: {
    instagram: {
      url: '',
      handle: '@nuxtjs'
    },
    facebook: {
      url: 'https://www.facebook.com/nuxtjs',
      handle: '@nuxtjs'
    },
    twitter: {
      url: 'https://twitter.com/nuxtjs',
      handle: '@nuxtjs'
    },
    linkedin: {
      url: 'https://www.linkedin.com/company/nuxtjs',
      handle: '@nuxtjs'
    }
  }
}

/**
 * A helper function to define business details with type safety. It allows you to provide partial details, 
 * which will be merged with the default business details. This ensures that all required fields are present 
 * while allowing for flexibility in defining only the necessary details.
 * @param details - Partial business details to override the default values. You can provide only the fields you want to customize, and the rest will be filled in with defaults.
 */
export function defineBusinessDetails(details: Partial<BusinessDetails>) {
  return {
    ...businessDetails,
    ...details
  }
}

/**
 * A composable to access business details throughout the application. It provides a `get` function 
 * to retrieve specific details by key, ensuring type safety and consistency across the app.
 */
export function useBusinessDetails() {
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
