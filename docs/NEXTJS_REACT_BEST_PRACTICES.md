# Next.js 15 & React 19 Best Practices Guide

> A comprehensive guide for production-ready patterns with zero bloat and clean code

## Table of Contents

1. [App Router Patterns](#app-router-patterns)
2. [Performance Optimization](#performance-optimization)
3. [State Management](#state-management)
4. [TypeScript Integration](#typescript-integration)

---

## App Router Patterns

### Server Components vs Client Components Decision Matrix

#### Default to Server Components

In Next.js 15, **everything in the `app/` directory is a Server Component by default**. This is the most important paradigm shift.

```typescript
// app/products/page.tsx - Server Component by default
export default async function ProductsPage() {
  const products = await fetchProducts(); // Direct database call
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### When to Use Client Components

Use Client Components (`'use client'`) only when you need:
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, document, localStorage)
- React hooks (useState, useEffect, etc.)
- Real-time updates or animations

```typescript
// components/AddToCart.tsx
'use client';

import { useState } from 'react';

export function AddToCart({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAdd = async () => {
    setIsAdding(true);
    // Client-side interaction
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

#### Component Composition Pattern

Keep pages as Server Components and isolate client interactivity:

```typescript
// app/product/[id]/page.tsx - Server Component
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Client Component for interactivity */}
      <AddToCart productId={product.id} />
    </div>
  );
}
```

### Data Fetching Patterns

#### Parallel Data Fetching

Avoid waterfalls by fetching data in parallel:

```typescript
// ❌ Sequential (waterfall)
const user = await fetchUser(id);
const posts = await fetchUserPosts(user.id);

// ✅ Parallel
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchUserPosts(id)
]);
```

#### Streaming with Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { UserStats, RecentOrders, Analytics } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Suspense fallback={<div>Loading stats...</div>}>
        <UserStats />
      </Suspense>
      
      <Suspense fallback={<div>Loading orders...</div>}>
        <RecentOrders />
      </Suspense>
      
      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

### Route Organization

```
app/
├── (marketing)/              # Route group - no URL impact
│   ├── about/
│   └── blog/
├── (shop)/                   # Route group
│   ├── products/
│   └── categories/
├── dashboard/
│   ├── _components/          # Private folder
│   ├── _utils/
│   └── page.tsx
└── api/                      # API routes
    └── products/
```

### Middleware Best Practices

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Run on the edge - keep it lightweight
  const isAuthenticated = request.cookies.get('auth-token');
  
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*']
};
```

### Error Boundaries and Loading States

```typescript
// app/products/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

```typescript
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  );
}
```

---

## Performance Optimization

### React Server Components Optimization

#### Component Granularity

```typescript
// ❌ Large Server Component with client interactivity
export default async function ProductPage() {
  const products = await fetchProducts();
  
  return (
    <div>
      {/* Entire list becomes client component */}
      <ProductList products={products} />
    </div>
  );
}

// ✅ Granular approach
export default async function ProductPage() {
  const products = await fetchProducts();
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {/* Server Component for static content */}
          <ProductInfo product={product} />
          {/* Client Component only for interactivity */}
          <AddToCartButton productId={product.id} />
        </div>
      ))}
    </div>
  );
}
```

### Streaming and Suspense Patterns

#### Partial Prerendering (PPR)

```typescript
// app/product/[id]/page.tsx
import { Suspense } from 'react';

// Static shell loads instantly
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={params.id} />
      </Suspense>
      
      {/* Reviews load independently */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={params.id} />
      </Suspense>
    </div>
  );
}
```

### Image Optimization

```typescript
import Image from 'next/image';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={false} // Set true for above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..." // Generated placeholder
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="rounded-lg"
    />
  );
}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Bundle Size Reduction

#### Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Load heavy components only when needed
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  loading: () => <p>Loading editor...</p>,
  ssr: false, // Disable SSR for client-only components
});

export function PostEditor() {
  const [showEditor, setShowEditor] = useState(false);
  
  return (
    <div>
      {showEditor ? (
        <RichTextEditor />
      ) : (
        <button onClick={() => setShowEditor(true)}>
          Open Editor
        </button>
      )}
    </div>
  );
}
```

#### Tree Shaking with Barrel Exports

```typescript
// ❌ Avoid barrel exports that import everything
export * from './Button';
export * from './Input';
export * from './Modal';

// ✅ Use named exports
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
```

---

## State Management

### Server State vs Client State

#### Server State Management

```typescript
// Server Component - No client state needed
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* Mutations through Server Actions */}
      <UpdateProfileForm user={user} />
    </div>
  );
}
```

#### Client State for UI

```typescript
'use client';

import { useState, useTransition } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (value: string) => {
    setQuery(value);
    startTransition(() => {
      // Non-urgent update
      performSearch(value);
    });
  };
  
  return (
    <input
      type="search"
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder={isPending ? 'Searching...' : 'Search products'}
    />
  );
}
```

### React 19 Hooks Best Practices

#### useOptimistic Hook

```typescript
'use client';

import { useOptimistic } from 'react';

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [likes, setOptimisticLikes] = useOptimistic(initialLikes);
  
  const handleLike = async () => {
    // Optimistically update UI
    setOptimisticLikes(likes + 1);
    
    // Server action will update the real value
    await likePost(postId);
  };
  
  return (
    <button onClick={handleLike}>
      ❤️ {likes}
    </button>
  );
}
```

#### useActionState Hook

```typescript
'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions';

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    message: null,
    errors: {},
  });
  
  return (
    <form action={formAction}>
      <input name="name" defaultValue={user.name} />
      {state.errors?.name && (
        <p className="text-red-500">{state.errors.name}</p>
      )}
      
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      
      {state.message && (
        <p className="text-green-500">{state.message}</p>
      )}
    </form>
  );
}
```

### Context Usage Patterns

#### Server Component Context Pattern

```typescript
// app/providers.tsx
'use client';

import { createContext, useContext } from 'react';

const ThemeContext = createContext<'light' | 'dark'>('light');

export function ThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: 'light' | 'dark';
}) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

```typescript
// app/layout.tsx - Server Component
import { ThemeProvider } from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getUserTheme(); // Server-side data
  
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Form Handling with Server Actions

```typescript
// app/actions/user.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export async function updateProfile(
  prevState: { message: string | null; errors: Record<string, string> },
  formData: FormData
) {
  const validatedFields = updateProfileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });
  
  if (!validatedFields.success) {
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    await db.user.update({
      where: { id: getCurrentUserId() },
      data: validatedFields.data,
    });
    
    revalidatePath('/profile');
    
    return {
      message: 'Profile updated successfully',
      errors: {},
    };
  } catch (error) {
    return {
      message: 'Failed to update profile',
      errors: {},
    };
  }
}
```

---

## TypeScript Integration

### Type Safety Patterns

#### Page Props Types

```typescript
// app/product/[id]/page.tsx
type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProductPage({ params, searchParams }: PageProps) {
  const product = await getProduct(params.id);
  const variant = searchParams.variant || 'default';
  
  return <ProductDisplay product={product} variant={variant} />;
}
```

#### Layout Props Types

```typescript
// app/dashboard/layout.tsx
type LayoutProps = {
  children: React.ReactNode;
  analytics: React.ReactNode; // Parallel route
  metrics: React.ReactNode;   // Parallel route
};

export default function DashboardLayout({
  children,
  analytics,
  metrics,
}: LayoutProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">{children}</div>
      <div>
        {analytics}
        {metrics}
      </div>
    </div>
  );
}
```

### Generic Component Patterns

```typescript
// components/DataTable.tsx
type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} onClick={() => onRowClick?.(item)}>
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### API Route Typing

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createProductSchema.parse(body);
    
    const product = await createProduct(validated);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Server Action Types

```typescript
// app/actions/types.ts
export type ActionState<T = any> = {
  message: string | null;
  errors: Record<string, string[] | undefined>;
  data?: T;
};

// app/actions/product.ts
'use server';

import type { ActionState } from './types';

export async function createProduct(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState<{ productId: string }>> {
  // Implementation with full type safety
  const result = await db.product.create({
    data: {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
    },
  });
  
  return {
    message: 'Product created successfully',
    errors: {},
    data: { productId: result.id },
  };
}
```

### Environment Variables Type Safety

```typescript
// env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);

// Now use with full type safety
// env.DATABASE_URL // typed as string
// env.NODE_ENV // typed as 'development' | 'production' | 'test'
```

---

## Key Takeaways

1. **Default to Server Components**: Keep components on the server unless you need client-side interactivity
2. **Optimize Strategically**: Use Suspense boundaries for independent loading states
3. **Type Everything**: Leverage TypeScript for end-to-end type safety
4. **Progressive Enhancement**: Forms work without JavaScript using Server Actions
5. **Performance First**: Stream content, optimize images, and reduce bundle size

Remember: Next.js 15 with React 19 provides powerful primitives. Use them wisely to build fast, maintainable applications with excellent user experience.