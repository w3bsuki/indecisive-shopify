# Authentication Implementation Guide

## Overview

The Indecisive Wear authentication system is fully integrated with Shopify's Customer API using modern Next.js 15 patterns.

## Architecture

### 1. **Server Actions** (Recommended Approach)
- Located in `/app/actions/auth.ts`
- Uses React 19's `useActionState` hook
- Progressive enhancement (works without JavaScript)
- Automatic form validation with Zod
- Secure httpOnly cookie storage

### 2. **Key Components**

#### Login Flow
```typescript
// app/login/login-form.tsx
const [state, formAction, isPending] = useActionState(loginAction, {})
```

#### Register Flow
```typescript
// app/register/register-form.tsx
const [state, formAction, isPending] = useActionState(registerAction, {})
```

### 3. **Token Management**
- Tokens stored in httpOnly cookies via `/lib/auth/token.ts`
- Automatic expiry checking
- Secure cookie configuration

## Implementation Status

✅ **Complete**:
- Login/Register forms with validation
- Server Actions for authentication
- Shopify Customer API integration
- Secure token storage
- Password recovery flow
- Auto-login after registration

## Testing Authentication

1. **Visit**: http://localhost:3000/auth-test
2. **Check Status**: See if you're logged in
3. **Test Registration**: Create a new account
4. **Test Login**: Sign in with credentials
5. **Verify**: Check account pages load with data

## Environment Requirements

```env
# Required in .env.local
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-04
```

## API Reference

### Server Actions

```typescript
// Login a customer
loginAction(prevState, formData): Promise<AuthState>

// Register a new customer
registerAction(prevState, formData): Promise<AuthState>

// Logout current customer
logoutAction(): Promise<void>

// Get current customer data
getCurrentCustomer(): Promise<Customer | null>
```

### Customer Data Access

```typescript
// In any Server Component
import { getCurrentCustomer } from '@/app/actions/auth'

export default async function Page() {
  const customer = await getCurrentCustomer()
  // Use customer data...
}
```

## Security Features

1. **httpOnly Cookies**: Prevents XSS attacks
2. **CSRF Protection**: Built into Server Actions
3. **Input Validation**: Zod schemas for all forms
4. **Secure Headers**: Configured in middleware
5. **Rate Limiting**: Protects against brute force

## Troubleshooting

### "Missing Shopify configuration" Error
- Ensure `.env.local` has all required variables
- Check token has Customer Account API access
- Verify store domain includes `.myshopify.com`

### Login Fails Silently
- Check browser console for errors
- Verify Shopify customer exists
- Ensure password meets requirements (8+ chars)

### Token Expires Quickly
- Shopify tokens expire after 1 hour
- Implement refresh logic if needed
- Consider using Shopify's delegated authentication

## Next Steps

1. **Order History**: Wire up `/account/orders` with Shopify data
2. **Address Management**: Connect address CRUD operations
3. **Wishlist Persistence**: Use customer metafields
4. **Guest Checkout**: Implement for non-authenticated users