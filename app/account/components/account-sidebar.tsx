import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Heart,
  Home
} from 'lucide-react'
import { AccountLogoutButton } from '../logout-button'
import type { Customer } from '@/lib/shopify/customer-auth'
import { AccountNavigation } from './account-navigation'

interface AccountSidebarProps {
  customer: Customer
}

export function AccountSidebar({ customer }: AccountSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <Card className="border-2 border-black">
        <CardHeader className="pb-3">
          <CardTitle className="font-mono text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-mono font-medium">
              {customer.displayName || `${customer.firstName} ${customer.lastName}`.trim() || 'Customer'}
            </p>
            <p className="text-sm text-gray-600">{customer.email}</p>
          </div>
          
          {customer.phone && (
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-mono">{customer.phone}</p>
            </div>
          )}
          
          <div>
            <p className="text-xs text-gray-500">Member since</p>
            <p className="text-sm font-mono">
              {new Date(customer.id.split('/').pop()?.split('?')[0] || '').toLocaleDateString() || 'Recently'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <AccountNavigation />

      {/* Quick Actions */}
      <Card className="border-2 border-black">
        <CardHeader className="pb-3">
          <CardTitle className="font-mono text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full justify-start font-mono border-2 border-black">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/wishlist" className="block">
            <Button variant="outline" className="w-full justify-start font-mono border-2 border-black">
              <Heart className="h-4 w-4 mr-2" />
              View Wishlist
            </Button>
          </Link>
          
          <AccountLogoutButton />
        </CardContent>
      </Card>
    </div>
  )
}