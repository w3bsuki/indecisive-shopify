'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { formatPrice } from '@/lib/utils/price'

// These arrays will be populated with translated labels inside the component
const sortOptionsValues = [
  'relevance',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'created-desc',
]

// Categories are handled via collection pills, not in filters
// const categoryOptionsValues = [
//   'hats',
//   'tshirts',
//   'bags',
//   'giftcards',
// ]

const colorOptionsData = [
  { value: 'black', hex: '#000000' },
  { value: 'white', hex: '#FFFFFF' },
  { value: 'gray', hex: '#6B7280' },
  { value: 'navy', hex: '#1E3A8A' },
  { value: 'blue', hex: '#3B82F6' },
  { value: 'red', hex: '#EF4444' },
  { value: 'green', hex: '#10B981' },
  { value: 'beige', hex: '#D2B48C' },
]

const sizeOptionsValues = ['xs', 's', 'm', 'l', 'xl', 'xxl']

const availabilityOptionsValues = [
  'in-stock',
  'low-stock',
  'pre-order',
]

export function ProductFiltersContent() {
  const t = useTranslations('products.filters')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState([0, 200])
  
  // Create translated options arrays with icons and short labels
  const sortOptions = sortOptionsValues.map(value => {
    let label = ''
    let icon = null
    let shortLabel = ''
    
    if (value === 'relevance') {
      label = t('sort.relevance')
      shortLabel = t('sort.relevance')
      icon = <ArrowUpDown className="w-3 h-3" />
    } else if (value === 'price-asc') {
      label = t('sort.priceAsc')
      shortLabel = 'ЦЕНА'
      icon = <ArrowUp className="w-3 h-3" />
    } else if (value === 'price-desc') {
      label = t('sort.priceDesc')
      shortLabel = 'ЦЕНА'
      icon = <ArrowDown className="w-3 h-3" />
    } else if (value === 'name-asc') {
      label = t('sort.nameAsc')
      shortLabel = 'ИМЕ'
      icon = <ArrowUp className="w-3 h-3" />
    } else if (value === 'name-desc') {
      label = t('sort.nameDesc')
      shortLabel = 'ИМЕ'
      icon = <ArrowDown className="w-3 h-3" />
    } else {
      label = t('sort.createdDesc')
      shortLabel = 'НОВИ'
      icon = <ArrowDown className="w-3 h-3" />
    }
    
    return { value, label, shortLabel, icon }
  })
  
  // Category options are handled differently in this component
  // const categoryOptions = categoryOptionsValues.map(value => {
  //   if (value === 'hats') return { value, label: 'HATS' }
  //   if (value === 'tshirts') return { value, label: 'TSHIRTS' }
  //   if (value === 'bags') return { value, label: 'BAGS' }
  //   if (value === 'giftcards') return { value, label: 'GIFTCARDS' }
  //   return { value, label: value.toUpperCase() }
  // })
  
  const colorOptions = colorOptionsData.map(({ value, hex }) => ({
    value,
    label: t(`color.${value}`),
    hex
  }))
  
  const sizeOptions = sizeOptionsValues.map(value => ({
    value,
    label: t(`size.${value}`)
  }))
  
  const availabilityOptions = availabilityOptionsValues.map(value => {
    const translationKey = value === 'in-stock' ? 'inStock' :
      value === 'low-stock' ? 'lowStock' :
      'preOrder'
    return { value, label: t(`availabilityOptions.${translationKey}`) }
  })
  
  // Get current filter values
  const currentSort = searchParams.get('sort') || 'relevance'
  const currentCategory = searchParams.get('category') || ''
  const currentColors = searchParams.get('colors')?.split(',').filter(Boolean) || []
  const currentSizes = searchParams.get('sizes')?.split(',').filter(Boolean) || []
  const currentAvailability = searchParams.get('availability')?.split(',').filter(Boolean) || []
  const currentMinPrice = parseInt(searchParams.get('minPrice') || '0')
  const currentMaxPrice = parseInt(searchParams.get('maxPrice') || '200')

  // Initialize price range from URL
  useEffect(() => {
    setPriceRange([currentMinPrice, currentMaxPrice])
  }, [currentMinPrice, currentMaxPrice])

  const updateFilter = (key: string, value: string | string[] | number[]) => {
    const params = new URLSearchParams(searchParams)
    
    if (Array.isArray(value)) {
      if (key === 'priceRange') {
        // Handle price range
        const [min, max] = value as number[]
        if (min > 0) params.set('minPrice', min.toString())
        else params.delete('minPrice')
        if (max < 200) params.set('maxPrice', max.toString())
        else params.delete('maxPrice')
      } else {
        // Handle array values (colors, sizes, etc.)
        if (value.length > 0) {
          params.set(key, value.join(','))
        } else {
          params.delete(key)
        }
      }
    } else {
      // Handle single values
      if (value) {
        params.set(key, value as string)
      } else {
        params.delete(key)
      }
    }
    
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/products')
    setPriceRange([0, 200])
  }

  const hasActiveFilters = 
    currentSort !== 'relevance' || 
    currentCategory || 
    currentColors.length > 0 || 
    currentSizes.length > 0 || 
    currentAvailability.length > 0 ||
    currentMinPrice > 0 || 
    currentMaxPrice < 200

  const toggleArrayFilter = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilter(key, newValues)
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-black">
          {t('sortBy')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const newValue = currentSort === option.value ? 'relevance' : option.value
                updateFilter('sort', newValue)
              }}
              className={cn(
                "font-mono text-xs h-11 px-3 rounded-full transition-colors flex items-center justify-center gap-1.5",
                currentSort === option.value
                  ? "bg-black text-white"
                  : "bg-gray-50 text-black hover:bg-gray-100"
              )}
            >
              {option.icon}
              <span className="truncate font-semibold">{option.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-black">
          {t('priceRange')}
        </h3>
        <div className="px-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={(value) => updateFilter('priceRange', value)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between mt-3 text-sm font-mono font-medium">
            <span className="bg-gray-100 px-3 py-1 rounded-full">{formatPrice(priceRange[0], 'USD')}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">{formatPrice(priceRange[1], 'USD')}</span>
          </div>
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-black">
          {t('colors')}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((color) => {
            const isSelected = currentColors.includes(color.value)
            return (
              <button
                key={color.value}
                onClick={() => toggleArrayFilter('colors', color.value, currentColors)}
                className={cn(
                  "relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                  isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-transform",
                    isSelected 
                      ? "border-black scale-110" 
                      : "border-gray-200 group-hover:border-gray-300",
                    color.value === 'white' && "border-gray-300"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  isSelected ? "text-black" : "text-gray-600"
                )}>
                  {color.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-black">
          {t('sizes')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size.value}
              onClick={() => toggleArrayFilter('sizes', size.value, currentSizes)}
              className={cn(
                "font-mono text-xs h-10 px-3 rounded-full transition-colors font-semibold",
                currentSizes.includes(size.value)
                  ? "bg-black text-white"
                  : "bg-gray-50 text-black hover:bg-gray-100"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-black">
          {t('availability')}
        </h3>
        <div className="space-y-3">
          {availabilityOptions.map((option) => {
            const isChecked = currentAvailability.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('availability', option.value, currentAvailability)}
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left",
                  isChecked ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-lg border-2 transition-colors flex items-center justify-center",
                  isChecked ? "bg-black border-black" : "bg-white border-gray-300"
                )}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={clearFilters}
            className="font-medium text-sm h-12 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all w-full flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {t('clearAll')}
          </button>
        </div>
      )}
    </div>
  )
}
