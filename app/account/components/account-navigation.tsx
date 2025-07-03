'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  User, 
  Package, 
  MapPin, 
  Settings,
  LayoutDashboard
} from 'lucide-react'

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/account',
    icon: LayoutDashboard,
    description: 'Account overview'
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Package,
    description: 'Order history'
  },
  {
    title: 'Profile',
    href: '/account/profile',
    icon: User,
    description: 'Personal information'
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
    description: 'Shipping addresses'
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Settings,
    description: 'Account preferences'
  }
]

export function AccountNavigation() {
  const pathname = usePathname()

  return (
    <Card className="border-2 border-black">
      <CardHeader className="pb-3">
        <CardTitle className="font-mono text-lg">Navigation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/account' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-mono transition-colors border-l-4',
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'text-gray-700 hover:bg-gray-100 border-transparent hover:border-gray-300'
                )}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className={cn(
                    'text-xs',
                    isActive ? 'text-gray-300' : 'text-gray-500'
                  )}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}