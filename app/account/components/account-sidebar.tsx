import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Heart,
  Home
} from 'lucide-react'
import { AccountLogoutButton } from '../logout-button'
import type { Customer } from '@/lib/shopify/customer-auth'

interface AccountSidebarProps {
  customer: Customer
}

export function AccountSidebar({ customer }: AccountSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-900">
              {customer.displayName || `${customer.firstName} ${customer.lastName}`.trim() || 'Customer'}
            </p>
            <p className="text-gray-600 text-xs">{customer.email}</p>
          </div>
          
          {customer.phone && (
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm">{customer.phone}</p>
            </div>
          )}
          
          <div>
            <p className="text-xs text-gray-500">Member since</p>
            <p className="text-sm">
              {new Date(customer.id.split('/').pop()?.split('?')[0] || '').toLocaleDateString() || 'Recently'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full justify-start hover:bg-gray-50 h-10">
              <Home className="h-4 w-4 mr-2 flex-shrink-0" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/account/wishlist" className="block">
            <Button variant="outline" className="w-full justify-start hover:bg-gray-50 h-10">
              <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
              View Wishlist
            </Button>
          </Link>
          
          <AccountLogoutButton />
        </CardContent>
      </Card>
    </div>
  )
}