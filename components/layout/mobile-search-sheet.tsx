"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearch, getTrendingSearches } from "@/hooks/use-search"
import { formatPrice } from "@/lib/shopify/api"

interface MobileSearchSheetProps {
  children?: React.ReactNode
}

export function MobileSearchSheet({ children }: MobileSearchSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    query,
    results,
    isLoading,
    error,
    suggestions,
    recentSearches,
    setSearchQuery,
    addToRecentSearches,
    clearSearch
  } = useSearch()

  const trendingSearches = getTrendingSearches()

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="hover:bg-black/5 h-11 w-11 sharp-active">
            <Search className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="top" className="w-full h-full font-mono p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-black/10">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="font-mono text-base h-12 border-2 border-black focus:ring-0 focus:border-black pr-10"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          </div>
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearchSelect(suggestion)}
                  className="font-mono text-xs h-7 px-2"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {query.length === 0 ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearchSelect(search)}
                        className="font-mono text-xs border border-black/20 hover:border-black"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <h3 className="font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearchSelect(search)}
                      className="font-mono text-xs border border-black/20 hover:border-black"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">
                {isLoading ? 'Searching...' : `Results for "${query}" (${results.length})`}
              </h3>

              {!isLoading && results.length === 0 ? (
                <p className="text-black/60 text-sm">No products found</p>
              ) : (
                <div className="space-y-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={handleProductClick}
                      className="flex items-center gap-4 p-3 border border-black/10 hover:border-black/30 transition-colors block"
                    >
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={product.featuredImage?.url || "/placeholder.svg"}
                          alt={product.featuredImage?.altText || product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-mono font-bold text-sm">{product.title}</h4>
                        {product.variants?.edges?.[0]?.node && (
                          <>
                            <p className="text-xs text-black/60">
                              {product.variants.edges[0].node.availableForSale ? 'In Stock' : 'Out of Stock'}
                            </p>
                            <p className="font-mono font-bold text-sm">
                              {formatPrice(
                                product.priceRange.minVariantPrice.amount,
                                product.priceRange.minVariantPrice.currencyCode
                              )}
                            </p>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
