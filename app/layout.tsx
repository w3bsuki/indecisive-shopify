import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/hooks/use-cart'
import { Toaster } from '@/components/ui/toaster'

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
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}