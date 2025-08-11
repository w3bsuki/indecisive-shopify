# Production Deployment Guide

## Deployment Architecture

- **Frontend**: Vercel (Next.js optimization)
- **Backend**: Shopify Storefront API (headless commerce)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics + Sentry (optional)

## Environment Variables

### Required Variables

```bash
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-04

# Optional Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### Getting Shopify Credentials

1. **Create Shopify Partner Account**
   - Visit [partners.shopify.com](https://partners.shopify.com)
   - Create development store or use existing

2. **Generate Storefront Access Token**
   - Go to Shopify Admin → Apps → Develop apps
   - Create private app with Storefront API access
   - Copy the Storefront access token

3. **Configure API Permissions**
   Required Storefront API permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`

## Vercel Deployment

### 1. Connect Repository

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from local (first time)
vercel

# Or connect via Vercel dashboard
# - Import Git repository
# - Select Next.js preset
# - Configure environment variables
```

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
# Production
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=production-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-04

# Preview (optional - for staging)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=staging-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_yyyyy
```

### 3. Build Configuration

Vercel automatically detects Next.js projects. Optional `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/products",
      "destination": "/shop",
      "permanent": true
    }
  ]
}
```

## Performance Optimization

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  experimental: {
    ppr: true, // Partial Prerendering
  },
};

export default nextConfig;
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm analyze

# Monitor with @next/bundle-analyzer
ANALYZE=true pnpm build
```

## Monitoring & Analytics

### 1. Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Web Vitals Monitoring

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 3. Error Monitoring (Optional)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

## Custom Domain Setup

### 1. Domain Configuration

In Vercel Dashboard → Domains:
1. Add your custom domain
2. Configure DNS records as shown
3. Wait for SSL certificate provisioning

### 2. DNS Configuration

For Vercel deployment:
```
A     @     76.76.19.61
CNAME www   your-project.vercel.app
```

### 3. Shopify Webhook URLs

Update Shopify webhooks to use production domain:
- Order creation: `https://yourdomain.com/api/webhooks/orders/create`
- Product updates: `https://yourdomain.com/api/webhooks/products/update`

## Security

### 1. Content Security Policy

```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.shopify.com; img-src 'self' https://cdn.shopify.com data:; connect-src 'self' https://your-shop.myshopify.com;"
  );
  
  return response;
}
```

### 2. API Route Security

```typescript
// app/api/cart/route.ts
import { headers } from 'next/headers';

export async function POST() {
  const origin = headers().get('origin');
  
  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Handle request
}
```

## Testing in Production

### 1. Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Shopify webhooks updated
- [ ] SSL certificate active
- [ ] DNS propagated
- [ ] Core Web Vitals optimized

### 2. Production Testing

```bash
# Test production build locally
pnpm build
pnpm start

# Run E2E tests against production
PLAYWRIGHT_BASE_URL=https://yourdomain.com pnpm test:e2e
```

## Rollback Strategy

### 1. Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### 2. Git-based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel will auto-deploy the revert
```

## Scaling Considerations

### 1. Shopify Plus Features

For high-traffic stores:
- Shopify Plus (higher API limits)
- GraphQL query optimization
- Edge caching strategies

### 2. Vercel Pro Features

- Increased bandwidth
- Priority support
- Advanced analytics
- Team collaboration

## Cost Optimization

### Estimated Monthly Costs

- **Vercel Pro**: $20/month (recommended for production)
- **Shopify Basic**: $29/month minimum
- **Domain**: $10-15/year
- **Total**: ~$50-60/month

### Cost Monitoring

- Set up Vercel usage alerts
- Monitor Shopify API usage
- Optimize image sizes and formats
- Use efficient GraphQL queries

## Troubleshooting

### Common Issues

**Build Failures**
- Check build logs in Vercel dashboard
- Verify all environment variables set
- Ensure TypeScript compilation succeeds

**Shopify API Errors**
- Verify access token permissions
- Check API version compatibility
- Monitor rate limiting

**Performance Issues**
- Run Lighthouse audits
- Check Core Web Vitals
- Optimize images and fonts
- Review bundle size

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

This deployment guide ensures your Shopify headless storefront runs optimally in production with monitoring, security, and scalability built in.