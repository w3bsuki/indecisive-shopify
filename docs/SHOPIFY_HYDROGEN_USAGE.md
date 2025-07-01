# Shopify Hydrogen React Usage in Our Project

## We ARE Using Shopify Hydrogen React! 

Our project correctly implements **@shopify/hydrogen-react** as recommended by Shopify for headless commerce:

### 1. **Hydrogen React Provider Setup**
```tsx
// lib/shopify/hydrogen-client.tsx
import { ShopifyProvider, CartProvider } from '@shopify/hydrogen-react';

export function HydrogenProvider({ children }) {
  return (
    <ShopifyProvider
      storeDomain={fullDomain}
      storefrontToken={storefrontToken}
      storefrontApiVersion={apiVersion}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <CartProvider>
        {children}
      </CartProvider>
    </ShopifyProvider>
  );
}
```

### 2. **Cart Hook Using Hydrogen React**
```tsx
// hooks/use-cart.tsx
import { useCart as useHydrogenCart } from '@shopify/hydrogen-react';

export function useCart() {
  const {
    status,
    lines,
    totalQuantity,
    cost,
    checkoutUrl,
    cartReady,
    linesAdd,
    linesRemove,
    linesUpdate,
    // ... other Hydrogen React cart methods
  } = useHydrogenCart();
  
  // Our custom logic on top of Hydrogen React
}
```

### 3. **Key Features We Use from Hydrogen React**

- ✅ **CartProvider** - Manages cart state globally
- ✅ **useCart hook** - Access cart functionality anywhere
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Automatic Shopify Integration** - Handles API calls
- ✅ **Built-in Error Handling** - Manages network issues

### 4. **Smart Quantity Handling**

We've enhanced the base Hydrogen React functionality to handle adding existing items:

```tsx
// Check if item already exists in cart
const existingLine = lines?.find(
  (line) => line.merchandise?.id === merchandiseId
);

if (existingLine) {
  // Update quantity instead of adding duplicate line
  const newQuantity = (existingLine.quantity || 0) + quantity;
  linesUpdate([{ id: existingLine.id, quantity: newQuantity }]);
} else {
  // Add new line
  linesAdd([{ merchandiseId, quantity }]);
}
```

### 5. **Toast Notifications with Unique IDs**

To prevent stacking, all toasts use unique IDs:

```tsx
toast.success('Added to cart', {
  id: 'cart-add-success', // Replaces previous toast with same ID
  description: `${quantity} item${quantity > 1 ? 's' : ''} added`,
  duration: 3000,
});
```

## Why We Don't Use Full Hydrogen Framework

- **Hydrogen React** ✅ - We use this (headless cart/checkout)
- **Hydrogen Framework** ❌ - We don't need this (full Remix-based framework)

We're using Next.js + Hydrogen React, which is a valid and recommended approach by Shopify for headless commerce when you want to use your own framework.

## Best Practices We Follow

1. **Single Cart Provider** - One instance wraps entire app
2. **Optimistic Updates** - Instant feedback to users
3. **Smart Quantity Management** - Update existing items instead of duplicating
4. **Proper Error Handling** - User-friendly error messages
5. **TypeScript Integration** - Full type safety
6. **Performance Optimized** - Minimal re-renders

## Common Misconceptions

❌ "You must use the full Hydrogen framework"
✅ Hydrogen React can be used with any React framework (Next.js, Gatsby, etc.)

❌ "You need server-side Hydrogen components"
✅ Client-side Hydrogen React provides everything needed for cart/checkout

❌ "Custom implementations are wrong"
✅ Extending Hydrogen React with custom logic is encouraged