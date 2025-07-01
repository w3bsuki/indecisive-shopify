import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or external service)
const rateLimit = new Map<string, { count: number; lastReset: number; blocked: boolean }>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  blockDurationMs?: number // How long to block after limit exceeded
  skipSuccessfulRequests?: boolean // Whether to skip counting successful requests
  keyGenerator?: (request: NextRequest) => string // Custom key generator
}

// Rate limiting configurations for different endpoints
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // API routes - general
  '/api/': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    blockDurationMs: 5 * 60 * 1000, // 5 minutes block
  },
  
  // Authentication endpoints - stricter limits
  '/api/auth/': {
    windowMs: 15 * 60 * 1000, // 15 minutes  
    maxRequests: 5, // 5 attempts per 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  },
  
  // Payment endpoints - very strict
  '/api/payment/': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    blockDurationMs: 10 * 60 * 1000, // 10 minutes block
  },
  
  // Search endpoints - moderate limits
  '/api/search/': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 searches per minute
  },
  
  // Health check - higher limits for monitoring
  '/api/health': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 200, // 200 requests per minute
    skipSuccessfulRequests: true,
  },
}

function getRateLimitKey(request: NextRequest, config?: RateLimitConfig): string {
  if (config?.keyGenerator) {
    return config.keyGenerator(request)
  }
  
  // Get client IP address
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'anonymous'
  
  // Include pathname for endpoint-specific limiting
  const pathname = new URL(request.url).pathname
  
  return `${ip}:${pathname}`
}

function getRateLimitConfig(pathname: string): RateLimitConfig | null {
  // Find the most specific matching configuration
  const sortedPaths = Object.keys(rateLimitConfigs).sort((a, b) => b.length - a.length)
  
  for (const path of sortedPaths) {
    if (pathname.startsWith(path)) {
      return rateLimitConfigs[path]
    }
  }
  
  return null
}

function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
} {
  const now = Date.now()
  const current = rateLimit.get(key)
  
  // If no record exists, create one
  if (!current) {
    rateLimit.set(key, {
      count: 1,
      lastReset: now,
      blocked: false
    })
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }
  
  // Check if we're in a blocked state
  if (current.blocked && config.blockDurationMs) {
    const blockEndTime = current.lastReset + config.blockDurationMs
    if (now < blockEndTime) {
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: blockEndTime,
        retryAfter: Math.ceil((blockEndTime - now) / 1000)
      }
    } else {
      // Block period expired, reset
      current.blocked = false
      current.count = 1
      current.lastReset = now
    }
  }
  
  // Check if the time window has passed
  if (now - current.lastReset >= config.windowMs) {
    current.count = 1
    current.lastReset = now
    current.blocked = false
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }
  
  // Increment counter
  current.count++
  
  // Check if limit exceeded
  if (current.count > config.maxRequests) {
    current.blocked = true
    
    const retryAfter = config.blockDurationMs ? 
      Math.ceil(config.blockDurationMs / 1000) : 
      Math.ceil((config.windowMs - (now - current.lastReset)) / 1000)
    
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: current.lastReset + config.windowMs,
      retryAfter
    }
  }
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - current.count,
    resetTime: current.lastReset + config.windowMs
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip rate limiting for static assets and non-API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    !pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }
  
  // Get rate limit configuration for this endpoint
  const config = getRateLimitConfig(pathname)
  
  if (!config) {
    // No rate limiting configured for this endpoint
    return NextResponse.next()
  }
  
  // Generate rate limit key
  const key = getRateLimitKey(request, config)
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(key, config)
  
  // Create response
  const response = rateLimitResult.allowed ? 
    NextResponse.next() : 
    NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      },
      { status: 429 }
    )
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
  
  if (rateLimitResult.retryAfter) {
    response.headers.set('Retry-After', rateLimitResult.retryAfter.toString())
  }
  
  // Log rate limit violations for monitoring
  if (!rateLimitResult.allowed) {
    // TODO: Send rate limit violations to monitoring service
    // Rate limit exceeded for ${key} on ${pathname}
    // IP: ${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'}
    // User-Agent: ${request.headers.get('user-agent')}
    // Timestamp: ${new Date().toISOString()}
    // Endpoint: ${pathname}
    // await sendRateLimitAlert(key, pathname, rateLimitResult)
  }
  
  return response
}

// Cleanup function to remove old entries (call periodically)
export function cleanupRateLimit() {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  for (const [key, data] of rateLimit.entries()) {
    // Remove entries older than 1 hour
    if (now - data.lastReset > oneHour) {
      rateLimit.delete(key)
    }
  }
}

// Set up periodic cleanup (in a real application, you might want to do this differently)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 10 * 60 * 1000) // Cleanup every 10 minutes
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}