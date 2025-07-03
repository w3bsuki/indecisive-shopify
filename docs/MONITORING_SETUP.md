# Monitoring & Analytics Setup Guide

This guide covers the error monitoring and analytics implementation for Indecisive Wear.

## Overview

The application includes:
- **Error Monitoring**: Sentry integration for production error tracking
- **Analytics**: Google Analytics 4 for user behavior tracking
- **Rate Limiting**: Built-in rate limiting with monitoring
- **Performance Monitoring**: Core Web Vitals tracking

## Error Monitoring (Sentry)

### Setup

1. **Create Sentry Account**
   - Sign up at [sentry.io](https://sentry.io)
   - Create a new Next.js project
   - Copy your DSN from Project Settings → Client Keys

2. **Configure Environment Variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_ORG=your-org-slug
   SENTRY_PROJECT=your-project-slug
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

3. **Features Implemented**
   - Automatic error boundary integration
   - Source map upload in production
   - User context tracking
   - Performance monitoring
   - Session replay on errors

### Configuration Files

- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration

### Error Filtering

The following errors are automatically filtered:
- Network errors (connectivity issues)
- Browser extension errors
- Known third-party script errors

## Analytics (Google Analytics 4)

### Setup

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com)
   - Create new GA4 property
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Configure Environment Variable**
   ```bash
   # .env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Cookie Consent**
   - Analytics only loads after user consent
   - Consent stored in localStorage
   - GDPR/CCPA compliant

### Events Tracked

#### E-commerce Events
- `view_item` - Product page views
- `add_to_cart` - Add to cart actions
- `remove_from_cart` - Remove from cart
- `begin_checkout` - Checkout initiated
- `purchase` - Order completed

#### User Events
- `login` - User authentication
- `sign_up` - New registrations
- `search` - Search queries

#### Engagement Events
- `add_to_wishlist` - Wishlist additions
- `remove_from_wishlist` - Wishlist removals

### Custom Event Tracking

Use the analytics utility:

```typescript
import { analytics } from '@/lib/analytics/events'

// Track custom event
analytics.addToCart({
  id: 'PROD-123',
  name: 'Indecisive Hoodie',
  price: 89.99,
  quantity: 1
})
```

## Rate Limiting Monitoring

### Dashboard Access
Visit `/admin/monitoring` to view:
- Active rate limits by endpoint
- Total blocked requests
- Configuration status

### Endpoints Protected
- `/api/auth/*` - 10 requests per minute
- `/api/contact` - 5 requests per 5 minutes
- `/api/search` - 30 requests per minute
- `/api/payment/*` - 5 requests per minute

### Admin API
```bash
# Get rate limit stats
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://yourdomain.com/api/admin/rate-limits

# Clear specific rate limit
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "clear", "key": "user-ip"}' \
  https://yourdomain.com/api/admin/rate-limits
```

## Performance Monitoring

### Core Web Vitals
Tracked automatically via Sentry:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

### Custom Performance Marks
```typescript
// Track custom performance metrics
performance.mark('myFeature-start')
// ... feature code ...
performance.mark('myFeature-end')
performance.measure('myFeature', 'myFeature-start', 'myFeature-end')
```

## Testing Monitoring

### Local Development
1. Set environment variables in `.env.local`
2. Restart development server
3. Test error: Throw error in any component
4. Test analytics: Check Network tab for GA requests

### Production Verification
1. Check Sentry dashboard for errors
2. Verify GA4 real-time reports
3. Monitor rate limiting via admin dashboard

## Privacy & Compliance

### GDPR Compliance
- Cookie consent required before tracking
- User data anonymized
- IP anonymization enabled
- Data retention: 14 months

### Data Collected
- Page views and navigation
- E-commerce interactions
- Error details (no PII)
- Performance metrics

## Troubleshooting

### Sentry Not Reporting
1. Check DSN is correct
2. Verify no ad blockers
3. Check browser console for errors
4. Ensure proper environment variables

### Analytics Not Working
1. Verify cookie consent given
2. Check GA Measurement ID
3. Ensure no tracking blockers
4. Verify events in GA4 DebugView

### Rate Limiting Issues
1. Check `/admin/monitoring` dashboard
2. Clear specific limits if needed
3. Adjust limits in `/lib/rate-limit.ts`

## Best Practices

1. **Don't Track PII**: Never send personal information
2. **Use Event Parameters**: Add context to events
3. **Monitor Regularly**: Check dashboards weekly
4. **Test Before Deploy**: Verify in staging first
5. **Document Custom Events**: Keep event taxonomy updated