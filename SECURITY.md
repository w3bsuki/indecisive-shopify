# Security Guidelines

## Overview

This document outlines security best practices for the Indecisive Wear e-commerce platform. As a production Shopify headless storefront handling customer data and payments, security is paramount.

## Environment Security

### Environment Variables

```bash
# ✅ Correct - Never commit secrets
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx

# ❌ Never do this - Private keys exposed
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx  # Keep server-side only
```

### .env File Management

```bash
# Always in .gitignore
.env.local
.env.production
.env

# Safe for public (prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=shop.myshopify.com
```

## API Security

### Input Validation

```typescript
// Always validate with Zod
import { z } from 'zod';

const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  variantId: z.string().min(1),
});

export async function addToCart(formData: FormData) {
  const parsed = cartItemSchema.parse({
    productId: formData.get('productId'),
    quantity: Number(formData.get('quantity')),
    variantId: formData.get('variantId'),
  });
  
  // Proceed with validated data
}
```

### Server Actions Security

```typescript
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  // 1. Validate user authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  
  // 2. Validate input
  const validated = updateProfileSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  });
  
  // 3. Authorize operation
  if (user.id !== validated.userId) {
    throw new Error('Unauthorized');
  }
  
  // 4. Process safely
  await updateUser(validated);
  
  // 5. Revalidate and redirect
  revalidatePath('/profile');
  redirect('/profile?updated=true');
}
```

### API Route Protection

```typescript
// app/api/admin/products/route.ts
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  // Verify admin access
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const payload = verify(token, process.env.JWT_SECRET!);
    // Process authorized request
  } catch {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

## Content Security Policy

### Next.js Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();
  
  // Strict CSP for production
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://cdn.shopify.com data: blob:",
      "connect-src 'self' https://your-shop.myshopify.com https://api.stripe.com",
      "frame-src https://js.stripe.com https://checkout.stripe.com",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  
  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

## XSS Prevention

### Safe Content Rendering

```tsx
// ❌ Dangerous - can execute scripts
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Safe - escaped automatically
<div>{userContent}</div>

// ✅ Safe - sanitized HTML
import DOMPurify from 'dompurify';

function SafeHTML({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### URL Safety

```typescript
// Validate URLs before redirects
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function redirect(url: string) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid redirect URL');
  }
  // Safe to redirect
}
```

## CSRF Protection

### Form Security

```tsx
// Server Action with CSRF token
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

async function generateCSRFToken() {
  const token = createHash('sha256')
    .update(Date.now().toString())
    .digest('hex');
    
  cookies().set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  
  return token;
}

// Form component
export async function ContactForm() {
  const csrfToken = await generateCSRFToken();
  
  return (
    <form action={submitContact}>
      <input type="hidden" name="csrf-token" value={csrfToken} />
      {/* Form fields */}
    </form>
  );
}
```

## Data Protection

### Customer Data Handling

```typescript
// Minimal data collection
interface CustomerData {
  id: string;
  email: string; // Only what's needed
  // Don't store: passwords, payment info, etc.
}

// Encrypt sensitive data
import { encrypt, decrypt } from '@/lib/crypto';

async function storeCustomerPreferences(userId: string, preferences: object) {
  const encrypted = await encrypt(JSON.stringify(preferences));
  await db.userPreferences.create({
    userId,
    data: encrypted,
  });
}
```

### Session Management

```typescript
// Secure session configuration
export const sessionConfig = {
  cookieName: 'indecisive-session',
  password: process.env.SESSION_SECRET!, // 32+ characters
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'strict' as const,
  },
};
```

## Payment Security

### Stripe Integration

```tsx
// ✅ Never expose secret keys to client
// server-side only
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ Use Stripe Elements for payment forms
import { Elements } from '@stripe/react-stripe-js';

export function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentElement />
    </Elements>
  );
}
```

### PCI Compliance

- Never store payment card data
- Use Shopify's secure checkout
- Implement proper SSL/TLS
- Regular security audits

## Monitoring & Logging

### Error Tracking

```typescript
// Security event logging
import * as Sentry from '@sentry/nextjs';

export function logSecurityEvent(event: string, context: object) {
  Sentry.captureMessage(`Security Event: ${event}`, {
    level: 'warning',
    extra: context,
  });
}

// Usage
export async function login(credentials: LoginData) {
  try {
    const user = await authenticate(credentials);
    return user;
  } catch (error) {
    logSecurityEvent('Failed login attempt', {
      email: credentials.email,
      ip: getClientIP(),
      userAgent: getUserAgent(),
    });
    throw error;
  }
}
```

### Rate Limiting

```typescript
// Simple rate limiting
import { LRUCache } from 'lru-cache';

const ratelimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function rateLimiter(identifier: string) {
  const tokenCount = ratelimit.get(identifier) as number | undefined;
  
  if (tokenCount === undefined) {
    ratelimit.set(identifier, 1);
    return true;
  }
  
  if (tokenCount >= 10) {
    return false; // Rate limited
  }
  
  ratelimit.set(identifier, tokenCount + 1);
  return true;
}
```

## Dependency Security

### Regular Auditing

```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically fixable issues
pnpm audit --fix

# Check with npm for additional insights
npx better-npm-audit audit
```

### Dependency Management

```json
{
  "scripts": {
    "security-check": "pnpm audit && npx better-npm-audit audit",
    "update-deps": "pnpm update --latest"
  }
}
```

## Incident Response

### Security Incident Checklist

1. **Immediate Response**
   - [ ] Assess impact and scope
   - [ ] Document timeline and actions
   - [ ] Isolate affected systems
   - [ ] Notify stakeholders

2. **Investigation**
   - [ ] Analyze logs and monitoring data
   - [ ] Identify attack vectors
   - [ ] Assess data exposure
   - [ ] Preserve evidence

3. **Recovery**
   - [ ] Implement fixes
   - [ ] Update security measures
   - [ ] Test systems thoroughly
   - [ ] Monitor for recurrence

4. **Post-Incident**
   - [ ] Conduct post-mortem
   - [ ] Update documentation
   - [ ] Improve security measures
   - [ ] Train team on lessons learned

### Contact Information

- **Security Team**: security@indecisivewear.com
- **Emergency Contacts**: [Internal contact list]
- **External Resources**: CERT, local cybersecurity authorities

## Compliance

### GDPR Compliance

- Clear privacy policy
- Data processing consent
- Right to data deletion
- Data portability features

### Accessibility Security

- Secure screen reader compatibility
- Keyboard navigation security
- Visual indicator authenticity

## Security Testing

### Automated Testing

```typescript
// Security-focused tests
describe('Security Tests', () => {
  test('prevents XSS in user input', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });
  
  test('validates CSRF tokens', async () => {
    const response = await request('/api/admin/users', {
      method: 'POST',
      headers: { 'X-CSRF-Token': 'invalid-token' },
    });
    expect(response.status).toBe(403);
  });
});
```

### Manual Security Testing

- Regular penetration testing
- Code security reviews
- Third-party security audits
- Vulnerability assessments

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [Shopify Security](https://shopify.dev/concepts/security)
- [Vercel Security](https://vercel.com/docs/security)

---

Security is an ongoing process. Regularly review and update these guidelines as the application evolves.