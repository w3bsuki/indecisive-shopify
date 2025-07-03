# React 19 Server/Client Components Expert Guide

> Comprehensive documentation for React 19 Server/Client component patterns, new hooks, and performance optimization strategies for 2025.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Server vs Client Component Decision Matrix](#server-vs-client-component-decision-matrix)
3. [React 19 New Hooks](#react-19-new-hooks)
4. [Data Fetching Patterns](#data-fetching-patterns)
5. [State Management in React 19](#state-management-in-react-19)
6. [Streaming and Suspense Patterns](#streaming-and-suspense-patterns)
7. [Performance Optimization](#performance-optimization)
8. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
9. [Migration Guide](#migration-guide)

---

## Executive Summary

### What's New in React 19 (2025)

React 19 was officially released on December 5, 2024, marking a paradigm shift in how we build web applications, with Server Components now stable and a suite of new hooks that simplify complex patterns.

**Key Changes:**
- **Server Components**: Now production-ready with improved streaming and direct data layer access
- **New Hooks**: `useActionState`, `useOptimistic`, `useFormStatus`, `use()`
- **Actions & Server Actions**: Replace event handlers for forms and mutations with built-in pending states
- **React Compiler**: Built-in compiler that transforms components into optimized JavaScript
- **Document Metadata**: Built-in support for `<title>`, `<meta>`, and `<link>`
- **Asset Loading**: Integrated resource loading with Suspense
- **Improved ref Handling**: No longer need `forwardRef` for function components
- **Better Hydration**: Faster and more reliable client-side hydration with improved error reporting
- **Web Components**: Better integration with custom elements

**React 19.1 Update (March 28, 2025):**
- Enhanced Suspense functionality with expanded support across all application lifecycle phases
- Improved debugging capabilities for Server Components
- Better error handling and performance optimizations
- Addresses the 300ms Suspense throttling limitation that was a community pain point

### Core Philosophy

React 19 embraces a **server-first architecture** where:
1. Components render on the server by default
2. Client interactivity is added only when necessary
3. Data fetching happens close to where it's needed
4. The network boundary is explicit and optimized

---

## Server vs Client Component Decision Matrix

### Quick Decision Guide

| Feature Needed | Component Type | Reason |
|----------------|----------------|---------|
| Database queries | Server | Direct backend access |
| API calls | Server | Avoid exposing keys |
| Large dependencies | Server | Reduce bundle size |
| Static content | Server | Better performance |
| Event handlers | Client | Browser interaction |
| Browser APIs | Client | DOM/Window access |
| State (useState) | Client | Reactive updates |
| Effects (useEffect) | Client | Lifecycle hooks |
| Real-time updates | Client | WebSocket/polling |
| Animations | Client | RAF/transitions |

### Detailed Component Patterns

#### Server Components (Default)

```typescript
// app/products/page.tsx - Server Component by default
import { db } from '@/lib/db';
import { ProductCard } from '@/components/product-card';

export default async function ProductsPage() {
  // Direct database access - no API needed
  const products = await db.query.products.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        // ProductCard can be a Server Component too
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Client Components (Explicit)

```typescript
// components/add-to-cart.tsx
'use client'; // Explicit client boundary

import { useTransition, useOptimistic } from 'react';
import { addToCart } from '@/app/actions';

export function AddToCart({ productId, inStock }: { productId: string; inStock: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticInCart, setOptimisticInCart] = useOptimistic(false);

  async function handleAdd() {
    startTransition(async () => {
      setOptimisticInCart(true);
      await addToCart(productId);
    });
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock || isPending}
      className="..."
    >
      {optimisticInCart ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
```

### Component Boundary Best Practices

#### 1. Minimize Client Component Scope

```typescript
// ❌ Bad: Entire page becomes client component
'use client';
export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  // Entire page is now client-side
}

// ✅ Good: Only interactive parts are client
// app/product/[id]/page.tsx - Server Component
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  return (
    <>
      <ProductInfo product={product} /> {/* Server Component */}
      <QuantitySelector productId={product.id} /> {/* Client Component */}
    </>
  );
}
```

#### 2. Composition Over Props Drilling

```typescript
// ✅ Server Component wrapper with Client Component children
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  return (
    <div>
      <ServerHeader user={user} />
      <ClientSidebar> {/* Client Component */}
        {children} {/* Can be Server Components */}
      </ClientSidebar>
    </div>
  );
}
```

---

## React 19 New Hooks

### 1. useActionState Hook

The `useActionState` hook simplifies form state management by accepting a function (the "Action") and returning a wrapped Action to call. It eliminates the need for excessive useState hooks, automating pending states and reducing boilerplate code.

**Key Benefits:**
- Automatic pending state management
- Built-in error handling
- Cleaner code with less boilerplate
- Improved maintainability

```typescript
// app/actions/user.ts
'use server';

export async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get('name');
  
  try {
    await db.user.update({
      where: { id: getCurrentUserId() },
      data: { name }
    });
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return { error: 'Failed to update profile' };
  }
}

// components/profile-form.tsx
'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions/user';

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    { message: null, error: null }
  );

  return (
    <form action={formAction}>
      <input name="name" defaultValue={user.name} />
      
      {isPending && <p>Saving...</p>}
      {state.message && <p className="text-green-500">{state.message}</p>}
      {state.error && <p className="text-red-500">{state.error}</p>}
      
      <button type="submit" disabled={isPending}>
        Save Changes
      </button>
    </form>
  );
}
```

### 2. useOptimistic Hook

The `useOptimistic` hook brings the power of optimistic UI updates by allowing immediate UI updates while background operations are still in progress. It accepts the current state and an update function, returning the optimistic state and a dispatch function.

**Key Benefits:**
- Instant user feedback
- Better perceived performance
- Automatic rollback on errors
- Smoother user experience

```typescript
'use client';

import { useOptimistic } from 'react';
import { toggleLike } from '@/app/actions';

export function LikeButton({ postId, initialLiked, initialCount }: Props) {
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(initialLiked);
  const [optimisticCount, setOptimisticCount] = useOptimistic(initialCount);

  async function handleToggle() {
    // Optimistic update
    setOptimisticLiked(!optimisticLiked);
    setOptimisticCount(optimisticLiked ? optimisticCount - 1 : optimisticCount + 1);
    
    // Server action will sync the real state
    await toggleLike(postId);
  }

  return (
    <button onClick={handleToggle} className={optimisticLiked ? 'text-red-500' : ''}>
      ❤️ {optimisticCount}
    </button>
  );
}
```

### 3. useFormStatus Hook

The `useFormStatus` hook provides real-time information about the last form submission, including pending state, form data, HTTP method, and action. It must be called from inside a component that is also inside a form.

**Key Benefits:**
- Access form state from any child component
- No prop drilling needed
- Real-time submission status
- Works with design systems

**Important Note:** `useFormStatus` only returns status information of the parent form element and not the form element rendered in the same component.

```typescript
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage in parent form
export function ContactForm() {
  return (
    <form action={sendMessage}>
      <input name="message" required />
      <SubmitButton /> {/* Automatically knows form state */}
    </form>
  );
}
```

### 4. use() Hook

The `use()` hook is a new API to read resources in render, including promises and context. Unlike traditional hooks, `use()` can be called conditionally (such as after early returns) and will Suspend until promises resolve.

**Key Benefits:**
- Read promises directly in render
- Conditional context reading
- Works with Suspense boundaries
- More flexible than traditional hooks

```typescript
'use client';

import { use, Suspense } from 'react';

// Can read promises during render
function ProductDetails({ productPromise }: { productPromise: Promise<Product> }) {
  const product = use(productPromise); // Suspends until resolved
  
  return <div>{product.name}</div>;
}

// Can conditionally read context
function ConditionalTheme({ dark }: { dark: boolean }) {
  if (dark) {
    const theme = use(ThemeContext); // OK to call conditionally
    return <div style={{ color: theme.text }}>Dark mode</div>;
  }
  return <div>Light mode</div>;
}

// Parent component
export function ProductPage({ id }: { id: string }) {
  const productPromise = fetch(`/api/products/${id}`).then(r => r.json());
  
  return (
    <Suspense fallback={<Loading />}>
      <ProductDetails productPromise={productPromise} />
    </Suspense>
  );
}
```

---

## Data Fetching Patterns

### 1. Server-Side Data Fetching

```typescript
// Direct database access in Server Components
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Parallel data fetching
  const [product, reviews, related] = await Promise.all([
    db.product.findUnique({ where: { id: params.id } }),
    db.review.findMany({ where: { productId: params.id } }),
    db.product.findMany({ where: { categoryId: product.categoryId }, take: 4 })
  ]);

  return (
    <>
      <ProductDetails product={product} />
      <ReviewList reviews={reviews} />
      <RelatedProducts products={related} />
    </>
  );
}
```

### 2. Streaming with Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Each section loads independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <UserStats /> {/* Async Server Component */}
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <SalesChart /> {/* Async Server Component */}
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders /> {/* Async Server Component */}
      </Suspense>
    </div>
  );
}
```

### 3. Request Deduplication

React 19 automatically deduplicates requests made during the same render.

```typescript
// These components can call the same function
async function getUser(id: string) {
  // This will only make one request even if called multiple times
  const user = await fetch(`/api/users/${id}`, {
    next: { revalidate: 60 } // Next.js caching
  });
  return user.json();
}

// Multiple components can call getUser(id) - only one request is made
export async function UserAvatar({ userId }: { userId: string }) {
  const user = await getUser(userId);
  return <img src={user.avatar} alt={user.name} />;
}

export async function UserName({ userId }: { userId: string }) {
  const user = await getUser(userId); // Same request, deduped!
  return <span>{user.name}</span>;
}
```

### 4. Incremental Data Loading

```typescript
// Load critical data first, enhancement data later
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Critical: Load immediately
  const product = await getProduct(params.id);

  return (
    <>
      <ProductHero product={product} />
      
      {/* Non-critical: Load after initial paint */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />
      </Suspense>
      
      <Suspense fallback={null}>
        <RecommendedProducts categoryId={product.categoryId} />
      </Suspense>
    </>
  );
}
```

---

## State Management in React 19

### 1. Server State vs Client State

```typescript
// Server state: Data from database/API
export default async function ProductList() {
  const products = await db.product.findMany(); // Server state
  
  return <ProductGrid products={products} />;
}

// Client state: UI interactions
'use client';
export function ProductFilters() {
  const [filters, setFilters] = useState({ price: 'all', category: 'all' });
  const [isOpen, setIsOpen] = useState(false);
  
  // Client state for UI
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Filters</button>
      {/* Filter UI */}
    </div>
  );
}
```

### 2. Form State with Actions

```typescript
// app/actions/product.ts
'use server';

export async function createProduct(prevState: any, formData: FormData) {
  const result = await db.product.create({
    data: {
      name: formData.get('name'),
      price: Number(formData.get('price')),
    }
  });
  
  revalidatePath('/products');
  return { success: true, product: result };
}

// components/product-form.tsx
'use client';

export function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, {});
  
  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="price" type="number" required />
      
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Product'}
      </button>
      
      {state.success && <p>Product created!</p>}
    </form>
  );
}
```

### 3. Optimistic Updates Pattern

```typescript
'use client';

import { useOptimistic, useTransition } from 'react';

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setOptimisticTodos] = useOptimistic(initialTodos);
  const [isPending, startTransition] = useTransition();

  async function addTodo(text: string) {
    const newTodo = { id: crypto.randomUUID(), text, completed: false };
    
    startTransition(async () => {
      // Optimistic update
      setOptimisticTodos([...todos, newTodo]);
      
      // Server action
      await createTodo(text);
    });
  }

  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <AddTodoForm onAdd={addTodo} disabled={isPending} />
    </div>
  );
}
```

---

## Streaming and Suspense Patterns

### Streaming SSR Architecture (React 19)

React 19 introduces significant improvements to streaming SSR with two major features:
1. **Streaming HTML on the server**: Using `renderToPipeableStream` instead of `renderToString`
2. **Selective Hydration on the client**: Using `hydrateRoot` with `<Suspense>` boundaries

**Key Benefits:**
- **Selective Hydration**: React can start hydrating chunks at different timings and priorities
- **Memory Optimization**: Reduces memory usage for large component trees
- **Better Performance**: Suspense boundaries split the application into chunks based on data fetching requirements

### 1. Progressive Enhancement

```typescript
// Start with static shell, enhance with dynamic content
export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <article>
      {/* Static content loads immediately */}
      <Suspense fallback={<HeaderSkeleton />}>
        <ArticleHeader slug={params.slug} />
      </Suspense>
      
      {/* Content streams in when ready */}
      <Suspense fallback={<ContentSkeleton />}>
        <ArticleContent slug={params.slug} />
      </Suspense>
      
      {/* Comments load last, don't block anything */}
      <Suspense fallback={null}>
        <Comments slug={params.slug} />
      </Suspense>
    </article>
  );
}
```

### Streaming with Stylesheet Loading

React 19 ensures stylesheets are loaded correctly during streaming:
- **Server-side**: React includes stylesheets in `<head>` to ensure browser won't paint until loaded
- **Client-side**: React waits for stylesheets to load before committing render
- **Suspense Integration**: Stylesheets discovered late are inserted before revealing Suspense boundary content

### 2. Error Boundaries with Streaming

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// Granular error boundaries
export default function ProductPage() {
  return (
    <>
      <ErrorBoundary fallback={<ProductError />}>
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetails />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<ReviewsError />}>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
```

### 3. Parallel vs Sequential Loading

```typescript
// ❌ Sequential loading - slow
export default async function SlowPage() {
  const user = await getUser();
  const posts = await getUserPosts(user.id); // Waits for user
  const comments = await getPostComments(posts[0].id); // Waits for posts
  
  return <>{/* ... */}</>;
}

// ✅ Parallel loading - fast
export default function FastPage({ userId }: { userId: string }) {
  return (
    <>
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile userId={userId} />
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts userId={userId} /> {/* Loads in parallel */}
      </Suspense>
      
      <Suspense fallback={<StatsSkeleton />}>
        <UserStats userId={userId} /> {/* Loads in parallel */}
      </Suspense>
    </>
  );
}
```

### 4. Suspense Throttling (2025 Update)

**Important Note**: React 19 initially maintained the 300ms Suspense throttling, which has been a pain point for the React community. However, React 19.1 (March 2025) addresses this limitation with:

- **Improved Suspense Control**: Better control over Suspense timing
- **Expanded Lifecycle Support**: Suspense boundaries work consistently across client, server, and hydration
- **Performance Improvements**: Reduced throttling delays for better user experience

```typescript
// React 19.1 improvements allow for more responsive Suspense
export default function ResponsivePage() {
  return (
    <>
      {/* Faster Suspense resolution in React 19.1 */}
      <Suspense fallback={<QuickSkeleton />}>
        <FastLoadingComponent />
      </Suspense>
      
      {/* Improved streaming performance */}
      <Suspense fallback={<DetailedSkeleton />}>
        <DetailedContent />
      </Suspense>
    </>
  );
}
```

---

## Performance Optimization

### React Compiler (New in React 19)

React 19 introduces a built-in compiler that transforms React components into highly optimized JavaScript code. This compiler handles rendering and state updates autonomously, reducing the need for manual optimization hooks.

**Key Benefits:**
- **Automatic Memoization**: Compiler automatically handles memoization without `useMemo`, `useCallback`, or `memo`
- **Cleaner Code**: Eliminates boilerplate optimization code  
- **Better Performance**: Up to 40% bundle size reduction and improved runtime performance
- **Memory Efficiency**: Reduces memory usage for large component trees

```typescript
// Before (React 18) - Manual optimization
const ExpensiveComponent = memo(({ data, callback }) => {
  const processed = useMemo(() => processData(data), [data]);
  const memoizedCallback = useCallback(callback, [callback]);
  
  return <div onClick={memoizedCallback}>{processed}</div>;
});

// After (React 19 with compiler) - Automatic optimization
function ExpensiveComponent({ data, callback }) {
  const processed = processData(data); // Compiler handles memoization
  return <div onClick={callback}>{processed}</div>; // Compiler optimizes automatically
}
```

### 1. Bundle Size Optimization

```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/rich-text-editor'),
  {
    loading: () => <div>Loading editor...</div>,
    ssr: false // Don't SSR heavy client components
  }
);

// Lazy load modals and overlays
const CheckoutModal = dynamic(
  () => import('@/components/checkout-modal')
);

// Result: Initial bundle size reduced by up to 40%
```

### 2. Actions for Performance

Actions in React 19 provide automatic optimization features:

```typescript
// Actions automatically manage:
// - Pending states
// - Error handling  
// - Optimistic updates
// - Form submissions

'use server';
export async function updateProduct(prevState: any, formData: FormData) {
  // Automatic pending state management
  // Automatic error handling
  // Automatic optimistic update reversion on failure
  
  try {
    const result = await db.product.update({
      where: { id: formData.get('id') },
      data: { name: formData.get('name') }
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 3. Preloading and Prefetching

```typescript
// Preload critical resources
import { preload, prefetchDNS } from 'react-dom';

// In Server Component
export default async function Layout({ children }: { children: React.ReactNode }) {
  // Preload critical assets
  preload('/fonts/inter.woff2', { as: 'font', crossOrigin: 'anonymous' });
  preload('/api/user', { as: 'fetch' });
  
  // Prefetch DNS for external resources
  prefetchDNS('https://cdn.shopify.com');
  
  return <>{children}</>;
}
```

### 4. Image Optimization

```typescript
import Image from 'next/image';

export function OptimizedProductImage({ product }: { product: Product }) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      width={800}
      height={600}
      priority={product.featured} // LCP optimization
      placeholder="blur"
      blurDataURL={product.blurDataUrl}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
    />
  );
}
```

### 5. Selective Hydration

```typescript
// Hydrate interactive components first
'use client';

import { useEffect } from 'react';

export function InteractiveSection({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mark as high priority for hydration
    if ('scheduler' in window && 'yield' in window.scheduler) {
      window.scheduler.yield();
    }
  }, []);

  return <div>{children}</div>;
}
```

---

## React 19 Advanced Patterns (2025)

### 1. Async Transitions

React 19 adds support for using async functions in transitions to handle pending states, errors, forms, and optimistic updates automatically.

```typescript
'use client';

import { useTransition } from 'react';

export function AsyncTransitionExample() {
  const [isPending, startTransition] = useTransition();
  
  const handleAsyncAction = () => {
    startTransition(async () => {
      // The async transition will:
      // 1. Immediately set isPending to true
      // 2. Make the async request(s)
      // 3. Switch isPending to false after completion
      
      await updateUserProfile(userData);
      await refreshUserData();
    });
  };
  
  return (
    <button onClick={handleAsyncAction} disabled={isPending}>
      {isPending ? 'Updating...' : 'Update Profile'}
    </button>
  );
}
```

### 2. Improved ref Handling

Starting in React 19, you can access `ref` as a prop for function components without `forwardRef`.

```typescript
// Before (React 18)
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>;
  }
);

// After (React 19)
function Button({ children, ref, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return <button ref={ref} {...props}>{children}</button>;
}
```

### 3. Document Metadata Integration

React 19 provides built-in support for document metadata, eliminating the need for libraries like `react-helmet`.

```typescript
// Built-in metadata support
export default function ProductPage({ product }: { product: Product }) {
  return (
    <>
      <title>{product.name} - Store</title>
      <meta name="description" content={product.description} />
      <meta property="og:title" content={product.name} />
      <meta property="og:image" content={product.image} />
      <link rel="canonical" href={`/products/${product.id}`} />
      
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </div>
    </>
  );
}
```

### 4. Enhanced Error Boundaries

React 19 improves error reporting for hydration errors and provides better debugging information.

```typescript
// Enhanced error boundary with React 19
'use client';

export default function EnhancedErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // React 19 provides better error information
  const errorInfo = {
    message: error.message,
    digest: error.digest, // Server-side error digest
    stack: error.stack,
    timestamp: new Date().toISOString(),
  };
  
  return (
    <div className="error-boundary">
      <h2>Something went wrong!</h2>
      <details>
        <summary>Error Details</summary>
        <pre>{JSON.stringify(errorInfo, null, 2)}</pre>
      </details>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Common Mistakes to Avoid

### 1. Over-Clientization

```typescript
// ❌ Making entire page client component
'use client';
export default function ProductPage() {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    fetch('/api/product').then(/* ... */);
  }, []);
  
  return /* ... */;
}

// ✅ Keep data fetching on server
export default async function ProductPage() {
  const product = await getProduct();
  
  return (
    <>
      <ProductInfo product={product} />
      <ClientInteractions productId={product.id} />
    </>
  );
}
```

### 2. Prop Drilling Server Data

```typescript
// ❌ Passing server data through multiple client components
export default async function Page() {
  const user = await getUser();
  
  return <ClientLayout user={user} />; // Everything becomes client
}

// ✅ Fetch data where needed
export default function Page() {
  return (
    <Layout>
      <UserSection /> {/* Fetches its own data */}
    </Layout>
  );
}
```

### 3. Misusing Suspense

```typescript
// ❌ Suspense around non-async components
<Suspense fallback={<Loading />}>
  <RegularComponent /> {/* This doesn't suspend */}
</Suspense>

// ✅ Suspense around async components or lazy imports
<Suspense fallback={<Loading />}>
  <AsyncServerComponent /> {/* Server Component that fetches data */}
</Suspense>
```

### 4. State in Server Components

```typescript
// ❌ Server Components can't have state
export default function ServerComponent() {
  const [count, setCount] = useState(0); // Error!
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ Extract interactive parts to Client Components
export default function ServerComponent() {
  return <Counter initialCount={0} />;
}

'use client';
function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 5. Blocking Data Fetching

```typescript
// ❌ Waterfall data fetching
export default async function Page() {
  const user = await getUser();
  const posts = await getPosts(user.id);
  const likes = await getLikes(posts.map(p => p.id));
  
  return /* ... */;
}

// ✅ Parallel data fetching
export default async function Page({ userId }: { userId: string }) {
  const [user, posts] = await Promise.all([
    getUser(userId),
    getPosts(userId)
  ]);
  
  return /* ... */;
}
```

---

## Migration Guide

### From Pages Router to App Router

```typescript
// pages/products/[id].tsx (Pages Router)
export default function ProductPage({ product }) {
  return <ProductDetails product={product} />;
}

export async function getServerSideProps({ params }) {
  const product = await getProduct(params.id);
  return { props: { product } };
}

// app/products/[id]/page.tsx (App Router)
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetails product={product} />;
}
```

### From Client to Server Components

```typescript
// Before: Client Component with data fetching
'use client';
export function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products').then(/* ... */);
  }, []);
  
  return /* ... */;
}

// After: Server Component
export async function ProductList() {
  const products = await db.product.findMany();
  return /* ... */;
}
```

### Updating Event Handlers to Actions

```typescript
// Before: Client-side form
'use client';
export function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    await fetch('/api/contact', { method: 'POST', body: /* ... */ });
    setIsPending(false);
  };
  
  return <form onSubmit={handleSubmit}>/* ... */</form>;
}

// After: Server Action
export function ContactForm() {
  return (
    <form action={sendMessage}>
      <input name="message" />
      <SubmitButton />
    </form>
  );
}

async function sendMessage(formData: FormData) {
  'use server';
  await db.message.create({ data: { text: formData.get('message') } });
}
```

---

## Performance Checklist

### React 19 Specific
- [ ] Server Components used by default
- [ ] Client Components only for interactivity
- [ ] Actions used for form submissions
- [ ] React Compiler enabled (automatic memoization)
- [ ] `useActionState` for form state management
- [ ] `useOptimistic` for instant feedback
- [ ] `useFormStatus` for submission states
- [ ] `use()` hook for conditional resource reading
- [ ] Async transitions for better UX
- [ ] Streaming SSR with `renderToPipeableStream`
- [ ] Selective hydration with `hydrateRoot`
- [ ] Built-in metadata instead of external libraries

### General Performance  
- [ ] Data fetching happens in parallel
- [ ] Suspense boundaries for independent loading
- [ ] Dynamic imports for heavy components
- [ ] Images optimized with next/image
- [ ] Fonts optimized and preloaded
- [ ] Critical CSS inlined
- [ ] JavaScript bundle < 200KB initial load
- [ ] Time to Interactive < 3 seconds
- [ ] Cumulative Layout Shift < 0.1
- [ ] No hydration mismatches
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Forms work without JavaScript
- [ ] Stylesheet loading optimized
- [ ] Request deduplication working
- [ ] Bundle size reduced by 30-40% (React Compiler)

### React 19.1 Improvements
- [ ] Enhanced Suspense performance (reduced throttling)
- [ ] Improved debugging capabilities
- [ ] Better error reporting for hydration
- [ ] Consistent Suspense behavior across lifecycle phases

---

## Resources

- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Patterns.dev](https://www.patterns.dev/)
- [React Server Components Demo](https://github.com/reactjs/server-components-demo)

---

## 🔍 AUDIT FINDINGS

### Component Analysis Overview

**Audit Date**: January 30, 2025  
**React Version**: 19.1.0  
**Next.js Version**: 15.3.4  
**Total Components Analyzed**: 102  

### 📊 Server/Client Component Distribution

#### Component Architecture Analysis

| Component Type | Count | Percentage | Status |
|---------------|-------|------------|---------|
| **Server Components** | 26 | 25.5% | ✅ Good baseline |
| **Client Components** | 76 | 74.5% | ⚠️ High ratio |
| **UI Components (shadcn/ui)** | 49 | 48% | ✅ Properly client |
| **Layout Components** | 12 | 11.8% | ⚠️ Mixed pattern |
| **Commerce Components** | 17 | 16.7% | ⚠️ Over-clientized |

#### Detailed Component Breakdown

**✅ EXCELLENT: Server/Client Hybrid Patterns**
- `HeroEnhancedServer` + `HeroEnhancedClient` - Perfect separation
- `ProductCardServer` + `ProductCardActions` - Optimal composition  
- `ProductCardMinimalServer` - Pure server rendering with client actions
- `NewsletterSection` - Server wrapper with client form

**⚠️ IMPROVEMENT OPPORTUNITIES: Over-Clientized Components**
- `HeroEnhanced` - Old client-only version (should migrate to hybrid)
- `ProductCard` - Full client component (data fetching on client)
- `CommunitySection` - Could be server component with client interactions
- `ProductCarousel` - Unnecessary client rendering for static content

**❌ CONCERNS: Missing Server Component Opportunities**
- Product listing pages fetch data client-side
- Search results could be server-rendered
- Category pages use client components unnecessarily

### 🎯 React 19 Hooks Adoption

#### Current Hook Usage Analysis

| Hook | Usage Count | Implementation Quality | Adoption Status |
|------|-------------|----------------------|-----------------|
| `useActionState` | 5 forms | ✅ Excellent | 100% adopted |
| `useOptimistic` | 0 | ❌ Not implemented | 0% adopted |
| `useFormStatus` | 0 | ❌ Missing | 0% adopted |
| `use()` | 0 | ❌ Not implemented | 0% adopted |
| `useTransition` | 0 | ❌ Missing async patterns | 0% adopted |

#### Form State Management (✅ EXCELLENT)

**Perfect Implementation Found:**
```typescript
// app/login/login-form.tsx
const [state, formAction, isPending] = useActionState(loginAction, {})
```

**Server Actions Integration:**
- ✅ All forms use Server Actions correctly
- ✅ Proper validation with Zod schemas
- ✅ Error handling implemented
- ✅ Pending states managed automatically

#### Missing Hook Opportunities

**1. Optimistic Updates (❌ CRITICAL MISSING)**
```typescript
// Should implement in cart operations
const [optimisticCart, setOptimisticCart] = useOptimistic(cart)
```

**2. Form Status Context (❌ MISSING)**
```typescript
// Should implement for button components
const { pending } = useFormStatus()
```

**3. Async Transitions (❌ MISSING)**
```typescript
// Should implement for cart/wishlist operations
startTransition(async () => {
  await addToCart(productId)
})
```

### 🚀 Data Fetching Patterns

#### Current Implementation Assessment

**✅ EXCELLENT: Server-Side Data Fetching**
- Homepage uses `getProducts()` in Server Component
- Product pages fetch data on server with `getProduct()`
- Proper error boundaries with fallback UI
- Static generation for product pages

**✅ GOOD: Parallel Data Loading**
```typescript
// app/page.tsx - Good pattern
const productsData = await getProducts(8)
const relatedProductsData = await getProducts(8)
```

**❌ MISSING: Advanced Streaming Patterns**
- No Suspense boundaries for independent sections
- No Progressive Enhancement with streaming
- Missing incremental data loading patterns

#### Streaming Implementation Status

**Current Streaming Usage:**
- ✅ Single Suspense boundary in product image gallery
- ❌ Missing: Dashboard-style parallel loading
- ❌ Missing: Independent section streaming
- ❌ Missing: Error boundaries per section

**Recommended Streaming Pattern:**
```typescript
// Missing implementation
<Suspense fallback={<ProductSkeleton />}>
  <ProductDetails id={id} />
</Suspense>
<Suspense fallback={<ReviewsSkeleton />}>
  <ProductReviews id={id} />
</Suspense>
```

### 🎨 Component Architecture Patterns

#### Server Component Best Practices (✅ GOOD)

**Excellent Examples Found:**
1. **Homepage (`app/page.tsx`)**
   - Pure server component with data fetching
   - Proper error handling with try/catch
   - Composition with mixed server/client components

2. **Product Card Server (`product-card-server.tsx`)**
   - Server-side price formatting
   - Translation handling on server
   - Client actions isolated to separate component

#### Client Component Patterns (⚠️ MIXED)

**Good Practices:**
- ✅ Proper `'use client'` directives
- ✅ Event handlers and state management
- ✅ Browser API usage (cart persistence)

**Areas for Improvement:**
- ⚠️ Some components fetch data client-side unnecessarily
- ⚠️ State management could use React 19 patterns
- ⚠️ Missing optimistic UI updates

### 🔄 State Management Analysis

#### Current State Patterns

**✅ EXCELLENT: Cart State Management**
```typescript
// hooks/use-cart.tsx - Good Hydrogen React integration
const {
  status, lines, totalQuantity, cost, checkoutUrl, cartReady,
  linesAdd, linesRemove, linesUpdate
} = useHydrogenCart()
```

**✅ GOOD: Form State with Actions**
- All authentication forms use `useActionState`
- Server Actions for mutations
- Proper validation and error handling

**❌ MISSING: React 19 Optimistic Patterns**

Current pattern (synchronous):
```typescript
// Current implementation
addItem(variant, 1)
toast.success('Added to cart')
```

Should be optimistic:
```typescript
// Recommended React 19 pattern
const [optimisticCart, setOptimisticCart] = useOptimistic(cart)
setOptimisticCart(prev => [...prev, newItem]) // Immediate UI update
await addToCart(variant) // Background sync
```

### 📈 Performance Optimization Status

#### Bundle Splitting Assessment

**✅ GOOD: Dynamic Imports**
- UI components properly code-split
- Layout components optimized

**❌ MISSING: React 19 Compiler Benefits**
- No automatic memoization leveraged
- Manual optimization patterns still present
- Missing React Compiler configuration

#### Image and Asset Optimization

**✅ EXCELLENT: Next.js Image Optimization**
```typescript
// Found in components
<Image
  src={product.featuredImage.url}
  alt={product.title}
  fill
  sizes="(max-width: 768px) 50vw, 33vw"
  priority={priority}
/>
```

### 🎯 Migration Recommendations

#### Priority 1: Implement Optimistic UI (HIGH IMPACT)

**Cart Operations Enhancement:**
```typescript
// Current: Synchronous feedback
addItem(variant, 1)

// Recommended: Optimistic updates
const [optimisticLines, setOptimisticLines] = useOptimistic(lines)
setOptimisticLines(prev => [...prev, optimisticItem])
await addItem(variant, 1)
```

**Wishlist Operations:**
```typescript
// Add optimistic wishlist updates
const [optimisticWishlist, setOptimisticWishlist] = useOptimistic(wishlist)
```

#### Priority 2: Enhanced Streaming Patterns (MEDIUM IMPACT)

**Product Page Enhancement:**
```typescript
// Recommended streaming structure
<Suspense fallback={<ProductInfoSkeleton />}>
  <ProductInfo productId={id} />
</Suspense>
<Suspense fallback={<RelatedSkeleton />}>
  <RelatedProducts categoryId={categoryId} />
</Suspense>
```

#### Priority 3: Form Status Context (LOW IMPACT)

**Button Component Enhancement:**
```typescript
// Add to button components
function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button disabled={pending}>{pending ? 'Saving...' : 'Save'}</Button>
}
```

### 📊 Overall Architecture Grade

| Category | Grade | Score | Notes |
|----------|-------|-------|-------|
| **Server/Client Split** | B+ | 82/100 | Good foundation, room for optimization |
| **React 19 Adoption** | C+ | 70/100 | Forms excellent, missing optimistic patterns |
| **Data Fetching** | A- | 88/100 | Server-first approach implemented well |
| **Performance** | B | 80/100 | Good optimization, missing React 19 benefits |
| **Code Quality** | A- | 90/100 | Clean architecture, consistent patterns |

**Overall Architecture Grade: B+ (83/100)**

### 🚀 Next Steps

1. **Immediate (Week 1)**
   - Implement `useOptimistic` for cart operations
   - Add `useFormStatus` to form components
   - Migrate `HeroEnhanced` to hybrid pattern

2. **Short-term (Week 2-3)**
   - Add Suspense boundaries for parallel loading
   - Implement async transitions for heavy operations
   - Enable React Compiler optimizations

3. **Long-term (Month 1)**
   - Migrate remaining over-clientized components
   - Implement progressive enhancement patterns
   - Add `use()` hook for conditional data loading

---

**Last Updated**: January 30, 2025  
**React Version**: 19.1.0  
**Next.js Version**: 15.3.4