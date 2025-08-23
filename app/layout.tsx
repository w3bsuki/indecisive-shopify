import React from 'react'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Comforter } from 'next/font/google'
import './globals.css'
import { MarketProvider } from '@/hooks/use-market'
import { HydrogenProvider } from '@/lib/shopify/hydrogen-client'
import { IndecisiveProvider } from '@/components/providers/indecisive-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { getCurrentCustomer } from '@/app/actions/auth'
import { ResourceHints } from './resource-hints'
import ClientLayout from '@/components/layout/client-layout'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

// Inter - Clean, modern font with excellent readability
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
})

// JetBrains Mono - Better Cyrillic support than Courier Prime
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
})

// Comforter - More authentic handwritten font with Cyrillic support
const comforter = Comforter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-handwritten',
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
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <ResourceHints />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} ${comforter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <MarketProvider>
            <HydrogenProvider>
              <AuthProvider initialCustomer={customer}>
                <IndecisiveProvider>
                  <ScrollToTop />
                  <ClientLayout>
                    {children}
                  </ClientLayout>
                </IndecisiveProvider>
              </AuthProvider>
            </HydrogenProvider>
          </MarketProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}