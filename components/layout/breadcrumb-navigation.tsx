'use client'

import Link from 'next/link'
import { ChevronRight, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  backButtonHref?: string
  backButtonLabel?: string
  className?: string
  variant?: 'default' | 'minimal' | 'compact'
}

export function BreadcrumbNavigation({
  items,
  showBackButton = true,
  backButtonHref,
  backButtonLabel = 'Back',
  className,
  variant = 'default'
}: BreadcrumbNavigationProps) {
  // Auto-detect back button href from second-to-last item
  const autoBackHref = items.length > 1 ? items[items.length - 2].href : '/'

  const variantStyles = {
    default: 'py-4 border-b border-gray-100',
    minimal: 'py-2',
    compact: 'py-1 text-sm'
  }

  return (
    <nav 
      className={cn(variantStyles[variant], className)}
      aria-label="Breadcrumb navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Breadcrumb Trail */}
          <ol className="flex items-center space-x-1 md:space-x-2">
            {items.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight 
                    className="h-4 w-4 text-gray-400 mx-1 md:mx-2 flex-shrink-0" 
                    aria-hidden="true" 
                  />
                )}
                
                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="group flex items-center text-gray-600 hover:text-black transition-colors"
                    aria-label="Home"
                  >
                    <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="ml-1 font-medium hidden sm:inline">
                      {item.label}
                    </span>
                  </Link>
                ) : item.current ? (
                  <span 
                    className="text-black font-medium truncate max-w-[150px] md:max-w-none"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-black transition-colors font-medium truncate max-w-[100px] md:max-w-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>

          {/* Back Button */}
          {showBackButton && (
            <Link href={backButtonHref || autoBackHref}>
              <Button 
                variant="ghost" 
                size={variant === 'compact' ? 'sm' : 'default'}
                className="flex items-center gap-1 text-gray-600 hover:text-black font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backButtonLabel}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

// Helper functions to generate breadcrumbs for common page types
export const BreadcrumbHelpers = {
  // For product pages: Home → Collections → Category → Product
  product: (productTitle: string, category?: string, collection?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(collection ? [{ label: collection, href: `/collections/${collection.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    ...(category && category !== collection ? [{ label: category, href: `/collections/${category.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    { label: productTitle, href: '#', current: true }
  ],

  // For collection pages: Home → Collections → Category
  collection: (collectionName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/products' },
    { label: collectionName, href: '#', current: true }
  ],

  // For search results: Home → Products → Search Results
  search: (query?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: query ? `Search: "${query}"` : 'Search Results', href: '#', current: true }
  ],

  // For account pages: Home → Account → Section
  account: (section?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    ...(section ? [{ label: section, href: '#', current: true }] : [])
  ],

  // For cart/checkout: Home → Shopping Cart / Checkout
  checkout: (step: 'cart' | 'checkout' | 'confirmation' = 'cart'): BreadcrumbItem[] => {
    const steps = [
      { label: 'Home', href: '/' },
      { label: 'Shopping Cart', href: '/cart', current: step === 'cart' },
      { label: 'Checkout', href: '/checkout', current: step === 'checkout' },
      { label: 'Order Confirmation', href: '#', current: step === 'confirmation' }
    ]
    
    return steps.filter(item => {
      if (step === 'cart') return item.href !== '/checkout' && item.href !== '#'
      if (step === 'checkout') return item.href !== '#'
      return true
    })
  },

  // For static pages: Home → Page
  page: (pageTitle: string, parentPage?: { title: string; href: string }): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    ...(parentPage ? [{ label: parentPage.title, href: parentPage.href }] : []),
    { label: pageTitle, href: '#', current: true }
  ]
}

// Structured data component for SEO
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}` : item.href
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}