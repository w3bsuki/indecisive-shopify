'use client'

import { useState } from 'react'
import { Filter, ArrowUpDown } from 'lucide-react'
import { FilterDrawer } from './filter-drawer'
import { SortDrawer } from './sort-drawer'

interface MobileRefineBarProps {
  totalCount: number
}

export function MobileRefineBar({ totalCount }: MobileRefineBarProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [showSortDrawer, setShowSortDrawer] = useState(false)

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 rounded-t-2xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-full border border-gray-100 bg-white text-sm hover:bg-gray-50"
            aria-label="Open filters"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <div className="px-2 text-xs text-gray-500 select-none">{totalCount} items</div>
          <button
            onClick={() => setShowSortDrawer(true)}
            className="flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-full border border-gray-100 bg-white text-sm hover:bg-gray-50"
            aria-label="Open sort"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
        <div className="h-safe-area-inset-bottom" />
      </div>
      
      {/* Filter Drawer */}
      <FilterDrawer 
        open={showFilterDrawer} 
        onOpenChange={setShowFilterDrawer} 
      />
      
      {/* Sort Drawer */}
      <SortDrawer 
        open={showSortDrawer} 
        onOpenChange={setShowSortDrawer} 
      />
    </>
  )
}
