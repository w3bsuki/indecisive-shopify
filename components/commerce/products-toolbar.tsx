"use client"

import { useEffect, useMemo, useState } from 'react'
import { Filter, ArrowUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { FilterDrawer } from '@/components/commerce/filter-drawer'

interface ProductsToolbarProps {
  totalCount: number
  className?: string
}

export function ProductsToolbar({ totalCount, className = '' }: ProductsToolbarProps) {
  const t = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Allow global trigger (from mobile refine bar) to open the drawer
  useEffect(() => {
    const handler = () => setFiltersOpen(true)
    window.addEventListener('open-filters', handler)
    return () => window.removeEventListener('open-filters', handler)
  }, [])

  const sort = searchParams.get('sort') || 'created-desc'
  const colors = (searchParams.get('colors') || '').split(',').filter(Boolean)
  const sizes = (searchParams.get('sizes') || '').split(',').filter(Boolean)
  const availability = (searchParams.get('availability') || '').split(',').filter(Boolean)
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const activeFiltersCount = (colors.length + sizes.length + availability.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0))

  const showingText = useMemo(() => {
    // For simplicity on SSR, we only show total count; pagination details already render elsewhere
    const label = t('itemsLabel') || 'items'
    return `${totalCount} ${label}`
  }, [totalCount, t])

  const updateQuery = (key: string, value?: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value.length) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }





  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between gap-3 py-2">
        {/* Left: Mobile actions (Filters + Sort) */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 h-9 rounded-full border border-gray-100 bg-white/90 backdrop-blur px-3 text-xs hover:bg-gray-50"
          >
            <Filter className="w-3.5 h-3.5" />
            {t('filters.title') || 'Filters'}
            {activeFiltersCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-black text-white text-[10px] px-1">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 h-9 rounded-full border border-gray-100 bg-white/90 backdrop-blur px-3 text-xs hover:bg-gray-50"
            aria-label={t('filters.sortBy') || 'Sort By'}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {t('filters.sortBy') || 'Sort'}
          </button>
          <span className="ml-1 text-[11px] text-gray-500">{showingText}</span>
        </div>

        {/* Left (desktop): Filters button only */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 h-9 rounded-full border border-gray-100 bg-white/90 backdrop-blur px-3 text-sm hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          {t('filters.title') || 'Filters'}
          {activeFiltersCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-black text-white text-[10px] px-1">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Center: Spacer (removed quick toggles) */}
        <div className="flex-1"></div>

        {/* Right: Sort + Count */}
        <div className="inline-flex items-center gap-3">
          <div className="hidden sm:block text-sm text-gray-600 font-medium select-none">
            {showingText}
          </div>
          <label htmlFor="sort" className="hidden sm:block text-xs text-gray-500">
            {t('filters.sortBy') || 'Sort By'}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateQuery('sort', e.target.value)}
            className="hidden sm:block h-9 rounded-full border border-gray-100 bg-white/90 backdrop-blur px-3 text-sm focus:outline-none hover:bg-gray-50"
            aria-label={t('filters.sortBy') || 'Sort By'}
          >
            <option value="created-desc">{t('filters.sort.createdDesc') || 'Newest First'}</option>
            <option value="price-asc">{t('filters.sort.priceAsc') || 'Price: Low to High'}</option>
            <option value="price-desc">{t('filters.sort.priceDesc') || 'Price: High to Low'}</option>
            <option value="name-asc">{t('filters.sort.nameAsc') || 'Name: A-Z'}</option>
            <option value="name-desc">{t('filters.sort.nameDesc') || 'Name: Z-A'}</option>
          </select>
        </div>
      </div>
      <FilterDrawer open={filtersOpen} onOpenChange={setFiltersOpen} />
    </div>
  )
}
