'use client'

import { ReactNode } from 'react'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import { WebVitals } from '@/app/web-vitals'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/layout/cookie-consent'
import { TwentyFirstToolbar } from '@21st-extension/toolbar-react'
import { ReactPlugin } from '@21st-extension/react'
import { FlyToCartProvider } from '@/contexts/fly-to-cart-context'
import { CartNotificationProvider } from '@/components/providers/cart-notification-provider'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <FlyToCartProvider>
      <CartNotificationProvider>
        <AnalyticsProvider>
          {children}
          <WebVitals />
          <Toaster />
          <CookieConsent />
          <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
        </AnalyticsProvider>
      </CartNotificationProvider>
    </FlyToCartProvider>
  )
}
