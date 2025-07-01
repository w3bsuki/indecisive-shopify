'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileSearchSheet } from '@/components/layout/mobile-search-sheet'

export function SearchButton() {
  return (
    <MobileSearchSheet>
      <Button 
        variant="outline" 
        size="sm"
        className="font-mono text-xs h-10 px-4 border border-gray-300 hover:border-gray-950 hover:shadow-md"
      >
        <Search className="h-4 w-4 mr-2" />
        Search Products
      </Button>
    </MobileSearchSheet>
  )
}