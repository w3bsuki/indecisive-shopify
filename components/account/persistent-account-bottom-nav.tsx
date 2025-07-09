"use client"

import { User, Package, MapPin, CreditCard, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'

const navTabs = [
  { id: 'profile', label: 'Profile', icon: User, href: '/account' },
  { id: 'orders', label: 'Orders', icon: Package, href: '/account/orders' },
  { id: 'addresses', label: 'Addresses', icon: MapPin, href: '/account/addresses' },
  { id: 'billing', label: 'Billing', icon: CreditCard, href: '/account/settings' },
  { id: 'history', label: 'History', icon: History, href: '/account/history' },
]

export function PersistentAccountBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  // Only show on mobile
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg flex md:hidden">
      {navTabs.map(tab => {
        const isActive =
          (tab.href === '/account' && pathname === '/account') ||
          (tab.href !== '/account' && pathname.startsWith(tab.href))
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant="ghost"
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-none border-none font-mono text-xs gap-1 transition-colors ${
              isActive ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => router.push(tab.href)}
            aria-label={tab.label}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'text-black' : 'text-gray-400'}`} />
            <span>{tab.label}</span>
          </Button>
        )
      })}
    </nav>
  )
}
