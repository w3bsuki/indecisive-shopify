'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const breadcrumbMap: Record<string, string> = {
  '/account': 'Dashboard',
  '/account/orders': 'Orders',
  '/account/profile': 'Profile',
  '/account/addresses': 'Addresses',
  '/account/settings': 'Settings'
}

export function AccountBreadcrumb() {
  const pathname = usePathname()
  
  // Generate breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = []
  
  // Add home
  breadcrumbItems.push({
    label: 'Home',
    href: '/',
    icon: Home
  })
  
  // Build account breadcrumbs
  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    
    if (breadcrumbMap[currentPath]) {
      breadcrumbItems.push({
        label: breadcrumbMap[currentPath],
        href: currentPath,
        icon: null
      })
    }
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          
          {index === breadcrumbItems.length - 1 ? (
            // Current page - not clickable
            <span className={cn(
              'font-mono font-medium',
              index === 0 ? 'text-gray-500' : 'text-black'
            )}>
              {item.icon && <item.icon className="h-4 w-4 mr-1 inline" />}
              {item.label}
            </span>
          ) : (
            // Clickable breadcrumb
            <Link 
              href={item.href}
              className="font-mono hover:text-black transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-1 inline" />}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}