'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const sortOptions = [
  { value: '', label: 'Recommended' },
  { value: 'created-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

export function SortDrawer({ open, onOpenChange }: SortDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSort, setCurrentSort] = useState(searchParams.get('sort') || '')

  useEffect(() => {
    const handleOpenSort = () => {
      onOpenChange(true)
    }

    window.addEventListener('open-sort', handleOpenSort)
    return () => {
      window.removeEventListener('open-sort', handleOpenSort)
    }
  }, [onOpenChange])

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    
    // Reset to page 1 when changing sort
    params.delete('page')
    
    router.push(`?${params.toString()}`)
    setCurrentSort(value)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">Sort By</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-1 pb-safe">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "w-full px-4 py-3 flex items-center justify-between rounded-xl transition-colors",
                "hover:bg-gray-50 active:bg-gray-100",
                currentSort === option.value && "bg-gray-100"
              )}
            >
              <span className={cn(
                "text-base",
                currentSort === option.value && "font-medium"
              )}>
                {option.label}
              </span>
              {currentSort === option.value && (
                <Check className="w-5 h-5 text-black" />
              )}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}