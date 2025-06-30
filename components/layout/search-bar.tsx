"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useSearch } from "@/hooks/use-search"
import { formatPrice } from "@/lib/shopify/api"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    query,
    results,
    isLoading,
    error,
    suggestions,
    setSearchQuery,
    addToRecentSearches,
    clearSearch
  } = useSearch()

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        clearSearch()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [clearSearch])

  const handleFocus = () => {
    setIsOpen(true)
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
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/60" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search products..."
          className="pl-10 pr-10 h-10 font-mono text-sm border-2 border-black/20 focus:border-black"
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
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-b border-black/10">
              <p className="text-xs font-bold uppercase tracking-wider mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      addToRecentSearches(suggestion)
                    }}
                    className="font-mono text-xs h-7 px-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query && (
            <div>
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-black/60">Searching...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-black/60">No products found for &quot;{query}&quot;</p>
                </div>
              ) : (
                <>
                  <div className="p-3 border-b border-black/10">
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {results.length} Results
                    </p>
                  </div>
                  <div className="divide-y divide-black/10">
                    {results.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={handleProductClick}
                        className="flex items-center gap-3 p-3 hover:bg-black/5 transition-colors"
                      >
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={product.featuredImage?.url || "/placeholder.svg"}
                            alt={product.featuredImage?.altText || product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-mono text-sm font-bold truncate">
                            {product.title}
                          </h4>
                          {product.priceRange && (
                            <p className="font-mono text-sm">
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
                      className="block p-3 text-center text-sm font-mono font-bold hover:bg-black/5 transition-colors border-t border-black/10"
                    >
                      View all {results.length} results
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}