import { getProducts } from '@/lib/shopify/api'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/shopify/api'

interface SearchResultsProps {
  query?: string
  sort?: string
  category?: string
}

export async function SearchResults({ query, sort, category }: SearchResultsProps) {
  // Build search query with filters
  let searchQuery = query || ''
  if (category) {
    searchQuery = `${searchQuery} product_type:${category}`.trim()
  }

  // Fetch products with search query
  const productsData = await getProducts(50, searchQuery)
  const products = productsData.edges.map(edge => edge.node)

  // Sort products based on sort parameter
  const sortedProducts = [...products]
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

  if (sortedProducts.length === 0) {
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
          {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group"
          >
            <div className="aspect-square relative overflow-hidden border-2 border-black/10 group-hover:border-black/30 transition-colors">
              <Image
                src={product.featuredImage?.url || '/placeholder.svg'}
                alt={product.featuredImage?.altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="font-mono font-bold text-sm line-clamp-1">
                {product.title}
              </h3>
              <p className="font-mono text-sm">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
              {product.variants?.edges?.[0]?.node && (
                <p className="text-xs text-black/60">
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