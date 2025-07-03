import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

// Map market IDs to locales
const marketToLocale: Record<string, string> = {
  'bg': 'bg',    // Bulgaria -> Bulgarian
  'gb': 'en',    // United Kingdom -> English  
  'de': 'de'     // Germany -> German
}

export default getRequestConfig(async () => {
  // Processing internationalization request...
  
  // Get the market from cookies (set by our market context)
  const cookieStore = await cookies()
  const storedMarket = cookieStore.get('indecisive-wear-market')
  
  let locale = 'bg' // Default to Bulgarian
  let marketId = 'bg'
  
  // Cookie check performed
  
  if (storedMarket) {
    try {
      marketId = JSON.parse(storedMarket.value)
      locale = marketToLocale[marketId] || 'bg'
      // Market parsed successfully
    } catch (error) {
      // Failed to parse market cookie, using default
      locale = 'bg'
      marketId = 'bg'
    }
  } else {
    // No market cookie found, using default Bulgarian
  }

  // Final locale selection determined

  try {
    const messages = (await import(`../messages/${locale}.json`)).default
    // Messages loaded successfully
    
    return {
      locale,
      messages
    }
  } catch (error) {
    console.error(`❌ [I18N] Failed to load messages for ${locale}, falling back to Bulgarian:`, error)
    
    // Fallback to Bulgarian if the locale file doesn't exist
    const fallbackMessages = (await import(`../messages/bg.json`)).default
    return {
      locale: 'bg',
      messages: fallbackMessages
    }
  }
})