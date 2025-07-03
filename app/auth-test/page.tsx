import { getCurrentCustomer } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'

export default async function AuthTestPage() {
  const customer = await getCurrentCustomer()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <div className="border-2 border-black p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Current Status:</h2>
        
        {customer ? (
          <div className="space-y-2 text-green-600">
            <p className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <strong>Logged in as:</strong> {customer.firstName} {customer.lastName}
            </p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Customer ID:</strong> {customer.id}</p>
            {customer.acceptsMarketing && (
              <p className="text-sm text-gray-600">✓ Subscribed to marketing emails</p>
            )}
          </div>
        ) : (
          <p className="text-red-600">Not logged in</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold">Test Actions:</h3>
        
        <div className="flex flex-wrap gap-4">
          {!customer ? (
            <>
              <Button asChild>
                <Link href="/login">
                  Test Login
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">
                  Test Register
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/account">
                  Go to Account
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cart">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Test Checkout
                </Link>
              </Button>
              <form action="/api/auth/logout" method="POST" className="inline">
                <Button type="submit" variant="destructive">
                  Test Logout
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 border border-gray-300 text-sm">
        <h4 className="font-semibold mb-2">Authentication Flow:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Register creates a Shopify customer account</li>
          <li>Login authenticates via Shopify Storefront API</li>
          <li>Token stored in secure httpOnly cookie</li>
          <li>Account pages fetch customer data with token</li>
          <li>Checkout pre-populates customer information</li>
        </ol>
      </div>
    </div>
  )
}