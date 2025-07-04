'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'name-asc', label: 'A-Z' },
  { value: 'name-desc', label: 'Z-A' },
]

const categoryOptions = [
  { value: '', label: 'All' },
  { value: 'T-Shirts', label: 'T-Shirts' },
  { value: 'Hoodies', label: 'Hoodies' },
  { value: 'Jackets', label: 'Jackets' },
  { value: 'Pants', label: 'Pants' },
  { value: 'Accessories', label: 'Accessories' },
]

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSort = searchParams.get('sort') || 'relevance'
  const currentCategory = searchParams.get('category') || ''
  const query = searchParams.get('q') || ''

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

  return (
    <div className="bg-white border-b border-black/20 py-4 sticky top-0 z-40 shadow-sm">
      <div className="space-y-4">
        {/* Sort By */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-sm uppercase tracking-wider text-gray-700 mr-2">
            Sort:
          </span>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('sort', option.value)}
              className={cn(
                "font-mono text-xs h-8 px-3 transition-all",
                currentSort === option.value
                  ? "bg-black text-white border-black"
                  : "hover:border-black hover:bg-black/5"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-sm uppercase tracking-wider text-gray-700 mr-2">
            Category:
          </span>
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              variant={currentCategory === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', option.value)}
              className={cn(
                "font-mono text-xs h-8 px-3 transition-all",
                currentCategory === option.value
                  ? "bg-black text-white border-black"
                  : "hover:border-black hover:bg-black/5"
              )}
            >
              {option.label}
            </Button>
          ))}
          
          {/* Clear Filters */}
          {(currentSort !== 'relevance' || currentCategory) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="font-mono text-xs h-8 px-3 text-gray-500 hover:text-black ml-4"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}