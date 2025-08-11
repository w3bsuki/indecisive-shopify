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
  const router = useRouter()
  const locale = useLocale()
  
  // Locale-specific translations
  const translations = {
    'all': locale === 'bg' ? 'ВСИЧКИ' : 'ALL',
    'hats': locale === 'bg' ? 'ШАПКИ' : 'HATS',
    'tshirts': locale === 'bg' ? 'ТЕНИСКИ' : 'T-SHIRTS', 
    'bags': locale === 'bg' ? 'ЧАНТИ' : 'BAGS',
    'hoodies': locale === 'bg' ? 'СУИТШЪРТИ' : 'HOODIES',
    'jackets': locale === 'bg' ? 'ЯКЕТА' : 'JACKETS',
    'pants': locale === 'bg' ? 'ПАНТАЛОНИ' : 'PANTS',
    'accessories': locale === 'bg' ? 'АКСЕСОАРИ' : 'ACCESSORIES'
  }

  // Translation mapping for collection handles
  const getCollectionTitle = (handle: string, originalTitle: string): string => {
    const handleMap: Record<string, string> = {
      'bucket-hats': translations.hats,
      'tees': translations.tshirts, 
      'tote-bags': translations.bags,
      'tees-1': translations.tshirts,
      'caps': translations.hats,
      'crop-tops': translations.tshirts,
      'hats': translations.hats,
      'tshirts': translations.tshirts,
      'accessories': translations.accessories,
      'hoodies': translations.hoodies,
      'jackets': translations.jackets,
      'pants': translations.pants
    }
    
    // Return translated version if available, otherwise use original title
    return handleMap[handle] || originalTitle.toUpperCase()
  }

  // Always use dynamic collections with "ALL" as first option
  const collections = [
    // Always include "ALL" as first option
    {
      id: 'all',
      handle: 'all', 
      title: translations.all,
      href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}`
    },
    // Add dynamic collections with proper filter URLs and translations
    ...dynamicCollections.map(collection => ({
      id: collection.handle,
      handle: collection.handle,
      title: getCollectionTitle(collection.handle, collection.title),
      href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=${collection.handle}`
    }))
  ]

  // Handle navigation without prefetch issues
  const handleCollectionClick = useCallback((href: string) => {
    router.push(href)
  }, [router])

  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop view - integrated tabs */}
          <div className="hidden sm:flex justify-center py-4">
            <div className="inline-flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection.href)}
                  className={cn(
                    "relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                    "hover:text-black hover:bg-white",
                    currentCategory === collection.handle
                      ? "bg-black text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:scale-102"
                  )}
                >
                  <span className="relative z-10 uppercase tracking-wider font-mono text-xs sm:text-sm font-semibold">
                    {collection.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile view - modern pill design */}
          <div className="sm:hidden py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection.href)}
                  className={cn(
                    "relative px-4 py-2.5 text-sm font-semibold whitespace-nowrap rounded-full transition-all duration-300 border",
                    "min-w-[80px] flex-shrink-0",
                    currentCategory === collection.handle
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm active:scale-95"
                  )}
                >
                  <span className="uppercase tracking-wide font-mono text-xs font-bold">
                    {collection.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}