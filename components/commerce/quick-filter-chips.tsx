'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface QuickFilterChipsProps {
  className?: string
}

export function QuickFilterChips({ className = '' }: QuickFilterChipsProps) {
  const t = useTranslations('products.filters')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = new URLSearchParams(searchParams.toString())

  const isInStock = (params.get('availability') || '').split(',').filter(Boolean).includes('in-stock')
  const maxPrice = params.get('maxPrice')
  const tags = (params.get('tags') || '').split(',').filter(Boolean)
  const hasSale = tags.includes('sale')

  const updateParam = (updater: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(params.toString())
    updater(p)
    // Reset page on filter change
    p.delete('page')
    router.push(`${pathname}?${p.toString()}`)
  }

  const toggleInStock = () => {
    updateParam((p) => {
      const current = (p.get('availability') || '').split(',').filter(Boolean)
      const next = new Set(current)
      if (next.has('in-stock')) next.delete('in-stock'); else next.add('in-stock')
      const value = Array.from(next).join(',')
      value ? p.set('availability', value) : p.delete('availability')
    })
  }

  const toggleUnder50 = () => {
    updateParam((p) => {
      if (p.get('maxPrice') === '50') p.delete('maxPrice'); else p.set('maxPrice', '50')
    })
  }

  const toggleSale = () => {
    updateParam((p) => {
      const current = (p.get('tags') || '').split(',').filter(Boolean)
      const next = new Set(current)
      if (next.has('sale')) next.delete('sale'); else next.add('sale')
      const value = Array.from(next).join(',')
      value ? p.set('tags', value) : p.delete('tags')
    })
  }

  const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border',
        active ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:bg-gray-50'
      )}
    >
      {label}
    </button>
  )

  return (
    <div className={cn('sm:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1', className)}>
      <Chip active={isInStock} label={t('availabilityOptions.inStock') || 'In Stock'} onClick={toggleInStock} />
      <Chip active={maxPrice === '50'} label={t('priceUnder', { value: 50 }) || 'Under 50'} onClick={toggleUnder50} />
      <Chip active={hasSale} label={t('sale') || 'Sale'} onClick={toggleSale} />
    </div>
  )
}

