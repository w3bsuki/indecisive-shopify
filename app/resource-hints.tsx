/**
 * Resource hints for performance optimization
 * Preconnect to external origins and DNS prefetch
 */

export function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://cdn.shopify.com" />
      <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      
      {/* Shopify Storefront API */}
      {process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && (
        <>
          <link 
            rel="preconnect" 
            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`} 
          />
          <link 
            rel="dns-prefetch" 
            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`} 
          />
        </>
      )}
      
      {/* Google Analytics - only in production */}
      {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        </>
      )}
      
      {/* Sentry - only in production */}
      {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN && (
        <link rel="dns-prefetch" href="https://sentry.io" />
      )}
      
      {/* Fonts - Google Fonts preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Prevent unused preload warnings */}
      <meta name="format-detection" content="telephone=no" />
    </>
  )
}