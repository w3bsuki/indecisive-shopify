'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'

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
    'cropTops': locale === 'bg' ? 'КРОП-ТОПОВЕ' : 'CROP TOPS',
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
      'crop-tops': translations.cropTops,
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

  // Standardize collection handle for routing (e.g., unify tees variants)
  const standardizeHandle = (handle: string): string => {
    const h = handle.toLowerCase()
    if (h === 'tees' || h === 'tees-1' || h === 'tshirts') return 'tshirts'
    return h
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
    ...dynamicCollections.map(collection => {
      const normalized = standardizeHandle(collection.handle)
      return ({
        id: collection.handle,
        handle: normalized,
        title: getCollectionTitle(collection.handle, collection.title),
        href: `${variant === 'new' ? '/new' : variant === 'sale' ? '/sale' : '/products'}?category=${normalized}`
      })
    })
  ]

  // 1) Deduplicate by displayed title to avoid duplicate pills (e.g., 'tees' & 'tees-1' both "T-SHIRTS")
  const seenTitles = new Set<string>()
  const uniqueCollections = collections.filter((c) => {
    const key = (c.title || '').toUpperCase().trim()
    if (seenTitles.has(key)) return false
    seenTitles.add(key)
    return true
  })

  // 2) Sort for better UX: ALL, T-SHIRTS, CROP TOPS, HATS, BAGS, then others A→Z
  const weight = (handle: string, title: string) => {
    const h = handle.toLowerCase()
    const t = (title || '').toLowerCase()
    if (h === 'all') return 0
    const isTees = h.includes('tee') || h === 'tshirts'
    const isCrop = h === 'crop-tops'
    const isHats = h.includes('hat') || h === 'caps' || t.includes('hat')
    const isBags = h.includes('bag') || t.includes('bag')
    if (isTees) return 1
    if (isCrop) return 2
    if (isHats) return 3
    if (isBags) return 4
    return 10
  }

  const [first, ...rest] = uniqueCollections
  const sortedCollections = [
    first,
    ...rest.sort((a, b) => {
      const wa = weight(a.handle, a.title)
      const wb = weight(b.handle, b.title)
      if (wa !== wb) return wa - wb
      return a.title.localeCompare(b.title)
    })
  ]

  // Handle navigation without prefetch issues
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null)

  const handleCollectionClick = useCallback((href: string) => {
    router.push(href)
  }, [router])

  // Center the active pill on mobile once to avoid left-bias
  useEffect(() => {
    const scroller = mobileScrollerRef.current
    if (!scroller) return
    const active = scroller.querySelector<HTMLButtonElement>('button[aria-current="page"]')
    if (!active) return
    const scrollerMid = scroller.clientWidth / 2
    const activeMid = active.offsetLeft + active.offsetWidth / 2
    scroller.scrollLeft = Math.max(0, activeMid - scrollerMid)
  }, [])

  return (
    <div className={cn('w-full', className)}>
      {/* Container panel for category pills (use parent container width; no extra padding) */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {/* Desktop: align perfectly with container; no edge hacks */}
            <div className="hidden sm:flex justify-start py-3 px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Product categories">
              <div className="flex flex-wrap items-center justify-start gap-3 w-full">
                {sortedCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionClick(collection.href)}
                    className={cn(
                      "relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                      currentCategory === collection.handle
                        ? "bg-black text-white"
                        : "bg-gray-50 text-black hover:bg-gray-100 border border-gray-100"
                  )}
                    aria-current={currentCategory === collection.handle ? 'page' : undefined}
                  >
                    <span className="uppercase tracking-wider font-mono text-xs font-bold">
                      {collection.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: horizontal scroll with consistent side padding */}
            <div className="sm:hidden py-3" role="navigation" aria-label="Product categories">
              <div ref={mobileScrollerRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-4" style={{ scrollPaddingLeft: '16px', scrollPaddingRight: '16px' }}>
                {sortedCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionClick(collection.href)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                      "min-w-[70px] flex-shrink-0",
                    currentCategory === collection.handle
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-100"
                  )}
                    aria-current={currentCategory === collection.handle ? 'page' : undefined}
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
  )
}
