'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCallback } from 'react'

interface Collection {
  id: string
  handle: string
  title: string
}

interface CollectionsPillsProps {
  variant?: 'all' | 'new' | 'sale' | 'collection'
  currentCategory?: string
  className?: string
  collections?: Collection[]  // Dynamic collections from Shopify
  useDynamicCollections?: boolean
}

export function CollectionsPills({
  variant = 'all',
  currentCategory = 'all',
  className = '',
  collections: dynamicCollections = []
}: CollectionsPillsProps) {
  const locale = useLocale()
  const router = useRouter()
  const _isBulgarian = locale === 'bg'

  // No static collections - we'll use dynamic collections from Shopify

  // Always use dynamic collections with "ALL" as first option
  const collections = [
    // Always include "ALL" as first option
    {
      id: 'all',
      handle: 'all', 
      title: locale === 'bg' ? 'ВСИЧКИ' : 'ALL',
      href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}`
    },
    // Add dynamic collections with proper filter URLs
    ...dynamicCollections.map(collection => ({
      id: collection.handle,
      handle: collection.handle,
      title: collection.title.toUpperCase(),
      href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=${collection.handle}`
    }))
  ]

  // Handle navigation without prefetch issues
  const handleCollectionClick = useCallback((href: string) => {
    router.push(href)
  }, [router])

  return (
    <div className={cn('w-full mb-8', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop view - pill style */}
        <div className="hidden sm:flex justify-center">
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-full">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleCollectionClick(collection.href)}
                className={cn(
                  "relative px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
                  "hover:text-gray-900",
                  currentCategory === collection.handle
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <span className="relative z-10 uppercase tracking-wider font-mono text-xs sm:text-sm">
                  {collection.title}
                </span>
                {currentCategory === collection.handle && (
                  <span className="absolute inset-0 bg-white rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mobile view - horizontal scroll */}
        <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4">
          <div className="inline-flex gap-3 px-4 pb-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleCollectionClick(collection.href)}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200",
                  "border-b-2",
                  currentCategory === collection.handle
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
                )}
              >
                <span className="uppercase tracking-wider font-mono text-xs">
                  {collection.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}