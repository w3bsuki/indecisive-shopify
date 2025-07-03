# PHASE 2: COMPLETE SHOPIFY INTEGRATION PLAN
## Customer Authentication, Orders & Checkout

> **ULTRATHINK APPROACH**: Server-first architecture with minimal client-side JavaScript, leveraging Shopify's Storefront API for secure customer operations.

---

## 🎯 EXECUTIVE SUMMARY

**Objective**: Implement complete customer journey from authentication through checkout, maintaining server-first approach established in Phase 1.

**Key Principles**:
- Server Components by default - only use client for forms/interactivity
- Server Actions for all mutations (no API routes needed)
- Secure token handling with httpOnly cookies
- Progressive enhancement - forms work without JavaScript
- Type-safe Shopify integration

**Success Metrics**:
- Zero increase in First Load JS (maintain ~101KB)
- Sub-2s checkout page load
- 100% Server Component pages (client only for interactions)
- Secure authentication flow
- Full TypeScript coverage

---

## 📋 PHASE 2 SCOPE

### 1. Customer Authentication System

**1.1 Login Flow**
- [ ] Server Component login page with client form
- [ ] Server Action for authentication
- [ ] Shopify customer access token generation
- [ ] Secure httpOnly cookie storage
- [ ] Redirect handling with proper status codes

**1.2 Registration Flow**
- [ ] Server Component register page
- [ ] Client form with validation (zod + react-hook-form)
- [ ] Server Action for customer creation
- [ ] Email verification handling
- [ ] Auto-login after registration

**1.3 Password Reset**
- [ ] Request reset page (server)
- [ ] Reset token handling
- [ ] New password form
- [ ] Email notifications via Shopify

**1.4 Session Management**
- [ ] Middleware for auth checks
- [ ] Token refresh logic
- [ ] Logout Server Action
- [ ] Protected route handling

### 2. Customer Account Pages

**2.1 Account Dashboard**
- [ ] Server Component main layout
- [ ] Recent orders display
- [ ] Account overview
- [ ] Quick actions menu

**2.2 Profile Management**
- [ ] View profile (server)
- [ ] Edit profile form (client)
- [ ] Server Action for updates
- [ ] Success/error handling

**2.3 Address Book**
- [ ] List addresses (server)
- [ ] Add/Edit address forms (client)
- [ ] Delete address action
- [ ] Default address selection

**2.4 Order History**
- [ ] Orders list with pagination (server)
- [ ] Order detail pages (server)
- [ ] Order status tracking
- [ ] Reorder functionality

### 3. Checkout Integration

**3.1 Checkout Flow Architecture**
```
┌─────────────────────────────────────────┐
│          Cart Page (Server)             │
│  - Display items                        │
│  - Calculate totals                     │
│  - Apply discounts                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Checkout Page (Server)             │
│  - Guest/Login prompt                   │
│  - Shipping form (client)               │
│  - Payment integration                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Order Confirmation (Server)          │
│  - Order details                        │
│  - Email sent confirmation              │
└─────────────────────────────────────────┘
```

**3.2 Implementation Details**
- [ ] Create checkout via Server Action
- [ ] Update checkout with customer info
- [ ] Shipping methods fetching
- [ ] Payment processing (Stripe/Shop Pay)
- [ ] Order creation and confirmation

### 4. Wishlist Persistence

**4.1 Authenticated Wishlist**
- [ ] Migrate local wishlist to Shopify metafields
- [ ] Server Action for add/remove
- [ ] Sync on login
- [ ] Guest to authenticated migration

### 5. Enhanced Features

**5.1 Customer-Specific Features**
- [ ] Personalized recommendations
- [ ] Customer-specific pricing
- [ ] Loyalty points display
- [ ] Exclusive products access

---

## 🏗️ TECHNICAL ARCHITECTURE

### Authentication Flow

```typescript
// lib/shopify/customer-auth.ts
export async function authenticateCustomer(
  email: string, 
  password: string
): Promise<CustomerAuthResult> {
  const { customerAccessTokenCreate } = await shopifyFetch({
    query: CREATE_ACCESS_TOKEN,
    variables: { input: { email, password } }
  })
  
  if (customerAccessTokenCreate.userErrors.length > 0) {
    throw new AuthError(customerAccessTokenCreate.userErrors[0])
  }
  
  return customerAccessTokenCreate.customerAccessToken
}

// app/actions/auth.ts
'use server'

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  try {
    const token = await authenticateCustomer(email, password)
    
    // Set httpOnly cookie
    cookies().set('customer-token', token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(token.expiresAt)
    })
    
    revalidatePath('/')
    redirect('/account')
  } catch (error) {
    return {
      error: 'Invalid credentials'
    }
  }
}
```

### Middleware Pattern

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('customer-token')
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Validate token with Shopify
    const isValid = await validateCustomerToken(token.value)
    if (!isValid) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('customer-token')
      return response
    }
  }
  
  return NextResponse.next()
}
```

### Component Structure

```typescript
// app/account/page.tsx - Server Component
export default async function AccountPage() {
  const customer = await getCustomer() // Server-side fetch
  
  return (
    <div>
      <h1>Welcome, {customer.displayName}</h1>
      <AccountNav />
      <RecentOrders orders={customer.orders} />
    </div>
  )
}

// app/account/profile/page.tsx - Server Component
export default async function ProfilePage() {
  const customer = await getCustomer()
  
  return (
    <div>
      <h2>Profile Information</h2>
      <ProfileDisplay customer={customer} />
      <EditProfileForm customer={customer} /> {/* Client Component */}
    </div>
  )
}

// components/account/edit-profile-form.tsx - Client Component
'use client'

export function EditProfileForm({ customer }: { customer: Customer }) {
  const [state, formAction] = useActionState(updateProfileAction, {})
  
  return (
    <form action={formAction}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 🔄 IMPLEMENTATION STEPS

### Step 1: Setup Authentication Infrastructure (Day 1)
1. [ ] Create Shopify GraphQL queries/mutations for auth
2. [ ] Implement secure token storage
3. [ ] Setup middleware for protected routes
4. [ ] Create auth context provider (client)
5. [ ] Build login/register Server Actions

### Step 2: Build Authentication Pages (Day 1-2)
1. [ ] Login page with progressive enhancement
2. [ ] Register page with validation
3. [ ] Password reset flow
4. [ ] Auth error handling
5. [ ] Success redirects

### Step 3: Customer Account Pages (Day 2-3)
1. [ ] Account layout and navigation
2. [ ] Profile view/edit pages
3. [ ] Address management
4. [ ] Order history with details
5. [ ] Account settings

### Step 4: Checkout Integration (Day 3-4)
1. [ ] Checkout creation from cart
2. [ ] Guest checkout option
3. [ ] Shipping address form
4. [ ] Shipping methods selection
5. [ ] Payment integration (Stripe/Shop Pay)
6. [ ] Order confirmation page

### Step 5: Wishlist & Enhancements (Day 4-5)
1. [ ] Migrate wishlist to Shopify
2. [ ] Sync local/server wishlists
3. [ ] Customer recommendations
4. [ ] Testing and optimization

---

## ✅ VALIDATION CHECKLIST

### Security
- [ ] All tokens in httpOnly cookies
- [ ] CSRF protection on forms
- [ ] Rate limiting on auth endpoints
- [ ] Secure password reset flow
- [ ] No sensitive data in client

### Performance
- [ ] No increase in bundle size
- [ ] Server-side data fetching
- [ ] Optimistic UI updates
- [ ] Proper caching strategies
- [ ] Fast checkout flow

### User Experience
- [ ] Forms work without JS
- [ ] Clear error messages
- [ ] Loading states
- [ ] Mobile-optimized
- [ ] Accessible forms

### Code Quality
- [ ] Full TypeScript coverage
- [ ] No 'any' types
- [ ] Consistent patterns
- [ ] Error boundaries
- [ ] Clean architecture

---

## 🚨 CRITICAL CONSIDERATIONS

### 1. Token Security
- Never expose customer access tokens to client
- Use httpOnly cookies exclusively
- Implement token refresh before expiry
- Clear tokens on logout

### 2. Checkout Security
- Validate all prices server-side
- Never trust client-side calculations
- Implement idempotency for payments
- Log all checkout attempts

### 3. Performance Impact
- Maintain current bundle size
- Use Server Components for all pages
- Client components only for forms
- Implement proper caching

### 4. Error Handling
- Graceful degradation
- User-friendly error messages
- Proper logging
- Recovery mechanisms

---

## 📊 SUCCESS METRICS

1. **Technical Metrics**
   - Bundle size: ≤ 101KB (no increase)
   - Checkout load time: < 2s
   - Auth response time: < 500ms
   - Zero client-side secrets

2. **Business Metrics**
   - Checkout completion rate
   - Account creation rate
   - Customer retention
   - Cart abandonment reduction

3. **Quality Metrics**
   - Zero security vulnerabilities
   - 100% TypeScript coverage
   - All forms accessible
   - Mobile conversion rate

---

## 🎯 NEXT STEPS

After Phase 2 completion:
- Phase 3: Technical Debt Cleanup
- Phase 4: Internationalization
- Phase 5: Performance & Security
- Phase 6: Testing Suite
- Phase 7: Production Deployment

---

**Created**: 2025-07-02
**Status**: Ready to Start
**Estimated Duration**: 4-5 days
**Priority**: Critical

## Implementation Notes

### Server-First Checklist
- [ ] Every new page starts as Server Component
- [ ] Extract interactivity to small Client Components
- [ ] Use Server Actions for all mutations
- [ ] Validate everything server-side
- [ ] Progressive enhancement always