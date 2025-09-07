'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '@/lib/shopify/api'
import Image from 'next/image'
import Link from 'next/link'
import { useMarket } from '@/hooks/use-market'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface SearchResultsProps {
  query?: string
  sort?: string
  category?: string
}

export function SearchResults({ query, sort, category }: SearchResultsProps) {
  const { formatPrice } = useMarket()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Build search query with filters
        let searchQuery = query || ''
        if (category) {
          searchQuery = `${searchQuery} product_type:${category}`.trim()
        }

        // Fetch products with search query
        const productsData = await getProducts(50, searchQuery)
        const fetchedProducts = productsData.edges.map(edge => edge.node)

        // Sort products based on sort parameter
        const sortedProducts = [...fetchedProducts]
        if (sort === 'price-asc') {
          sortedProducts.sort((a, b) => 
            parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
          )
        } else if (sort === 'price-desc') {
          sortedProducts.sort((a, b) => 
            parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
          )
        } else if (sort === 'name-asc') {
          sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sort === 'name-desc') {
          sortedProducts.sort((a, b) => b.title.localeCompare(a.title))
        }

        setProducts(sortedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [query, sort, category])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-black/60 font-mono">Loading...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-black/60 font-mono">
          {query ? `No products found for "${query}"` : 'No products found'}
        </p>
        <Link 
          href="/products" 
          className="inline-block mt-4 font-mono text-sm underline"
        >
          Browse all products
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/60 font-mono">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group touch-manipulation"
          >
            <div className="aspect-square relative overflow-hidden rounded-radius-lg bg-gray-50 border border-gray-200 group-hover:border-gray-300 group-hover:shadow-md transition-all duration-fast">
              <Image
                src={product.featuredImage?.url || '/placeholder.svg'}
                alt={product.featuredImage?.altText || product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-slow"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
            <div className="mt-3 space-y-1 px-1">
              <h3 className="text-product-name line-clamp-2 group-hover:text-black transition-colors duration-fast">
                {product.title}
              </h3>
              <p className="text-price">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
              {product.variants?.edges?.[0]?.node && (
                <p className="text-caption text-gray-500">
                  {product.variants.edges[0].node.availableForSale ? 'In Stock' : 'Out of Stock'}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}