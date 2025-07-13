'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  Search, Filter, X, ChevronDown, Star, 
  SlidersHorizontal, Grid, List, ArrowUpDown,
  Tag, Palette, Ruler, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FilterState {
  query: string
  priceRange: [number, number]
  categories: string[]
  sizes: string[]
  colors: string[]
  brands: string[]
  rating: number
  availability: 'all' | 'instock' | 'sale'
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'bestselling' | 'rating'
}

// interface FilterOption {
//   label: string
//   value: string
//   count?: number
//   color?: string
// }

const mockFilterOptions = {
  categories: [
    { label: 'T-Shirts', value: 'tshirts', count: 125 },
    { label: 'Hoodies', value: 'hoodies', count: 78 },
    { label: 'Jeans', value: 'jeans', count: 92 },
    { label: 'Jackets', value: 'jackets', count: 45 },
    { label: 'Accessories', value: 'accessories', count: 156 }
  ],
  sizes: [
    { label: 'XS', value: 'xs', count: 45 },
    { label: 'S', value: 's', count: 123 },
    { label: 'M', value: 'm', count: 167 },
    { label: 'L', value: 'l', count: 145 },
    { label: 'XL', value: 'xl', count: 89 },
    { label: 'XXL', value: 'xxl', count: 34 }
  ],
  colors: [
    { label: 'Black', value: 'black', count: 89, color: '#000000' },
    { label: 'White', value: 'white', count: 76, color: '#FFFFFF' },
    { label: 'Navy', value: 'navy', count: 54, color: '#1e3a8a' },
    { label: 'Gray', value: 'gray', count: 67, color: '#6b7280' },
    { label: 'Blue', value: 'blue', count: 43, color: '#3b82f6' },
    { label: 'Red', value: 'red', count: 32, color: '#ef4444' },
    { label: 'Green', value: 'green', count: 28, color: '#10b981' },
    { label: 'Pink', value: 'pink', count: 21, color: '#ec4899' }
  ],
  brands: [
    { label: 'Indecisive Wear', value: 'indecisive-wear', count: 234 },
    { label: 'Urban Basic', value: 'urban-basic', count: 123 },
    { label: 'Street Style', value: 'street-style', count: 89 },
    { label: 'Minimal Co.', value: 'minimal-co', count: 67 }
  ]
}

const sortOptions = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Best Selling', value: 'bestselling' },
  { label: 'Highest Rated', value: 'rating' }
]

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults?: number
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  className?: string
}

export function AdvancedSearchFilters({
  onFiltersChange,
  totalResults = 0,
  viewMode = 'grid',
  onViewModeChange,
  className
}: AdvancedSearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    priceRange: [0, 200],
    categories: [],
    sizes: [],
    colors: [],
    brands: [],
    rating: 0,
    availability: 'all',
    sortBy: 'relevance'
  })

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState(new Set(['categories', 'price']))

  // Debounced filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, onFiltersChange])

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const toggleArrayFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return { ...prev, [key]: newArray }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      priceRange: [0, 200],
      categories: [],
      sizes: [],
      colors: [],
      brands: [],
      rating: 0,
      availability: 'all',
      sortBy: 'relevance'
    })
  }, [])

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++
    count += filters.categories.length
    count += filters.sizes.length
    count += filters.colors.length
    count += filters.brands.length
    if (filters.rating > 0) count++
    if (filters.availability !== 'all') count++
    return count
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    children, 
    sectionKey 
  }: { 
    title: string
    icon: any
    children: React.ReactNode
    sectionKey: string 
  }) => (
    <Collapsible
      open={expandedSections.has(sectionKey)}
      onOpenChange={() => toggleSection(sectionKey)}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 px-1 rounded">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="font-medium">{title}</span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          expandedSections.has(sectionKey) && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <FilterSection title="Price Range" icon={DollarSign} sectionKey="price">
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={200}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Categories" icon={Tag} sectionKey="categories">
        <div className="space-y-2">
          {mockFilterOptions.categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.categories.includes(category.value)}
                onCheckedChange={() => toggleArrayFilter('categories', category.value)}
              />
              <Label 
                htmlFor={`category-${category.value}`}
                className="flex-1 flex justify-between cursor-pointer"
              >
                <span>{category.label}</span>
                <span className="text-sm text-gray-500">({category.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Sizes" icon={Ruler} sectionKey="sizes">
        <div className="flex flex-wrap gap-2">
          {mockFilterOptions.sizes.map((size) => (
            <Button
              key={size.value}
              variant={filters.sizes.includes(size.value) ? "default" : "outline"}
              size="sm"
              className="h-8 w-12"
              onClick={() => toggleArrayFilter('sizes', size.value)}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" icon={Palette} sectionKey="colors">
        <div className="grid grid-cols-4 gap-3">
          {mockFilterOptions.colors.map((color) => (
            <button
              key={color.value}
              onClick={() => toggleArrayFilter('colors', color.value)}
              className={cn(
                "relative w-10 h-10 rounded-full border-2 transition-all",
                filters.colors.includes(color.value)
                  ? "border-gray-900 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.color }}
              title={color.label}
            >
              {color.value === 'white' && (
                <div className="absolute inset-1 rounded-full border border-gray-200" />
              )}
              {filters.colors.includes(color.value) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    color.value === 'white' || color.value === 'yellow' ? "bg-gray-900" : "bg-white"
                  )} />
                </div>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" icon={Tag} sectionKey="brands">
        <div className="space-y-2">
          {mockFilterOptions.brands.map((brand) => (
            <div key={brand.value} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.value}`}
                checked={filters.brands.includes(brand.value)}
                onCheckedChange={() => toggleArrayFilter('brands', brand.value)}
              />
              <Label 
                htmlFor={`brand-${brand.value}`}
                className="flex-1 flex justify-between cursor-pointer"
              >
                <span>{brand.label}</span>
                <span className="text-sm text-gray-500">({brand.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating" icon={Star} sectionKey="rating">
        <RadioGroup
          value={filters.rating.toString()}
          onValueChange={(value) => updateFilters({ rating: parseInt(value) })}
        >
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" icon={Filter} sectionKey="availability">
        <RadioGroup
          value={filters.availability}
          onValueChange={(value) => updateFilters({ availability: value as any })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="availability-all" />
            <Label htmlFor="availability-all">All Products</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="instock" id="availability-instock" />
            <Label htmlFor="availability-instock">In Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sale" id="availability-sale" />
            <Label htmlFor="availability-sale">On Sale</Label>
          </div>
        </RadioGroup>
      </FilterSection>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full"
        disabled={getActiveFiltersCount() === 0}
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Controls Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10 form-field-enhanced"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Filters */}
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with these filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilters({ sortBy: option.value as any })}
                  className={cn(
                    filters.sortBy === option.value && "bg-gray-100"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="hidden sm:flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.query}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilters({ query: '' })}
              />
            </Badge>
          )}
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {mockFilterOptions.categories.find(c => c.value === category)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('categories', category)}
              />
            </Badge>
          ))}
          {filters.sizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1">
              Size: {size.toUpperCase()}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('sizes', size)}
              />
            </Badge>
          ))}
          {filters.colors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-1">
              {mockFilterOptions.colors.find(c => c.value === color)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleArrayFilter('colors', color)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {totalResults.toLocaleString()} product{totalResults !== 1 ? 's' : ''} found
          {getActiveFiltersCount() > 0 && ` with ${getActiveFiltersCount()} filter${getActiveFiltersCount() !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Desktop Filters Sidebar */}
      <div className="flex gap-6">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-4 bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </div>
            <FiltersContent />
          </div>
        </div>

        {/* This would be where your product grid/list goes */}
        <div className="flex-1">
          {/* Product grid component would go here */}
        </div>
      </div>
    </div>
  )
}