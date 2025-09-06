'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SaleFiltersProps {
  className?: string
}

export function SaleFilters({ className }: SaleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentDiscountRange = searchParams.get('discountRange') || 'all'
  
  const discountRanges = [
    { value: 'all', label: 'All Discounts' },
    { value: '0-25', label: 'Up to 25% OFF' },
    { value: '25-50', label: '25-50% OFF' },
    { value: '50-75', label: '50-75% OFF' },
    { value: '75+', label: '75%+ OFF' }
  ]

  const handleDiscountRangeChange = (range: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (range === 'all') {
      params.delete('discountRange')
    } else {
      params.set('discountRange', range)
    }
    
    // Reset to first page when changing filters
    params.delete('page')
    
    router.push(`/sale?${params.toString()}`)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Discount Range Filter */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-px bg-black/30" />
          <h3 className="text-black/80 text-xs font-medium tracking-[0.1em] uppercase">
            DISCOUNT RANGE
          </h3>
          <div className="w-8 h-px bg-black/30" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {discountRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleDiscountRangeChange(range.value)}
              className={cn(
                'min-h-[44px] px-4 py-2.5 text-sm font-medium border transition-all duration-300 rounded-full',
                currentDiscountRange === range.value
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-black/70 border-black/20 hover:border-black/40 hover:bg-black/5 hover:backdrop-blur-sm'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}