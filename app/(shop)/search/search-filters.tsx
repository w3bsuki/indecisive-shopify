'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

const categoryOptions = [
  { value: '', label: 'All Categories' },
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
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
          Sort By
        </h3>
        <RadioGroup
          value={currentSort}
          onValueChange={(value) => updateFilter('sort', value)}
        >
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="font-mono text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
          Category
        </h3>
        <RadioGroup
          value={currentCategory}
          onValueChange={(value) => updateFilter('category', value)}
        >
          {categoryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option.value} id={`cat-${option.value}`} />
              <Label htmlFor={`cat-${option.value}`} className="font-mono text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {(currentSort !== 'relevance' || currentCategory) && (
        <div className="border-t border-black/10 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full font-mono text-xs"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}