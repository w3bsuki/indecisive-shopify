# Security Implementation Guide

This document outlines the security measures implemented in the Indecisive Wear store.

## Overview

The application implements multiple layers of security following OWASP best practices:

1. **Security Headers** - Protection against common web vulnerabilities
2. **Content Security Policy** - XSS prevention
3. **Authentication** - Secure customer authentication via Shopify
4. **Rate Limiting** - DDoS and brute force protection
5. **HTTPS Enforcement** - Encrypted communications

## Security Headers

All responses include the following security headers:

### X-Frame-Options: DENY
Prevents clickjacking attacks by disabling iframe embedding.

### X-Content-Type-Options: nosniff
Prevents MIME type sniffing attacks.

### Referrer-Policy: strict-origin-when-cross-origin
Controls referrer information sent with requests.

### Permissions-Policy
Restricts browser features:
- Camera: Disabled
- Microphone: Disabled
- Geolocation: Disabled
- Payment: Self only
- USB: Disabled

### Strict-Transport-Security (Production only)
Forces HTTPS connections with:
- max-age=31536000 (1 year)
- includeSubDomains
- preload

## Content Security Policy (CSP)

Strict CSP rules prevent XSS attacks:

```
default-src 'self'
script-src 'self' 'unsafe-eval' https://cdn.shopify.com https://www.googletagmanager.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob: https:
font-src 'self' data:
connect-src 'self' https://*.myshopify.com https://cdn.shopify.com
frame-src 'none'
object-src 'none'
```

## Authentication Security

### Customer Authentication
- Shopify Customer API handles authentication
- Tokens stored in httpOnly cookies
- Automatic token expiration
- No passwords stored locally

### Session Management
- 2-hour token expiration
- Automatic refresh on activity
- Secure cookie attributes:
  - httpOnly: true
  - secure: true (production)
  - sameSite: lax

## Rate Limiting

Endpoint-specific rate limits:

| Endpoint | Limit | Window | Block Duration |
|----------|-------|---------|----------------|
| /api/auth/* | 5 | 15 min | 30 min |
| /api/contact | 5 | 5 min | 15 min |
| /api/search | 30 | 1 min | - |
| /api/payment/* | 5 | 1 min | 15 min |
| Default | 100 | 1 min | - |

### Implementation
- In-memory store (development)
- Redis recommended for production
- IP-based tracking
- Gradual backoff for repeated violations

## Data Protection

### Personal Data
- No PII stored in application database
- Customer data managed by Shopify
- Analytics anonymized
- Cookie consent required

### Payment Security
- Payments processed by Shopify Checkout
- No credit card data touches our servers
- PCI compliance handled by Shopify

## Input Validation

### Forms
- Zod schema validation
- Server-side validation
- SQL injection prevention via GraphQL

### File Uploads
- Not implemented (security by design)
- All product images hosted on Shopify CDN

## Error Handling

### Production Errors
- Generic error messages to users
- Detailed errors logged to Sentry
- No stack traces exposed
- Error IDs for tracking

## Monitoring & Alerts

### Error Monitoring
- Sentry integration for error tracking
- Automatic alerts for security errors
- Rate limit violations logged

### Security Headers Monitoring
- Health check endpoint validates headers
- Automated tests verify CSP

## Development Security

### Environment Variables
- Secrets never committed to git
- .env.local for local development
- Production secrets in hosting platform

### Dependencies
- Regular dependency updates
- Automated security scanning
- No known vulnerabilities policy

## Incident Response

### Security Issue Reporting
1. Email: security@indecisivewear.com
2. Response time: 24 hours
3. Fix timeline: Based on severity

### Severity Levels
- **Critical**: Customer data exposure
- **High**: Authentication bypass
- **Medium**: XSS vulnerabilities
- **Low**: Information disclosure

## Testing

### Security Testing Checklist
- [ ] OWASP Top 10 vulnerabilities
- [ ] Authentication bypass attempts
- [ ] XSS payload testing
- [ ] SQL injection (GraphQL)
- [ ] Rate limit effectiveness
- [ ] CSP violations
- [ ] HTTPS enforcement

### Automated Tests
```bash
# Run security tests
pnpm test:security

# Check for vulnerabilities
pnpm audit

# Validate CSP
pnpm test:csp
```

## Best Practices

1. **Least Privilege**: Minimal permissions for all operations
2. **Defense in Depth**: Multiple security layers
3. **Fail Secure**: Errors default to denying access
4. **Security by Default**: Secure configurations out of the box
5. **Regular Updates**: Keep dependencies current

## Compliance

### GDPR
- Cookie consent implementation
- Data minimization
- Right to deletion (via Shopify)

### PCI DSS
- No credit card handling
- Shopify manages compliance

### CCPA
- Privacy policy compliance
- Opt-out mechanisms

## Security Checklist for Deployment

- [ ] Environment variables configured
- [ ] HTTPS certificate installed
- [ ] Security headers verified
- [ ] Rate limiting enabled
- [ ] Error monitoring active
- [ ] Admin endpoints protected
- [ ] CSP policy tested
- [ ] Cookie settings secure
- [ ] Dependency vulnerabilities checked
- [ ] Security.txt file deployed