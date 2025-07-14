export function PerformanceHints() {
  return (
    <>
      {/* DNS Prefetch for Shopify CDN */}
      <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      
      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://cdn.shopify.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Prefetch critical resources */}
      <link rel="prefetch" href="/api/cart" as="fetch" crossOrigin="anonymous" />
      
      {/* Resource hints for better performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </>
  )
}