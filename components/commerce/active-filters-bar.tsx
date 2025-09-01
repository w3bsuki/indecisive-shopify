'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ActiveFiltersBarProps {
  className?: string
}

export function ActiveFiltersBar({ className = '' }: ActiveFiltersBarProps) {
  const t = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const colors = (searchParams.get('colors') || '').split(',').filter(Boolean)
  const sizes = (searchParams.get('sizes') || '').split(',').filter(Boolean)
  const availability = (searchParams.get('availability') || '').split(',').filter(Boolean)
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const hasFilters = colors.length || sizes.length || availability.length || minPrice || maxPrice

  const removeFromCsv = (csv: string, value: string) => {
    const parts = csv.split(',').filter(Boolean)
    const next = parts.filter(p => p.toLowerCase() !== value.toLowerCase())
    return next.join(',')
  }

  const updateParams = (updater: (sp: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    updater(params)
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => {
    updateParams((params) => {
      params.delete('colors')
      params.delete('sizes')
      params.delete('availability')
      params.delete('minPrice')
      params.delete('maxPrice')
      params.delete('page')
    })
  }

  const chips = useMemo(() => {
    const items: Array<{ key: string; label: string; onRemove: () => void }> = []
    colors.forEach((c) => {
      items.push({
        key: `color-${c}`,
        label: `${t('filters.colors') || 'Colors'}: ${c}`,
        onRemove: () => updateParams((p) => {
          const next = removeFromCsv(p.get('colors') || '', c)
          if (next) {
            p.set('colors', next)
          } else {
            p.delete('colors')
          }
          p.delete('page')
        })
      })
    })
    sizes.forEach((s) => {
      items.push({
        key: `size-${s}`,
        label: `${t('filters.sizes') || 'Sizes'}: ${s}`,
        onRemove: () => updateParams((p) => {
          const next = removeFromCsv(p.get('sizes') || '', s)
          if (next) {
            p.set('sizes', next)
          } else {
            p.delete('sizes')
          }
          p.delete('page')
        })
      })
    })
    availability.forEach((a) => {
      const map: Record<string, string> = {
        'in-stock': t('filters.availabilityOptions.inStock') || 'In Stock',
        'low-stock': t('filters.availabilityOptions.lowStock') || 'Low Stock',
        'pre-order': t('filters.availabilityOptions.preOrder') || 'Pre-Order',
      }
      items.push({
        key: `avail-${a}`,
        label: `${t('filters.availability') || 'Availability'}: ${map[a] || a}`,
        onRemove: () => updateParams((p) => {
          const next = removeFromCsv(p.get('availability') || '', a)
          if (next) {
            p.set('availability', next)
          } else {
            p.delete('availability')
          }
          p.delete('page')
        })
      })
    })
    if (minPrice || maxPrice) {
      const label = `${t('filters.priceRange') || 'Price Range'}: ${minPrice || '0'} — ${maxPrice || '∞'}`
      items.push({
        key: 'price',
        label,
        onRemove: () => updateParams((p) => {
          p.delete('minPrice')
          p.delete('maxPrice')
          p.delete('page')
        })
      })
    }
    return items
  }, [colors, sizes, availability, minPrice, maxPrice, t, updateParams])

  if (!hasFilters) return null

  return (
    <div className={cn('w-full bg-white/80', className)}>
      <div className="flex items-center justify-between gap-2 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="group inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
              aria-label={`Remove ${chip.label}`}
            >
              <span className="truncate max-w-[50vw] sm:max-w-none">{chip.label}</span>
              <span className="text-gray-400 group-hover:text-gray-600">×</span>
            </button>
          ))}
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-gray-500 hover:text-black underline underline-offset-2"
        >
          {t('filters.clearAll') || 'Clear All Filters'}
        </button>
      </div>
    </div>
  )
}
