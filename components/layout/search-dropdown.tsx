'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Money } from '@/components/commerce/money'
import { useMarket } from '@/hooks/use-market'
import { getProducts } from '@/lib/shopify/api'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { market } = useMarket()
  const t = useTranslations('search')

  // Popular collections/categories with images
  const popularCollections = [
    { 
      name: 'Шапки', 
      href: '/products?category=bucket-hats',
      emoji: '🧢',
      description: 'Bucket hats'
    },
    { 
      name: 'Тениски', 
      href: '/products?category=tees',
      emoji: '👕',
      description: 'Tees & shirts'
    },
    { 
      name: 'Чанти', 
      href: '/products?category=tote-bags',
      emoji: '🎒',
      description: 'Tote bags'
    },
  ]

  // Popular searches
  const popularSearches = [
    'черно', 'бяло', 'шапка', 'тениска', 'чанта', 'хулиганка'
  ]

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search products when query changes
  useEffect(() => {
    const searchDebounced = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      console.log('Searching for:', query)
      try {
        let searchResponse = await getProducts(6, query, market)
        let searchResults = searchResponse?.edges?.map(edge => edge.node) || []
        
        // If no results with Cyrillic, try Latin equivalent (Ху -> Hu)
        if (searchResults.length === 0 && /[а-яё]/i.test(query)) {
          const latinQuery = query.replace(/х/gi, 'h').replace(/у/gi, 'u')
          if (latinQuery !== query) {
            searchResponse = await getProducts(6, latinQuery, market)
            searchResults = searchResponse?.edges?.map(edge => edge.node) || []
          }
        }
        
        setResults(searchResults)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchDebounced, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleClearSearch = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200"
        >
          <Search className="h-5 w-5 stroke-[1.5]" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="center"
        side="bottom"
        className={cn(
          "max-w-md p-0 mt-1 border border-gray-200 shadow-xl bg-white rounded-xl overflow-hidden animate-none",
          "w-[calc(100vw-32px)] mx-4"
        )}
        sideOffset={8}
      >
        {/* Search Header */}
        <div className="px-4 py-3 border-b bg-gray-50/50 relative">
          <div className="flex items-center gap-3 pr-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-8 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : query.trim().length < 2 ? (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('popularCategories')}</h3>
                <div className="space-y-2">
                  {popularCollections.map((collection) => (
                    <Link
                      key={collection.href}
                      href={collection.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                        {collection.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-black">
                          {collection.name}
                        </h4>
                        <p className="text-xs text-gray-500">{collection.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('popularSearches')}</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term)
                        inputRef.current?.focus()
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700 hover:text-black"
                    >
                      🔥 {term}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center pt-2">
                <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-xs text-gray-500">{t('typeToSearch')}</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium mb-1">{t('noResults')}</p>
              <p className="text-xs text-gray-500 mb-4">{t('tryDifferentKeywords')}</p>
              <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  {t('viewAllResults')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {results.map((product) => (
                <div key={product.id} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                  {/* Product Image */}
                  <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${product.handle}`}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <h4 className="text-sm font-medium text-gray-900 truncate hover:text-black transition-colors mb-1">
                        {product.title}
                      </h4>
                      <div className="text-sm text-gray-600">
                        <Money 
                          data={product.priceRange.minVariantPrice} 
                          showDualCurrency={market.countryCode === 'BG'}
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-4 border-t bg-gray-50/50">
            <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setIsOpen(false)}>
              <Button className="w-full h-10 text-sm bg-black hover:bg-gray-800 rounded-xl flex items-center justify-center gap-2 transition-colors">
{t('viewAllResultsFor')} "{query}"
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}