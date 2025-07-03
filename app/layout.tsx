import React from 'react'
import type { Metadata } from 'next'
import { Inter, Courier_Prime } from 'next/font/google'
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

// Inter has excellent Bulgarian Cyrillic support with proper loclBGR OpenType features
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
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
    <html lang={locale} className={`${inter.variable} ${courierPrime.variable}`}>
      <head>
        <ResourceHints />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <MarketProvider>
            <HydrogenProvider>
              <AuthProvider initialCustomer={customer}>
                <IndecisiveProvider>
                  <AnalyticsProvider>
                    {children}
                    <WebVitals />
                    <Toaster />
                    <CookieConsent />
                  </AnalyticsProvider>
                </IndecisiveProvider>
              </AuthProvider>
            </HydrogenProvider>
          </MarketProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}