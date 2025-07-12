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
  Clock,
  Zap,
  Shield
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Checkout Option */}
        <Card className={`border cursor-pointer transition-all duration-200 ${
          selectedOption === 'guest' 
            ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className={`p-2 rounded-full ${
                selectedOption === 'guest' ? 'bg-white text-black' : 'bg-gray-100'
              }`}>
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">GUEST CHECKOUT</span>
                  <Badge variant={selectedOption === 'guest' ? 'secondary' : 'outline'} 
                         className={`text-xs ${selectedOption === 'guest' ? 'bg-white text-black' : 'border-green-300 text-green-700'}`}>
                    <Zap className="h-3 w-3 mr-1" />
                    FASTEST
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">No account needed</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Quick and easy</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Email confirmation</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm">Track via email</span>
              </div>
            </div>

            <Button
              onClick={handleGuestProceed}
              disabled={isLoading}
              className={`w-full h-11 font-semibold transition-all ${
                selectedOption === 'guest' 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {selectedOption === 'guest' && isLoading ? (
                <>
                  <ArrowRight className="h-4 w-4 mr-2 animate-pulse" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  CONTINUE AS GUEST
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Login Option */}
        <Card className={`border cursor-pointer transition-all duration-200 ${
          selectedOption === 'login' 
            ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
        }`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className={`p-2 rounded-full ${
                selectedOption === 'login' ? 'bg-white text-black' : 'bg-gray-100'
              }`}>
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">SIGN IN</span>
                  <Badge variant={selectedOption === 'login' ? 'secondary' : 'outline'} 
                         className={`text-xs ${selectedOption === 'login' ? 'bg-white text-black' : 'border-blue-300 text-blue-700'}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    RECOMMENDED
                  </Badge>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Pre-filled shipping details</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Order history</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Easy returns and exchanges</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Faster future checkouts</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleLoginRedirect}
                disabled={isLoading}
                className={`w-full h-11 font-semibold transition-all ${
                  selectedOption === 'login' 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {selectedOption === 'login' && isLoading ? (
                  <>
                    <User className="h-4 w-4 mr-2 animate-pulse" />
                    REDIRECTING...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    SIGN IN
                  </>
                )}
              </Button>

              <Link href="/register?redirectTo=/checkout">
                <Button
                  variant="outline"
                  className={`w-full h-10 font-medium transition-all ${
                    selectedOption === 'login' 
                      ? 'border-white text-white hover:bg-white hover:text-black' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  CREATE ACCOUNT
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Information */}
      <div className="mt-6">
        <Card className="border border-gray-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-sm">Security & Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>Security:</strong> All payments are securely processed by Shopify</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>Guest orders:</strong> Create an account after checkout for easy tracking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}