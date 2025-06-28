# Next.js 15 & React 19 Optimization Patterns for E-commerce
*Date: 2025-06-28*

## Executive Summary

This guide documents the latest Next.js 15 and React 19 patterns specifically tailored for the Indecisive Wear e-commerce platform. Based on comprehensive research of current best practices, this implementation guide focuses on patterns that will deliver immediate performance gains.

## 1. Server Component Patterns

### Best Practices for Data Fetching in Server Components

#### Core Principles
- **Fetch data on the server** with Server Components to keep sensitive information secure
- **Fetch data where it's needed** - React automatically memoizes fetch requests
- **Direct database queries** are now possible without API layers

#### Implementation Pattern
```typescript
// app/products/[id]/page.tsx
import { db } from '@/lib/db'
import { cache } from 'react'

// Using React cache for deduplication
const getProduct = cache(async (id: string) => {
  // Direct database query - no API layer needed
  const product = await db.query.products.findFirst({
    where: eq(products.id, id)
  })
  return product
})

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await getProduct(id)
  
  return <ProductDetails product={product} />
}
```

### Parallel Data Loading with React 19

#### Pattern: Parallel Fetching for Product Pages
```typescript
// app/products/[id]/page.tsx
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  // Initiate all requests in parallel
  const productPromise = getProduct(id)
  const reviewsPromise = getProductReviews(id)
  const recommendationsPromise = getRecommendations(id)
  const inventoryPromise = getInventoryStatus(id)
  
  // Wait for all data
  const [product, reviews, recommendations, inventory] = await Promise.all([
    productPromise,
    reviewsPromise,
    recommendationsPromise,
    inventoryPromise
  ])
  
  return (
    <>
      <ProductDetails product={product} inventory={inventory} />
      <ProductReviews reviews={reviews} />
      <RecommendedProducts products={recommendations} />
    </>
  )
}
```

### Partial Prerendering (PPR) Implementation

#### Enable PPR in Configuration
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental' // Enable PPR for specific routes
  }
}

export default nextConfig
```

#### PPR for Product Pages
```typescript
// app/products/[id]/page.tsx
import { Suspense } from 'react'

// Enable PPR for this route
export const experimental_ppr = true

export default function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  return (
    <>
      {/* Static shell - immediately rendered */}
      <ProductHeader />
      <ProductImages />
      
      {/* Dynamic content - streamed */}
      <Suspense fallback={<PriceSkeleton />}>
        <ProductPrice productId={params.id} />
      </Suspense>
      
      <Suspense fallback={<InventorySkeleton />}>
        <InventoryStatus productId={params.id} />
      </Suspense>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={params.id} />
      </Suspense>
    </>
  )
}
```

### When to Use generateStaticParams vs Dynamic Rendering

#### Use generateStaticParams for:
- Popular products (top 100-1000)
- Category pages
- Static marketing pages

```typescript
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  // Pre-render top products at build time
  const products = await db.query.products.findMany({
    where: eq(products.isPopular, true),
    limit: 100
  })
  
  return products.map((product) => ({
    id: product.id
  }))
}
```

#### Use Dynamic Rendering for:
- User-specific content (cart, wishlist)
- Real-time inventory
- Personalized recommendations

## 2. Performance Optimization

### Bundle Splitting Strategies for E-commerce

#### Dynamic Imports for Heavy Components
```typescript
// app/products/[id]/page.tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const ProductImageGallery = dynamic(
  () => import('@/components/product-image-gallery'),
  {
    loading: () => <ImageGallerySkeleton />,
    ssr: true // Keep SSR for SEO
  }
)

const ProductReviews = dynamic(
  () => import('@/components/product-reviews'),
  {
    loading: () => <ReviewsSkeleton />,
    ssr: false // Reviews can be client-only
  }
)

// Size comparison widget - load on interaction
const SizeChart = dynamic(
  () => import('@/components/size-chart'),
  {
    loading: () => <Button>Loading size chart...</Button>,
    ssr: false
  }
)
```

#### Route-based Code Splitting
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Bundle external packages for better caching
  bundlePagesRouterDependencies: true,
  
  // Exclude heavy packages from server bundle
  serverExternalPackages: ['@aws-sdk/client-s3', 'sharp']
}
```

### Image Optimization for Product Galleries

#### Next/Image Configuration for E-commerce
```typescript
// components/product-image.tsx
import Image from 'next/image'

export function ProductImage({ 
  src, 
  alt, 
  priority = false 
}: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={800}
      priority={priority} // Use for above-fold images
      quality={85} // Balance quality vs size
      placeholder="blur" // Show blur while loading
      blurDataURL={generateBlurDataURL(src)}
      sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 50vw, 
             33vw"
      className="w-full h-auto"
    />
  )
}
```

#### Responsive Image Gallery Pattern
```typescript
// components/product-gallery.tsx
export function ProductGallery({ images }: { images: ProductImage[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {images.map((image, index) => (
        <ProductImage
          key={image.id}
          src={image.url}
          alt={image.alt}
          priority={index < 2} // Prioritize first 2 images
        />
      ))}
    </div>
  )
}
```

### Implementing ISR for Product Pages

#### ISR Configuration with Edge Runtime Workaround
```typescript
// app/products/[id]/page.tsx
// Note: ISR not compatible with edge runtime
// Use cache-control headers for similar behavior

export const revalidate = 60 // Revalidate every 60 seconds

// For edge runtime, use manual cache-control
export const runtime = 'nodejs' // Use Node.js runtime for ISR

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await getProduct(id)
  
  return <ProductDetails product={product} />
}
```

#### Edge Runtime Alternative with Cache Headers
```typescript
// app/api/products/[id]/route.ts
export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await getProduct(id)
  
  return new Response(JSON.stringify(product), {
    headers: {
      'Content-Type': 'application/json',
      // Implement stale-while-revalidate manually
      'Cache-Control': 's-maxage=60, stale-while-revalidate=59'
    }
  })
}
```

## 3. Data Fetching Patterns

### Server Actions for Cart Operations

#### Cart Server Actions Implementation
```typescript
// app/actions/cart.ts
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function addToCart(productId: string, quantity: number) {
  const cookieStore = await cookies()
  const cartId = cookieStore.get('cartId')?.value
  
  try {
    // Perform cart operation
    const cart = await db.cart.addItem({
      cartId,
      productId,
      quantity
    })
    
    // Revalidate cart-related paths
    revalidatePath('/cart')
    revalidatePath('/', 'layout') // Update cart counter in layout
    
    return { success: true, cart }
  } catch (error) {
    return { success: false, error: 'Failed to add item' }
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    const cart = await db.cart.updateItem({
      itemId,
      quantity
    })
    
    revalidatePath('/cart')
    return { success: true, cart }
  } catch (error) {
    return { success: false, error: 'Failed to update item' }
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const cart = await db.cart.removeItem(itemId)
    
    revalidatePath('/cart')
    return { success: true, cart }
  } catch (error) {
    return { success: false, error: 'Failed to remove item' }
  }
}
```

### Optimistic Updates with useOptimistic

#### Product Cart Button with Optimistic UI
```typescript
// components/add-to-cart-button.tsx
'use client'

import { useOptimistic, useTransition, startTransition } from 'react'
import { addToCart } from '@/app/actions/cart'

export function AddToCartButton({ 
  productId, 
  initialInCart = false 
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticInCart, setOptimisticInCart] = useOptimistic(
    initialInCart,
    (state, newState: boolean) => newState
  )

  async function handleAddToCart() {
    startTransition(async () => {
      // Optimistically update UI
      setOptimisticInCart(true)
      
      // Perform server action
      const result = await addToCart(productId, 1)
      
      if (!result.success) {
        // Revert on error
        setOptimisticInCart(false)
        toast.error('Failed to add item to cart')
      }
    })
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || optimisticInCart}
      className={cn(
        'px-4 py-2 rounded-md transition-colors',
        optimisticInCart 
          ? 'bg-green-600 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      )}
    >
      {isPending ? (
        <Spinner />
      ) : optimisticInCart ? (
        'Added to Cart'
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}
```

#### Cart Quantity Updater with Optimistic Updates
```typescript
// components/cart-item-quantity.tsx
'use client'

import { useOptimistic, startTransition } from 'react'
import { updateCartItem } from '@/app/actions/cart'

export function CartItemQuantity({ 
  itemId, 
  initialQuantity 
}: CartItemQuantityProps) {
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(
    initialQuantity,
    (state, newQuantity: number) => newQuantity
  )

  function handleQuantityChange(newQuantity: number) {
    startTransition(async () => {
      // Optimistically update
      setOptimisticQuantity(newQuantity)
      
      // Server action
      const result = await updateCartItem(itemId, newQuantity)
      
      if (!result.success) {
        // Revert on error
        setOptimisticQuantity(initialQuantity)
        toast.error('Failed to update quantity')
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleQuantityChange(Math.max(1, optimisticQuantity - 1))}
        className="p-1 border rounded"
      >
        -
      </button>
      <span className="w-12 text-center">{optimisticQuantity}</span>
      <button
        onClick={() => handleQuantityChange(optimisticQuantity + 1)}
        className="p-1 border rounded"
      >
        +
      </button>
    </div>
  )
}
```

### Streaming Large Product Lists

#### Streaming Product Grid Implementation
```typescript
// app/products/page.tsx
import { Suspense } from 'react'

export default function ProductsPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Stream categories immediately */}
      <Suspense fallback={<CategoryFilterSkeleton />}>
        <CategoryFilter />
      </Suspense>
      
      {/* Stream product grid in chunks */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <StreamedProductGrid />
      </Suspense>
    </div>
  )
}

// components/streamed-product-grid.tsx
async function StreamedProductGrid() {
  // Fetch first batch immediately
  const firstBatch = await getProducts({ limit: 12, offset: 0 })
  
  return (
    <>
      <ProductGrid products={firstBatch} />
      
      {/* Stream additional batches */}
      <Suspense fallback={<LoadingMore />}>
        <AdditionalProducts offset={12} />
      </Suspense>
    </>
  )
}

async function AdditionalProducts({ offset }: { offset: number }) {
  const products = await getProducts({ limit: 24, offset })
  
  return (
    <>
      <ProductGrid products={products} />
      
      {/* Lazy load more as needed */}
      {products.length === 24 && (
        <Suspense fallback={<LoadingMore />}>
          <AdditionalProducts offset={offset + 24} />
        </Suspense>
      )}
    </>
  )
}
```

#### Infinite Scroll Pattern with Streaming
```typescript
// components/infinite-product-list.tsx
'use client'

import { useInView } from 'react-intersection-observer'
import { useEffect, useState, useTransition } from 'react'
import { loadMoreProducts } from '@/app/actions/products'

export function InfiniteProductList({ 
  initialProducts 
}: { 
  initialProducts: Product[] 
}) {
  const [products, setProducts] = useState(initialProducts)
  const [hasMore, setHasMore] = useState(true)
  const [isPending, startTransition] = useTransition()
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasMore && !isPending) {
      startTransition(async () => {
        const newProducts = await loadMoreProducts(products.length)
        
        if (newProducts.length === 0) {
          setHasMore(false)
        } else {
          setProducts(prev => [...prev, ...newProducts])
        }
      })
    }
  }, [inView, hasMore, isPending, products.length])

  return (
    <>
      <ProductGrid products={products} />
      
      {hasMore && (
        <div ref={ref} className="flex justify-center p-4">
          {isPending ? <Spinner /> : <span>Load more</span>}
        </div>
      )}
    </>
  )
}
```

### Caching Strategies with Next.js 15

#### Explicit Fetch Caching
```typescript
// lib/api/products.ts
// Next.js 15 - No default caching

// Force cache for static data
export async function getCategories() {
  const res = await fetch('https://api.example.com/categories', {
    cache: 'force-cache' // Explicitly cache
  })
  return res.json()
}

// Time-based revalidation for dynamic data
export async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  return res.json()
}

// No cache for user-specific data
export async function getUserCart(userId: string) {
  const res = await fetch(`https://api.example.com/cart/${userId}`, {
    cache: 'no-store' // Never cache
  })
  return res.json()
}
```

#### Using unstable_cache for Database Queries
```typescript
// lib/cache/products.ts
import { unstable_cache } from 'next/cache'

export const getCachedProduct = unstable_cache(
  async (id: string) => {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        images: true,
        variants: true
      }
    })
  },
  ['product'], // Cache key prefix
  {
    revalidate: 60, // Revalidate after 60 seconds
    tags: ['products'] // For tag-based revalidation
  }
)

export const getCachedCategories = unstable_cache(
  async () => {
    return db.query.categories.findMany({
      with: {
        subcategories: true
      }
    })
  },
  ['categories'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['categories']
  }
)
```

#### Tag-based Revalidation Pattern
```typescript
// app/actions/admin.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string, data: ProductUpdate) {
  // Update product in database
  await db.products.update({
    where: { id },
    data
  })
  
  // Revalidate all product-related caches
  revalidateTag('products')
  revalidateTag(`product-${id}`)
}

export async function updateCategory(id: string, data: CategoryUpdate) {
  // Update category
  await db.categories.update({
    where: { id },
    data
  })
  
  // Revalidate category caches
  revalidateTag('categories')
  revalidateTag('products') // Products may display categories
}
```

#### New "use cache" Directive (Experimental)
```typescript
// lib/api/featured-products.ts
import { unstable_cacheLife as cacheLife } from 'next/cache'

export async function getFeaturedProducts() {
  'use cache'
  cacheLife('minutes') // Cache for a few minutes
  
  const products = await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    limit: 8
  })
  
  return products
}
```

## 4. Error Handling

### Error Boundaries in App Router

#### Product Page Error Boundary
```typescript
// app/products/[id]/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">
        We couldn't load this product. Please try again.
      </p>
      <Button
        onClick={reset}
        variant="default"
      >
        Try again
      </Button>
    </div>
  )
}
```

### Graceful Error Handling for Payment Flows

#### Payment Error Boundary with Recovery
```typescript
// app/checkout/error.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  // Determine error type
  const isPaymentError = error.message.includes('payment')
  const isNetworkError = error.message.includes('network')
  
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          {isPaymentError 
            ? 'Payment Processing Error' 
            : 'Checkout Error'}
        </h2>
        <p className="text-red-600">
          {isPaymentError
            ? 'Your payment could not be processed. Please check your payment details and try again.'
            : isNetworkError
            ? 'Network error occurred. Please check your connection and try again.'
            : 'An unexpected error occurred during checkout.'}
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={reset}
          variant="default"
          className="flex-1"
        >
          Try Again
        </Button>
        <Button
          onClick={() => router.push('/cart')}
          variant="outline"
          className="flex-1"
        >
          Back to Cart
        </Button>
      </div>
      
      {isPaymentError && (
        <p className="text-sm text-gray-600 mt-4 text-center">
          If the problem persists, please contact support or try a different payment method.
        </p>
      )}
    </div>
  )
}
```

#### Payment Processing with Retry Logic
```typescript
// app/actions/checkout.ts
'use server'

import { revalidatePath } from 'next/cache'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function retryableOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return retryableOperation(operation, retries - 1)
    }
    throw error
  }
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Retry on network errors or specific payment errors
    return (
      error.message.includes('NETWORK_ERROR') ||
      error.message.includes('TIMEOUT') ||
      error.message.includes('RATE_LIMIT')
    )
  }
  return false
}

export async function processPayment(paymentData: PaymentData) {
  try {
    // Retry payment processing if needed
    const result = await retryableOperation(async () => {
      const payment = await stripeClient.paymentIntents.create({
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethod,
        confirm: true,
        metadata: {
          orderId: paymentData.orderId
        }
      })
      
      return payment
    })
    
    // Update order status
    await db.orders.update({
      where: { id: paymentData.orderId },
      data: { 
        status: 'paid',
        paymentId: result.id
      }
    })
    
    revalidatePath('/orders')
    return { success: true, paymentId: result.id }
    
  } catch (error) {
    console.error('Payment processing error:', error)
    
    // Save failed attempt for debugging
    await db.paymentAttempts.create({
      data: {
        orderId: paymentData.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    })
    
    return { 
      success: false, 
      error: 'Payment failed. Please try again.',
      retryable: isRetryableError(error)
    }
  }
}
```

### Retry Mechanisms for Failed Requests

#### Global Retry Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    // Retry failed static generation
    staticGenerationRetryCount: 3
  }
}
```

#### Custom Retry Hook
```typescript
// hooks/use-retry.ts
import { useState, useCallback } from 'react'

interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
}

export function useRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true
  } = options
  
  const [attempt, setAttempt] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const execute = useCallback(async (): Promise<T> => {
    setIsRetrying(true)
    setError(null)
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        setAttempt(i + 1)
        const result = await operation()
        setIsRetrying(false)
        return result
      } catch (err) {
        const isLastAttempt = i === maxAttempts - 1
        
        if (isLastAttempt) {
          setError(err instanceof Error ? err : new Error('Operation failed'))
          setIsRetrying(false)
          throw err
        }
        
        // Calculate delay with exponential backoff
        const retryDelay = backoff 
          ? delay * Math.pow(2, i) 
          : delay
          
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
    
    throw new Error('Max retry attempts reached')
  }, [operation, maxAttempts, delay, backoff])
  
  return {
    execute,
    attempt,
    isRetrying,
    error,
    reset: () => {
      setAttempt(0)
      setError(null)
      setIsRetrying(false)
    }
  }
}
```

#### Usage in Components
```typescript
// components/product-availability.tsx
'use client'

import { useRetry } from '@/hooks/use-retry'

export function ProductAvailability({ productId }: { productId: string }) {
  const checkAvailability = useCallback(
    () => fetch(`/api/products/${productId}/availability`).then(r => r.json()),
    [productId]
  )
  
  const { execute, isRetrying, attempt, error } = useRetry(
    checkAvailability,
    {
      maxAttempts: 3,
      delay: 500,
      backoff: true
    }
  )
  
  useEffect(() => {
    execute()
  }, [execute])
  
  if (isRetrying) {
    return (
      <div className="text-sm text-gray-600">
        Checking availability... (Attempt {attempt})
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-sm text-red-600">
        Unable to check availability
        <button 
          onClick={() => execute()}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    )
  }
  
  // ... render availability data
}
```

## Implementation Priorities

Based on the audit findings and these patterns, prioritize implementation in this order:

1. **Immediate Wins (Week 1)**
   - Enable PPR for product pages
   - Implement parallel data fetching
   - Add streaming to product lists
   - Configure proper image optimization

2. **Performance Gains (Week 2)**
   - Implement Server Actions for cart
   - Add optimistic updates
   - Configure ISR for product pages
   - Set up proper caching strategies

3. **Stability Improvements (Week 3)**
   - Add comprehensive error boundaries
   - Implement retry mechanisms
   - Add proper loading states
   - Set up monitoring for errors

4. **Advanced Optimizations (Week 4)**
   - Fine-tune bundle splitting
   - Optimize third-party scripts
   - Implement advanced caching patterns
   - Add performance monitoring

## Conclusion

These Next.js 15 and React 19 patterns provide a solid foundation for optimizing the Indecisive Wear e-commerce platform. The combination of Server Components, PPR, streaming, and proper caching will deliver significant performance improvements while maintaining excellent developer experience.

Remember to:
- Test each optimization in production-like environments
- Monitor Core Web Vitals after each change
- Use A/B testing for significant UX changes
- Keep error tracking in place for all new patterns

The patterns documented here represent the cutting edge of Next.js development in 2024 and will position Indecisive Wear as a performant, modern e-commerce platform.