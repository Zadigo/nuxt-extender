/**
 * Composable for generating social media links
 */
export function useSocialLinks() {
  function instagram(username: string) {
    return `https://www.instagram.com/${username}`
  }

  return {
    instagram
  }
}
