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
  address: string
  priceRange: '$' | '$$' | '$$$'
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

/**
 * A composable to access business details throughout the application. It provides a `get` function 
 * to retrieve specific details by key, ensuring type safety and consistency across the app.
 */
export async function useBusinessDetails() {
  const businessDetails = computed(() => {
    const appConfig = useAppConfig()
    return appConfig.business as BusinessDetails
  })

  function get<K extends BusinessDetailsKeys>(key: K): BusinessDetailsKeyValue[K] {
    return businessDetails.value[key]
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

  return {
    businessDetails: readonly(businessDetails),
    activeSocials,
    get,
    reactiveGet,
    getSocial,
    getSocialIcon
  }
}
