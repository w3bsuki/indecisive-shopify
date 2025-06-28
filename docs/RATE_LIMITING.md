# Rate Limiting System Documentation

This document describes the comprehensive rate limiting system implemented for the e-commerce application, designed to protect against abuse and ensure fair resource usage.

## 📋 Overview

The rate limiting system provides:
- **Endpoint-specific limits** with different configurations for various API routes
- **IP-based tracking** to prevent abuse from specific clients
- **Temporary blocking** for repeated violations
- **Admin monitoring** and management capabilities
- **Production-ready implementation** with memory cleanup and monitoring

## 🛡️ Rate Limit Configurations

### Default Configurations

| Endpoint Type | Window | Max Requests | Block Duration | Use Case |
|---------------|--------|--------------|----------------|----------|
| **General API** | 1 minute | 100 requests | 5 minutes | Standard API operations |
| **Authentication** | 15 minutes | 5 attempts | 30 minutes | Login, registration, password reset |
| **Payment** | 1 minute | 10 requests | 10 minutes | Payment processing, checkout |
| **Search** | 1 minute | 30 requests | None | Product search, filtering |
| **Contact Forms** | 1 hour | 3 requests | 24 hours | Contact forms, support tickets |
| **Health Check** | 1 minute | 200 requests | None | Monitoring and health checks |

### Configuration Details

```typescript
// Example configuration
{
  windowMs: 60 * 1000,        // Time window (1 minute)
  maxRequests: 100,           // Maximum requests in window
  blockDurationMs: 5 * 60 * 1000, // Block duration (5 minutes)
  message: 'Custom error message'
}
```

## 🏗️ Implementation Architecture

### Core Components

1. **Middleware (`middleware.ts`)**
   - Intercepts all API requests
   - Applies rate limiting based on endpoint configuration
   - Returns 429 status for rate limit violations

2. **Rate Limit Library (`lib/rate-limit.ts`)**
   - Provides utilities for rate limit management
   - Handles statistics and monitoring
   - Offers admin functions for management

3. **Admin API (`/api/admin/rate-limits`)**
   - Monitoring dashboard for rate limits
   - Management functions (clear limits, view stats)
   - Administrative controls

### Key Features

#### Smart Client Identification
```typescript
// Multi-source IP detection
const ip = request.ip ||
           request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') || // Cloudflare
           'unknown'
```

#### Endpoint-Specific Rate Limiting
```typescript
// Configuration matching by pathname
const rateLimitConfigs = {
  '/api/auth/': { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  '/api/payment/': { windowMs: 60 * 1000, maxRequests: 10 },
  '/api/search/': { windowMs: 60 * 1000, maxRequests: 30 }
}
```

#### Progressive Blocking
```typescript
// Temporary blocking for repeated violations
if (current.count > config.maxRequests) {
  current.blocked = true
  const retryAfter = config.blockDurationMs ? 
    Math.ceil(config.blockDurationMs / 1000) : 
    Math.ceil((config.windowMs - (now - current.lastReset)) / 1000)
}
```

## 🔧 Usage Examples

### Testing Rate Limits

```bash
# Test basic rate limiting
curl -X GET "http://localhost:3000/api/test/rate-limit"

# Test with multiple requests to trigger rate limit
for i in {1..15}; do
  curl -X GET "http://localhost:3000/api/test/rate-limit"
  echo "Request $i"
done
```

### Admin Management

```bash
# Get rate limit statistics
curl -X GET "http://localhost:3000/api/admin/rate-limits" \
  -H "Authorization: Bearer your-admin-token"

# Clear specific rate limit
curl -X POST "http://localhost:3000/api/admin/rate-limits" \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{"action": "clear", "key": "192.168.1.1:/api/auth/"}'

# Clear all rate limits
curl -X POST "http://localhost:3000/api/admin/rate-limits" \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{"action": "clear-all"}'
```

## 📊 Monitoring and Statistics

### Rate Limit Headers

All API responses include rate limit information:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642684800000
```

For rate limit violations:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642684800000
Retry-After: 300

{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 300
}
```

### Statistics API Response

```json
{
  "success": true,
  "stats": {
    "totalRequests": 1250,
    "blockedRequests": 15,
    "uniqueIPs": 45,
    "topEndpoints": [
      { "endpoint": "/api/search", "requests": 450 },
      { "endpoint": "/api/products", "requests": 320 }
    ],
    "recentBlocks": [
      {
        "key": "192.168.1.100:/api/auth/",
        "endpoint": "/api/auth/login",
        "timestamp": 1642684500000
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Configuration Options

### Environment Variables

```bash
# Admin token for rate limit management
ADMIN_TOKEN=your-secure-admin-token

# Rate limiting settings (optional)
RATE_LIMIT_WINDOW_MS=60000       # Default window: 1 minute
RATE_LIMIT_MAX_REQUESTS=100      # Default max requests
RATE_LIMIT_BLOCK_DURATION=300000 # Default block: 5 minutes
```

### Custom Configuration

```typescript
// Add custom rate limit configuration
const customConfig = {
  '/api/newsletter/': {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 1,                 // 1 request per day
    blockDurationMs: 24 * 60 * 60 * 1000,
    message: 'Newsletter signup limited to once per day'
  }
}
```

## 🚀 Production Deployment

### Memory Management

The system includes automatic cleanup to prevent memory leaks:

```typescript
// Periodic cleanup of old entries
function cleanupRateLimit() {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.lastReset > oneHour) {
      rateLimit.delete(key)
    }
  }
}

// Cleanup every 10 minutes
setInterval(cleanupRateLimit, 10 * 60 * 1000)
```

### Redis Integration (Recommended for Production)

For production environments with multiple server instances, integrate with Redis:

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

async function checkRateLimit(key: string, config: RateLimitConfig) {
  const current = await redis.hgetall(key)
  // Implement Redis-based rate limiting logic
}
```

### Monitoring Integration

```typescript
// Example Sentry integration
import * as Sentry from '@sentry/nextjs'

export async function sendRateLimitAlert(key: string, endpoint: string) {
  Sentry.addBreadcrumb({
    message: 'Rate limit exceeded',
    level: 'warning',
    data: { key, endpoint }
  })
}
```

## 🔒 Security Considerations

### IP Spoofing Protection

```typescript
// Validate IP addresses from trusted proxies only
function getClientIP(request: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY === 'true'
  
  if (trustProxy) {
    return request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip
  }
  
  return request.ip || 'unknown'
}
```

### Rate Limit Bypass Prevention

- **Admin authentication** required for management endpoints
- **Monitoring service detection** to allow health checks
- **Header validation** to prevent manipulation
- **Key normalization** to prevent bypass attempts

## 📈 Performance Optimization

### Efficient Key Generation

```typescript
// Optimized key generation
function generateKey(ip: string, endpoint: string): string {
  // Use hash for consistent key length
  return `${ip.slice(0, 15)}:${endpoint.slice(0, 30)}`
}
```

### Memory Usage

- **Automatic cleanup** of expired entries
- **Maximum entry limits** to prevent memory exhaustion
- **Efficient data structures** for fast lookups

## 🐛 Troubleshooting

### Common Issues

#### 1. Rate Limits Not Working
```bash
# Check middleware configuration
curl -I "http://localhost:3000/api/test/rate-limit"
# Look for X-RateLimit-* headers
```

#### 2. False Positives
```bash
# Check IP detection
curl -H "X-Forwarded-For: 192.168.1.1" "http://localhost:3000/api/test/rate-limit"
```

#### 3. Memory Usage
```bash
# Monitor rate limit entries
curl "http://localhost:3000/api/admin/rate-limits" \
  -H "Authorization: Bearer admin-token"
```

### Debug Mode

Enable detailed logging:

```typescript
// Add to middleware.ts
if (process.env.DEBUG_RATE_LIMIT === 'true') {
  console.log('Rate limit check:', { key, config, result })
}
```

## 📚 API Reference

### Admin Endpoints

#### GET /api/admin/rate-limits
Get current rate limiting statistics and active limits.

**Headers:**
- `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "success": true,
  "stats": { /* statistics object */ },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### POST /api/admin/rate-limits
Manage rate limits (clear specific or all).

**Headers:**
- `Authorization: Bearer <admin-token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "action": "clear",        // "clear", "clear-all", "get-info"
  "key": "192.168.1.1:/api/auth/" // Required for "clear" and "get-info"
}
```

### Test Endpoints

#### GET /api/test/rate-limit
Test endpoint with rate limiting enabled (10 requests/minute).

#### POST /api/test/rate-limit
Test endpoint for POST requests with rate limiting.

---

**Note**: This rate limiting system is designed for production use and includes enterprise-grade features like monitoring, management, and security considerations. Regular monitoring and adjustment of limits based on actual usage patterns is recommended.