import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { redirectCheckoutReturn } from '@/lib/checkout'
import { CheckoutPreparation } from './checkout-preparation'

export const metadata: Metadata = {
  title: 'Secure Checkout - Indecisive Wear',
  description: 'Complete your order with our secure checkout powered by Shopify',
}

interface CheckoutPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams
  
  // Convert searchParams to URLSearchParams for checkout return handling
  const urlParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlParams.set(key, value)
    } else if (Array.isArray(value)) {
      urlParams.set(key, value[0] || '')
    }
  })
  
  // Check if this is a checkout return and handle redirects
  const redirectTo = redirectCheckoutReturn(urlParams)
  if (redirectTo) {
    redirect(redirectTo)
  }

  // Normal checkout flow
  return (
    <>
      {/* Simple header for brand continuity */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-lg sm:text-xl font-bold">Indecisive Wear</h1>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
                <span>•</span>
                <span>Secure Checkout</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs sm:text-sm text-gray-600">Secure</span>
            </div>
          </div>
        </div>
      </header>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <CheckoutPreparation returnUrl={params.return_url as string} />
      </div>
    </>
  )
}