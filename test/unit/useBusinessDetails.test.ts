import { describe, expect, it } from 'vitest'

describe('useBusinessDetails', () => {
  it('should return the correct business details', () => {
    const { get, reactiveGet } = useBusinessDetails()

    expect(get('legalName')).toBeDefined()
    expect(get('name')).toBeTypeOf('string')

    const reactiveValue = reactiveGet('legalName')
    expect(toValue(reactiveValue)).toEqual(get('legalName'))
    expect(isRef(reactiveValue)).toBeTruthy()
  })

  it('should return the correct social icons', () => {
    const { getSocialIcon } = useBusinessDetails()
    
    expect(getSocialIcon('instagram')).toBe('fa-brands:instagram')
    expect(getSocialIcon('facebook')).toBe('fa-brands:facebook')
    expect(getSocialIcon('twitter')).toBe('fa-brands:twitter')
    expect(getSocialIcon('linkedin')).toBe('fa-brands:linkedin')
  })

  it('should return the correct address', () => {
    const { address } = useBusinessDetails()
    expect(toValue(address)).toEqual('123 Nuxt Street, 75000 Nuxt City')
  })
})
