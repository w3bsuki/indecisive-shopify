# shadcn/ui Component Architecture Guide

A comprehensive guide to building a modular component system with shadcn/ui and Radix UI, focusing on clean, minimal design with perfect styling tokens.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Design System Integration](#design-system-integration)
- [Component Patterns](#component-patterns)
- [Performance & Bundle Size](#performance--bundle-size)
- [Implementation Examples](#implementation-examples)

## Component Architecture

### 1. Compound Component Patterns

Compound components provide a flexible way to share state within React applications. They work by creating parent components made up of child components that share implicit state.

#### Benefits:
- Clear division of responsibility between parent and child components
- Eliminates prop drilling
- More expressive and flexible APIs
- Easier to maintain and debug

#### Implementation with Context API:

```tsx
// Example: Custom Select Component using compound pattern
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"

// Context for sharing state
const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

// Parent component
export const Select = ({ children, ...props }: SelectPrimitive.SelectProps) => {
  const [value, setValue] = React.useState(props.defaultValue || "")
  
  return (
    <SelectContext.Provider value={{ value, onValueChange: setValue }}>
      <SelectPrimitive.Root {...props} value={value} onValueChange={setValue}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}

// Child components access shared state
export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { value } = React.useContext(SelectContext)
  
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-none border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
```

### 2. Composition Over Inheritance

shadcn/ui's architecture favors composition, allowing you to build complex components from simple primitives.

#### Key Principles:
- **Copy-paste architecture**: Components live in your codebase, giving you full control
- **No version lock-in**: Components don't change unless you update them
- **Framework agnostic patterns**: The component patterns can be adapted to any framework

#### Layered Architecture:

```
┌─────────────────────────────────────┐
│         Your Components             │
├─────────────────────────────────────┤
│      shadcn/ui Components           │
├─────────────────────────────────────┤
│    Radix UI Primitives (Headless)   │
├─────────────────────────────────────┤
│         React + TypeScript          │
└─────────────────────────────────────┘
```

### 3. Variant System with Class Variance Authority (CVA)

CVA provides a powerful way to manage component variants while maintaining type safety.

#### Best Practices:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base styles - sharp, minimal design
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
        icon: "h-10 w-10",
        // Mobile-optimized sizes
        touch: "min-h-[48px] px-4 py-3", // Meets minimum touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Type-safe props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

### 4. Accessibility Patterns with Radix UI

Radix UI provides WAI-ARIA compliant components out of the box. Key patterns:

#### Focus Management:
```tsx
// Proper focus trap for modals
<Dialog.Root>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      {/* Focus is trapped within content */}
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

#### Keyboard Navigation:
```tsx
// Built-in keyboard support
<NavigationMenu.Root>
  <NavigationMenu.List>
    {/* Arrow keys navigate between items */}
    {/* Home/End keys jump to first/last item */}
    {/* Tab moves focus out of menu */}
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### 5. Component Organization and File Structure

```
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── dialog.tsx
│   └── form.tsx
├── features/              # Feature-specific components
│   ├── checkout/
│   └── product-gallery/
├── layouts/               # Layout components
│   ├── header.tsx
│   └── mobile-nav.tsx
└── shared/                # Shared business components
    ├── product-card.tsx
    └── review-stars.tsx
```

## Design System Integration

### 1. Design Tokens and CSS Variables

#### Color System:
```css
@layer base {
  :root {
    /* Semantic color tokens */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    
    /* Component-specific tokens */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    
    /* Interactive states */
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    
    /* Feedback colors */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    
    /* Sharp design system */
    --radius: 0; /* No border radius for sharp edges */
  }
  
  .dark {
    /* Dark mode tokens */
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* ... other dark mode tokens */
  }
}
```

#### Spacing and Typography:
```tsx
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        // Consistent spacing scale
        'touch': '48px', // Minimum touch target
      },
      typography: {
        // Clean, minimal typography
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            },
          },
        },
      },
    },
  },
}
```

### 2. Tailwind CSS Best Practices

#### Utility-First with Semantic Classes:
```tsx
// Bad - inline everything
<div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">

// Good - use CVA for variants
const inputVariants = cva(
  "flex w-full bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "h-10 border-2 border-input px-3 py-2 focus:ring-2 focus:ring-ring",
        minimal: "h-9 border-b-2 border-input px-1 py-1 focus:border-primary",
      }
    }
  }
)
```

### 3. Dark Mode Implementation

#### Theme Provider Pattern:
```tsx
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Usage in layout
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### 4. Responsive Design Patterns

#### Mobile-First Approach:
```tsx
const MobileOptimizedCard = () => (
  <div className={cn(
    // Mobile base styles
    "p-4 border-2 border-black/10",
    // Tablet and up
    "md:p-6 md:border-black/20",
    // Desktop
    "lg:p-8 lg:hover:border-black/40",
  )}>
    {/* Content */}
  </div>
)
```

### 5. Animation with Purpose

#### Micro-Interactions Only:
```tsx
// Subtle, purposeful animations
const Toast = () => (
  <div className={cn(
    "transition-all duration-200",
    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2",
    "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2",
  )}>
    {/* Toast content */}
  </div>
)
```

## Component Patterns

### 1. Form Components with react-hook-form and Zod

#### Type-Safe Forms:
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### 2. Data Display Components

#### Virtualized Lists for Performance:
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualProductList({ products }: { products: Product[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated item height
    overscan: 5, // Number of items to render outside viewport
  })

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3. Modal and Dialog Patterns

#### Accessible Modal with Focus Management:
```tsx
export function CheckoutModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your purchase in just a few steps.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Modal content */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Complete Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### 4. Navigation Components

#### Mobile-Optimized Navigation:
```tsx
export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {/* Navigation items with proper touch targets */}
          <Link 
            href="/products" 
            className="flex items-center py-3 text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

### 5. Loading and Skeleton States

#### Content-Aware Skeletons:
```tsx
export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>
    </div>
  )
}

// Usage with Suspense
<Suspense fallback={<ProductCardSkeleton />}>
  <ProductCard productId={id} />
</Suspense>
```

## Performance & Bundle Size

### 1. Tree-Shaking Optimization

#### Configure Build Tools:
```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        usedExports: true,
      }
    }
    return config
  },
}
```

### 2. Component Lazy Loading

#### Route-Based Code Splitting:
```tsx
// app/products/page.tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const ProductFilters = dynamic(
  () => import('@/components/product-filters'),
  {
    loading: () => <FiltersSkeleton />,
    ssr: false, // Disable SSR for client-only components
  }
)

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <ProductFilters />
      </aside>
      <main className="lg:col-span-3">
        {/* Product grid */}
      </main>
    </div>
  )
}
```

### 3. CSS Optimization

#### Purge Unused Styles:
```js
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    // Only include files that actually use Tailwind
  ],
  // Optimize for production
  future: {
    hoverOnlyWhenSupported: true,
  },
}
```

### 4. Icon Optimization

#### Use Individual Icon Imports:
```tsx
// Bad - imports entire icon library
import * as Icons from 'lucide-react'

// Good - imports only what you need
import { ShoppingCart, Heart, Menu } from 'lucide-react'
```

## Implementation Examples

### Complete Button Component

```tsx
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        touch: "min-h-[48px] px-4 py-3", // Mobile-optimized
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Accessible Form Field

```tsx
// Example of accessible form field with proper labeling
export function AccessibleInput() {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email Address</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-describedby="email-description email-error"
              {...field}
            />
          </FormControl>
          <FormDescription id="email-description">
            We'll never share your email with anyone.
          </FormDescription>
          <FormMessage id="email-error" />
        </FormItem>
      )}
    />
  )
}
```

## Best Practices Summary

1. **Component Ownership**: Copy components into your codebase for full control
2. **Accessibility First**: Always use Radix UI primitives for complex interactions
3. **Type Safety**: Leverage TypeScript and CVA for type-safe variants
4. **Performance**: Implement lazy loading and tree-shaking from the start
5. **Mobile Optimization**: Design for touch targets and responsive layouts
6. **Minimal Animations**: Use purposeful micro-interactions only
7. **Sharp Design**: Embrace the no-border-radius aesthetic for clean lines
8. **Semantic Tokens**: Use CSS variables for consistent theming
9. **Compound Components**: Build flexible APIs with shared state
10. **Progressive Enhancement**: Start with HTML, enhance with JavaScript

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Class Variance Authority](https://cva.style/docs)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com)