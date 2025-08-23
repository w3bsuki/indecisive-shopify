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
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simplified Desktop view */}
          <div className="hidden sm:flex justify-center py-4">
            <div className="inline-flex items-center gap-1 p-1 bg-white border-2 border-black">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection.href)}
                  className={cn(
                    "relative px-5 py-2 text-sm font-medium transition-all duration-150",
                    currentCategory === collection.handle
                      ? "bg-black text-white"
                      : "text-black hover:bg-gray-100"
                  )}
                >
                  <span className="uppercase tracking-wider font-mono text-xs font-bold">
                    {collection.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Simplified Mobile view */}
          <div className="sm:hidden py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => handleCollectionClick(collection.href)}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-150 border",
                    "min-w-[70px] flex-shrink-0",
                    currentCategory === collection.handle
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black hover:bg-gray-100"
                  )}
                >
                  <span className="uppercase tracking-wider font-mono text-xs font-bold">
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