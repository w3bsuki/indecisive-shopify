import React from 'react'
import type { Metadata } from 'next'
import { Sora, Courier_Prime } from 'next/font/google'
import './globals.css'
import { HydrogenProvider } from '@/lib/shopify/hydrogen-client'
import { IndecisiveProvider } from '@/components/providers/indecisive-provider'
import { Toaster } from '@/components/ui/sonner'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${courierPrime.variable}`}>
      <body className={sora.className}>
        <HydrogenProvider>
          <IndecisiveProvider>
            {children}
            <Toaster />
          </IndecisiveProvider>
        </HydrogenProvider>
      </body>
    </html>
  )
}