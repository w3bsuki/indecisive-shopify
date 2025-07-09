'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  UserPlus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface GuestCheckoutOptionProps {
  onGuestCheckout: () => void
  isLoading?: boolean
}

export function GuestCheckoutOption({ onGuestCheckout, isLoading = false }: GuestCheckoutOptionProps) {
  const [selectedOption, setSelectedOption] = useState<'guest' | 'login' | null>(null)

  const handleGuestProceed = () => {
    setSelectedOption('guest')
    onGuestCheckout()
  }

  const handleLoginRedirect = () => {
    setSelectedOption('login')
    window.location.href = '/login?redirectTo=/checkout'
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold font-mono mb-2">Choose Your Checkout Method</h2>
        <p className="text-gray-600">
          Continue as a guest or log in to your account for faster checkout
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guest Checkout Option */}
        <Card className={`border cursor-pointer transition-all ${
          selectedOption === 'guest' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="font-mono flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Guest Checkout
              <Badge variant="outline" className="ml-auto border-green-300 text-green-700">
                Fastest
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No account required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Quick and simple</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Email confirmation included</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span>Manual tracking via email</span>
              </div>
            </div>

            <Button
              onClick={handleGuestProceed}
              disabled={isLoading}
              className="w-full font-mono"
              variant={selectedOption === 'guest' ? 'default' : 'outline'}
            >
              {selectedOption === 'guest' && isLoading ? (
                <>
                  <ArrowRight className="h-4 w-4 mr-2 animate-pulse" />
                  Proceeding...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue as Guest
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Login Option */}
        <Card className={`border cursor-pointer transition-all ${
          selectedOption === 'login' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="font-mono flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Login
              <Badge variant="outline" className="ml-auto border-blue-300 text-blue-700">
                Recommended
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Pre-filled address info</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Order history tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Easy returns & exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Faster future checkouts</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleLoginRedirect}
                disabled={isLoading}
                className="w-full font-mono"
                variant={selectedOption === 'login' ? 'default' : 'outline'}
              >
                {selectedOption === 'login' && isLoading ? (
                  <>
                    <User className="h-4 w-4 mr-2 animate-pulse" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Log In to Account
                  </>
                )}
              </Button>

              <Link href="/register?redirectTo=/checkout">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-sm font-mono"
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="py-4">
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>
              <strong>Security:</strong> All payments are processed securely by Shopify using 256-bit SSL encryption
            </p>
            <p>
              <strong>Guest Orders:</strong> You can create an account after checkout to track your order
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}