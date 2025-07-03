# Project Structure & Architecture Expert

## Executive Summary

This document provides comprehensive guidance on modern Next.js 15 project structure and architecture patterns, with a focus on scalable e-commerce applications. The recommendations combine industry best practices with e-commerce-specific patterns to create a maintainable, performant, and developer-friendly codebase.

### Key Principles for 2025
- **Feature-First Organization**: Group by business domain rather than technical layers
- **Headless Commerce Architecture**: Decouple frontend from backend with API-first approach
- **Server/Client Component Hybrid**: Balance server-side efficiency with client-side interactivity
- **Composable Commerce**: Build modular, independent services that can be combined flexibly
- **Colocation**: Keep related code together (components, hooks, utils, tests)
- **Clear Boundaries**: Enforce separation between features and shared code
- **Progressive Disclosure**: Hide implementation details, expose clean APIs
- **Type Safety**: Leverage TypeScript for architecture enforcement
- **Performance-First**: Default to Server Components, optimize bundle size
- **Mobile-First**: Design for mobile experience with responsive patterns

## Directory Structure Recommendations

### Recommended E-commerce Project Structure (2025)

Based on the latest Next.js 15 and React 19 best practices, here's the optimal structure for scalable e-commerce applications:

```
.
├── src/                          # Source directory (recommended for Next.js 15)
│   ├── app/                      # Next.js 15 App Router
│   │   ├── (auth)/               # Route group for authentication
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (shop)/               # Main shopping experience
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # Product listing
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # Product detail
│   │   │   │       └── loading.tsx
│   │   │   ├── collections/
│   │   │   │   └── [handle]/
│   │   │   ├── cart/
│   │   │   └── search/
│   │   ├── (checkout)/           # Checkout flow (isolated)
│   │   │   ├── checkout/
│   │   │   ├── payment/
│   │   │   └── confirmation/
│   │   ├── (account)/            # User account area
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   └── wishlist/
│   │   ├── api/                  # API routes
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── webhooks/
│   │   ├── layout.tsx            # Root layout
│   │   ├── error.tsx             # Global error boundary
│   │   ├── not-found.tsx         # 404 page
│   │   └── global-error.tsx      # Global error boundary
│   │
│   ├── components/               # Shared UI components
│   │   ├── ui/                   # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/               # Layout components
│   │   │   ├── header/
│   │   │   │   ├── server/       # Server Components
│   │   │   │   └── client/       # Client Components  
│   │   │   ├── footer/
│   │   │   └── navigation/
│   │   │       ├── desktop-nav.tsx
│   │   │       └── mobile-nav.tsx
│   │   └── common/               # Common business components
│   │       ├── price-display.tsx
│   │       ├── product-image.tsx
│   │       └── rating-stars.tsx
│   │
│   ├── features/                 # Feature-based modules (composable commerce)
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   │   ├── server/       # Server Components
│   │   │   │   │   └── cart-summary.tsx
│   │   │   │   └── client/       # Client Components
│   │   │   │       ├── cart-drawer.tsx
│   │   │   │       └── cart-item.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-cart.ts
│   │   │   │   └── use-cart-mutations.ts
│   │   │   ├── services/
│   │   │   │   └── cart-service.ts
│   │   │   ├── types/
│   │   │   │   └── cart.types.ts
│   │   │   └── index.ts          # Public API
│   │   │
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── server/       # Server Components
│   │   │   │   │   ├── product-list.tsx
│   │   │   │   │   └── product-detail.tsx
│   │   │   │   └── client/       # Client Components
│   │   │   │       ├── product-filters.tsx
│   │   │   │       └── product-search.tsx
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── checkout/
│   │   │   ├── components/
│   │   │   │   ├── server/
│   │   │   │   └── client/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   │
│   │   └── user/
│   │       ├── components/
│   │       │   ├── server/
│   │       │   └── client/
│   │       ├── hooks/
│   │       └── services/
│   │
│   ├── lib/                      # Core utilities and integrations
│   │   ├── shopify/              # E-commerce platform integration
│   │   │   ├── client.ts
│   │   │   ├── queries/
│   │   │   ├── mutations/
│   │   │   └── types/
│   │   ├── api/                  # API client utilities
│   │   │   ├── fetcher.ts
│   │   │   └── error-handling.ts
│   │   ├── auth/                 # Authentication
│   │   ├── payments/             # Payment integrations
│   │   │   ├── stripe/
│   │   │   └── types/
│   │   └── utils/                # General utilities
│   │       ├── cn.ts
│   │       ├── format.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                    # Global hooks
│   │   ├── use-media-query.ts
│   │   ├── use-local-storage.ts
│   │   └── use-debounce.ts
│   │
│   ├── types/                    # Global type definitions
│   │   ├── global.d.ts
│   │   ├── api.types.ts
│   │   └── environment.d.ts
│   │
│   ├── styles/                   # Global styles
│   │   ├── globals.css
│   │   └── components/
│   │
│   └── context/                  # React Context providers
│       ├── cart-context.tsx
│       └── theme-context.tsx
│
├── public/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tests/                        # Test configuration and utilities
│   ├── e2e/
│   ├── integration/
│   └── setup/
│
├── config/                       # Configuration files
│   ├── site.ts                   # Site configuration
│   ├── navigation.ts             # Navigation config
│   └── constants.ts              # App constants
│
├── .env                          # Environment variables
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── tailwind.config.ts            # Tailwind CSS configuration
```

## React 19 Server/Client Component Architecture

### Server Component vs Client Component Decision Matrix

React 19 introduces a new hybrid architecture that combines server-side efficiency with client-side interactivity. The key distinction:

**Server Components (Default in Next.js 15):**
- Run only on the server, zero impact on bundle size
- Can run at build time to read filesystem or fetch static content
- Cannot use interactive APIs like useState
- Perfect for product listings, category pages, static content

**Client Components (Use 'use client' directive):**
- Traditional React components with full React features
- Required for interactivity, state, effects, DOM access
- Should be used sparingly and strategically

### Component Architecture Patterns

#### 1. Hybrid Component Model
```typescript
// Server Component (default)
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await fetchProducts(); // Direct data fetch
  
  return (
    <div className="grid gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Client Component for interactivity
// components/client/add-to-cart.tsx
'use client';

import { useState } from 'react';

export function AddToCart({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAdd = async () => {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  };
  
  return (
    <button onClick={handleAdd} disabled={isAdding}>
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

#### 2. Server/Client Boundary Management
```typescript
// features/products/components/server/product-detail.tsx
import { AddToCart } from '../client/add-to-cart';

export async function ProductDetail({ productId }: { productId: string }) {
  const product = await getProduct(productId);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      {/* Client Component for interactivity */}
      <AddToCart productId={product.id} />
    </div>
  );
}
```

#### 3. Streaming with Suspense
```typescript
// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList />
      </Suspense>
      <Suspense fallback={<FiltersSkeleton />}>
        <ProductFilters />
      </Suspense>
    </div>
  );
}
```

## Component Organization Patterns

### 1. Feature-Based Architecture

Features are self-contained modules that encapsulate all code related to a specific business domain.

```typescript
// features/cart/index.ts - Public API
export { CartProvider, useCart } from './hooks/use-cart';
export { CartDrawer } from './components/cart-drawer';
export { cartService } from './services/cart-service';
export type { Cart, CartItem } from './types/cart.types';

// Internal implementation is hidden
```

### 2. Component Structure Patterns

#### Compound Components
```typescript
// features/products/components/product-card/index.tsx
export const ProductCard = {
  Root: ProductCardRoot,
  Image: ProductCardImage,
  Info: ProductCardInfo,
  Price: ProductCardPrice,
  Actions: ProductCardActions,
};

// Usage
<ProductCard.Root>
  <ProductCard.Image src={product.image} alt={product.title} />
  <ProductCard.Info>
    <ProductCard.Price value={product.price} />
    <ProductCard.Actions productId={product.id} />
  </ProductCard.Info>
</ProductCard.Root>
```

#### Presentational vs Container Pattern
```typescript
// Presentational Component
// components/common/price-display.tsx
interface PriceDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function PriceDisplay({ amount, currency = 'USD', className }: PriceDisplayProps) {
  return <span className={className}>{formatPrice(amount, currency)}</span>;
}

// Container Component
// features/products/components/product-price.tsx
export function ProductPrice({ productId }: { productId: string }) {
  const { data: product } = useProduct(productId);
  const { data: pricing } = useProductPricing(productId);
  
  if (!product || !pricing) return <PriceSkeleton />;
  
  return (
    <PriceDisplay 
      amount={pricing.finalPrice} 
      originalAmount={pricing.originalPrice}
    />
  );
}
```

### 3. Service Layer Pattern

```typescript
// features/cart/services/cart-service.ts
export class CartService {
  private client: ShopifyClient;
  
  constructor(client: ShopifyClient) {
    this.client = client;
  }
  
  async addItem(cartId: string, item: CartItemInput): Promise<Cart> {
    // Business logic here
    const validated = validateCartItem(item);
    const result = await this.client.cart.addLines(cartId, [validated]);
    return transformCart(result);
  }
  
  async updateQuantity(cartId: string, lineId: string, quantity: number): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeItem(cartId, lineId);
    }
    // Update logic
  }
}

// Singleton instance
export const cartService = new CartService(shopifyClient);
```

## Feature-Based vs Layer-Based Architecture

### Feature-Based (Recommended for E-commerce)

**Advantages:**
- Better code organization for large teams
- Easier to understand business logic
- Simplified dependency management
- Natural code splitting boundaries
- Easier to onboard new developers

**Structure Example:**
```
features/
├── products/          # Everything about products
├── cart/             # Everything about cart
├── checkout/         # Everything about checkout
└── user/             # Everything about users
```

### Layer-Based (Traditional)

**When to Use:**
- Smaller applications
- Single developer/small team
- Simple business logic

**Structure Example:**
```
src/
├── components/       # All components
├── hooks/           # All hooks
├── services/        # All services
├── utils/           # All utilities
└── types/           # All types
```

## Naming Conventions and Standards

### File Naming
- **Components**: `kebab-case.tsx` (e.g., `product-card.tsx`)
- **Hooks**: `use-*.ts` (e.g., `use-cart.ts`)
- **Services**: `*-service.ts` (e.g., `cart-service.ts`)
- **Types**: `*.types.ts` (e.g., `product.types.ts`)
- **Utils**: `*.util.ts` or descriptive names (e.g., `format-price.ts`)

### Component Naming
```typescript
// File: product-card.tsx
export function ProductCard() {} // PascalCase

// File: use-cart.ts
export function useCart() {} // camelCase with 'use' prefix

// File: cart-service.ts
export class CartService {} // PascalCase for classes
export const cartService = new CartService(); // camelCase for instances
```

### Directory Naming
- **Route segments**: `kebab-case` (matches URL structure)
- **Feature modules**: `kebab-case`
- **Grouped routes**: `(group-name)`
- **Private folders**: `_folder-name`

## Scalability Considerations

### 1. Code Splitting Strategy

```typescript
// Automatic code splitting with dynamic imports
const ProductFilters = dynamic(
  () => import('@/features/products/components/product-filters'),
  { 
    loading: () => <FiltersSkeleton />,
    ssr: false // Client-only component
  }
);

// Route-based code splitting (automatic in App Router)
// Each page.tsx creates a separate bundle
```

### 2. Monorepo Structure (For Large Scale - 2025)

Modern e-commerce platforms use monorepo architectures with Turborepo for consistency and scalability:

```
apps/
├── storefront/           # Customer-facing Next.js app
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── features/
│   ├── package.json
│   └── next.config.js
├── admin/               # Admin dashboard Next.js app
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── package.json
├── mobile/              # React Native app
│   ├── src/
│   └── package.json
└── docs/                # Documentation site

packages/
├── ui/                  # Shared UI components
│   ├── src/
│   │   ├── components/
│   │   └── index.ts
│   └── package.json
├── commerce/            # E-commerce business logic
│   ├── src/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── api-client/          # API client library
│   ├── src/
│   │   ├── clients/
│   │   └── types/
│   └── package.json
├── config/              # Shared configuration
│   ├── eslint-config/
│   ├── tsconfig/
│   └── tailwind-config/
└── database/            # Database schemas and migrations
    ├── prisma/
    └── package.json

turbo.json               # Turborepo configuration
package.json             # Root package.json
```

#### Turborepo Configuration for E-commerce

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 3. Module Federation (Micro-Frontends)

```typescript
// next.config.js
module.exports = {
  experimental: {
    // Enable module federation
    modularizeImports: {
      '@features/*': {
        transform: '@features/*/index',
      },
    },
  },
};
```

### 4. Performance Patterns

```typescript
// Parallel data loading
export default async function ProductPage({ params }: Props) {
  // Load data in parallel
  const [product, reviews, recommendations] = await Promise.all([
    getProduct(params.id),
    getProductReviews(params.id),
    getRecommendations(params.id),
  ]);
  
  return (
    <>
      <ProductDetails product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews data={reviews} />
      </Suspense>
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations data={recommendations} />
      </Suspense>
    </>
  );
}
```

## Modern E-commerce Architecture Patterns (2025)

### 1. Headless Commerce Architecture

The dominant pattern for scalable e-commerce in 2025 is headless architecture, where the frontend is completely decoupled from the backend:

```typescript
// lib/commerce/client.ts
export class CommerceClient {
  private apiClient: APIClient;
  
  constructor() {
    this.apiClient = new APIClient({
      baseURL: process.env.COMMERCE_API_URL,
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_TOKEN,
      },
    });
  }
  
  async getProducts(params: ProductQuery): Promise<Product[]> {
    return this.apiClient.get('/products', { params });
  }
  
  async getProduct(id: string): Promise<Product> {
    return this.apiClient.get(`/products/${id}`);
  }
}
```

### 2. Composable Commerce Architecture

Break down the e-commerce system into small, independent services:

```typescript
// features/commerce/services/index.ts
export const commerceServices = {
  products: new ProductService(),
  cart: new CartService(),
  checkout: new CheckoutService(),
  user: new UserService(),
  inventory: new InventoryService(),
  payments: new PaymentService(),
};

// Each service is independent and can be swapped out
interface CommerceService {
  initialize(): Promise<void>;
  healthCheck(): Promise<boolean>;
}
```

### 3. Microservices-Ready Frontend Architecture

Organize features to support independent deployment:

```typescript
// features/cart/index.ts - Standalone cart module
export const CartModule = {
  components: () => import('./components'),
  services: () => import('./services'),
  hooks: () => import('./hooks'),
  routes: [
    { path: '/cart', component: () => import('./pages/cart-page') },
    { path: '/cart/checkout', component: () => import('./pages/checkout-page') },
  ],
};
```

### 4. Performance-Optimized Architecture

Implement streaming and parallel loading:

```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  // Parallel data fetching
  const [products, categories, filters] = await Promise.all([
    getProducts(),
    getCategories(),
    getFilters(),
  ]);
  
  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      <aside>
        <Suspense fallback={<FiltersSkeleton />}>
          <ProductFilters filters={filters} />
        </Suspense>
      </aside>
      <main>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>
      </main>
    </div>
  );
}
```

### 5. Mobile-First Architecture

Design for mobile experience with touch-optimized components:

```typescript
// components/mobile/mobile-navigation.tsx
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <nav className="flex flex-col gap-4">
          {/* Touch-optimized navigation items */}
          <Link 
            href="/products" 
            className="flex items-center py-4 text-lg font-medium min-h-[48px]"
          >
            Products
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

## E-commerce Specific Patterns

### 1. Product Catalog Architecture

```typescript
// features/products/components/product-listing/index.tsx
export function ProductListing() {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside>
        <ProductFilters />
      </aside>
      <main>
        <ProductSort />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
        <ProductPagination />
      </main>
    </div>
  );
}
```

### 2. Cart State Management

```typescript
// features/cart/hooks/use-cart.ts
interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (item: CartItemInput) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Optimistic updates
  const addItem = useCallback(async (item: CartItemInput) => {
    setIsLoading(true);
    
    // Optimistic update
    setCart(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: [...prev.items, createOptimisticItem(item)],
      };
    });
    
    try {
      const updated = await cartService.addItem(cart.id, item);
      setCart(updated);
    } catch (error) {
      // Revert optimistic update
      setCart(prev => cart);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cart]);
  
  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}
```

### 3. Checkout Flow Architecture

```typescript
// features/checkout/components/checkout-flow/index.tsx
interface CheckoutStep {
  id: string;
  title: string;
  component: React.ComponentType<CheckoutStepProps>;
  validation: (data: CheckoutData) => boolean;
}

const checkoutSteps: CheckoutStep[] = [
  { id: 'shipping', title: 'Shipping', component: ShippingStep, validation: validateShipping },
  { id: 'payment', title: 'Payment', component: PaymentStep, validation: validatePayment },
  { id: 'review', title: 'Review', component: ReviewStep, validation: validateOrder },
];

export function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({});
  
  const CurrentStepComponent = checkoutSteps[currentStep].component;
  
  return (
    <div>
      <CheckoutProgress steps={checkoutSteps} currentStep={currentStep} />
      <CurrentStepComponent
        data={checkoutData}
        onUpdate={setCheckoutData}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onBack={() => setCurrentStep(prev => prev - 1)}
      />
    </div>
  );
}
```

### 4. Search & Discovery Architecture

```typescript
// features/search/components/search-interface/index.tsx
export function SearchInterface() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const debouncedQuery = useDebounce(query, 300);
  
  const { data, isLoading } = useSearch({
    query: debouncedQuery,
    filters,
  });
  
  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <div className="grid lg:grid-cols-[240px_1fr]">
        <SearchFilters filters={filters} onChange={setFilters} />
        <SearchResults results={data?.results} isLoading={isLoading} />
      </div>
    </div>
  );
}
```

### 5. Inventory Management Patterns

```typescript
// features/products/hooks/use-product-availability.ts
export function useProductAvailability(productId: string) {
  const { data: inventory } = useSWR(
    `/api/products/${productId}/inventory`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );
  
  return {
    isAvailable: inventory?.quantity > 0,
    quantity: inventory?.quantity ?? 0,
    lowStock: inventory?.quantity > 0 && inventory?.quantity < 10,
  };
}
```

## Testing Structure

### Test Organization
```
tests/
├── e2e/
│   ├── checkout-flow.spec.ts
│   ├── product-search.spec.ts
│   └── cart-operations.spec.ts
├── integration/
│   ├── cart-service.test.ts
│   └── checkout-service.test.ts
└── unit/
    ├── components/
    ├── hooks/
    └── utils/
```

### Component Testing Pattern
```typescript
// features/products/components/product-card/__tests__/product-card.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../product-card';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const product = createMockProduct();
    
    render(<ProductCard product={product} />);
    
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(formatPrice(product.price))).toBeInTheDocument();
  });
});
```

## Migration Strategies

### From Pages Router to App Router
1. Start with shared components and utilities
2. Migrate page by page, starting with simple pages
3. Use parallel routes for gradual migration
4. Update data fetching patterns incrementally

### From Layer-Based to Feature-Based
1. Identify feature boundaries
2. Create feature modules one at a time
3. Move related code into feature modules
4. Update imports to use feature public APIs
5. Remove old structure once migration is complete

## Best Practices Summary

1. **Organize by Feature**: Group related code together
2. **Clear Public APIs**: Export only what's needed
3. **Consistent Naming**: Follow conventions throughout
4. **Optimize Imports**: Use barrel exports wisely
5. **Type Everything**: Leverage TypeScript for safety
6. **Test Strategically**: Focus on user flows
7. **Document Patterns**: Maintain architecture docs
8. **Monitor Bundle Size**: Regular audits
9. **Performance First**: Consider loading patterns
10. **Accessibility Always**: Build inclusive e-commerce

## AUDIT FINDINGS - Indecisive Wear Project Structure Analysis

### Executive Summary

**Overall Grade: B+ (82/100)**

The Indecisive Wear project demonstrates a solid foundation with modern Next.js 15 + React 19 architecture, well-structured route groups, and good e-commerce patterns. However, there are specific areas requiring improvement to achieve production-ready status.

**Key Strengths:**
- ✅ Modern Next.js 15 App Router with proper route groups
- ✅ Excellent Shopify integration with Hydrogen React
- ✅ Comprehensive component library with shadcn/ui
- ✅ Strong TypeScript implementation
- ✅ Mobile-first responsive design

**Critical Gaps:**
- 🔴 Inconsistent Server/Client component architecture
- 🔴 Missing feature-based organization structure  
- 🔴 Component architecture needs optimization
- 🔴 Naming conventions require standardization

---

## Detailed Assessment

### 1. Next.js 15 Compliance ✅ **EXCELLENT (95/100)**

**Strengths:**
- ✅ Full App Router implementation (no Pages Router remnants)
- ✅ Proper route groups: `(shop)`, `(content)`, `account`
- ✅ Comprehensive error boundaries (`error.tsx`, `global-error.tsx`, `not-found.tsx`)
- ✅ Loading states implemented (`loading.tsx` files)
- ✅ Metadata API properly configured
- ✅ Route-specific layouts in place
- ✅ Parallel routes potential with account structure

**Minor Issues:**
- Route organization could be more granular (checkout could be separate group)

**Directory Structure Analysis:**
```
app/
├── (shop)/          ✅ Shopping experience grouped
├── (content)/       ✅ Content pages grouped  
├── account/         ✅ User account features
├── api/            ✅ API routes properly organized
├── layout.tsx      ✅ Root layout with providers
├── error.tsx       ✅ Global error boundary
├── global-error.tsx✅ Fallback error boundary
├── not-found.tsx   ✅ 404 page
└── manifest.ts     ✅ PWA manifest
```

### 2. React 19 Architecture ⚠️ **NEEDS IMPROVEMENT (65/100)**

**Issues Found:**
- 🔴 **Inconsistent Server/Client Split**: Many components marked 'use client' unnecessarily
- 🔴 **Missing Hybrid Patterns**: No clear server/client boundary management
- 🔴 **Overuse of Client Components**: ProductCard should have server variant as primary

**Current Problems:**

1. **Product Card Architecture** - Incorrect pattern:
```tsx
// components/commerce/product-card.tsx - PROBLEM
'use client'  // ❌ Should be server component by default

// Should be:
// components/commerce/server/product-card.tsx - Server Component (default)
// components/commerce/client/product-card-actions.tsx - Client Component (interactions)
```

2. **Missing Server/Client Directory Structure**:
- Empty `components/commerce/server/` directory
- Empty `components/commerce/client/` directory  
- Empty `components/layout/server/` directory
- Empty `components/layout/client/` directory

3. **Server Actions Usage**: Limited implementation of React 19 Server Actions

**Recommended Fixes:**
1. Restructure ProductCard to hybrid server/client pattern
2. Implement proper server/client directory organization
3. Increase Server Actions usage for forms
4. Add React 19 hooks where applicable

### 3. Feature Organization ⚠️ **NEEDS IMPROVEMENT (60/100)**

**Current Structure Issues:**

**❌ Technical Organization (Current):**
```
components/
├── commerce/        # All commerce components mixed
├── layout/          # All layout components mixed  
├── shared/          # Catch-all shared components
└── ui/              # UI primitives (good)
```

**✅ Recommended Feature-Based Structure:**
```
features/
├── cart/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── products/
│   ├── components/
│   │   ├── server/
│   │   └── client/
│   ├── hooks/
│   └── services/
├── checkout/
├── user/
└── wishlist/
```

**Problems:**
1. **No Feature Boundaries**: Related code scattered across technical layers
2. **No Public APIs**: Features don't export clean interfaces
3. **Tight Coupling**: Direct imports between unrelated modules
4. **No Colocation**: Hooks, components, and services separated

### 4. Component Architecture ⚠️ **NEEDS IMPROVEMENT (70/100)**

**Current Issues:**

1. **Server/Client Hybrid Missing**:
```tsx
// ❌ Current: Only client component
export function ProductCard() // 'use client'

// ✅ Should be: Hybrid pattern
export function ProductCard() // Server Component (default)
  └── ProductCardActions() // 'use client' (interactions only)
```

2. **Inconsistent Naming**:
- `product-card.tsx` (client)
- `product-card-server.tsx` (server)
- `product-card-minimal.tsx` (client)
- `product-card-minimal-server.tsx` (server)

3. **Component Variants**: Too many similar components instead of composed variants

**Recommended Improvements:**
1. Single ProductCard component with variant props
2. Clear server/client boundary with actions component
3. Consistent naming: `product-card/index.tsx`, `product-card/actions.tsx`
4. Compound component pattern for flexibility

### 5. Naming Conventions ⚠️ **NEEDS IMPROVEMENT (75/100)**

**Current Issues:**

**Files:** Mixed conventions
- ✅ Good: `use-cart.tsx`, `product-card.tsx` (kebab-case)
- ❌ Issue: Multiple variants of same component

**Components:** Inconsistent patterns
- ✅ Good: `ProductCard`, `MobileNavigation` (PascalCase)
- ❌ Issue: Too many suffixed variants (`ProductCardServer`, `ProductCardMinimal`)

**Directories:** Good conventions
- ✅ Good: `(shop)`, `account`, `api` (kebab-case/grouped)

**Recommended Standards:**
```typescript
// File naming
components/
├── product-card/
│   ├── index.tsx        // Main component
│   ├── actions.tsx      // Client interactions
│   └── variants.tsx     // Style variants

// Component naming
export function ProductCard()     // PascalCase
export function useCart()         // camelCase with 'use'
export const cartService         // camelCase for instances
```

### 6. Import/Export Patterns ⚠️ **MIXED (70/100)**

**Current Analysis:**
- ✅ Proper TypeScript path mapping (`@/` imports)
- ✅ Consistent import ordering
- ❌ No barrel exports for feature modules
- ❌ Direct component imports instead of feature APIs

**Current Import Pattern:**
```tsx
import { ProductCard } from '@/components/commerce/product-card'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils/price'
```

**Recommended Feature-Based Imports:**
```tsx
import { ProductCard, useProducts } from '@/features/products'
import { useCart } from '@/features/cart'
import { formatPrice } from '@/lib/utils'
```

### 7. E-commerce Architecture ✅ **EXCELLENT (90/100)**

**Strengths:**
- ✅ Excellent Shopify Storefront API integration
- ✅ Hydrogen React for optimized cart management
- ✅ Comprehensive product catalog structure
- ✅ Mobile-optimized commerce components
- ✅ Proper price formatting and currency handling
- ✅ Touch target compliance (44px minimum)
- ✅ Headless commerce patterns

**Areas for Enhancement:**
- Could benefit from feature-based commerce organization
- Search and discovery could be more modular

### 8. Performance Patterns ✅ **GOOD (85/100)**

**Current Implementation:**
- ✅ Next.js Image optimization everywhere
- ✅ Font optimization with Google Fonts
- ✅ Proper loading states and skeletons
- ✅ Lighthouse-optimized images
- ✅ Bundle analysis configured

**Opportunities:**
- Dynamic imports for heavy components (QuickView, etc.)
- More Suspense boundaries for streaming
- Code splitting by feature modules

### 9. Mobile-First Design ✅ **EXCELLENT (95/100)**

**Strengths:**
- ✅ Perfect mobile navigation with bottom nav
- ✅ Touch-optimized product cards
- ✅ Responsive grid layouts
- ✅ Mobile sheet components
- ✅ Haptic feedback implementation
- ✅ Mobile-specific interaction patterns

### 10. Scalability Assessment ⚠️ **NEEDS IMPROVEMENT (65/100)**

**Current Limitations:**
1. **Monolithic component structure** - hard to scale with team size
2. **No feature boundaries** - coupling increases over time  
3. **Mixed concerns** - business logic scattered across layers
4. **No versioning strategy** for component APIs

**Scalability Blockers:**
- Adding new product features requires touching multiple directories
- No clear ownership boundaries for team collaboration
- Testing requires understanding entire component hierarchy

---

## Priority Recommendations

### 🔴 **CRITICAL (Do First)**

1. **Implement Feature-Based Architecture**
   - Effort: 2-3 days
   - Create `features/` directory structure
   - Migrate cart, products, checkout features
   - Establish public APIs with barrel exports

2. **Fix Server/Client Component Split**
   - Effort: 1-2 days
   - Convert ProductCard to hybrid pattern
   - Create proper server/client directories
   - Remove unnecessary 'use client' directives

3. **Standardize Component Architecture**
   - Effort: 1 day
   - Consolidate ProductCard variants
   - Implement compound component pattern
   - Consistent naming conventions

### 🟡 **HIGH PRIORITY (Do Next)**

4. **Implement Server Actions**
   - Effort: 1 day
   - Convert forms to Server Actions
   - Add React 19 hooks (useOptimistic, useActionState)
   - Optimize form handling

5. **Add Dynamic Imports**
   - Effort: 0.5 days
   - Lazy load heavy components
   - Route-based code splitting
   - Bundle size optimization

### 🟢 **MEDIUM PRIORITY (Do Later)**

6. **Enhance Testing Structure**
   - Effort: 1 day
   - Feature-based test organization
   - Component integration tests
   - E2E test coverage

7. **Documentation Standards**
   - Effort: 0.5 days
   - Component documentation
   - Feature API documentation
   - Architecture decision records

---

## Migration Strategy

### Phase 1: Feature Structure (Day 1-2)
1. Create `features/` directory
2. Migrate cart feature first (smallest)
3. Migrate products feature
4. Update import paths

### Phase 2: Component Architecture (Day 3)
1. Refactor ProductCard to hybrid pattern
2. Consolidate component variants
3. Implement server/client directories

### Phase 3: Optimization (Day 4-5)  
1. Add Server Actions
2. Implement dynamic imports
3. Performance testing and validation

---

## Success Metrics

**Target Scores:**
- Overall: A- (90/100)
- Server/Client Architecture: 90/100
- Feature Organization: 85/100  
- Component Architecture: 90/100
- Scalability: 85/100

**Validation Criteria:**
- [ ] Clear feature boundaries established
- [ ] Server/Client components properly split
- [ ] Component variants consolidated
- [ ] Naming conventions standardized
- [ ] Bundle size optimized
- [ ] Team collaboration improved

---

## Phase 2 Preparation: Codebase Audit Framework

### Audit Checklist for Current Project Structure

When Phase 2 begins, evaluate the current codebase against these criteria:

#### 1. Next.js 15 Compliance
- [x] Using App Router (not Pages Router)
- [x] Proper route groups for organization
- [x] Server Components by default
- [ ] Client Components only where needed (**NEEDS FIX**)
- [x] Proper loading.tsx and error.tsx files
- [x] Metadata API implementation

#### 2. React 19 Architecture
- [ ] Server/Client component boundaries clearly defined (**NEEDS FIX**)
- [x] Proper use of Suspense for streaming
- [ ] React 19 hooks (useOptimistic, useActionState) where applicable (**PARTIAL**)
- [x] Server Actions for form handling
- [ ] Minimal use of 'use client' directive (**NEEDS FIX**)

#### 3. Feature Organization
- [ ] Features grouped by business domain (**NEEDS IMPLEMENTATION**)
- [ ] Clear public APIs for feature modules (**NEEDS IMPLEMENTATION**)
- [ ] Proper colocation of related code (**NEEDS IMPLEMENTATION**)
- [x] Consistent naming conventions
- [x] TypeScript strict mode compliance

#### 4. Performance Patterns
- [x] Code splitting implemented
- [ ] Dynamic imports for heavy components (**ENHANCEMENT**)
- [x] Image optimization with Next.js Image
- [x] Font optimization
- [x] Bundle size monitoring

#### 5. E-commerce Specific Patterns
- [x] Headless commerce architecture
- [x] Cart state management
- [x] Product catalog optimization
- [x] Mobile-first responsive design
- [x] Touch target compliance (44px minimum)

#### 6. Scalability Indicators
- [ ] Modular architecture (**NEEDS IMPLEMENTATION**)
- [ ] Clear dependency boundaries (**NEEDS IMPLEMENTATION**)
- [x] Testable component structure
- [x] Documentation completeness
- [x] Deployment readiness

### Scoring Framework

**Excellent (90-100%)**: Production-ready, follows all best practices
**Good (70-89%)**: Solid foundation with minor improvements needed
**Needs Improvement (50-69%)**: Significant refactoring required
**Poor (0-49%)**: Major architectural changes needed

**Current Project Score: B+ (82/100)**

### Recommendations Template

For each audit area, provide:
1. **Current State**: What exists now
2. **Gap Analysis**: What's missing or incorrect
3. **Improvement Plan**: Specific steps to fix issues
4. **Priority Level**: Critical, High, Medium, Low
5. **Effort Estimate**: Time required for changes

## Conclusion

A well-structured Next.js 15 e-commerce application balances developer experience with performance and maintainability. By following these patterns, teams can build scalable applications that grow with business needs while maintaining code quality and performance standards.

The key to success in 2025 is embracing:
- **Headless commerce** for flexibility
- **Server/Client hybrid architecture** for performance
- **Composable commerce** for scalability
- **Mobile-first design** for user experience
- **Feature-based organization** for maintainability

This documentation provides the foundation for Phase 2 codebase evaluation and improvement recommendations.