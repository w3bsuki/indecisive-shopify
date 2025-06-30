import React from 'react'
import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import { HydrogenProvider } from '@/lib/shopify/hydrogen-client'
import { Toaster } from '@/components/ui/sonner'

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
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
    <html lang="en">
      <body className={sora.className}>
        <HydrogenProvider>
          {children}
          <Toaster />
        </HydrogenProvider>
      </body>
    </html>
  )
}