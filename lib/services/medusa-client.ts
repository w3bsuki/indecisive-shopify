// Medusa API client for server-side data fetching
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string
  thumbnail: string
  variants: Array<{
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  categories?: Array<{
    id: string
    name: string
  }>
  metadata?: Record<string, any>
}

interface MedusaProductsResponse {
  products: MedusaProduct[]
  count: number
  offset: number
  limit: number
}

// Fetch products from Medusa
export async function fetchProducts(params?: {
  limit?: number
  offset?: number
  category_id?: string[]
  collection_id?: string[]
}): Promise<MedusaProductsResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.category_id) params.category_id.forEach(id => queryParams.append('category_id[]', id))
  if (params?.collection_id) params.collection_id.forEach(id => queryParams.append('collection_id[]', id))
  
  const response = await fetch(
    `${MEDUSA_BACKEND_URL}/store/products?${queryParams}`,
    {
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return response.json()
}

// Fetch single product
export async function fetchProduct(id: string): Promise<{ product: MedusaProduct }> {
  const response = await fetch(
    `${MEDUSA_BACKEND_URL}/store/products/${id}`,
    {
      next: { revalidate: 60 },
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  
  return response.json()
}

// Fetch product categories
export async function fetchCategories(): Promise<{ product_categories: Array<{ id: string; name: string; handle: string }> }> {
  const response = await fetch(
    `${MEDUSA_BACKEND_URL}/store/product-categories`,
    {
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  
  return response.json()
}

// Transform Medusa product to our Product interface
export function transformMedusaProduct(product: MedusaProduct) {
  const price = product.variants[0]?.prices[0]?.amount || 0
  
  return {
    id: product.id,
    name: product.title,
    price: price / 100, // Medusa stores prices in cents
    image: product.thumbnail || '/placeholder.svg',
    category: product.categories?.[0]?.name || 'Uncategorized',
    rating: product.metadata?.rating || 4.5,
    reviews: product.metadata?.reviews || 0,
    isNew: product.metadata?.isNew || false,
    isBestSeller: product.metadata?.isBestSeller || false,
    originalPrice: product.metadata?.originalPrice ? product.metadata.originalPrice / 100 : undefined,
  }
}