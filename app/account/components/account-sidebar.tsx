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
      <Card className="border-2 border-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-drawer-title">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-drawer-value font-semibold">
              {customer.displayName || `${customer.firstName} ${customer.lastName}`.trim() || 'Customer'}
            </p>
            <p className="text-drawer-subtitle">{customer.email}</p>
          </div>
          
          {customer.phone && (
            <div>
              <p className="text-drawer-label">Phone</p>
              <p className="text-drawer-value">{customer.phone}</p>
            </div>
          )}
          
          <div>
            <p className="text-drawer-label">Member since</p>
            <p className="text-drawer-value">
              {new Date(customer.id.split('/').pop()?.split('?')[0] || '').toLocaleDateString() || 'Recently'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-drawer-title">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full justify-start border-2 border-black hover:bg-gray-50 h-12">
              <Home className="h-5 w-5 mr-3 flex-shrink-0" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/account/wishlist" className="block">
            <Button variant="outline" className="w-full justify-start border-2 border-black hover:bg-gray-50 h-12">
              <Heart className="h-5 w-5 mr-3 flex-shrink-0" />
              View Wishlist
            </Button>
          </Link>
          
          <AccountLogoutButton />
        </CardContent>
      </Card>
    </div>
  )
}