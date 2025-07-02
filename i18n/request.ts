import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

// Map market IDs to locales
const marketToLocale: Record<string, string> = {
  'bg': 'bg',
  'gb': 'en', 
  'de': 'de'
}

export default getRequestConfig(async () => {
  // Get the market from cookies (set by our market context)
  const cookieStore = await cookies()
  const storedMarket = cookieStore.get('indecisive-wear-market')
  
  let locale = 'bg' // Default to Bulgarian
  
  if (storedMarket) {
    try {
      const marketId = JSON.parse(storedMarket.value)
      locale = marketToLocale[marketId] || 'bg'
    } catch {
      // If parsing fails, use default
      locale = 'bg'
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})