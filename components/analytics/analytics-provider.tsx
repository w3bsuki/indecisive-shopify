'use client'

import { GoogleAnalytics } from './google-analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  
  return (
    <>
      {children}
      {gaId && <GoogleAnalytics measurementId={gaId} />}
    </>
  )
}