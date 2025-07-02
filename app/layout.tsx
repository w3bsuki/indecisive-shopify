import React from 'react'
import type { Metadata } from 'next'
import { Sora, Courier_Prime } from 'next/font/google'
import './globals.css'
import { MarketProvider } from '@/hooks/use-market'
import { HydrogenProvider } from '@/lib/shopify/hydrogen-client'
import { IndecisiveProvider } from '@/components/providers/indecisive-provider'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/layout/cookie-consent'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

const sora = Sora({
  subsets: ['latin'],
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

  return (
    <html lang={locale} className={`${sora.variable} ${courierPrime.variable}`}>
      <body className={sora.className}>
        <NextIntlClientProvider messages={messages}>
          <MarketProvider>
            <HydrogenProvider>
              <IndecisiveProvider>
                {children}
                <Toaster />
                <CookieConsent />
              </IndecisiveProvider>
            </HydrogenProvider>
          </MarketProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}