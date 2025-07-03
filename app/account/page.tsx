import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Package, User, MapPin, Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Dashboard - My Account - Indecisive Wear',
  description: 'Your account dashboard overview',
}

export default async function AccountDashboardPage() {
  const customer = await getCurrentCustomer()
  
  // This will be handled by the layout, but keeping for safety
  if (!customer) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Account Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/account/orders">
          <Card className="border-2 border-black hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Package className="h-6 w-6" />
              <CardTitle className="font-mono">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">View your order history and track shipments</p>
              <p className="text-xs text-gray-500">Last order: Recently</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/profile">
          <Card className="border-2 border-black hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center space-x-4">
              <User className="h-6 w-6" />
              <CardTitle className="font-mono">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Manage your personal information</p>
              <p className="text-xs text-gray-500">Keep your details up to date</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/addresses">
          <Card className="border-2 border-black hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center space-x-4">
              <MapPin className="h-6 w-6" />
              <CardTitle className="font-mono">Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Manage shipping addresses</p>
              <p className="text-xs text-gray-500">
                {customer.defaultAddress ? 'Default address set' : 'No default address'}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/wishlist">
          <Card className="border-2 border-black hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Heart className="h-6 w-6" />
              <CardTitle className="font-mono">Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">View saved items</p>
              <p className="text-xs text-gray-500">Items you&apos;re considering</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Account Summary */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Account Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Contact Information</p>
              <div className="space-y-1">
                <p className="font-mono text-sm">{customer.email}</p>
                {customer.phone && (
                  <p className="font-mono text-sm">{customer.phone}</p>
                )}
              </div>
            </div>

            {customer.defaultAddress && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Default Shipping Address</p>
                <div className="font-mono text-sm space-y-1">
                  <p>{customer.defaultAddress.firstName} {customer.defaultAddress.lastName}</p>
                  <p>{customer.defaultAddress.address1}</p>
                  {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
                  <p>
                    {customer.defaultAddress.city}, {customer.defaultAddress.provinceCode || customer.defaultAddress.province} {customer.defaultAddress.zip}
                  </p>
                  <p>{customer.defaultAddress.country}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/account/profile">
                <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                  Edit Profile
                </Button>
              </Link>
              
              <Link href="/account/addresses">
                <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                  Manage Addresses
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Preferences */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">Marketing Communications</p>
              <p className="text-xs text-gray-600">
                {customer.acceptsMarketing ? 'You are subscribed to receive updates and offers' : 'You are not subscribed to marketing communications'}
              </p>
            </div>
            <Link href="/account/settings">
              <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                Change
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}