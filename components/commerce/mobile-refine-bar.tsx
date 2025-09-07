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
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-gray-200 rounded-t-radius-lg shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 sheet-safe-bottom">
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-radius-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-colors duration-fast touch-manipulation"
            aria-label="Open filters"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <div className="px-3 text-xs text-gray-600 select-none font-medium">{totalCount} items</div>
          <button
            onClick={() => setShowSortDrawer(true)}
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-radius-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-colors duration-fast touch-manipulation"
            aria-label="Open sort"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
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
