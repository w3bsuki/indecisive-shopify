"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2, X, TrendingUp, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useSearch, getTrendingSearches } from "@/hooks/use-search"
import { useMarket } from "@/hooks/use-market"
import { cn } from "@/lib/utils"

export function MobileSearchDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { formatPrice } = useMarket()
  const {
    query,
    results,
    isLoading,
    error,
    recentSearches,
    setSearchQuery,
    addToRecentSearches,
    clearSearch
  } = useSearch()

  const trendingSearches = getTrendingSearches()

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      clearSearch()
    }
  }

  const handleSearchSelect = (searchTerm: string) => {
    setSearchQuery(searchTerm)
    addToRecentSearches(searchTerm)
  }

  const handleProductClick = () => {
    if (query) {
      addToRecentSearches(query)
    }
    setIsOpen(false)
    clearSearch()
  }

  const handleClear = () => {
    clearSearch()
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button */}
      <button 
        onClick={handleToggle}
        className="relative h-10 w-10 flex items-center justify-center transition-all duration-200 active:scale-95"
      >
        {isOpen ? (
          <X className="h-5 w-5 stroke-[1.5]" />
        ) : (
          <Search className="h-5 w-5 stroke-[1.5]" />
        )}
        <span className="sr-only">Search</span>
      </button>

      {/* Dropdown Container */}
      <div 
        className={cn(
          "fixed top-[70px] left-3 right-3 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-[380px] bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden transition-all duration-200 z-50",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        {/* Search Input */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-10 h-10 font-mono text-sm border border-gray-300 focus:border-black"
            />
            {isLoading && (
              <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {query.length === 0 ? (
            <div className="p-3 space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-gray-600">
                    <Clock className="h-3 w-3" />
                    Recent
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.slice(0, 5).map((search) => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearchSelect(search)}
                        className="font-mono text-xs h-7 px-2 border-gray-300 hover:border-black"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-gray-600">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {trendingSearches.slice(0, 6).map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearchSelect(search)}
                      className="font-mono text-xs h-7 px-2 border-gray-300 hover:border-black"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Searching...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-600">No products found</p>
                </div>
              ) : (
                <>
                  <div className="p-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100">
                    {results.length} Results
                  </div>
                  <div className="divide-y divide-gray-100">
                    {results.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={handleProductClick}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.featuredImage?.url || "/placeholder.svg"}
                            alt={product.featuredImage?.altText || product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-mono text-sm font-medium line-clamp-1">
                            {product.title}
                          </h4>
                          {product.priceRange && (
                            <p className="font-mono text-sm font-bold">
                              {formatPrice(
                                product.priceRange.minVariantPrice.amount,
                                product.priceRange.minVariantPrice.currencyCode
                              )}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  {results.length > 5 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={handleProductClick}
                      className="block p-3 text-center text-xs font-mono font-bold hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      View all {results.length} results
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}