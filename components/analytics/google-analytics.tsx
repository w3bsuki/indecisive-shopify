'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useCookieConsent } from '@/hooks/use-cookie-consent'

// Type declarations for gtag are in types/window.d.ts

interface GoogleAnalyticsProps {
  measurementId: string
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { consentData } = useCookieConsent()
  
  // Track page views
  useEffect(() => {
    if (!consentData?.analytics || !window.gtag) return
    
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    window.gtag('config', measurementId, {
      page_path: url,
    })
  }, [pathname, searchParams, measurementId, consentData?.analytics])
  
  // Only load GA if analytics consent is given
  if (!consentData?.analytics) {
    return null
  }
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}