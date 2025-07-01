# Performance Optimization Implementation Guide

## Quick Wins (Implement Today)

### 1. Web Vitals Monitoring Component

```typescript
// app/components/web-vitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }
    
    // Send to analytics in production
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      });
    }
  });
  
  return null;
}
```

### 2. Resource Hints in Layout

```typescript
// app/layout.tsx - Add to head
export default function RootLayout() {
  return (
    <html>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://indecisive2x.myshopify.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/sora-variable.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
      </head>
    </html>
  );
}
```

### 3. Lazy Load Heavy Components

```typescript
// app/(shop)/products/page.tsx
import dynamic from 'next/dynamic';

// Lazy load filters - not critical for initial render
const ProductFilters = dynamic(
  () => import('@/components/commerce/product-filters'),
  { 
    ssr: false,
    loading: () => <div className="w-64 h-96 animate-pulse bg-gray-200" />
  }
);

// Lazy load modals
const QuickViewDialog = dynamic(
  () => import('@/components/commerce/quick-view-dialog'),
  { ssr: false }
);
```

### 4. Image Component Optimization

```typescript
// components/commerce/optimized-product-image.tsx
import Image from 'next/image';

export function OptimizedProductImage({ 
  src, 
  alt, 
  priority = false 
}: { 
  src: string; 
  alt: string; 
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={600}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
      className="object-cover"
    />
  );
}
```

## Advanced Optimizations

### 1. Implement Partial Prerendering (PPR)

```typescript
// app/(shop)/products/[handle]/page.tsx
export const experimental_ppr = true;

import { Suspense } from 'react';

export default function ProductPage({ params }: { params: { handle: string } }) {
  return (
    <>
      {/* Static shell - renders immediately */}
      <div className="container">
        <ProductBreadcrumbs handle={params.handle} />
        
        {/* Dynamic content with suspense */}
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetails handle={params.handle} />
        </Suspense>
        
        <Suspense fallback={<ReviewsSkeleton />}>
          <ProductReviews handle={params.handle} />
        </Suspense>
      </div>
    </>
  );
}
```

### 2. Optimize Shopify GraphQL Queries

```typescript
// lib/shopify/queries/optimized-products.ts
export const OPTIMIZED_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
```

### 3. Implement Smart Prefetching

```typescript
// hooks/use-prefetch.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function usePrefetch() {
  const router = useRouter();
  const prefetchedUrls = useRef(new Set<string>());
  
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const url = entry.target.getAttribute('href');
              if (url && !prefetchedUrls.current.has(url)) {
                router.prefetch(url);
                prefetchedUrls.current.add(url);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      // Observe all product links
      const links = document.querySelectorAll('a[data-prefetch="true"]');
      links.forEach(link => observer.observe(link));
      
      return () => observer.disconnect();
    }
  }, [router]);
}
```

### 4. Service Worker for Offline Support

```javascript
// public/sw.js
const CACHE_NAME = 'indecisive-wear-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  // Add critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/offline'))
    );
  }
});
```

### 5. Bundle Analysis Script

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "analyze:server": "BUNDLE_ANALYZE=server next build",
    "analyze:browser": "BUNDLE_ANALYZE=browser next build"
  }
}
```

```javascript
// next.config.mjs
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : '../analyze/client.html',
        })
      );
    }
    return config;
  },
};
```

## Performance Monitoring Dashboard

```typescript
// app/api/performance/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const metrics = await request.json();
  
  // Log to monitoring service
  console.log('Performance metrics:', {
    timestamp: new Date().toISOString(),
    ...metrics
  });
  
  // Store in database or send to analytics
  // await storeMetrics(metrics);
  
  return NextResponse.json({ success: true });
}
```

## Performance Budget Configuration

```javascript
// performance-budget.js
module.exports = {
  bundles: [
    {
      name: 'main',
      path: '.next/static/chunks/main-*.js',
      maxSize: '50kb',
    },
    {
      name: 'vendor',
      path: '.next/static/chunks/vendors-*.js',
      maxSize: '300kb',
    },
  ],
  lighthouse: {
    performance: 95,
    accessibility: 95,
    'best-practices': 95,
    seo: 90,
  },
};
```

## Testing Performance Improvements

```bash
# 1. Build and analyze
npm run build
npm run analyze

# 2. Test with throttling
# Use Chrome DevTools with:
# - Slow 3G network
# - 4x CPU slowdown

# 3. Run Lighthouse
# In Chrome DevTools > Lighthouse tab

# 4. Monitor real users
# Check Web Vitals in console
```

## Checklist for Implementation

- [ ] Add WebVitals component to layout
- [ ] Implement resource hints
- [ ] Lazy load 3+ heavy components
- [ ] Optimize all product images
- [ ] Add prefetch for visible links
- [ ] Configure service worker
- [ ] Set up bundle analyzer
- [ ] Create performance dashboard
- [ ] Test on real devices
- [ ] Monitor for 1 week
- [ ] Iterate based on data