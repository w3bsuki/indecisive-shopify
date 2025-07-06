'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
import { SlidersHorizontal, Filter } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTranslations } from 'next-intl'

export function SearchFiltersTranslated() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const t = useTranslations()
  const [accordionValue, setAccordionValue] = useState<string | undefined>("filters")
  
  const currentSort = searchParams.get('sort') || 'relevance'
  const currentCategory = searchParams.get('category') || ''
  const query = searchParams.get('q') || ''

  const sortOptions = [
    { value: 'relevance', label: t('filters.sort.relevance') || 'Relevance' },
    { value: 'price-asc', label: t('filters.sort.priceAsc') || 'Price: Low to High' },
    { value: 'price-desc', label: t('filters.sort.priceDesc') || 'Price: High to Low' },
    { value: 'name-asc', label: t('filters.sort.nameAsc') || 'Name: A-Z' },
    { value: 'name-desc', label: t('filters.sort.nameDesc') || 'Name: Z-A' },
  ]

  const categoryOptions = [
    { value: '', label: t('filters.categories.all') || 'All Categories' },
    { value: 'T-Shirts', label: t('filters.categories.tshirts') || 'T-Shirts' },
    { value: 'Hoodies', label: t('filters.categories.hoodies') || 'Hoodies' },
    { value: 'Jackets', label: t('filters.categories.jackets') || 'Jackets' },
    { value: 'Pants', label: t('filters.categories.pants') || 'Pants' },
    { value: 'Accessories', label: t('filters.categories.accessories') || 'Accessories' },
  ]

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const url = key === 'category' || key === 'sort' ? '/products' : '/search'
    router.push(`${url}?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/products')
  }

  const hasActiveFilters = currentSort !== 'relevance' || currentCategory

  // Auto-collapse filters on scroll (desktop only)
  useEffect(() => {
    if (isMobile) return

    let scrollTimer: NodeJS.Timeout

    const handleScroll = () => {
      // Clear previous timer
      clearTimeout(scrollTimer)

      // Close accordion immediately on scroll
      setAccordionValue(undefined)

      // Reopen accordion after scrolling stops (300ms delay)
      scrollTimer = setTimeout(() => {
        setAccordionValue("filters")
      }, 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [isMobile])

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort Options */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700">
          {t('filters.sortBy') || 'Sort By'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('sort', option.value)}
              className={cn(
                "font-mono text-xs h-9 px-3 transition-all justify-start",
                currentSort === option.value
                  ? "bg-black text-white border-black"
                  : "hover:border-black hover:bg-black/5"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700">
          {t('filters.categories.title') || 'Categories'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentCategory === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', option.value)}
              className={cn(
                "font-mono text-xs h-9 px-3 transition-all justify-start",
                currentCategory === option.value
                  ? "bg-black text-white border-black"
                  : "hover:border-black hover:bg-black/5"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="font-mono text-xs h-9 px-4 border-black hover:bg-black hover:text-white transition-all w-full md:w-auto"
          >
            {t('filters.clearAll') || 'Clear All Filters'}
          </Button>
        </div>
      )}
    </div>
  )

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <div className="mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-12 font-mono text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('filters.title') || 'Filters & Sort'}
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                  {t('filters.active') || 'Active'}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="font-mono uppercase">{t('filters.title') || 'Filters & Sort'}</SheetTitle>
              <SheetDescription>
                {t('filters.subtitle') || 'Refine your product search'}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // Desktop: Use Accordion
  return (
    <div className="bg-white border-2 border-black/10 shadow-sm mb-6">
      <Accordion 
        type="single" 
        collapsible 
        value={accordionValue} 
        onValueChange={setAccordionValue}
        className="w-full"
      >
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-mono font-bold text-sm uppercase tracking-wider">
                {t('filters.title') || 'Filters & Sort'}
              </span>
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs font-mono rounded-full">
                  {t('filters.active') || 'Active'}
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