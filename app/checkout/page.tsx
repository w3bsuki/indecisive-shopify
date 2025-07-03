import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { redirectCheckoutReturn } from '@/lib/checkout'
import { CheckoutPreparation } from './checkout-preparation'

export const metadata: Metadata = {
  title: 'Checkout - Indecisive Wear',
  description: 'Complete your order securely',
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
    <div className="min-h-screen bg-gray-50">
      <CheckoutPreparation returnUrl={params.return_url as string} />
    </div>
  )
}