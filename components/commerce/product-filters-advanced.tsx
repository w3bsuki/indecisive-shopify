'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal, Filter, X } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
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

const categoryOptionsValues = [
  '',
  'T-Shirts',
  'Hoodies',
  'Jackets',
  'Pants',
  'Accessories',
  'Hats',
  'Bags',
]

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

interface ProductFiltersAdvancedProps {
  className?: string
}

export function ProductFiltersAdvanced({ className }: ProductFiltersAdvancedProps) {
  const t = useTranslations('products.filters')
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  
  const [priceRange, setPriceRange] = useState([0, 200])
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  
  // Create translated options arrays
  const sortOptions = sortOptionsValues.map(value => {
    const translationKey = value === 'relevance' ? 'relevance' :
      value === 'price-asc' ? 'priceAsc' :
      value === 'price-desc' ? 'priceDesc' :
      value === 'name-asc' ? 'nameAsc' :
      value === 'name-desc' ? 'nameDesc' :
      'createdDesc'
    return { value, label: t(`sort.${translationKey}`) }
  })
  
  const categoryOptions = categoryOptionsValues.map(value => {
    if (value === '') return { value: '', label: t('category.all') }
    const translationKey = value.toLowerCase().replace('-', '')
    return { value, label: t(`category.${translationKey}`) }
  })
  
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

  const activeFilterCount = [
    currentSort !== 'relevance' ? 1 : 0,
    currentCategory ? 1 : 0,
    currentColors.length,
    currentSizes.length,
    currentAvailability.length,
    (currentMinPrice > 0 || currentMaxPrice < 200) ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0)

  const toggleArrayFilter = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilter(key, newValues)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
          {t('sortBy')}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="touch"
              onClick={() => updateFilter('sort', option.value)}
              className={cn(
                "font-mono text-xs min-h-[44px] px-3 transition-all justify-start touch-optimized",
                currentSort === option.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:border-primary hover:bg-accent"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
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
          <div className="flex justify-between mt-2 text-sm text-muted-foreground font-mono">
            <span>{formatPrice(priceRange[0], 'USD')}</span>
            <span>{formatPrice(priceRange[1], 'USD')}</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
          {t('categories')}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentCategory === option.value ? "default" : "outline"}
              size="touch"
              onClick={() => updateFilter('category', option.value)}
              className={cn(
                "font-mono text-xs min-h-[44px] px-3 transition-all justify-start touch-optimized",
                currentCategory === option.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:border-primary hover:bg-accent"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
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
                  "relative group flex flex-col items-center gap-2 p-2 rounded transition-all",
                  isSelected ? "bg-black/5" : "hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    isSelected 
                      ? "border-black ring-2 ring-black ring-offset-2" 
                      : "border-gray-300 group-hover:border-gray-400",
                    color.value === 'white' && "border-gray-400"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span className={cn(
                  "text-xs font-mono transition-colors",
                  isSelected ? "text-black font-bold" : "text-gray-600"
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
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
          {t('sizes')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {sizeOptions.map((size) => (
            <Button
              key={size.value}
              variant={currentSizes.includes(size.value) ? "default" : "outline"}
              size="touch"
              onClick={() => toggleArrayFilter('sizes', size.value, currentSizes)}
              className={cn(
                "font-mono text-xs h-9 px-3 transition-all",
                currentSizes.includes(size.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:border-primary hover:bg-accent"
              )}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
          {t('availability')}
        </h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => {
            const isChecked = currentAvailability.includes(option.value)
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={isChecked}
                  onCheckedChange={() => toggleArrayFilter('availability', option.value, currentAvailability)}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-mono cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="font-mono text-xs h-9 px-4 border-black hover:bg-black hover:text-white transition-all w-full"
          >
            <X className="w-4 h-4 mr-2" />
            {t('clearAll')}
          </Button>
        </div>
      )}
    </div>
  )

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <div className={cn("mb-4", className)}>
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-12 font-mono text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('filtersAndSort')}
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[75vh] max-h-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-mono uppercase">{t('filtersAndSort')}</SheetTitle>
              <SheetDescription>
                {t('refineSearch')}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // Desktop: Use Accordion
  return (
    <div className={cn("bg-white border-2 border-black/10 shadow-sm mb-6", className)}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-mono font-bold text-sm uppercase tracking-wider">
                {t('title')}
              </span>
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs font-mono rounded-full">
                  {t('activeCount', { count: activeFilterCount })}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <FilterContent />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}