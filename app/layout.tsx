import React from 'react'
import type { Metadata } from 'next'
import { Noto_Sans, Source_Sans_3, Roboto, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { MarketProvider } from '@/hooks/use-market'
import { HydrogenProvider } from '@/lib/shopify/hydrogen-client'
import { IndecisiveProvider } from '@/components/providers/indecisive-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/layout/cookie-consent'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { getCurrentCustomer } from '@/app/actions/auth'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import { WebVitals } from './web-vitals'
import { ResourceHints } from './resource-hints'
import { FlyToCartProvider } from '@/contexts/fly-to-cart-context'
import { CartNotificationProvider } from '@/components/providers/cart-notification-provider'

// Noto Sans - Updated 2024 with proper Bulgarian Cyrillic support (loclBGR)
const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto',
})

// Source Sans Pro - Excellent fallback for Bulgarian Cyrillic
const sourceSans = Source_Sans_3({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-source',
})

// Roboto - Reliable Bulgarian Cyrillic support
const roboto = Roboto({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

// JetBrains Mono - Better Cyrillic support than Courier Prime
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Indecisive Wear - Fashion for the Uncertain',
  description: 'Curated fashion for those who can\'t decide. Let us help you find your style.',
  generator: 'Next.js',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()
  
  // Fetch current customer data on the server
  const customer = await getCurrentCustomer()

  return (
    <html lang={locale} className={`${notoSans.variable} ${sourceSans.variable} ${roboto.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <ResourceHints />
      </head>
      <body className={notoSans.className}>
        <NextIntlClientProvider messages={messages}>
          <MarketProvider>
            <HydrogenProvider>
              <AuthProvider initialCustomer={customer}>
                <IndecisiveProvider>
                  <FlyToCartProvider>
                    <CartNotificationProvider>
                      <AnalyticsProvider>
                        {children}
                        <WebVitals />
                        <Toaster />
                        <CookieConsent />
                      </AnalyticsProvider>
                    </CartNotificationProvider>
                  </FlyToCartProvider>
                </IndecisiveProvider>
              </AuthProvider>
            </HydrogenProvider>
          </MarketProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}